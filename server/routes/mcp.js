const express = require('express');
const router = express.Router();
const { query } = require('../models/database');

// MCP routes placeholder - will be expanded in Phase 3
// These routes will handle integrations with Portainer, GitHub, n8n, and Asana

// Get MCP integrations status
router.get('/integrations', async (req, res) => {
  try {
    const integrationsQuery = `
      SELECT integration_type, integration_name, is_active, last_sync, config
      FROM mcp_integrations
      ORDER BY integration_type, integration_name
    `;

    const result = await query(integrationsQuery);
    
    res.json({
      integrations: result.rows.map(row => ({
        ...row,
        config: row.config ? Object.keys(row.config) : [] // Don't expose sensitive config
      }))
    });
    
  } catch (error) {
    console.error('MCP integrations error:', error);
    res.status(500).json({ error: 'Failed to fetch MCP integrations' });
  }
});

// Add/Update MCP integration
router.post('/integrations', async (req, res) => {
  try {
    const { integration_type, integration_name, config } = req.body;
    
    if (!integration_type || !integration_name) {
      return res.status(400).json({ 
        error: 'integration_type and integration_name are required' 
      });
    }

    const upsertQuery = `
      INSERT INTO mcp_integrations (integration_type, integration_name, config, is_active)
      VALUES ($1, $2, $3, true)
      ON CONFLICT (integration_type, integration_name)
      DO UPDATE SET 
        config = EXCLUDED.config,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;

    const values = [
      integration_type,
      integration_name,
      JSON.stringify(config || {})
    ];

    const result = await query(upsertQuery, values);
    
    res.json({
      success: true,
      integration: result.rows[0]
    });
    
  } catch (error) {
    console.error('MCP integration upsert error:', error);
    res.status(500).json({ error: 'Failed to save MCP integration' });
  }
});

// Get tasks from MCP integrations
router.get('/tasks', async (req, res) => {
  try {
    const { integration_type, status, assignee } = req.query;
    
    let whereClause = '1=1';
    const params = [];
    
    if (integration_type) {
      params.push(integration_type);
      whereClause += ` AND integration_type = $${params.length}`;
    }
    
    if (status) {
      params.push(status);
      whereClause += ` AND status = $${params.length}`;
    }
    
    if (assignee) {
      params.push(assignee);
      whereClause += ` AND assignee = $${params.length}`;
    }

    const tasksQuery = `
      SELECT *
      FROM tasks
      WHERE ${whereClause}
      ORDER BY updated_at DESC
      LIMIT 100
    `;

    const result = await query(tasksQuery, params);
    
    res.json({
      tasks: result.rows
    });
    
  } catch (error) {
    console.error('MCP tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch MCP tasks' });
  }
});

// Sync tasks from external systems (placeholder)
router.post('/sync/:integration_type', async (req, res) => {
  try {
    const { integration_type } = req.params;
    
    // This will be implemented in Phase 3 with actual MCP server connections
    res.json({
      success: true,
      message: `${integration_type} sync initiated - feature coming in Phase 3`,
      integration_type
    });
    
  } catch (error) {
    console.error('MCP sync error:', error);
    res.status(500).json({ error: 'Failed to sync MCP data' });
  }
});

module.exports = router;