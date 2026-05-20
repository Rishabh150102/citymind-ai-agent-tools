import { motion } from 'framer-motion';
import { Sparkles, MapPin, Newspaper, Cloud, Zap } from 'lucide-react';
import { AgentLogs } from './AgentLogs';
import { StatusCard } from './StatusCard';
import { AgentLog, SuggestedPrompt } from '../types';

interface SidebarProps {
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

export function Sidebar({ logs, onPromptSelect }: SidebarProps) {
  // Count tools from logs
  const toolCallsCount = logs.filter(log => 
    log.message.toLowerCase().includes('tool selected')
  ).length;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl flex flex-col h-full overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {/* Logo Section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">CityMind AI</h2>
            </div>
            <p className="text-xs text-slate-400">
              Your intelligent city assistant powered by LangChain agents
            </p>
          </div>
        </motion.div>

        {/* Agent Execution Logs */}
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
            {suggestedPrompts.map((prompt, index) => {
              const Icon = promptIcons[prompt.icon];
              return (
                <motion.button
                  key={prompt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPromptSelect(prompt.text)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-200 text-left group"
                >
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                    {prompt.text}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-slate-500">
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
