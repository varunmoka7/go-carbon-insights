import { AgentContext, AgentResponse } from '../types/AgentTypes';

export interface ClaudeAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  baseUrl?: string;
}

export interface ClaudeAIRequest {
  model: string;
  max_tokens: number;
  temperature: number;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

export interface ClaudeAIResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class ClaudeAIService {
  private config: ClaudeAIConfig;
  private baseUrl: string;

  constructor(config: ClaudeAIConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  }

  public async generateResponse(
    systemPrompt: string,
    userMessage: string,
    context?: AgentContext
  ): Promise<AgentResponse> {
    try {
      const request: ClaudeAIRequest = {
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        messages: [
          {
            role: 'system',
            content: this.buildSystemPrompt(systemPrompt, context)
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Claude AI API error: ${response.status} ${response.statusText}`);
      }

      const data: ClaudeAIResponse = await response.json();
      const messageContent = data.content[0]?.text || '';

      return {
        message: messageContent,
        confidence: this.calculateConfidence(data.usage),
        metadata: {
          model: this.config.model,
          tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
          agentId: 'claude-ai-enhanced'
        }
      };

    } catch (error) {
      console.error('Claude AI service error:', error);
      return {
        message: 'I apologize, but I\'m having trouble connecting to my enhanced AI capabilities. Let me provide you with a helpful response based on my local knowledge.',
        confidence: 0.5,
        shouldEscalate: true,
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
          fallback: true
        }
      };
    }
  }

  private buildSystemPrompt(basePrompt: string, context?: AgentContext): string {
    let enhancedPrompt = basePrompt;

    if (context) {
      enhancedPrompt += `\n\nContext Information:
- User ID: ${context.userId || 'Unknown'}
- Session ID: ${context.sessionId}
- Topic ID: ${context.topicId || 'None'}
- Company ID: ${context.companyId || 'None'}
- Conversation History: ${context.userHistory?.length || 0} messages

Please provide a helpful, accurate response that takes into account the user's context and previous conversation history.`;
    }

    return enhancedPrompt;
  }

  private calculateConfidence(usage: { input_tokens: number; output_tokens: number }): number {
    // Simple confidence calculation based on token usage
    const totalTokens = usage.input_tokens + usage.output_tokens;
    const maxExpectedTokens = this.config.maxTokens * 2;
    
    // Higher confidence if we used fewer tokens (more concise response)
    const tokenEfficiency = Math.max(0, 1 - (totalTokens / maxExpectedTokens));
    
    // Base confidence of 0.8 for successful API calls
    return Math.min(0.95, 0.8 + (tokenEfficiency * 0.15));
  }

  public isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.model);
  }

  public getConfig(): Partial<ClaudeAIConfig> {
    return {
      model: this.config.model,
      maxTokens: this.config.maxTokens,
      temperature: this.config.temperature,
      baseUrl: this.baseUrl
    };
  }
}

// Singleton instance
let claudeAIService: ClaudeAIService | null = null;

export const initializeClaudeAI = (config: ClaudeAIConfig): ClaudeAIService => {
  claudeAIService = new ClaudeAIService(config);
  return claudeAIService;
};

export const getClaudeAIService = (): ClaudeAIService | null => {
  return claudeAIService;
}; 