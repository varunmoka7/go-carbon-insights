export interface AgentEnvironmentConfig {
  // Claude AI Configuration
  CLAUDE_API_KEY?: string;
  CLAUDE_MODEL?: string;
  CLAUDE_MAX_TOKENS?: number;
  CLAUDE_TEMPERATURE?: number;
  CLAUDE_BASE_URL?: string;
  
  // Agent System Configuration
  AGENT_ENABLED?: boolean;
  AGENT_FALLBACK_ENABLED?: boolean;
  AGENT_DEBUG_MODE?: boolean;
  
  // Feature Flags
  ENABLE_CLAUDE_AI?: boolean;
  ENABLE_LOCAL_AGENTS?: boolean;
  ENABLE_AGENT_ANALYTICS?: boolean;
}

export const getAgentConfig = (): AgentEnvironmentConfig => {
  return {
    // Claude AI Configuration
    CLAUDE_API_KEY: import.meta.env.VITE_CLAUDE_API_KEY,
    CLAUDE_MODEL: import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-sonnet-20240229',
    CLAUDE_MAX_TOKENS: parseInt(import.meta.env.VITE_CLAUDE_MAX_TOKENS || '1000'),
    CLAUDE_TEMPERATURE: parseFloat(import.meta.env.VITE_CLAUDE_TEMPERATURE || '0.4'),
    CLAUDE_BASE_URL: import.meta.env.VITE_CLAUDE_BASE_URL,
    
    // Agent System Configuration
    AGENT_ENABLED: import.meta.env.VITE_AGENT_ENABLED !== 'false',
    AGENT_FALLBACK_ENABLED: import.meta.env.VITE_AGENT_FALLBACK_ENABLED !== 'false',
    AGENT_DEBUG_MODE: import.meta.env.VITE_AGENT_DEBUG_MODE === 'true',
    
    // Feature Flags
    ENABLE_CLAUDE_AI: import.meta.env.VITE_ENABLE_CLAUDE_AI === 'true',
    ENABLE_LOCAL_AGENTS: import.meta.env.VITE_ENABLE_LOCAL_AGENTS !== 'false',
    ENABLE_AGENT_ANALYTICS: import.meta.env.VITE_ENABLE_AGENT_ANALYTICS === 'true',
  };
};

export const isClaudeAIConfigured = (): boolean => {
  const config = getAgentConfig();
  return !!(config.CLAUDE_API_KEY && config.ENABLE_CLAUDE_AI);
};

export const isLocalAgentsEnabled = (): boolean => {
  const config = getAgentConfig();
  return config.ENABLE_LOCAL_AGENTS !== false;
};

export const isAgentSystemEnabled = (): boolean => {
  const config = getAgentConfig();
  return config.AGENT_ENABLED !== false;
};

// Default agent configuration
export const DEFAULT_AGENT_CONFIG = {
  maxTokens: 1000,
  temperature: 0.4,
  systemPrompt: 'You are a helpful AI assistant specialized in sustainability and climate data.',
  fallbackResponses: [
    "I'm here to help with your sustainability questions.",
    "Let me provide some guidance on that topic.",
    "I'd be happy to assist with your inquiry."
  ],
  escalationThreshold: 3
}; 