import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Newspaper, Cloud, Zap, Clock } from 'lucide-react';
import { AgentLogs } from './AgentLogs';
import { StatusCard } from './StatusCard';
import { AgentLog, SuggestedPrompt } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AgentLog[];
  onPromptSelect: (prompt: string) => void;
}

const suggestedPrompts: SuggestedPrompt[] = [
  { id: '1', text: 'How is Delhi today?', icon: 'map' },
  { id: '2', text: 'Latest news in Mumbai', icon: 'news' },
  { id: '3', text: 'Weather in Bangalore', icon: 'cloud' },
  { id: '4', text: "What's happening in Lucknow?", icon: 'zap' },
];

const promptIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  map: MapPin,
  news: Newspaper,
  cloud: Cloud,
  zap: Zap,
};

export function MobileMenu({ isOpen, onClose, logs, onPromptSelect }: MobileMenuProps) {
  const handlePromptSelect = (prompt: string) => {
    onPromptSelect(prompt);
    onClose();
  };

  // Count tools from logs
  const toolCallsCount = logs.filter(log => 
    log.message.toLowerCase().includes('tool selected')
  ).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-slate-950 border-r border-white/10 overflow-y-auto custom-scrollbar"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-bold text-white">CityMind AI</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Execution Logs */}
                <AgentLogs logs={logs} />
                
                {/* Status Cards */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    System Status
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <StatusCard
                      label="Agent"
                      value="Active"
                      status="active"
                      icon="activity"
                    />
                    <StatusCard
                      label="Tools"
                      value={toolCallsCount.toString()}
                      status={toolCallsCount > 0 ? 'active' : 'inactive'}
                      icon="wrench"
                    />
                    <StatusCard
                      label="Status"
                      value="Ready"
                      status="active"
                      icon="activity"
                    />
                  </div>
                </div>
                
                {/* Suggested Prompts */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Suggested Prompts
                  </h3>
                  <div className="space-y-2">
                    {suggestedPrompts.map((prompt) => {
                      const Icon = promptIcons[prompt.icon];
                      return (
                        <button
                          key={prompt.id}
                          onClick={() => handlePromptSelect(prompt.text)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all text-left"
                        >
                          <div className="p-1.5 rounded-lg bg-cyan-500/10">
                            <Icon className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span className="text-sm text-slate-300">{prompt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
