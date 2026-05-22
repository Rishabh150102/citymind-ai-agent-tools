import { motion } from 'framer-motion';
import { Sparkles, MapPin, Newspaper, Cloud, Globe, Building2 } from 'lucide-react';
import { AgentLogs } from './AgentLogs';
import { StatusCard } from './StatusCard';
import { AgentLog } from '../types';

interface SidebarProps {
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

export function Sidebar({ logs, toolCount, onPromptSelect }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl flex flex-col h-full overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
        {/* Logo Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">CityMind AI</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your intelligent city assistant powered by LangChain agents
            </p>
          </div>
        </motion.div>

        {/* Agent Execution Logs */}
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
            {trendingQueries.map((query, index) => {
              const Icon = queryIcons[query.icon];
              return (
                <motion.button
                  key={query.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPromptSelect(query.text)}
                  className="group relative flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-cyan-500/20 transition-all duration-200 text-left overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors relative z-10 flex-shrink-0" />
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors relative z-10 truncate leading-tight">
                    {query.text.length > 20 ? query.text.slice(0, 20) + '...' : query.text}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center justify-between text-[10px] text-slate-600">
          <span>v1.0.0</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Connected
          </span>
        </div>
      </div>
    </motion.aside>
  );
}
