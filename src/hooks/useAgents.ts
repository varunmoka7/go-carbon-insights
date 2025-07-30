import { useState, useEffect, useCallback } from 'react';
import { agentService } from '../agents/services/AgentService';
import { Agent, AgentResponse } from '../agents/types/AgentTypes';

export interface AgentMessage {
  id: string;
  content: string;
  type: 'user' | 'agent';
  timestamp: Date;
  agentId?: string;
  confidence?: number;
}

export interface UseAgentsReturn {
  // Agent information
  availableAgents: Agent[];
  selectedAgent: Agent | null;
  isLoading: boolean;
  error: string | null;
  
  // Conversation management
  messages: AgentMessage[];
  sessionId: string | null;
  
  // Actions
  sendMessage: (message: string, preferredAgentId?: string) => Promise<void>;
  selectAgent: (agentId: string) => void;
  clearConversation: () => void;
  startNewConversation: () => Promise<void>;
  
  // Utilities
  suggestAgent: (message: string) => Promise<Agent | null>;
  getAgentStats: () => Record<string, any>;
}

export const useAgents = (userId?: string): UseAgentsReturn => {
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize agents on mount
  useEffect(() => {
    const initializeAgents = async () => {
      try {
        setIsLoading(true);
        await agentService.initialize();
        const agents = agentService.getAvailableAgents();
        setAvailableAgents(agents);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize agents');
        console.error('Agent initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAgents();
  }, []);

  // Start a new conversation
  const startNewConversation = useCallback(async () => {
    try {
      const newSessionId = await agentService.startConversation(userId);
      setSessionId(newSessionId);
      setMessages([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
    }
  }, [userId]);

  // Send a message to agents
  const sendMessage = useCallback(async (message: string, preferredAgentId?: string) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: AgentMessage = {
      id: `user_${Date.now()}`,
      content: message,
      type: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      let response: AgentResponse;
      
      if (sessionId) {
        // Continue existing conversation
        response = await agentService.continueConversation(sessionId, message, userId);
      } else {
        // Start new conversation
        const newSessionId = await agentService.startConversation(userId);
        setSessionId(newSessionId);
        response = await agentService.continueConversation(newSessionId, message, userId);
      }

      // Add agent response
      const agentMessage: AgentMessage = {
        id: `agent_${Date.now()}`,
        content: response.message,
        type: 'agent',
        timestamp: new Date(),
        agentId: response.metadata?.agentId,
        confidence: response.confidence
      };
      setMessages(prev => [...prev, agentMessage]);

      // Update selected agent if it changed
      if (response.metadata?.agentId) {
        const agent = agentService.getAgentById(response.metadata.agentId);
        if (agent && (!selectedAgent || selectedAgent.id !== agent.id)) {
          setSelectedAgent(agent);
        }
      }

      // Handle escalation if needed
      if (response.shouldEscalate) {
        console.warn('Agent escalation requested:', response.metadata);
        // You could trigger additional UI or notifications here
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error('Message send error:', err);
      
      // Add error message to conversation
      const errorMessage: AgentMessage = {
        id: `error_${Date.now()}`,
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        type: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, userId, selectedAgent]);

  // Select a specific agent
  const selectAgent = useCallback((agentId: string) => {
    const agent = agentService.getAgentById(agentId);
    setSelectedAgent(agent || null);
  }, []);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    if (sessionId) {
      agentService.endConversation(sessionId);
      setSessionId(null);
    }
    setError(null);
  }, [sessionId]);

  // Suggest an agent for a message
  const suggestAgent = useCallback(async (message: string): Promise<Agent | null> => {
    try {
      return await agentService.suggestAgentForContext(message, { userId });
    } catch (err) {
      console.error('Agent suggestion error:', err);
      return null;
    }
  }, [userId]);

  // Get agent statistics
  const getAgentStats = useCallback(() => {
    return agentService.getAgentStats();
  }, []);

  return {
    availableAgents,
    selectedAgent,
    isLoading,
    error,
    messages,
    sessionId,
    sendMessage,
    selectAgent,
    clearConversation,
    startNewConversation,
    suggestAgent,
    getAgentStats
  };
};