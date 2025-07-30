# AI Agent System

A comprehensive AI agent system for the climate insights platform, designed to provide intelligent, context-aware assistance to users across different domains of climate action and sustainability.

## Overview

The agent system consists of several specialized AI agents that can:
- Answer questions about sustainability and climate topics
- Moderate community discussions
- Guide new users through platform onboarding
- Provide expert insights on ESG, emissions, and climate strategies
- Route conversations to the most appropriate specialist

## Architecture

### Core Components

1. **BaseAgent** - Abstract base class providing common functionality
2. **AgentOrchestrator** - Routes messages to appropriate agents
3. **AgentService** - Main service interface for the application
4. **Agent Types** - TypeScript interfaces and types

### Agent Implementations

#### 1. Community Moderator Agent (`CommunityModeratorAgent`)
- **Persona**: Community Guardian
- **Role**: Maintains community health and positive engagement
- **Capabilities**:
  - Content moderation and toxicity detection
  - Community guidelines enforcement
  - Conflict resolution and de-escalation
  - New user welcome and support
  - Escalation management

#### 2. Sustainability Expert Agent (`SustainabilityExpertAgent`)
- **Persona**: Dr. Green (Sustainability Expert)
- **Role**: Provides expert knowledge on environmental and climate topics
- **Capabilities**:
  - ESG strategy and implementation guidance
  - Climate science and policy analysis
  - Renewable energy and green technology advice
  - Supply chain sustainability insights
  - Circular economy principles
  - Regulatory compliance guidance

#### 3. Onboarding Guide Agent (`OnboardingGuideAgent`)
- **Persona**: Climate Compass
- **Role**: Helps new users navigate the platform and discover features
- **Capabilities**:
  - Platform navigation assistance
  - Feature explanation and tutorials
  - Goal setting and personalization
  - Community connection facilitation
  - Learning pathway recommendations

## Usage

### Basic Usage with React Hook

```typescript
import { useAgents } from '../hooks/useAgents';

function MyComponent() {
  const {
    availableAgents,
    sendMessage,
    messages,
    isLoading,
    error
  } = useAgents('user123');

  const handleSendMessage = async () => {
    await sendMessage('How can I reduce my carbon footprint?');
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <strong>{message.type}:</strong> {message.content}
        </div>
      ))}
      <button onClick={handleSendMessage} disabled={isLoading}>
        Send Message
      </button>
    </div>
  );
}
```

### Direct Service Usage

```typescript
import { agentService } from '../agents';

// Initialize the service
await agentService.initialize();

// Send a message
const response = await agentService.processUserMessage(
  'What are the latest ESG reporting requirements?',
  'user123'
);

console.log(response.message);
console.log('Confidence:', response.confidence);
console.log('Agent:', response.metadata?.agentName);
```

### Using the AgentChat Component

```typescript
import AgentChat from '../components/AgentChat';

function App() {
  return (
    <div>
      <AgentChat 
        userId="user123"
        defaultMessage="Hello! I'm new to climate action."
      />
    </div>
  );
}
```

## Agent Routing

The system automatically routes messages to the most appropriate agent based on:
- Message content analysis
- Keywords and domain expertise
- User context and history
- Agent availability and capabilities

### Routing Rules

- **Sustainability topics** → Sustainability Expert Agent
- **Community issues** → Community Moderator Agent  
- **Getting started** → Onboarding Guide Agent
- **Technical data questions** → Data Analyst Agent (when implemented)

## Configuration

Each agent can be configured with:

```typescript
interface AgentConfig {
  maxTokens: number;        // Maximum response length
  temperature: number;      // Response creativity (0-1)
  systemPrompt: string;     // Base personality prompt
  fallbackResponses: string[]; // Default responses
  escalationThreshold: number; // When to escalate to humans
}
```

## Adding New Agents

1. **Create Agent Implementation**:
```typescript
export class MyNewAgent extends BaseAgent {
  constructor() {
    super(
      'my-agent-001',
      'Agent Name',
      AgentPersona.CUSTOM_PERSONA,
      'Agent description',
      ['capability1', 'capability2'],
      config
    );
  }

  getPersonalityPrompt(): string {
    return 'Your agent personality and instructions...';
  }

  async processMessage(message: string, context: AgentContext): Promise<AgentResponse> {
    // Implementation logic
    return this.formatResponse('Agent response', 0.8);
  }
}
```

2. **Register with Service**:
```typescript
// In AgentService.ts
const agents = [
  new CommunityModeratorAgent(),
  new SustainabilityExpertAgent(),
  new OnboardingGuideAgent(),
  new MyNewAgent() // Add your agent
];
```

3. **Update Routing Rules** (optional):
```typescript
// In AgentOrchestrator.ts
this.routingRules.set('custom_topic', [AgentPersona.CUSTOM_PERSONA]);
```

## Features

### Conversation Management
- Session-based conversations with history
- Context preservation across messages
- Multi-turn dialogue support

### Smart Routing
- Automatic agent selection based on content
- Fallback mechanisms for edge cases
- Confidence scoring for responses

### Escalation Support
- Automatic escalation detection
- Human moderator notification
- Escalation reason tracking

### Integration Ready
- React hooks for easy UI integration
- TypeScript support throughout
- Extensible architecture

## Development

### Testing Agents

```typescript
import { CommunityModeratorAgent } from '../implementations/CommunityModeratorAgent';

const agent = new CommunityModeratorAgent();
const response = await agent.processMessage(
  'Test message',
  { sessionId: 'test-session' }
);

console.log(response);
```

### Debugging

The system includes comprehensive logging and metadata:
- Agent selection reasoning
- Confidence scores
- Processing time
- Error details

## Roadmap

### Planned Agents
- **Data Analyst Agent**: For technical data queries and analysis
- **Climate Researcher Agent**: For scientific climate information
- **Scope 3 Specialist Agent**: Focused on supply chain emissions

### Future Enhancements
- Machine learning-based agent selection
- Sentiment analysis integration
- Multi-language support
- Advanced conversation analytics
- Integration with external AI services

## Contributing

When adding new agents or features:
1. Follow the established patterns and interfaces
2. Include comprehensive TypeScript types
3. Add proper error handling and logging
4. Update routing rules if needed
5. Add tests for new functionality

## Support

For questions about the agent system:
- Check the AI_AGENT_IDEAS.md for conceptual background
- Review existing agent implementations for patterns
- Test with the AgentChat component for UI integration