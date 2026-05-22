import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Newspaper, Cloud, Globe, Building2 } from 'lucide-react';
import { AgentLogs } from './AgentLogs';
import { StatusCard } from './StatusCard';
import { AgentLog } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AgentLog[];
  toolCount: number;
  onPromptSelect: (prompt: string) => void;
}

const trendingQueries = [
  { id: '1', text: 'How is Delhi today?', icon: 'map' },
  { id: '2', text: 'Trending news in Mumbai', icon: 'news' },
  { id: '3', text: 'Weather in Bangalore', icon: 'cloud' },
  { id: '4', text: 'Latest updates from New York', icon: 'globe' },
  { id: '5', text: "What's happening in Dubai?", icon: 'building' },
  { id: '6', text: 'News and weather in London', icon: 'globe' },
];

const queryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  map: MapPin,
  news: Newspaper,
  cloud: Cloud,
  globe: Globe,
  building: Building2,
};

export function MobileMenu({ isOpen, onClose, logs, toolCount, onPromptSelect }: MobileMenuProps) {
  const handlePromptSelect = (prompt: string) => {
    onPromptSelect(prompt);
    onClose();
  };

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
              <div className="flex items-center justify-between mb-5">
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
              
              <div className="space-y-5">
                {/* Execution Logs */}
                <AgentLogs logs={logs} />
                
                {/* Status Cards */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
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
                      label="Tools Used"
                      value={toolCount}
                      status={toolCount > 0 ? 'active' : 'inactive'}
                      icon="wrench"
                      animateValue
                    />
                    <StatusCard
                      label="Status"
                      value="Ready"
                      status="active"
                      icon="check"
                    />
                  </div>
                </div>
                
                {/* Trending Queries */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trending Queries
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {trendingQueries.map((query) => {
                      const Icon = queryIcons[query.icon];
                      return (
                        <button
                          key={query.id}
                          onClick={() => handlePromptSelect(query.text)}
                          className="group flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-cyan-500/20 transition-all text-left"
                        >
                          <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                          <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                            {query.text.length > 20 ? query.text.slice(0, 20) + '...' : query.text}
                          </span>
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
