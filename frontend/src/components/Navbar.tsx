import { motion } from 'framer-motion';
import { Brain, Activity } from 'lucide-react';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50" />
            <Brain className="w-8 h-8 text-cyan-400 relative z-10" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CityMind AI
            </h1>
            <p className="text-[10px] text-slate-500 -mt-0.5">Powered by LangChain</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </motion.div>
            <span className="text-xs font-medium text-emerald-400">AI Active</span>
          </motion.div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>2 tools ready</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
