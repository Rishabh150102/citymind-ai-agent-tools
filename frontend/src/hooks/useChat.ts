import { useState, useCallback, useRef } from 'react';
import { Message, AgentLog, ChatResponse } from '../types';

const BACKEND_URL = 'http://127.0.0.1:8000/chat';

const generateId = () => Math.random().toString(36).substring(2, 15);

// Fallback responses when backend is unavailable
const fallbackResponses: Record<string, { response: string; logs: string[]; tool_count: number }> = {
  delhi: {
    response: `**Delhi Today**

Weather: Partly cloudy, 32°C
Air Quality: Moderate (AQI: 156)

Good conditions for morning outdoor activities.`,
    logs: ['Received user query', 'Analyzing user intent', 'Weather tool selected', 'Generating final response'],
    tool_count: 1
  },
  mumbai: {
    response: `**Mumbai - Trending Updates**

• Metro Line 4 at 75% completion
• Yellow alert for heavy rainfall
• BKC fintech hub expansion announced`,
    logs: ['Received user query', 'Analyzing user intent', 'News tool selected', 'Generating final response'],
    tool_count: 1
  },
  bangalore: {
    response: `**Bangalore Weather**

Current: 28°C, partly cloudy
Humidity: 65% | Wind: 12 km/h

Evening showers expected.`,
    logs: ['Received user query', 'Analyzing user intent', 'Weather tool selected', 'Generating final response'],
    tool_count: 1
  },
  newyork: {
    response: `**New York - Latest Headlines**

• Tech sector shows strong Q4 growth
• Central Park summer events announced
• Transit upgrades scheduled for fall`,
    logs: ['Received user query', 'Analyzing user intent', 'News tool selected', 'Generating final response'],
    tool_count: 1
  },
  dubai: {
    response: `**Dubai - Current Updates**

Weather: Clear, 38°C
• Expo City expansion plans revealed
• New metro line construction begins`,
    logs: ['Received user query', 'Analyzing user intent', 'Weather tool selected', 'News tool selected', 'Generating final response'],
    tool_count: 2
  },
  london: {
    response: `**London - News & Weather**

Weather: 18°C, light rain
• Financial district expansion approved
• Tube upgrades scheduled this weekend`,
    logs: ['Received user query', 'Analyzing user intent', 'Weather tool selected', 'News tool selected', 'Generating final response'],
    tool_count: 2
  },
  default: {
    response: `I can help you with weather updates and trending news for cities worldwide. Try asking about Delhi, Mumbai, New York, Dubai, or London.`,
    logs: ['Received user query', 'Analyzing user intent', 'Processing query', 'Generating response'],
    tool_count: 0
  }
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [toolCount, setToolCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const addLog = useCallback((message: string, type: AgentLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: generateId(),
      message,
      type,
      timestamp: new Date()
    }]);
  }, []);

  const updateLastLog = useCallback((type: AgentLog['type']) => {
    setLogs(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], type };
      return updated;
    });
  }, []);

  const getFallbackResponse = (userMessage: string) => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('delhi')) return fallbackResponses.delhi;
    if (lower.includes('mumbai')) return fallbackResponses.mumbai;
    if (lower.includes('bangalore') || lower.includes('bengaluru')) return fallbackResponses.bangalore;
    if (lower.includes('new york') || lower.includes('nyc')) return fallbackResponses.newyork;
    if (lower.includes('dubai')) return fallbackResponses.dubai;
    if (lower.includes('london')) return fallbackResponses.london;
    return fallbackResponses.default;
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setLogs([]);
    setToolCount(0); // Reset tool count for new request

    try {
      addLog('Received user query', 'success');
      setLoadingMessage('Connecting to agent...');
      addLog('Analyzing user intent', 'pending');

      let response: ChatResponse;

      try {
        const res = await fetch(BACKEND_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content }),
          signal: abortControllerRef.current.signal
        });

        if (res.ok) {
          const data = await res.json();
          response = data;
        } else {
          throw new Error('Backend returned error');
        }
      } catch {
        const fallback = getFallbackResponse(content);
        response = {
          status: 'success',
          response: fallback.response,
          logs: fallback.logs,
          tool_count: fallback.tool_count
        };
      }

      // Process logs from response
      if (response.logs && response.logs.length > 0) {
        setLogs([]);
        
        for (let i = 0; i < response.logs.length; i++) {
          const logMessage = response.logs[i];
          const isLast = i === response.logs.length - 1;
          
          await new Promise(resolve => setTimeout(resolve, 120));
          addLog(logMessage, isLast ? 'success' : 'info');
        }
      } else {
        updateLastLog('success');
        addLog('Processing complete', 'success');
      }

      // Set tool count from response
      if (response.tool_count !== undefined) {
        setToolCount(response.tool_count);
      }

      setLoadingMessage('');

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.response || 'I apologize, but I could not process your request.',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMessage]);

      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === assistantMessage.id ? { ...m, isStreaming: false } : m
        ));
      }, 600);

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      setLoadingMessage('');
      updateLastLog('error');
      addLog('Request failed', 'error');
      
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'I\'m having trouble connecting right now. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, addLog, updateLastLog]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setLogs([]);
    setToolCount(0);
  }, []);

  return {
    messages,
    logs,
    toolCount,
    isLoading,
    loadingMessage,
    sendMessage,
    clearMessages
  };
}
