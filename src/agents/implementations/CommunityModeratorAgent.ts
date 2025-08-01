import { BaseAgent } from '../core/BaseAgent';
import { AgentPersona, AgentContext, AgentResponse, AgentConfig } from '../types/AgentTypes';

export class CommunityModeratorAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      maxTokens: 500,
      temperature: 0.3,
      systemPrompt: 'You are a helpful community moderator focused on maintaining a positive, constructive environment.',
      fallbackResponses: [
        "Let me help you with that community question.",
        "I'll make sure to address your concern appropriately.",
        "Thank you for bringing this to my attention."
      ],
      escalationThreshold: 2
    };

    super(
      'community-moderator-001',
      'Community Guardian',
      AgentPersona.COMMUNITY_MODERATOR,
      'Maintains community health, moderates discussions, and ensures positive engagement',
      [
        'content_moderation',
        'community_guidelines',
        'conflict_resolution',
        'user_support',
        'escalation_management'
      ],
      config
    );
  }

  public getPersonalityPrompt(): string {
    return `You are a Community Guardian, a friendly but firm community moderator for a climate and sustainability platform. Your role is to:

    - Foster positive, constructive discussions about climate action and sustainability
    - Guide users toward helpful resources and community guidelines
    - De-escalate conflicts and redirect discussions productively
    - Welcome new users and help them navigate the community
    - Identify when human moderator intervention is needed
    
    Your tone should be:
    - Professional yet approachable
    - Supportive and encouraging
    - Clear and direct when addressing violations
    - Focused on education rather than punishment
    
    Always prioritize community well-being and productive dialogue about climate solutions.`;
  }

  public async processMessage(message: string, context: AgentContext): Promise<AgentResponse> {
    const messageText = message.toLowerCase();
    const confidence = this.calculateConfidence(messageText);
    
    // Check for moderation issues
    if (this.detectToxicity(messageText)) {
      return this.handleToxicContent(message, context);
    }

    // Check for spam
    if (this.detectSpam(messageText)) {
      return this.handleSpam(message, context);
    }

    // Handle community guidelines questions
    if (this.isGuidelinesQuery(messageText)) {
      return this.provideGuidelinesHelp(context);
    }

    // Handle conflict resolution
    if (this.isConflictSituation(messageText)) {
      return this.handleConflict(message, context);
    }

    // Welcome new users
    if (this.isNewUserGreeting(messageText)) {
      return this.welcomeNewUser(context);
    }

    // General community support
    return this.provideGeneralSupport(message, context, confidence);
  }

  private calculateConfidence(message: string): number {
    const moderationKeywords = [
      'community', 'guidelines', 'rules', 'report', 'inappropriate',
      'help', 'support', 'moderator', 'admin', 'conflict', 'dispute'
    ];
    
    const words = message.split(' ');
    const matches = moderationKeywords.filter(keyword => 
      words.some(word => word.includes(keyword))
    ).length;
    
    return Math.min(0.9, 0.3 + (matches * 0.15));
  }

  private detectToxicity(message: string): boolean {
    const toxicPatterns = [
      'stupid', 'idiot', 'moron', 'hate', 'kill', 'die',
      'shut up', 'get lost', 'go away', 'waste of time'
    ];
    
    return toxicPatterns.some(pattern => message.includes(pattern));
  }

  private detectSpam(message: string): boolean {
    // Simple spam detection logic
    const spamIndicators = [
      message.length > 1000,
      (message.match(/http/g) || []).length > 3,
      (message.match(/[A-Z]/g) || []).length > message.length * 0.5,
      /(.)\1{10,}/.test(message) // Repeated characters
    ];
    
    return spamIndicators.filter(Boolean).length >= 2;
  }

  private isGuidelinesQuery(message: string): boolean {
    const guidelinesKeywords = [
      'guidelines', 'rules', 'policy', 'allowed', 'permitted',
      'can i', 'what are the rules', 'community standards'
    ];
    
    return guidelinesKeywords.some(keyword => message.includes(keyword));
  }

  private isConflictSituation(message: string): boolean {
    const conflictKeywords = [
      'argument', 'disagree', 'fight', 'dispute', 'conflict',
      'harassment', 'bullying', 'attacking', 'rude'
    ];
    
    return conflictKeywords.some(keyword => message.includes(keyword));
  }

  private isNewUserGreeting(message: string): boolean {
    const greetingKeywords = [
      'hello', 'hi', 'new here', 'just joined', 'first time',
      'getting started', 'how do i', 'where do i start'
    ];
    
    return greetingKeywords.some(keyword => message.includes(keyword));
  }

  private handleToxicContent(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      "I notice some language that doesn't align with our community guidelines. Let's keep our discussions respectful and focused on constructive climate action. Could you please rephrase your message in a more positive way?",
      0.9,
      true,
      { action: 'toxicity_detected', originalMessage: message }
    );
  }

  private handleSpam(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      "Your message appears to contain spam-like content. Please ensure your posts are relevant to climate and sustainability discussions. If you need help, feel free to ask specific questions!",
      0.85,
      true,
      { action: 'spam_detected' }
    );
  }

  private provideGuidelinesHelp(context: AgentContext): AgentResponse {
    return this.formatResponse(
      "Our community guidelines focus on respectful dialogue about climate action and sustainability. Key points:\n\n• Be respectful and constructive\n• Stay on topic (climate, sustainability, carbon tracking)\n• Share reliable sources when making claims\n• Help others learn and grow\n• Report issues to moderators\n\nFor detailed guidelines, check our community handbook or ask a human moderator!",
      0.8,
      false,
      { action: 'guidelines_provided' }
    );
  }

  private handleConflict(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      "I see there might be some tension in this discussion. Let's refocus on our shared goal of climate action. Instead of debating who's right, what if we explored the different perspectives on this climate topic? I'm here to help facilitate a more productive conversation.",
      0.7,
      false,
      { action: 'conflict_mediation' }
    );
  }

  private welcomeNewUser(context: AgentContext): AgentResponse {
    return this.formatResponse(
      "Welcome to our climate action community! 🌍 I'm your Community Guardian, here to help you get started.\n\nGreat places to begin:\n• Check out the Climate Dashboard for company insights\n• Browse popular topics in the Community Forum\n• Ask questions - our community loves helping newcomers!\n• Share your sustainability journey\n\nWhat aspect of climate action interests you most?",
      0.9,
      false,
      { action: 'new_user_welcome' }
    );
  }

  private provideGeneralSupport(message: string, context: AgentContext, confidence: number): AgentResponse {
    return this.formatResponse(
      "Thanks for reaching out! I'm here to help maintain our positive community environment. If you have specific questions about community guidelines, reporting issues, or need help navigating the platform, I'm happy to assist. For technical or detailed climate questions, our specialist agents might be more helpful!",
      confidence,
      false,
      { action: 'general_support' }
    );
  }
}