import React, { useState, useRef, useEffect } from 'react';
import { useAgents } from '../hooks/useAgents';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Send, Bot, User, Sparkles, MessageCircle, X, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface AgentChatProps {
  userId?: string;
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  defaultMessage?: string;
}

const AgentChat: React.FC<AgentChatProps> = ({
  userId,
  className,
  isOpen = true,
  onClose,
  defaultMessage
}) => {
  const [inputMessage, setInputMessage] = useState(defaultMessage || '');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    availableAgents,
    selectedAgent,
    isLoading,
    error,
    messages,
    sessionId,
    sendMessage,
    selectAgent,
    clearConversation,
    startNewConversation
  } = useAgents(userId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start conversation on mount if no session exists
  useEffect(() => {
    if (!sessionId && isOpen) {
      startNewConversation();
    }
  }, [sessionId, isOpen, startNewConversation]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      await sendMessage(message);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAgentIcon = (agentId?: string) => {
    if (!agentId) return Bot;
    
    switch (agentId) {
      case 'community-moderator-001':
        return MessageCircle;
      case 'sustainability-expert-001':
        return Sparkles;
      case 'onboarding-guide-001':
        return User;
      default:
        return Bot;
    }
  };

  const getAgentColor = (agentId?: string) => {
    if (!agentId) return 'bg-blue-500';
    
    switch (agentId) {
      case 'community-moderator-001':
        return 'bg-green-500';
      case 'sustainability-expert-001':
        return 'bg-purple-500';
      case 'onboarding-guide-001':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (!isOpen) return null;

  return (
    <Card className={cn('w-full max-w-2xl mx-auto h-[600px] flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Climate Assistant</CardTitle>
          {selectedAgent && (
            <Badge variant="secondary" className="text-xs">
              {selectedAgent.name}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConversation}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Agent Selection */}
        {availableAgents.length > 0 && (
          <div className="p-3 border-b bg-gray-50/50">
            <div className="text-sm font-medium mb-2">Available Specialists:</div>
            <div className="flex flex-wrap gap-2">
              {availableAgents.map((agent) => (
                <Button
                  key={agent.id}
                  variant={selectedAgent?.id === agent.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => selectAgent(agent.id)}
                  className="text-xs"
                >
                  {agent.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Start a conversation with our climate specialists!</p>
                <p className="text-xs mt-1">Ask about sustainability, emissions data, or community topics.</p>
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.type === 'user';
              const AgentIcon = getAgentIcon(message.agentId);
              const agentColor = getAgentColor(message.agentId);

              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start space-x-3',
                    isUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={cn('text-white', agentColor)}>
                        <AgentIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={cn(
                      'rounded-lg px-3 py-2 max-w-[80%] text-sm',
                      isUser
                        ? 'bg-blue-500 text-white ml-12'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {!isUser && message.confidence && message.confidence < 0.7 && (
                      <div className="text-xs opacity-70 mt-1">
                        (Confidence: {Math.round(message.confidence * 100)}%)
                      </div>
                    )}
                  </div>
                  
                  {isUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-500 text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}

            {(isLoading || isTyping) && (
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border-t border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t bg-white">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about climate data, sustainability, or community topics..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentChat;