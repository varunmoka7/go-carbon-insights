import { AgentOrchestrator } from './AgentOrchestrator';
import { CommunityModeratorAgent } from '../implementations/CommunityModeratorAgent';
import { SustainabilityExpertAgent } from '../implementations/SustainabilityExpertAgent';
import { OnboardingGuideAgent } from '../implementations/OnboardingGuideAgent';
import { AgentContext, AgentResponse, Agent } from '../types/AgentTypes';

export class AgentService {
  private orchestrator: AgentOrchestrator;
  private initialized: boolean = false;

  constructor() {
    this.orchestrator = new AgentOrchestrator();
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    // Initialize and register all agents
    const agents = [
      new CommunityModeratorAgent(),
      new SustainabilityExpertAgent(),
      new OnboardingGuideAgent()
    ];

    agents.forEach(agent => {
      this.orchestrator.registerAgent(agent);
    });

    this.initialized = true;
  }

  public async processUserMessage(
    message: string,
    userId?: string,
    sessionId?: string,
    topicId?: string,
    categoryId?: string,
    companyId?: string,
    preferredAgentId?: string
  ): Promise<AgentResponse> {
    await this.initialize();

    const context: AgentContext = {
      userId,
      topicId,
      categoryId,
      companyId,
      sessionId: sessionId || this.generateSessionId(),
      userHistory: [], // TODO: Implement user history retrieval
      environmentData: {
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      }
    };

    return await this.orchestrator.routeMessage(message, context, preferredAgentId);
  }

  public getAvailableAgents(): Agent[] {
    return this.orchestrator.getActiveAgents();
  }

  public getAgentById(agentId: string): Agent | undefined {
    return this.orchestrator.getAgent(agentId);
  }

  public getAgentStats(): Record<string, any> {
    return this.orchestrator.getAgentStats();
  }

  public async suggestAgentForContext(
    message: string,
    context: Partial<AgentContext>
  ): Promise<Agent | null> {
    await this.initialize();
    
    // This is a simplified suggestion system
    const response = await this.orchestrator.routeMessage(
      message, 
      { ...context, sessionId: context.sessionId || this.generateSessionId() }
    );
    
    const agentId = response.metadata?.agentId;
    return agentId ? this.orchestrator.getAgent(agentId) || null : null;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Chat-like interface for continuous conversations
  public async startConversation(userId?: string): Promise<string> {
    const sessionId = this.generateSessionId();
    
    // Store session info if needed
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`agent_session_${sessionId}`, JSON.stringify({
        userId,
        startTime: new Date().toISOString(),
        messageCount: 0
      }));
    }
    
    return sessionId;
  }

  public async continueConversation(
    sessionId: string,
    message: string,
    userId?: string
  ): Promise<AgentResponse> {
    // Retrieve conversation history
    let userHistory: any[] = [];
    
    if (typeof localStorage !== 'undefined') {
      const sessionData = localStorage.getItem(`agent_session_${sessionId}`);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        userHistory = session.history || [];
        
        // Update session with new message
        session.history = [...userHistory, {
          id: `msg_${Date.now()}`,
          content: message,
          timestamp: new Date(),
          type: 'user'
        }];
        session.messageCount = (session.messageCount || 0) + 1;
        
        localStorage.setItem(`agent_session_${sessionId}`, JSON.stringify(session));
      }
    }

    const context: AgentContext = {
      userId,
      sessionId,
      userHistory,
      environmentData: {
        timestamp: new Date().toISOString(),
        conversationLength: userHistory.length
      }
    };

    const response = await this.orchestrator.routeMessage(message, context);

    // Store agent response in history
    if (typeof localStorage !== 'undefined') {
      const sessionData = localStorage.getItem(`agent_session_${sessionId}`);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        session.history = [...(session.history || []), {
          id: `msg_${Date.now()}`,
          content: response.message,
          timestamp: new Date(),
          type: 'agent',
          agentId: response.metadata?.agentId,
          confidence: response.confidence
        }];
        
        localStorage.setItem(`agent_session_${sessionId}`, JSON.stringify(session));
      }
    }

    return response;
  }

  public endConversation(sessionId: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`agent_session_${sessionId}`);
    }
  }

  // Health check
  public getServiceHealth(): { status: 'healthy' | 'degraded' | 'down'; details: any } {
    try {
      const stats = this.getAgentStats();
      const activeAgents = stats.activeAgents || 0;
      
      if (activeAgents === 0) {
        return { status: 'down', details: { reason: 'No active agents', stats } };
      } else if (activeAgents < 3) {
        return { status: 'degraded', details: { reason: 'Limited agents available', stats } };
      } else {
        return { status: 'healthy', details: { stats } };
      }
    } catch (error) {
      return { status: 'down', details: { error: error instanceof Error ? error.message : 'Unknown error' } };
    }
  }
}

// Singleton instance
export const agentService = new AgentService();