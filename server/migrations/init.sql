-- AI Spend Dashboard Database Schema

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Providers enum
CREATE TYPE provider_type AS ENUM ('openai', 'anthropic');

-- Models table
CREATE TABLE IF NOT EXISTS models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider provider_type NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    input_cost_per_token DECIMAL(15, 10) NOT NULL DEFAULT 0,
    output_cost_per_token DECIMAL(15, 10) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, model_name)
);

-- Spend data table
CREATE TABLE IF NOT EXISTS spend_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider provider_type NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    cost_usd DECIMAL(10, 4) NOT NULL DEFAULT 0,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    num_requests INTEGER DEFAULT 0,
    project_id VARCHAR(255),
    api_key_id VARCHAR(255),
    user_id VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, model_name, date, project_id, api_key_id, user_id)
);

-- Usage logs table (for detailed tracking)
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider provider_type NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    cost_usd DECIMAL(10, 6) NOT NULL DEFAULT 0,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    project_id VARCHAR(255),
    api_key_id VARCHAR(255),
    user_id VARCHAR(255),
    request_id VARCHAR(255),
    response_time_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- API keys table (for tracking which keys are being used)
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider provider_type NOT NULL,
    key_identifier VARCHAR(255) NOT NULL, -- Last 4 characters or key name
    key_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, key_identifier)
);

-- MCP integrations table
CREATE TABLE IF NOT EXISTS mcp_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_type VARCHAR(50) NOT NULL, -- 'portainer', 'github', 'n8n', 'asana'
    integration_name VARCHAR(255) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(integration_type, integration_name)
);

-- Tasks/issues tracking from MCP integrations
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) NOT NULL, -- ID from external system (GitHub issue ID, Asana task ID)
    integration_type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(100) NOT NULL,
    priority VARCHAR(50),
    assignee VARCHAR(255),
    labels JSONB DEFAULT '[]',
    due_date TIMESTAMP WITH TIME ZONE,
    external_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(integration_type, external_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_spend_data_date ON spend_data(date);
CREATE INDEX IF NOT EXISTS idx_spend_data_provider ON spend_data(provider);
CREATE INDEX IF NOT EXISTS idx_spend_data_model ON spend_data(model_name);
CREATE INDEX IF NOT EXISTS idx_spend_data_project ON spend_data(project_id);
CREATE INDEX IF NOT EXISTS idx_spend_data_provider_date ON spend_data(provider, date);

CREATE INDEX IF NOT EXISTS idx_usage_logs_timestamp ON usage_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_usage_logs_provider ON usage_logs(provider);
CREATE INDEX IF NOT EXISTS idx_usage_logs_model ON usage_logs(model_name);
CREATE INDEX IF NOT EXISTS idx_usage_logs_provider_timestamp ON usage_logs(provider, timestamp);

CREATE INDEX IF NOT EXISTS idx_tasks_integration_type ON tasks(integration_type);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_updated_at ON tasks(updated_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spend_data_updated_at BEFORE UPDATE ON spend_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mcp_integrations_updated_at BEFORE UPDATE ON mcp_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default model pricing data
INSERT INTO models (provider, model_name, input_cost_per_token, output_cost_per_token) 
VALUES 
    -- OpenAI models (prices per token in USD)
    ('openai', 'gpt-4o', 0.000005, 0.000015),
    ('openai', 'gpt-4o-mini', 0.00000015, 0.0000006),
    ('openai', 'gpt-4-turbo', 0.00001, 0.00003),
    ('openai', 'gpt-4', 0.00003, 0.00006),
    ('openai', 'gpt-3.5-turbo', 0.000001, 0.000002),
    ('openai', 'text-embedding-3-large', 0.00000013, 0),
    ('openai', 'text-embedding-3-small', 0.00000002, 0),
    ('openai', 'text-embedding-ada-002', 0.0000001, 0),
    
    -- Anthropic models (prices per token in USD)
    ('anthropic', 'claude-3-5-sonnet-20241022', 0.000003, 0.000015),
    ('anthropic', 'claude-3-opus-20240229', 0.000015, 0.000075),
    ('anthropic', 'claude-3-sonnet-20240229', 0.000003, 0.000015),
    ('anthropic', 'claude-3-haiku-20240307', 0.00000025, 0.00000125)
ON CONFLICT (provider, model_name) DO NOTHING;