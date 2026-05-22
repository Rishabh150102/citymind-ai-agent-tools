import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  loadingMessage: string;
  inputValue?: string;
  onSendMessage: (message: string) => void;
  onInputChange?: (value: string) => void;
}

export function ChatInterface({ messages, isLoading, loadingMessage, inputValue = '', onSendMessage, onInputChange }: ChatInterfaceProps) {
  const [internalInput, setInternalInput] = useState('');
  const input = onInputChange ? inputValue : internalInput;
  const setInput = onInputChange || setInternalInput;
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll with smooth behavior
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, [messages, loadingMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Messages Area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar">
        {messages.length === 0 ? (
          // Empty State
          <div className="h-full flex flex-col items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center"
              >
                <Sparkles className="w-7 h-7 text-cyan-400" />
              </motion.div>
              
              <h2 className="text-lg font-semibold text-white mb-2">
                Welcome to CityMind AI
              </h2>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                Get weather updates and trending news for cities worldwide.
              </p>
              
              <div className="flex flex-wrap justify-center gap-1.5">
                {['Weather', 'News', 'City Updates'].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 + 0.15 }}
                    className="px-2.5 py-1 rounded-md bg-white/5 border border-white/[0.06] text-[11px] text-slate-400"
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          // Messages List
          <div className="max-w-3xl mx-auto p-5 space-y-4">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </AnimatePresence>
            
            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 pl-1"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-1 h-1 rounded-full bg-cyan-400"
                  />
                  <span className="text-xs text-slate-400">{loadingMessage || 'Processing...'}</span>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} className="h-2" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-lg blur-md opacity-50" />
            
            {/* Input container */}
            <div className="relative flex items-end gap-2 p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm focus-within:border-cyan-500/30 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about weather or trending news..."
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm resize-none focus:outline-none px-3 py-2 leading-relaxed"
                style={{ minHeight: '36px', maxHeight: '120px' }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                whileTap={{ scale: input.trim() ? 0.95 : 1 }}
                className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-cyan-500/20"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>
          
          <p className="text-center text-[9px] text-slate-600 mt-1.5">
            Enter to send · Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
}
