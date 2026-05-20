import { useState, useCallback, useRef } from 'react';
import { Message, AgentLog, ChatResponse } from '../types';

const BACKEND_URL = 'http://127.0.0.1:8000/chat';

const generateId = () => Math.random().toString(36).substring(2, 15);

// Fallback responses when backend is unavailable
const fallbackResponses: Record<string, { response: string; logs: string[] }> = {
  delhi: {
    response: `**Delhi Today**

Weather: Partly cloudy, 32°C
Air Quality: Moderate (AQI: 156)

Good conditions for morning outdoor activities. Consider a mask in congested areas.`,
    logs: ['Received user query', 'Analyzing user intent', 'Weather tool selected', 'Generating final response']
  },
  mumbai: {
    response: `**Mumbai News**

• Metro Line 4 at 75% completion
• Yellow alert for heavy rainfall
• BKC fintech hub expansion announced`,
    logs: ['Received user query', 'Analyzing user intent', 'News tool selected', 'Generating final response']
  },
  bangalore: {
    response: `**Bangalore Weather**

Current: 28°C, partly cloudy
Humidity: 65%
Wind: 12 km/h

Evening showers expected. Good for outdoor dining.`,
    logs: ['Received user query', 'Analyzing user intent', 'Weather tool selected', 'Generating final response']
  },
  lucknow: {
    response: `**Lucknow Updates**

• Heritage corridor development ongoing
• New metro stations inaugurated
• Cultural festival scheduled this weekend`,
    logs: ['Received user query', 'Analyzing user intent', 'News tool selected', 'Generating final response']
  },
  default: {
    response: `I can help you with weather updates and news for various cities. Try asking about Delhi, Mumbai, Bangalore, or Lucknow.`,
    logs: ['Received user query', 'Analyzing user intent', 'Processing query', 'Generating response']
  }
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
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
    if (lower.includes('lucknow')) return fallbackResponses.lucknow;
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

    try {
      // Add initial log
      addLog('Received user query', 'success');
      
      // Show loading state
      setLoadingMessage('Connecting to agent...');
      
      // Add pending logs that will be updated
      addLog('Analyzing user intent', 'pending');

      // Try to call the backend
      let response: ChatResponse;
      let backendConnected = false;

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
          backendConnected = true;
        } else {
          throw new Error('Backend returned error');
        }
      } catch (fetchError) {
        // Backend unavailable, use fallback
        const fallback = getFallbackResponse(content);
        response = {
          status: 'success',
          response: fallback.response,
          logs: fallback.logs
        };
      }

      // Process logs from response
      if (response.logs && response.logs.length > 0) {
        // Clear the pending log and add all logs from backend
        setLogs([]);
        
        for (let i = 0; i < response.logs.length; i++) {
          const logMessage = response.logs[i];
          const isLast = i === response.logs.length - 1;
          
          // Add log with appropriate type
          await new Promise(resolve => setTimeout(resolve, 150));
          addLog(logMessage, isLast ? 'success' : 'info');
        }
      } else {
        // Update the pending log to success
        updateLastLog('success');
        addLog('Processing complete', 'success');
      }

      setLoadingMessage('');

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.response || 'I apologize, but I could not process your request.',
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMessage]);

      // End streaming animation
      setTimeout(() => {
        setMessages(prev => prev.map(m => 
          m.id === assistantMessage.id ? { ...m, isStreaming: false } : m
        ));
      }, 800);

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled
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
  }, []);

  return {
    messages,
    logs,
    isLoading,
    loadingMessage,
    sendMessage,
    clearMessages
  };
}
