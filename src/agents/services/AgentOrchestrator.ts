import { Agent, AgentContext, AgentResponse, AgentPersona } from '../types/AgentTypes';

export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private routingRules: Map<string, AgentPersona[]> = new Map();

  constructor() {
    this.setupRoutingRules();
  }

  private setupRoutingRules(): void {
    // Define which agents handle which types of queries
    this.routingRules.set('scope3', [AgentPersona.SCOPE3_SPECIALIST, AgentPersona.DATA_ANALYST]);
    this.routingRules.set('emissions', [AgentPersona.SUSTAINABILITY_EXPERT, AgentPersona.DATA_ANALYST]);
    this.routingRules.set('data', [AgentPersona.DATA_ANALYST, AgentPersona.CLIMATE_RESEARCHER]);
    this.routingRules.set('community', [AgentPersona.COMMUNITY_MODERATOR, AgentPersona.ONBOARDING_GUIDE]);
    this.routingRules.set('help', [AgentPersona.ONBOARDING_GUIDE, AgentPersona.COMMUNITY_MODERATOR]);
    this.routingRules.set('climate', [AgentPersona.CLIMATE_RESEARCHER, AgentPersona.SUSTAINABILITY_EXPERT]);
    this.routingRules.set('sustainability', [AgentPersona.SUSTAINABILITY_EXPERT, AgentPersona.CLIMATE_RESEARCHER]);
  }

  public registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  public unregisterAgent(agentId: string): void {
    this.agents.delete(agentId);
  }

  public getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public getActiveAgents(): Agent[] {
    return this.getAllAgents().filter(agent => agent.isActive);
  }

  public async routeMessage(
    message: string, 
    context: AgentContext,
    preferredAgentId?: string
  ): Promise<AgentResponse> {
    // If a specific agent is requested, use it
    if (preferredAgentId) {
      const agent = this.agents.get(preferredAgentId);
      if (agent && agent.isActive) {
        return await agent.processMessage(message, context);
      }
    }

    // Otherwise, route based on message content
    const bestAgent = this.findBestAgent(message);
    if (bestAgent) {
      return await bestAgent.processMessage(message, context);
    }

    // Fallback response
    return {
      message: "I'm sorry, I couldn't find an appropriate agent to handle your request. Please try rephrasing your question or contact a human moderator.",
      confidence: 0.1,
      shouldEscalate: true,
      metadata: {
        reason: 'No suitable agent found',
        originalMessage: message
      }
    };
  }

  private findBestAgent(message: string): Agent | undefined {
    const messageLower = message.toLowerCase();
    const words = messageLower.split(/\s+/);

    // Calculate relevance scores for each routing rule
    const scores = new Map<AgentPersona, number>();

    for (const [keyword, personas] of this.routingRules) {
      const relevance = words.filter(word => word.includes(keyword)).length;
      if (relevance > 0) {
        personas.forEach(persona => {
          scores.set(persona, (scores.get(persona) || 0) + relevance);
        });
      }
    }

    // Find the best matching persona
    let bestPersona: AgentPersona | undefined;
    let bestScore = 0;

    for (const [persona, score] of scores) {
      if (score > bestScore) {
        bestScore = score;
        bestPersona = persona;
      }
    }

    // Find an active agent with the best persona
    if (bestPersona) {
      const matchingAgents = this.getActiveAgents().filter(
        agent => agent.persona === bestPersona
      );
      return matchingAgents[0]; // Return the first matching agent
    }

    // Fallback to any active agent
    const activeAgents = this.getActiveAgents();
    return activeAgents.length > 0 ? activeAgents[0] : undefined;
  }

  public async broadcastToAllAgents(
    message: string,
    context: AgentContext
  ): Promise<AgentResponse[]> {
    const activeAgents = this.getActiveAgents();
    const responses = await Promise.all(
      activeAgents.map(agent => agent.processMessage(message, context))
    );
    return responses;
  }

  public getAgentsByPersona(persona: AgentPersona): Agent[] {
    return this.getAllAgents().filter(agent => agent.persona === persona);
  }

  public getAgentStats(): Record<string, any> {
    const totalAgents = this.agents.size;
    const activeAgents = this.getActiveAgents().length;
    const personaCounts = new Map<AgentPersona, number>();

    this.getAllAgents().forEach(agent => {
      personaCounts.set(agent.persona, (personaCounts.get(agent.persona) || 0) + 1);
    });

    return {
      totalAgents,
      activeAgents,
      inactiveAgents: totalAgents - activeAgents,
      personaDistribution: Object.fromEntries(personaCounts)
    };
  }
}