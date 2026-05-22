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
  
  // Headers - smaller and cleaner
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold text-white mt-2 mb-1">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-sm font-semibold text-white mt-2 mb-1.5">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-base font-semibold text-white mt-2 mb-1.5">$1</h1>');
  
  // Bullet lists - compact
  html = html.replace(/^[•\-] (.+)$/gm, '<li class="text-slate-300 text-sm leading-relaxed ml-2 mb-0.5">$1</li>');
  
  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="text-slate-300 text-sm leading-relaxed ml-2 mb-0.5">$1</li>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p class="text-sm mb-1.5 leading-relaxed">');
  html = html.replace(/\n/g, '<br />');
  
  // Wrap in paragraph if needed
  if (!html.startsWith('<h') && !html.startsWith('<li')) {
    html = `<p class="text-sm mb-1.5 leading-relaxed">${html}</p>`;
  }
  
  return html;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center shadow-lg ${
          isUser 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/20' 
            : 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-cyan-500/20'
        }`}
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-white" />
        )}
      </motion.div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.003 }}
          className={`inline-block rounded-xl px-3.5 py-2.5 ${
            isUser
              ? 'bg-gradient-to-br from-purple-500/15 to-pink-500/15 border border-purple-500/20'
              : 'bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm'
          }`}
        >
          {isUser ? (
            <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div 
              className="text-sm text-slate-300 leading-relaxed [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_li]:text-slate-300 [&_li]:text-sm"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
            />
          )}
          
          {/* Streaming indicator */}
          {message.isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-white/5"
            >
              <div className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.12 }}
                    className="w-0.5 h-0.5 rounded-full bg-cyan-400"
                  />
                ))}
              </div>
              <span className="text-[9px] text-cyan-400">generating...</span>
            </motion.div>
          )}
        </motion.div>

        {/* Timestamp */}
        <p className={`text-[9px] text-slate-600 mt-1 px-0.5 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}
