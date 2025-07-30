import { BaseAgent } from '../core/BaseAgent';
import { AgentPersona, AgentContext, AgentResponse, AgentConfig } from '../types/AgentTypes';

export class OnboardingGuideAgent extends BaseAgent {
  constructor() {
    const config: AgentConfig = {
      maxTokens: 600,
      temperature: 0.6,
      systemPrompt: 'You are a friendly onboarding guide helping new users navigate the climate platform.',
      fallbackResponses: [
        "Welcome! I'm here to help you get started on your climate journey.",
        "Let me guide you through the platform features!",
        "I'd love to help you discover what our climate community has to offer."
      ],
      escalationThreshold: 4
    };

    super(
      'onboarding-guide-001',
      'Climate Compass',
      AgentPersona.ONBOARDING_GUIDE,
      'Friendly guide helping new users navigate the platform and discover climate action opportunities',
      [
        'user_onboarding',
        'platform_navigation',
        'feature_introduction',
        'goal_setting',
        'community_integration',
        'learning_pathways'
      ],
      config
    );
  }

  public getPersonalityPrompt(): string {
    return `You are Climate Compass, an enthusiastic and supportive onboarding guide for a climate action platform. Your mission is to:

    - Welcome new users warmly and make them feel at home
    - Explain platform features in simple, accessible terms
    - Help users discover relevant content based on their interests
    - Guide users toward meaningful climate actions
    - Connect users with the right communities and resources
    - Encourage engagement while respecting different experience levels

    Your personality is:
    - Warm, encouraging, and patient
    - Knowledgeable about the platform without being overwhelming
    - Adaptive to different user backgrounds and goals
    - Enthusiastic about climate action but not preachy
    - Solution-focused and empowering

    You help users transform from platform newcomers into engaged climate community members.`;
  }

  public async processMessage(message: string, context: AgentContext): Promise<AgentResponse> {
    const messageText = message.toLowerCase();
    const confidence = this.calculateConfidence(messageText);

    // Handle new user greetings
    if (this.isNewUserGreeting(messageText)) {
      return this.provideWelcome(context);
    }

    // Handle platform navigation questions
    if (this.isNavigationQuery(messageText)) {
      return this.helpWithNavigation(message, context);
    }

    // Handle feature explanation requests
    if (this.isFeatureQuery(messageText)) {
      return this.explainFeatures(message, context);
    }

    // Handle goal setting and personalization
    if (this.isGoalSettingQuery(messageText)) {
      return this.helpWithGoalSetting(message, context);
    }

    // Handle community connection questions
    if (this.isCommunityQuery(messageText)) {
      return this.guideToCommunity(message, context);
    }

    // Handle getting started questions
    if (this.isGettingStartedQuery(messageText)) {
      return this.provideGettingStartedGuide(context);
    }

    // General onboarding support
    return this.provideGeneralOnboardingSupport(message, context, confidence);
  }

  private calculateConfidence(message: string): number {
    const onboardingKeywords = [
      'new', 'start', 'begin', 'help', 'guide', 'how',
      'where', 'what', 'first time', 'getting started',
      'navigate', 'features', 'tutorial', 'onboarding'
    ];
    
    const words = message.split(' ');
    const matches = onboardingKeywords.filter(keyword => 
      words.some(word => word.includes(keyword))
    ).length;
    
    return Math.min(0.9, 0.5 + (matches * 0.1));
  }

  private isNewUserGreeting(message: string): boolean {
    const greetingPatterns = [
      'hello', 'hi', 'hey', 'new here', 'just joined',
      'first time', 'getting started', 'new user'
    ];
    
    return greetingPatterns.some(pattern => message.includes(pattern));
  }

  private isNavigationQuery(message: string): boolean {
    const navigationKeywords = [
      'navigate', 'find', 'where is', 'how to get to',
      'menu', 'sidebar', 'dashboard', 'page'
    ];
    
    return navigationKeywords.some(keyword => message.includes(keyword));
  }

  private isFeatureQuery(message: string): boolean {
    const featureKeywords = [
      'features', 'what can i do', 'capabilities', 'functions',
      'tools', 'options', 'what does this do'
    ];
    
    return featureKeywords.some(keyword => message.includes(keyword));
  }

