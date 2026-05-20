import { motion } from 'framer-motion';
import { Activity, Shield, Wrench } from 'lucide-react';

interface StatusCardProps {
  label: string;
  value: string;
  status: 'active' | 'inactive' | 'pending';
  icon: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  activity: Activity,
  shield: Shield,
  wrench: Wrench,
};

const statusColors = {
  active: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  inactive: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
  },
  pending: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
};

export function StatusCard({ label, value, status, icon }: StatusCardProps) {
  const Icon = iconMap[icon] || Activity;
  const colors = statusColors[status];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative overflow-hidden rounded-xl ${colors.bg} border ${colors.border} p-3`}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-4 h-4 ${colors.text}`} />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-2 h-2 rounded-full ${colors.dot}`}
        />
      </div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${colors.text}`}>{value}</p>
      
      <div className={`absolute -bottom-2 -right-2 w-12 h-12 ${colors.dot} opacity-10 blur-xl rounded-full`} />
    </motion.div>
  );
}
