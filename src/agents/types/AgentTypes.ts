export interface AgentMessage {
  id: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentContext {
  userId?: string;
  topicId?: string;
  categoryId?: string;
  companyId?: string;
  sessionId: string;
  userHistory?: AgentMessage[];
  environmentData?: Record<string, any>;
}

export interface AgentResponse {
  message: string;
  confidence: number;
  actions?: AgentAction[];
  metadata?: Record<string, any>;
  shouldEscalate?: boolean;
}

export interface AgentAction {
  type: 'create_topic' | 'reply_to_topic' | 'escalate_to_human' | 'suggest_resource' | 'update_data';
  payload: Record<string, any>;
}

export enum AgentPersona {
  SUSTAINABILITY_EXPERT = 'sustainability_expert',
  DATA_ANALYST = 'data_analyst',
  COMMUNITY_MODERATOR = 'community_moderator',
  ONBOARDING_GUIDE = 'onboarding_guide',
  SCOPE3_SPECIALIST = 'scope3_specialist',
  CLIMATE_RESEARCHER = 'climate_researcher'
}

export interface Agent {
  id: string;
  name: string;
  persona: AgentPersona;
  description: string;
  isActive: boolean;
  capabilities: string[];
  processMessage(message: string, context: AgentContext): Promise<AgentResponse>;
  getPersonalityPrompt(): string;
}

export interface AgentConfig {
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  fallbackResponses: string[];
  escalationThreshold: number;
}