import { ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, trend }) => {
    return (
        <div className="glass-panel p-6 rounded-3xl transition-all duration-500 hover:luxury-glow hover:scale-[1.02] hover:border-primary/30 group cursor-default">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors opacity-70">{title}</p>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">{value}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 flex items-center justify-center text-muted group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 luxury-glow">
                    <ArrowUpRight size={18} />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20 uppercase tracking-wider">
                    {trend}
                </span>
                <span className="text-[10px] text-muted font-bold opacity-50 uppercase tracking-tight">vs last month</span>
            </div>
        </div>
    );
};

export default StatCard;
