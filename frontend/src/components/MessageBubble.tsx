import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

function renderMarkdown(content: string): string {
  let html = content;
  
  // Bold text
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-medium text-white">$1</strong>');
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-white mt-3 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-white mt-3 mb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-3 mb-2">$1</h1>');
  
  // Bullet lists
  html = html.replace(/^[•\-] (.+)$/gm, '<li class="text-slate-300 ml-3 mb-1">$1</li>');
  
  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="text-slate-300 ml-3 mb-1 list-decimal">$1</li>');
  
  // Line breaks (preserve paragraph structure)
  html = html.replace(/\n\n/g, '</p><p class="mb-2">');
  html = html.replace(/\n/g, '<br />');
  
  // Wrap in paragraph
  if (!html.startsWith('<h') && !html.startsWith('<li')) {
    html = `<p class="mb-2">${html}</p>`;
  }
  
  return html;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
            : 'bg-gradient-to-br from-cyan-500 to-blue-500'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </motion.div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.005 }}
          className={`inline-block rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
              : 'bg-white/5 border border-white/10 backdrop-blur-sm'
          }`}
        >
          {isUser ? (
            <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div 
              className="text-sm text-slate-300 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_li]:text-slate-300"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
            />
          )}
          
          {/* Streaming indicator */}
          {message.isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5"
            >
              <div className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1 h-1 rounded-full bg-cyan-400"
                  />
                ))}
              </div>
              <span className="text-[10px] text-cyan-400">generating...</span>
            </motion.div>
          )}
        </motion.div>

        {/* Timestamp */}
        <p className={`text-[10px] text-slate-600 mt-1.5 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}
