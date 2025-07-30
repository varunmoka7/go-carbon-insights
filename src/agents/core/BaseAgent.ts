import { Agent, AgentPersona, AgentContext, AgentResponse, AgentMessage, AgentConfig } from '../types/AgentTypes';

export abstract class BaseAgent implements Agent {
  public readonly id: string;
  public readonly name: string;
  public readonly persona: AgentPersona;
  public readonly description: string;
  public isActive: boolean = true;
  public readonly capabilities: string[];
  protected config: AgentConfig;

  constructor(
    id: string,
    name: string,
    persona: AgentPersona,
    description: string,
    capabilities: string[],
    config: AgentConfig
  ) {
    this.id = id;
    this.name = name;
    this.persona = persona;
    this.description = description;
    this.capabilities = capabilities;
    this.config = config;
  }

  abstract processMessage(message: string, context: AgentContext): Promise<AgentResponse>;
  
  abstract getPersonalityPrompt(): string;

  protected shouldEscalate(message: string, context: AgentContext): boolean {
    const escalationKeywords = [
      'urgent', 'emergency', 'complaint', 'bug', 'error', 'broken',
      'angry', 'frustrated', 'disappointed', 'lawsuit', 'legal'
    ];
    
    const messageWords = message.toLowerCase().split(' ');
    const keywordMatches = escalationKeywords.filter(keyword => 
      messageWords.some(word => word.includes(keyword))
    ).length;

    return keywordMatches >= this.config.escalationThreshold;
  }

  protected formatResponse(
    message: string,
    confidence: number = 0.8,
    shouldEscalate: boolean = false,
    metadata: Record<string, any> = {}
  ): AgentResponse {
    return {
      message,
      confidence,
      shouldEscalate,
      metadata: {
        ...metadata,
        agentId: this.id,
        agentName: this.name,
        persona: this.persona,
        timestamp: new Date().toISOString()
      }
    };
  }

  protected getContextualInfo(context: AgentContext): string {
    let info = '';
    
    if (context.userId) {
      info += `User ID: ${context.userId}\n`;
    }
    
    if (context.topicId) {
      info += `Topic ID: ${context.topicId}\n`;
    }
    
    if (context.categoryId) {
      info += `Category: ${context.categoryId}\n`;
    }
    
    if (context.userHistory && context.userHistory.length > 0) {
      info += `Recent conversation:\n`;
      context.userHistory.slice(-3).forEach(msg => {
        info += `- ${msg.content}\n`;
      });
    }
    
    return info;
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public updateConfig(newConfig: Partial<AgentConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}