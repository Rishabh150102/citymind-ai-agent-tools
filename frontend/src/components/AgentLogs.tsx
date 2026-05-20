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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Execution Logs
        </h3>
        {logs.length > 0 && (
          <span className="text-[10px] text-slate-500">
            {logs.length} step{logs.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => {
            const Icon = logIcons[log.type];
            const colors = logColors[log.type];
            const isPending = log.type === 'pending';
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 10, height: 0 }}
                transition={{ 
                  delay: index * 0.03,
                  height: { duration: 0.2 }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${colors.bg} border ${colors.border}`}
              >
                <Icon 
                  className={`w-3.5 h-3.5 flex-shrink-0 ${colors.icon} ${isPending ? 'animate-spin' : ''}`} 
                />
                <span className={`text-xs flex-1 ${colors.text}`}>{log.message}</span>
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {formatTimestamp(log.timestamp)}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {logs.length === 0 && (
          <div className="text-center py-8 text-slate-600">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-slate-800/50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-xs">No execution logs</p>
            <p className="text-[10px] text-slate-700 mt-1">Send a message to see agent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}
