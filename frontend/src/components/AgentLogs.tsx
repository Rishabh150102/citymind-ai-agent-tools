import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Info, AlertCircle, Clock } from 'lucide-react';
import { AgentLog as AgentLogType } from '../types';

interface AgentLogsProps {
  logs: AgentLogType[];
}

const logIcons = {
  success: Check,
  pending: Loader2,
  info: Info,
  error: AlertCircle,
};

const logColors = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: 'text-emerald-400',
  },
  pending: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    icon: 'text-cyan-400',
  },
  info: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    text: 'text-slate-300',
    icon: 'text-slate-400',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: 'text-red-400',
  },
};

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
}

export function AgentLogs({ logs }: AgentLogsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Execution Logs
        </h3>
        {logs.length > 0 && (
          <span className="text-[10px] text-slate-600 font-mono">
            {logs.filter(l => l.type === 'success').length}/{logs.length}
          </span>
        )}
      </div>
      
      <div className="space-y-1 max-h-44 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => {
            const Icon = logIcons[log.type];
            const colors = logColors[log.type];
            const isPending = log.type === 'pending';
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -8, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 8, height: 0 }}
                transition={{ 
                  delay: index * 0.02,
                  height: { duration: 0.15 },
                  opacity: { duration: 0.2 }
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${colors.bg} border ${colors.border}`}
              >
                <Icon 
                  className={`w-3 h-3 flex-shrink-0 ${colors.icon} ${isPending ? 'animate-spin' : ''}`} 
                />
                <span className={`text-[11px] flex-1 ${colors.text}`}>{log.message}</span>
                <span className="text-[9px] text-slate-600 flex items-center gap-1 font-mono">
                  {formatTimestamp(log.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {logs.length === 0 && (
          <div className="text-center py-6 text-slate-600">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-slate-800/50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-[11px]">No execution logs</p>
            <p className="text-[10px] text-slate-700 mt-0.5">Send a message to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}
