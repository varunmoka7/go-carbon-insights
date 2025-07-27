# Claude Code Sub-Agents for Go Carbon Insights

This directory contains specialized Claude Code sub-agents tailored for the Go Carbon Insights platform. These agents work alongside your existing BMAD agents but focus specifically on carbon tracking, sustainability, and climate data expertise.

## Agent Organization

### Carbon Platform Agents (`.claude/commands/`)
**Namespace:** Alexander the Great's legendary team + role descriptors

- **`/aristotle-carbon-analyst`** - Aristotle: Alexander's brilliant philosopher and carbon data analyst
- **`/hephaestion-forum-moderator`** - Hephaestion: Alexander's trusted friend and community moderator
- **`/ptolemy-sustainability-educator`** - Ptolemy: Alexander's bodyguard and sustainability educator
- **`/cleitus-api-specialist`** - Cleitus: Alexander's engineer and API integration specialist
- **`/parmenion-data-architect`** - Parmenion: Alexander's master strategist and data architect
- **`/cassander-compliance-advisor`** - Cassander: Alexander's administrator and compliance advisor

### BMAD Agents (via npm package)
**Namespace:** `/bmad-*` 

- **`/bmad-master`** - Overall project orchestration
- **`/bmad-orchestrator`** - Task coordination and planning
- **`/dev`** - Software development specialist
- **`/qa`** - Quality assurance and testing
- **`/pm`** - Project management
- **`/architect`** - System architecture
- And others from your BMAD installation

## Usage Examples

### Activate Carbon-Specific Agents
```
/aristotle-carbon-analyst Help me analyze the Scope 3 emissions data for the manufacturing sector

/ptolemy-sustainability-educator Explain the difference between market-based and location-based Scope 2 calculations

/cassander-compliance-advisor What TCFD requirements apply to our carbon disclosure data?

/cleitus-api-specialist How do I set up webhooks for real-time emissions data updates?
```

### Continue Using BMAD Agents
```
/bmad-master Plan the next development sprint for the forum features

/dev Implement the new carbon tracking dashboard component

/qa Create comprehensive tests for the ESG metrics API
```

## Integration Strategy

### Separation of Concerns
- **Carbon agents**: Domain expertise in sustainability, climate data, compliance
- **BMAD agents**: Software development, project management, system architecture

### Collaborative Workflows
- Use carbon agents for domain research and requirements gathering
- Use BMAD agents for implementation planning and execution
- Switch between agent types as needed for different aspects of the same feature

### Example Workflow
1. `/carbon-analyst` - Research industry benchmarking requirements
2. `/compliance-advisor` - Validate regulatory compliance needs  
3. `/bmad-master` - Plan the development approach
4. `/architect` - Design the technical implementation
5. `/dev` - Execute the coding tasks
6. `/qa` - Test the implementation

## Configuration Notes

- Carbon agents are stored in `.claude/agents/` (project-specific)
- BMAD agents are accessed via npm package (global)
- Both use the same Claude Code slash command interface
- No conflicts between agent namespaces

## Benefits

✅ **Domain Expertise**: Specialized knowledge for carbon tracking and sustainability  
✅ **Separation**: Clear boundaries between domain and technical concerns  
✅ **Flexibility**: Use the right agent for each task  
✅ **Scalability**: Add more specialized agents as the platform grows  
✅ **Collaboration**: Agents can work together on complex features