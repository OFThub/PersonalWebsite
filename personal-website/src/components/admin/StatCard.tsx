import { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
};

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon className="text-cyan-400" size={32} />
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <h3 className="text-gray-400">{title}</h3>
    </div>
  );
}
