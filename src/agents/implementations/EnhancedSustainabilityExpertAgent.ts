import { BaseAgent } from '../core/BaseAgent';
import { AgentPersona, AgentContext, AgentResponse, AgentConfig } from '../types/AgentTypes';
import { getClaudeAIService } from '../services/ClaudeAIService';

export class EnhancedSustainabilityExpertAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      maxTokens: 1000,
      temperature: 0.4,
      systemPrompt: 'You are a sustainability expert with deep knowledge of environmental science, corporate sustainability, and climate action. Provide detailed, actionable guidance on ESG, climate strategy, renewable energy, and sustainable business practices.',
      fallbackResponses: [
        "That's an interesting sustainability question. Let me provide some insights.",
        "From a sustainability perspective, there are several factors to consider.",
        "I'd be happy to share my expertise on this environmental topic."
      ],
      escalationThreshold: 3
    };

    super(
      'enhanced-sustainability-expert-001',
      'Dr. Green (Enhanced)',
      AgentPersona.SUSTAINABILITY_EXPERT,
      'Expert in sustainability practices, environmental science, and corporate climate strategies with AI-enhanced capabilities',
      [
        'sustainability_strategy',
        'environmental_science',
        'corporate_esg',
        'climate_policy',
        'green_technology',
        'circular_economy',
        'biodiversity',
        'renewable_energy',
        'ai_enhanced_responses'
      ],
      config
    );
  }

  public getPersonalityPrompt(): string {
    return `You are Dr. Green, a leading sustainability expert with 15+ years of experience in environmental science and corporate sustainability. Your expertise includes:

    - Corporate ESG strategies and implementation
    - Climate science and environmental impact assessment
    - Sustainable business practices and circular economy
    - Renewable energy and green technology solutions
    - Policy analysis and regulatory compliance
    - Supply chain sustainability and life cycle assessment

    Your communication style is:
    - Knowledgeable and authoritative yet accessible
    - Evidence-based with concrete examples
    - Solution-oriented and practical
    - Encouraging of sustainable action
    - Clear in explaining complex concepts

    You help users understand sustainability challenges and provide actionable guidance for both individuals and organizations working on climate solutions.`;
  }

  public async processMessage(message: string, context: AgentContext): Promise<AgentResponse> {
    const claudeAI = getClaudeAIService();
    
    // Try to use Claude AI if available and configured
    if (claudeAI && claudeAI.isConfigured()) {
      try {
        const aiResponse = await claudeAI.generateResponse(
          this.getPersonalityPrompt(),
          message,
          context
        );
        
        // If AI response is successful, return it
        if (aiResponse.confidence > 0.6 && !aiResponse.metadata?.fallback) {
          return {
            ...aiResponse,
            metadata: {
              ...aiResponse.metadata,
              agentId: this.id,
              enhanced: true
            }
          };
        }
      } catch (error) {
        console.warn('Claude AI failed, falling back to local knowledge:', error);
      }
    }

    // Fallback to local knowledge-based responses
    return this.processWithLocalKnowledge(message, context);
  }

  private async processWithLocalKnowledge(message: string, context: AgentContext): Promise<AgentResponse> {
    const messageText = message.toLowerCase();
    const confidence = this.calculateConfidence(messageText);

    // Handle ESG and corporate sustainability questions
    if (this.isESGQuery(messageText)) {
      return this.handleESGQuery(message, context);
    }

    // Handle climate strategy questions
    if (this.isClimateStrategyQuery(messageText)) {
      return this.handleClimateStrategy(message, context);
    }

    // Handle renewable energy questions
    if (this.isRenewableEnergyQuery(messageText)) {
      return this.handleRenewableEnergy(message, context);
    }

    // Handle supply chain sustainability
    if (this.isSupplyChainQuery(messageText)) {
      return this.handleSupplyChain(message, context);
    }

    // Handle circular economy questions
    if (this.isCircularEconomyQuery(messageText)) {
      return this.handleCircularEconomy(message, context);
    }

    // Handle regulatory and policy questions
    if (this.isPolicyQuery(messageText)) {
      return this.handlePolicy(message, context);
    }

    // General sustainability guidance
    return this.provideGeneralSustainabilityGuidance(message, context, confidence);
  }

  private calculateConfidence(message: string): number {
    const expertiseKeywords = [
      'sustainability', 'esg', 'environmental', 'climate', 'carbon',
      'renewable', 'green', 'circular economy', 'biodiversity',
      'emissions', 'net zero', 'decarbonization', 'sustainable'
    ];
    
    const words = message.split(' ');
    const matches = expertiseKeywords.filter(keyword => 
      words.some(word => word.includes(keyword))
    ).length;
    
    return Math.min(0.95, 0.4 + (matches * 0.1));
  }

  private isESGQuery(message: string): boolean {
    const esgKeywords = [
      'esg', 'environmental social governance', 'sustainability reporting',
      'materiality', 'stakeholder', 'sustainability metrics', 'tcfd',
      'sasb', 'gri', 'csrd', 'eu taxonomy'
    ];
    
    return esgKeywords.some(keyword => message.includes(keyword));
  }

  private isClimateStrategyQuery(message: string): boolean {
    const strategyKeywords = [
      'climate strategy', 'net zero', 'carbon neutral', 'decarbonization',
      'transition plan', 'climate targets', 'sbti', 'paris agreement',
      'science based targets'
    ];
    
    return strategyKeywords.some(keyword => message.includes(keyword));
  }

  private isRenewableEnergyQuery(message: string): boolean {
    const renewableKeywords = [
      'renewable energy', 'solar', 'wind', 'hydro', 'geothermal',
      'biomass', 'clean energy', 'grid', 'battery', 'storage'
    ];
    
    return renewableKeywords.some(keyword => message.includes(keyword));
  }

  private isSupplyChainQuery(message: string): boolean {
    const supplyChainKeywords = [
      'supply chain', 'supplier', 'procurement', 'logistics',
      'transportation', 'upstream', 'downstream', 'value chain'
    ];
    
    return supplyChainKeywords.some(keyword => message.includes(keyword));
  }

  private isCircularEconomyQuery(message: string): boolean {
    const circularKeywords = [
      'circular economy', 'recycling', 'waste', 'reuse', 'reduce',
      'cradle to cradle', 'life cycle', 'materials', 'packaging'
    ];
    
    return circularKeywords.some(keyword => message.includes(keyword));
  }

  private isPolicyQuery(message: string): boolean {
    const policyKeywords = [
      'regulation', 'policy', 'compliance', 'law', 'directive',
      'mandate', 'reporting requirement', 'disclosure', 'audit'
    ];
    
    return policyKeywords.some(keyword => message.includes(keyword));
  }

  private handleESGQuery(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Great ESG question! Environmental, Social, and Governance factors are crucial for sustainable business operations.

**Key ESG considerations:**
• **Environmental**: Climate impact, resource efficiency, pollution prevention
• **Social**: Employee welfare, community impact, human rights
• **Governance**: Board diversity, executive compensation, ethics

**Getting started with ESG:**
1. Conduct a materiality assessment to identify key issues
2. Set measurable targets aligned with business strategy
3. Implement robust data collection and reporting systems
4. Engage stakeholders regularly for feedback

Popular frameworks include GRI Standards, SASB, and TCFD. Would you like me to dive deeper into any specific aspect of ESG implementation?`,
      0.9,
      false,
      { topic: 'esg', expertise_area: 'corporate_sustainability' }
    );
  }

  private handleClimateStrategy(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Developing an effective climate strategy is essential for long-term business resilience! Here's a structured approach:

**1. Baseline Assessment**
- Measure current carbon footprint (Scope 1, 2, 3)
- Identify emission hotspots and reduction opportunities
- Assess climate risks and opportunities

**2. Target Setting**
- Set science-based targets aligned with 1.5°C pathway
- Define interim milestones and metrics
- Consider net-zero commitments with clear roadmap

**3. Implementation**
- Energy efficiency improvements
- Renewable energy transition
- Supply chain engagement
- Product/service innovation

**4. Monitoring & Reporting**
- Regular progress tracking
- Transparent disclosure (CDP, TCFD)
- Stakeholder communication

The Science Based Targets initiative (SBTi) provides excellent guidance for target setting. What specific aspect of climate strategy would you like to explore further?`,
      0.95,
      false,
      { topic: 'climate_strategy', expertise_area: 'decarbonization' }
    );
  }

  private handleRenewableEnergy(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Renewable energy is a cornerstone of effective decarbonization! Here's what you should know:

**Key Technologies:**
• **Solar**: Costs dropped 80%+ in past decade, highly scalable
• **Wind**: Excellent for large-scale power generation
• **Hydro**: Reliable baseload, but geographic limitations
• **Geothermal**: Consistent output, expanding applications

**Corporate Renewable Energy Options:**
1. **Power Purchase Agreements (PPAs)**: Long-term contracts with developers
2. **On-site Installation**: Solar panels, small wind systems
3. **Green Energy Certificates**: Purchase renewable energy credits
4. **Virtual PPAs**: Financial contracts without physical delivery

**Benefits:**
- Reduced electricity costs and price volatility
- Lower carbon footprint
- Enhanced ESG credentials
- Energy security and independence

The key is matching your energy profile with the right renewable solution. Would you like specific guidance for your organization's renewable energy transition?`,
      0.88,
      false,
      { topic: 'renewable_energy', expertise_area: 'clean_technology' }
    );
  }

  private handleSupplyChain(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Supply chain sustainability is crucial since Scope 3 emissions often represent 70-90% of total corporate emissions!

**Key Strategies:**
1. **Supplier Engagement**
   - Sustainability questionnaires and assessments
   - Collaborative improvement programs
   - Supplier training and capacity building

2. **Procurement Practices**
   - Sustainable sourcing criteria
   - Local/regional suppliers to reduce transport
   - Circular materials and recycled content

3. **Transportation Optimization**
   - Modal shift to lower-carbon options
   - Route optimization and consolidation
   - Alternative fuels and electric vehicles

4. **Measurement & Monitoring**
   - Scope 3 emissions calculation
   - Supplier sustainability scorecards
   - Regular audits and verification

**Best Practices:**
- Start with high-impact suppliers (80/20 rule)
- Set clear expectations and incentives
- Provide support, not just requirements
- Build long-term partnerships

Which aspect of supply chain sustainability would you like to explore in more detail?`,
      0.92,
      false,
      { topic: 'supply_chain', expertise_area: 'scope3_emissions' }
    );
  }

  private handleCircularEconomy(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `The circular economy is transforming how we think about resources and waste! Here's how to apply circular principles:

**Core Principles:**
1. **Design out waste** - Products designed for disassembly/reuse
2. **Keep products in use** - Sharing, repairing, refurbishing
3. **Regenerate natural systems** - Renewable inputs, biodiversity

**Business Model Innovations:**
• **Product-as-a-Service**: Retain ownership, lease functionality
• **Sharing Platforms**: Maximize asset utilization
• **Remanufacturing**: Restore products to like-new condition
• **Industrial Symbiosis**: One company's waste = another's input

**Implementation Steps:**
1. Material flow analysis - map current resource use
2. Identify circular opportunities in value chain
3. Redesign products for circularity
4. Develop reverse logistics capabilities
5. Create partnerships for material loops

**Benefits:**
- Reduced material costs and supply risk
- New revenue streams
- Enhanced brand differentiation
- Compliance with emerging regulations

Companies like Interface, Patagonia, and Philips are leading examples. What specific circular economy application interests you most?`,
      0.87,
      false,
      { topic: 'circular_economy', expertise_area: 'resource_efficiency' }
    );
  }

  private handlePolicy(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Sustainability regulations are rapidly evolving globally! Here's what organizations need to know:

**Major Regulatory Developments:**
• **EU CSRD**: Comprehensive sustainability reporting for large companies
• **EU Taxonomy**: Classification system for sustainable activities
• **TCFD**: Climate-related financial disclosure recommendations
• **SEC Climate Rules**: Proposed climate disclosure requirements (US)
• **SFDR**: Sustainable finance disclosure regulation

**Key Compliance Areas:**
1. **Emissions Reporting**
   - Scope 1, 2, 3 greenhouse gas emissions
   - Third-party verification requirements
   - Forward-looking climate targets

2. **Risk Assessment**
   - Physical and transition climate risks
   - Double materiality analysis
   - Scenario analysis and stress testing

3. **Supply Chain Due Diligence**
   - Human rights and environmental standards
   - Conflict minerals and deforestation
   - Modern slavery act compliance

**Preparation Strategy:**
- Establish robust data collection systems
- Conduct materiality assessments
- Engage with stakeholders early
- Consider voluntary frameworks as stepping stones

The regulatory landscape is complex but moving toward standardization. Would you like specific guidance on any particular regulation or compliance area?`,
      0.91,
      false,
      { topic: 'policy_compliance', expertise_area: 'regulatory_framework' }
    );
  }

  private provideGeneralSustainabilityGuidance(message: string, context: AgentContext, confidence: number): AgentResponse {
    return this.formatResponse(
      `Thanks for your sustainability question! As a sustainability expert, I'm here to help you navigate the complex world of environmental action and corporate responsibility.

I can provide guidance on:
- Corporate ESG strategies and implementation
- Climate science and decarbonization pathways  
- Renewable energy transitions and clean technology
- Supply chain sustainability and Scope 3 emissions
- Circular economy and resource efficiency
- Policy compliance and regulatory frameworks

To give you the most helpful response, could you share more details about what specific sustainability challenge or opportunity you're working on? Whether it's for your organization or personal understanding, I'm here to provide evidence-based, practical guidance!`,
      confidence,
      false,
      { topic: 'general_sustainability', action: 'clarification_requested' }
    );
  }
} 