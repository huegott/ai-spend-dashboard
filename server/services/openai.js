const axios = require('axios');
const fs = require('fs');
const { query, transaction } = require('../models/database');

class OpenAIService {
  constructor() {
    this.apiKey = this.loadApiKey();
    this.baseURL = 'https://api.openai.com/v1';
    
    if (!this.apiKey) {
      console.warn('OpenAI service initialized without API key');
      this.axiosInstance = null;
      return;
    }
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    // Add response interceptor for rate limiting
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 60;
          console.log(`Rate limited, waiting ${retryAfter} seconds...`);
          await this.sleep(retryAfter * 1000);
          return this.axiosInstance.request(error.config);
        }
        throw error;
      }
    );
  }

  loadApiKey() {
    // Try to load from Docker secret file first (for Swarm mode)
    const secretFile = process.env.OPENAI_API_KEY_FILE;
    if (secretFile && fs.existsSync(secretFile)) {
      return fs.readFileSync(secretFile, 'utf8').trim();
    }
    
    // Fallback to environment variable (for standalone Docker)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'placeholder-openai-key-add-real-key-here' || apiKey === 'placeholder-openai-key') {
      console.warn('OpenAI API key not configured. OpenAI sync will not work until you add a real API key.');
      return null;
    }
    
    return apiKey;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchUsageData(options = {}) {
    try {
      const {
        startTime,
        endTime,
        interval = '1d',
        projectIds,
        userIds,
        apiKeyIds,
        models
      } = options;

      const params = {
        interval,
        ...(startTime && { start_time: Math.floor(new Date(startTime).getTime() / 1000) }),
        ...(endTime && { end_time: Math.floor(new Date(endTime).getTime() / 1000) }),
        ...(projectIds && { project_ids: projectIds.join(',') }),
        ...(userIds && { user_ids: userIds.join(',') }),
        ...(apiKeyIds && { api_key_ids: apiKeyIds.join(',') }),
        ...(models && { models: models.join(',') })
      };

      console.log('Fetching OpenAI usage data with params:', params);

      const response = await this.axiosInstance.get('/organization/usage', { params });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching OpenAI usage data:', error.response?.data || error.message);
      throw new Error(`Failed to fetch OpenAI usage data: ${error.message}`);
    }
  }

  async fetchCostData(options = {}) {
    try {
      const {
        startTime,
        endTime,
        projectIds
      } = options;

      const params = {
        interval: '1d',
        ...(startTime && { start_time: Math.floor(new Date(startTime).getTime() / 1000) }),
        ...(endTime && { end_time: Math.floor(new Date(endTime).getTime() / 1000) }),
        ...(projectIds && { project_ids: projectIds.join(',') })
      };

      console.log('Fetching OpenAI cost data with params:', params);

      const response = await this.axiosInstance.get('/organization/costs', { params });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching OpenAI cost data:', error.response?.data || error.message);
      throw new Error(`Failed to fetch OpenAI cost data: ${error.message}`);
    }
  }

  async processAndStoreUsageData(usageData) {
    try {
      const processedData = [];

      if (usageData.data && Array.isArray(usageData.data)) {
        for (const item of usageData.data) {
          // Convert Unix timestamp to date
          const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];
          
          const record = {
            provider: 'openai',
            model_name: item.model || 'unknown',
            date: date,
            cost_usd: this.calculateCost(item),
            input_tokens: item.input_tokens || 0,
            output_tokens: item.output_tokens || 0,
            total_tokens: (item.input_tokens || 0) + (item.output_tokens || 0),
            num_requests: item.num_model_requests || 0,
            project_id: item.project_id || null,
            api_key_id: item.api_key_id || null,
            user_id: item.user_id || null,
            metadata: JSON.stringify({
              timestamp: item.timestamp,
              raw_data: item
            })
          };

          processedData.push(record);
        }
      }

      // Store in database using upsert
      if (processedData.length > 0) {
        await this.upsertSpendData(processedData);
        console.log(`Processed and stored ${processedData.length} OpenAI usage records`);
      }

      return processedData;
    } catch (error) {
      console.error('Error processing OpenAI usage data:', error);
      throw error;
    }
  }

  async processAndStoreCostData(costData) {
    try {
      const processedData = [];

      if (costData.data && Array.isArray(costData.data)) {
        for (const item of costData.data) {
          // Convert Unix timestamp to date
          const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];
          
          const record = {
            provider: 'openai',
            model_name: item.line_item || 'unknown',
            date: date,
            cost_usd: parseFloat(item.cost || 0),
            input_tokens: 0, // Cost API doesn't provide token details
            output_tokens: 0,
            total_tokens: 0,
            num_requests: 0,
            project_id: item.project_id || null,
            api_key_id: null,
            user_id: null,
            metadata: JSON.stringify({
              line_item: item.line_item,
              timestamp: item.timestamp,
              raw_data: item
            })
          };

          processedData.push(record);
        }
      }

      // Store in database using upsert
      if (processedData.length > 0) {
        await this.upsertSpendData(processedData);
        console.log(`Processed and stored ${processedData.length} OpenAI cost records`);
      }

      return processedData;
    } catch (error) {
      console.error('Error processing OpenAI cost data:', error);
      throw error;
    }
  }

  calculateCost(usageItem) {
    // Try to calculate cost from token usage if we have pricing data
    const inputTokens = usageItem.input_tokens || 0;
    const outputTokens = usageItem.output_tokens || 0;
    
    // This is a simplified calculation - in production you'd want to look up
    // actual pricing from the models table
    const estimatedCost = (inputTokens * 0.000001) + (outputTokens * 0.000002);
    
    return parseFloat(estimatedCost.toFixed(6));
  }

  async upsertSpendData(records) {
    return transaction(async (client) => {
      for (const record of records) {
        const upsertQuery = `
          INSERT INTO spend_data (
            provider, model_name, date, cost_usd, input_tokens, output_tokens, 
            total_tokens, num_requests, project_id, api_key_id, user_id, metadata
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (provider, model_name, date, project_id, api_key_id, user_id)
          DO UPDATE SET
            cost_usd = spend_data.cost_usd + EXCLUDED.cost_usd,
            input_tokens = spend_data.input_tokens + EXCLUDED.input_tokens,
            output_tokens = spend_data.output_tokens + EXCLUDED.output_tokens,
            total_tokens = spend_data.total_tokens + EXCLUDED.total_tokens,
            num_requests = spend_data.num_requests + EXCLUDED.num_requests,
            metadata = EXCLUDED.metadata,
            updated_at = CURRENT_TIMESTAMP
        `;

        const values = [
          record.provider,
          record.model_name,
          record.date,
          record.cost_usd,
          record.input_tokens,
          record.output_tokens,
          record.total_tokens,
          record.num_requests,
          record.project_id,
          record.api_key_id,
          record.user_id,
          record.metadata
        ];

        await client.query(upsertQuery, values);
      }
    });
  }

  async syncData(days = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      console.log(`Syncing OpenAI data from ${startDate.toISOString()} to ${endDate.toISOString()}`);

      // Fetch both usage and cost data
      const [usageData, costData] = await Promise.all([
        this.fetchUsageData({
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString()
        }),
        this.fetchCostData({
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString()
        })
      ]);

      // Process and store the data
      const [processedUsage, processedCost] = await Promise.all([
        this.processAndStoreUsageData(usageData),
        this.processAndStoreCostData(costData)
      ]);

      return {
        usageRecords: processedUsage.length,
        costRecords: processedCost.length,
        totalRecords: processedUsage.length + processedCost.length
      };

    } catch (error) {
      console.error('Error syncing OpenAI data:', error);
      throw error;
    }
  }
}

module.exports = OpenAIService;