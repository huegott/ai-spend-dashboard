const express = require('express');
const router = express.Router();
const { query } = require('../models/database');

// Get dashboard summary
router.get('/dashboard/summary', async (req, res) => {
  try {
    const { startDate, endDate, provider } = req.query;
    
    let whereClause = '1=1';
    const params = [];
    
    if (startDate) {
      params.push(startDate);
      whereClause += ` AND date >= $${params.length}`;
    }
    
    if (endDate) {
      params.push(endDate);
      whereClause += ` AND date <= $${params.length}`;
    }
    
    if (provider && provider !== 'all') {
      params.push(provider);
      whereClause += ` AND provider = $${params.length}`;
    }

    // Get total spend
    const totalSpendQuery = `
      SELECT COALESCE(SUM(cost_usd), 0) as total_spend
      FROM spend_data 
      WHERE ${whereClause}
    `;
    
    const totalSpendResult = await query(totalSpendQuery, params);
    const totalSpend = parseFloat(totalSpendResult.rows[0].total_spend);

    // Get spend by provider
    const providerSpendQuery = `
      SELECT provider, COALESCE(SUM(cost_usd), 0) as total_spend
      FROM spend_data 
      WHERE ${whereClause}
      GROUP BY provider
      ORDER BY total_spend DESC
    `;
    
    const providerSpendResult = await query(providerSpendQuery, params);

    // Get spend by model
    const modelSpendQuery = `
      SELECT provider, model_name, COALESCE(SUM(cost_usd), 0) as total_spend,
             COALESCE(SUM(total_tokens), 0) as total_tokens,
             COALESCE(SUM(num_requests), 0) as total_requests
      FROM spend_data 
      WHERE ${whereClause}
      GROUP BY provider, model_name
      ORDER BY total_spend DESC
      LIMIT 20
    `;
    
    const modelSpendResult = await query(modelSpendQuery, params);

    // Get daily spend trend
    const dailyTrendQuery = `
      SELECT date, COALESCE(SUM(cost_usd), 0) as daily_spend
      FROM spend_data 
      WHERE ${whereClause}
      GROUP BY date
      ORDER BY date DESC
      LIMIT 30
    `;
    
    const dailyTrendResult = await query(dailyTrendQuery, params);

    res.json({
      totalSpend,
      spendByProvider: providerSpendResult.rows,
      spendByModel: modelSpendResult.rows,
      dailyTrend: dailyTrendResult.rows.reverse() // Reverse to get chronological order
    });
    
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

// Get spend data with filters
router.get('/spend', async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      provider, 
      model, 
      projectId, 
      apiKeyId,
      page = 1, 
      limit = 50 
    } = req.query;
    
    let whereClause = '1=1';
    const params = [];
    
    if (startDate) {
      params.push(startDate);
      whereClause += ` AND date >= $${params.length}`;
    }
    
    if (endDate) {
      params.push(endDate);
      whereClause += ` AND date <= $${params.length}`;
    }
    
    if (provider && provider !== 'all') {
      params.push(provider);
      whereClause += ` AND provider = $${params.length}`;
    }
    
    if (model) {
      params.push(model);
      whereClause += ` AND model_name = $${params.length}`;
    }
    
    if (projectId) {
      params.push(projectId);
      whereClause += ` AND project_id = $${params.length}`;
    }
    
    if (apiKeyId) {
      params.push(apiKeyId);
      whereClause += ` AND api_key_id = $${params.length}`;
    }

    const offset = (page - 1) * limit;
    params.push(limit, offset);
    
    const spendQuery = `
      SELECT * FROM spend_data 
      WHERE ${whereClause}
      ORDER BY date DESC, created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;
    
    const countQuery = `
      SELECT COUNT(*) as total_count FROM spend_data WHERE ${whereClause}
    `;
    
    const [spendResult, countResult] = await Promise.all([
      query(spendQuery, params),
      query(countQuery, params.slice(0, -2)) // Remove limit and offset for count
    ]);

    res.json({
      data: spendResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total_count),
        totalPages: Math.ceil(countResult.rows[0].total_count / limit)
      }
    });
    
  } catch (error) {
    console.error('Spend data error:', error);
    res.status(500).json({ error: 'Failed to fetch spend data' });
  }
});

// Get available models
router.get('/models', async (req, res) => {
  try {
    const { provider } = req.query;
    
    let whereClause = '1=1';
    const params = [];
    
    if (provider && provider !== 'all') {
      params.push(provider);
      whereClause += ` AND provider = $${params.length}`;
    }

    const modelsQuery = `
      SELECT DISTINCT provider, model_name 
      FROM models 
      WHERE ${whereClause}
      ORDER BY provider, model_name
    `;
    
    const result = await query(modelsQuery, params);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Models fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// Get projects (OpenAI only)
router.get('/projects', async (req, res) => {
  try {
    const projectsQuery = `
      SELECT DISTINCT project_id 
      FROM spend_data 
      WHERE provider = 'openai' AND project_id IS NOT NULL
      ORDER BY project_id
    `;
    
    const result = await query(projectsQuery);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Projects fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get API keys
router.get('/api-keys', async (req, res) => {
  try {
    const { provider } = req.query;
    
    let whereClause = '1=1';
    const params = [];
    
    if (provider && provider !== 'all') {
      params.push(provider);
      whereClause += ` AND provider = $${params.length}`;
    }

    const apiKeysQuery = `
      SELECT DISTINCT api_key_id 
      FROM spend_data 
      WHERE ${whereClause} AND api_key_id IS NOT NULL
      ORDER BY api_key_id
    `;
    
    const result = await query(apiKeysQuery, params);
    res.json(result.rows);
    
  } catch (error) {
    console.error('API keys fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

module.exports = router;