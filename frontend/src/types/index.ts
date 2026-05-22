export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface AgentLog {
  id: string;
  message: string;
  type: 'success' | 'pending' | 'info' | 'error';
  timestamp: Date;
}

export interface StatusCard {
  label: string;
  value: string;
  status: 'active' | 'inactive' | 'pending';
  icon: string;
}

export interface ChatResponse {
  status: 'success' | 'error';
  response?: string;
  logs?: string[];
  tool_count?: number;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
  icon: string;
}
