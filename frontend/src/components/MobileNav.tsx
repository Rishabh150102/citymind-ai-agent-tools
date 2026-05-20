import { motion } from 'framer-motion';
import { Menu, Brain, Activity } from 'lucide-react';

interface MobileNavProps {
  onMenuOpen: () => void;
}

export function MobileNav({ onMenuOpen }: MobileNavProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between h-full px-4">
        <button
          onClick={onMenuOpen}
          className="p-2 rounded-lg bg-white/5 border border-white/10"
        >
          <Menu className="w-5 h-5 text-slate-400" />
        </button>
        
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-cyan-400" />
          <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            CityMind AI
          </h1>
        </div>
        
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-3 h-3 text-emerald-400" />
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
