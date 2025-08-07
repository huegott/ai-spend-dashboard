const express = require('express');
const router = express.Router();
const OpenAIService = require('../services/openai');
const { query } = require('../models/database');

// Initialize OpenAI service
let openaiService;
try {
  openaiService = new OpenAIService();
} catch (error) {
  console.warn('OpenAI service not initialized:', error.message);
}

// Sync OpenAI data
router.post('/sync/openai', async (req, res) => {
  try {
    if (!openaiService) {
      return res.status(400).json({ error: 'OpenAI service not configured' });
    }

    const { days = 30 } = req.body;
    
    console.log(`Starting OpenAI data sync for ${days} days...`);
    const result = await openaiService.syncData(days);
    
    res.json({
      success: true,
      message: 'OpenAI data synced successfully',
      ...result
    });
    
  } catch (error) {
    console.error('OpenAI sync error:', error);
    res.status(500).json({ 
      error: 'Failed to sync OpenAI data', 
      details: error.message 
    });
  }
});

// Manual Anthropic data input
router.post('/anthropic/manual', async (req, res) => {
  try {
    const { 
      date, 
      model_name, 
      cost_usd, 
      input_tokens, 
      output_tokens, 
      num_requests,
      metadata = {}
    } = req.body;

    // Validate required fields
    if (!date || !model_name || cost_usd === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: date, model_name, cost_usd' 
      });
    }

    // Insert Anthropic data
    const insertQuery = `
      INSERT INTO spend_data (
        provider, model_name, date, cost_usd, input_tokens, output_tokens, 
        total_tokens, num_requests, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (provider, model_name, date, project_id, api_key_id, user_id)
      DO UPDATE SET
        cost_usd = spend_data.cost_usd + EXCLUDED.cost_usd,
        input_tokens = spend_data.input_tokens + EXCLUDED.input_tokens,
        output_tokens = spend_data.output_tokens + EXCLUDED.output_tokens,
        total_tokens = spend_data.total_tokens + EXCLUDED.total_tokens,
        num_requests = spend_data.num_requests + EXCLUDED.num_requests,
        metadata = EXCLUDED.metadata,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      'anthropic',
      model_name,
      date,
      parseFloat(cost_usd),
      parseInt(input_tokens) || 0,
      parseInt(output_tokens) || 0,
      (parseInt(input_tokens) || 0) + (parseInt(output_tokens) || 0),
      parseInt(num_requests) || 0,
      JSON.stringify({ ...metadata, source: 'manual_input' })
    ];

    const result = await query(insertQuery, values);
    
    res.json({
      success: true,
      message: 'Anthropic data added successfully',
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Anthropic manual input error:', error);
    res.status(500).json({ 
      error: 'Failed to add Anthropic data', 
      details: error.message 
    });
  }
});

// Bulk manual data input (CSV upload)
router.post('/manual/bulk', async (req, res) => {
  try {
    const { records } = req.body;
    
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'No records provided' });
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const record of records) {
      try {
        const { 
          provider,
          date, 
          model_name, 
          cost_usd, 
          input_tokens = 0, 
          output_tokens = 0, 
          num_requests = 0,
          project_id = null,
          api_key_id = null,
          user_id = null,
          metadata = {}
        } = record;

        // Validate required fields
        if (!provider || !date || !model_name || cost_usd === undefined) {
          errors.push(`Record missing required fields: ${JSON.stringify(record)}`);
          errorCount++;
          continue;
        }

        const insertQuery = `
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
          provider.toLowerCase(),
          model_name,
          date,
          parseFloat(cost_usd),
          parseInt(input_tokens),
          parseInt(output_tokens),
          parseInt(input_tokens) + parseInt(output_tokens),
          parseInt(num_requests),
          project_id,
          api_key_id,
          user_id,
          JSON.stringify({ ...metadata, source: 'bulk_import' })
        ];

        await query(insertQuery, values);
        successCount++;
        
      } catch (error) {
        console.error('Error processing record:', record, error);
        errors.push(`Record error: ${error.message}`);
        errorCount++;
      }
    }

    res.json({
      success: true,
      message: 'Bulk data import completed',
      successCount,
      errorCount,
      totalRecords: records.length,
      errors: errors.slice(0, 10) // Limit error messages
    });
    
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ 
      error: 'Failed to process bulk import', 
      details: error.message 
    });
  }
});

// Get sync status
router.get('/sync/status', async (req, res) => {
  try {
    // Get latest data by provider
    const statusQuery = `
      SELECT 
        provider,
        COUNT(*) as total_records,
        MAX(date) as latest_date,
        SUM(cost_usd) as total_spend,
        MAX(updated_at) as last_updated
      FROM spend_data 
      GROUP BY provider
      ORDER BY provider
    `;

    const result = await query(statusQuery);

    res.json({
      providers: result.rows,
      openaiConfigured: !!openaiService,
      lastSyncCheck: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Sync status error:', error);
    res.status(500).json({ 
      error: 'Failed to get sync status', 
      details: error.message 
    });
  }
});

module.exports = router;