  private isGoalSettingQuery(message: string): boolean {
    const goalKeywords = [
      'goals', 'objectives', 'targets', 'what should i',
      'personalize', 'customize', 'preferences', 'interests'
    ];
    
    return goalKeywords.some(keyword => message.includes(keyword));
  }

  private isCommunityQuery(message: string): boolean {
    const communityKeywords = [
      'community', 'forum', 'discussion', 'connect',
      'meet people', 'join', 'participate', 'engage'
    ];
    
    return communityKeywords.some(keyword => message.includes(keyword));
  }

  private isGettingStartedQuery(message: string): boolean {
    const startingKeywords = [
      'getting started', 'how to start', 'begin', 'first steps',
      'tutorial', 'guide', 'walkthrough'
    ];
    
    return startingKeywords.some(keyword => message.includes(keyword));
  }

  private provideWelcome(context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Welcome to our climate action community! 🌍 I'm Climate Compass, your friendly guide to getting started.

I'm excited to help you discover how this platform can support your sustainability journey! Here's what makes our community special:

🔍 **Climate Dashboard**: Explore real company emissions data and climate performance
📊 **Industry Analysis**: Compare sustainability efforts across sectors  
💬 **Community Forum**: Connect with like-minded climate advocates
📈 **Personal Tracking**: Monitor your own climate impact and goals

**Quick first steps:**
1. Explore the Climate Dashboard to see how companies are performing
2. Check out the Community Forum for discussions and insights
3. Set up your profile to connect with others who share your interests

What aspect of climate action interests you most? I can guide you to the perfect starting point! 🚀`,
      0.95,
      false,
      { action: 'welcome_new_user', user_type: 'new_member' }
    );
  }

  private helpWithNavigation(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Great question about navigation! Let me help you find your way around:

**Main Navigation Areas:**
🏠 **Home/Dashboard**: Your starting point with key insights and activity
📊 **Climate Data**: 
   - Company performance metrics
   - Industry benchmarking  
   - Emissions tracking tools
💬 **Community**:
   - Forum discussions
   - User profiles and connections
   - Events and activities
⚙️ **Settings**: Personalize your experience and preferences

**Pro Navigation Tips:**
- Use the search bar at the top to find specific companies or topics
- The sidebar menu (click ☰) gives you quick access to all main sections
- Breadcrumbs at the top of pages show you where you are
- Your profile icon (top right) has account settings and logout

**Looking for something specific?** Just tell me what you're trying to find and I'll point you in the right direction! 🧭`,
      0.88,
      false,
      { action: 'navigation_help', assistance_type: 'platform_guidance' }
    );
  }

  private explainFeatures(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `I'd love to show you what our platform can do! Here are the key features that make climate action accessible and impactful:

**🔍 Climate Intelligence**
- Real-time company sustainability data
- Emissions tracking across Scope 1, 2, and 3
- Industry benchmarking and comparison tools
- ESG performance metrics

**📈 Data Visualization**
- Interactive charts and dashboards
- Progress tracking over time  
- Sector-based analysis
- Geographic climate impact mapping

**👥 Community Features**
- Discussion forums by topic/industry
- Expert Q&A sessions
- Peer-to-peer learning
- Resource sharing and recommendations

**🎯 Personal Tools**
- Goal setting and progress tracking
- Custom company watchlists  
- Personalized insights and recommendations
- Achievement badges and milestones

**🔗 Integration & APIs**
- Data export capabilities
- Third-party tool connections
- Reporting and analytics

Which feature would you like to explore first? I can give you a personalized walkthrough! ✨`,
      0.92,
      false,
      { action: 'feature_explanation', content_type: 'platform_overview' }
    );
  }

  private helpWithGoalSetting(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Setting meaningful climate goals is a fantastic way to start your journey! Let me help you create a personalized approach:

**🎯 Goal Categories to Consider:**
1. **Learning Goals**: 
   - Understand specific industries' climate impact
   - Master carbon accounting basics
   - Stay updated on climate policy

2. **Engagement Goals**:
   - Participate in community discussions
   - Connect with sustainability professionals
   - Share insights and experiences

3. **Action Goals**:
   - Track your personal/company carbon footprint
   - Advocate for climate policies
   - Support sustainable businesses

4. **Professional Goals**:
   - Build expertise in sustainability
   - Network with climate professionals
   - Advance climate-focused career

**Quick Goal-Setting Steps:**
1. **Reflect**: What climate impact do you want to make?
2. **Focus**: Choose 2-3 specific areas to start
3. **Measure**: Define how you'll track progress
4. **Connect**: Find community members with similar goals

**Popular starting goals:**
- "Learn about 3 new sustainable companies each week"
- "Engage in 2 community discussions monthly"  
- "Reduce my personal carbon footprint by 10%"

What kind of climate impact resonates most with you? I can help you craft specific, achievable goals! 🚀`,
      0.89,
      false,
      { action: 'goal_setting_assistance', guidance_type: 'personalized_planning' }
    );
  }

  private guideToCommunity(message: string, context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Our community is the heart of the platform - you're going to love connecting with fellow climate advocates! 🌟

**🏛️ Community Spaces:**
- **General Discussion**: Broad climate topics and news
- **Industry Focus Groups**: Sector-specific sustainability challenges  
- **Data & Analytics**: Technical discussions about climate data
- **Policy & Advocacy**: Climate policy and regulatory updates
- **Solutions Showcase**: Innovation and success stories

**💬 How to Engage:**
1. **Start by Observing**: Read popular discussions to get a feel
2. **Introduce Yourself**: Share your background and interests
3. **Ask Questions**: Our community loves helping newcomers
4. **Share Insights**: Your perspective adds value, regardless of experience level
5. **Support Others**: Like, comment, and encourage fellow members

**🌟 Community Guidelines:**
- Be respectful and constructive
- Stay focused on climate and sustainability topics  
- Share reliable sources when possible
- Help create an inclusive environment

**Great First Steps:**
- Check out the "New Members" welcome thread
- Browse trending topics to see what's current
- Look for members with similar interests or backgrounds

Ready to dive in? I can help you craft a great introduction post or find the perfect discussion to join! 💬`,
      0.91,
      false,
      { action: 'community_guidance', engagement_level: 'initial_connection' }
    );
  }

  private provideGettingStartedGuide(context: AgentContext): AgentResponse {
    return this.formatResponse(
      `Perfect timing! Here's your personalized getting started roadmap to make the most of our climate platform:

**📍 Your First 15 Minutes:**
1. **Explore the Climate Dashboard** - See live company sustainability data
2. **Browse Top Companies** - Discover leaders and laggards in climate action  
3. **Check Your Industry** - Find companies in sectors you care about

**🗓️ Your First Week:**
- Set up your profile with interests and goals
- Join 2-3 community discussions that interest you
- Follow companies you want to track
- Introduce yourself in the community

**📈 Your First Month:**
- Create your first forum post or ask a question
- Set up personalized tracking goals
- Connect with other members who share your interests
- Explore advanced features like data exports

**🏆 Ongoing Engagement:**
- Participate in weekly community challenges
- Share insights from your climate journey
- Help onboard other new members
- Build your expertise and reputation

**🎯 Choose Your Path:**
- **Data Explorer**: Focus on analyzing company performance
- **Community Builder**: Engage in discussions and networking
- **Action Advocate**: Use insights to drive real-world change
- **Learning Focused**: Build deep climate expertise

What path sounds most exciting to you? I can create a custom action plan for your specific interests! 🚀`,
      0.94,
      false,
      { action: 'comprehensive_getting_started', roadmap_type: 'personalized_journey' }
    );
  }

  private provideGeneralOnboardingSupport(message: string, context: AgentContext, confidence: number): AgentResponse {
    return this.formatResponse(
      `I'm here to make your climate platform experience amazing! 🌍

As your onboarding guide, I can help you with:
- **Platform Navigation**: Finding your way around all features
- **Feature Discovery**: Understanding what tools are available  
- **Goal Setting**: Creating a personalized climate action plan
- **Community Connection**: Meeting like-minded sustainability advocates
- **Learning Pathways**: Building your climate expertise step by step

Whether you're a complete beginner or have sustainability experience, I'll meet you where you are and help you move forward confidently.

**Quick question to personalize my help**: What brought you to our platform today? Are you looking to:
- Learn about corporate climate performance?
- Connect with the sustainability community?
- Track your own climate impact?
- Build professional climate expertise?
- Something else entirely?

Just let me know, and I'll tailor my guidance to exactly what you need! ✨`,
      confidence,
      false,
      { action: 'general_onboarding_support', support_type: 'needs_assessment' }
    );
  }
}