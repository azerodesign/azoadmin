import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    Bot, Activity, Cpu, HardDrive, Clock, RefreshCw,
    Terminal, History, AlertCircle, CheckCircle2,
    ChevronRight, Search, Filter
} from 'lucide-react';

const BotDetails = () => {
    const [status, setStatus] = useState(null);
    const [updatelogs, setUpdatelogs] = useState([]);
    const [changelogs, setChangelogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);

            // Fetch Status
            const { data: statusData } = await supabase
                .from('bot_status')
                .select('*')
                .eq('session_id', 'main')
                .single();

            if (statusData) setStatus(statusData);

            // Fetch Update Logs
            const { data: updateData } = await supabase
                .from('updatelogs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (updateData) setUpdatelogs(updateData);

            // Fetch Change Logs
            const { data: changeData } = await supabase
                .from('changelogs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (changeData) setChangelogs(changeData);

            setLoading(false);
        };

        fetchAll();
        const interval = setInterval(fetchAll, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    if (loading && !status) return <div className="flex items-center justify-center h-96"><RefreshCw className="animate-spin text-primary" /></div>;

    const formatUptime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Bot Header Card */}
            <div className="glass-panel p-8 rounded-[40px] relative overflow-hidden group border border-white/5 luxury-glow">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-3xl ${status?.is_online ? 'bg-emerald-500/10' : 'bg-red-500/10'} flex items-center justify-center border border-white/10 luxury-glow shadow-2xl overflow-hidden p-4`}>
                            <Bot className={`w-full h-full ${status?.is_online ? 'text-emerald-500' : 'text-red-500'}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-foreground tracking-tight">Azo-Bot Primary</h1>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status?.is_online ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
                                    {status?.is_online ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </div>
                            <p className="text-muted/60 mt-1 font-medium italic">Running on Baileys Node.js • v{status?.version || '1.0.0'}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-2xl hover:scale-105 transition-all shadow-lg active:scale-95">
                            <Activity size={18} /> Restart Bot
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-surface-l2 border border-white/5 text-foreground text-sm font-bold rounded-2xl hover:bg-surface-l3 transition-all active:scale-95">
                            <Terminal size={18} /> Open Console
                        </button>
                    </div>
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <VitalCard
                    icon={Cpu}
                    label="CPU Load"
                    value={`${status?.metadata?.cpu || '0.45'}`}
                    sub="System Avg"
                    color="text-blue-400"
                />
                <VitalCard
                    icon={HardDrive}
                    label="Memory"
                    value={`${status?.memory_usage || '128'}MB`}
                    sub={`Free: ${status?.metadata?.free_mem?.toFixed(0) || '0'}MB`}
                    color="text-purple-400"
                />
                <VitalCard
                    icon={Clock}
                    label="Uptime"
                    value={formatUptime(status?.uptime_seconds || 0)}
                    sub="Since Last Restart"
                    color="text-emerald-400"
                />
                <VitalCard
                    icon={Activity}
                    label="Platform"
                    value={status?.platform || 'Node.js'}
                    sub={status?.metadata?.node_version || 'N/A'}
                    color="text-orange-400"
                />
            </div>

            {/* Logs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Update Logs */}
                <LogContainer
                    title="Bot Update Logs"
                    icon={History}
                    description="Tracking bot operational updates and triggers."
                >
                    {updatelogs.length > 0 ? updatelogs.map((log) => (
                        <div key={log.id} className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group cursor-default border border-transparent hover:border-white/5">
                            <div className="mt-1 w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors mt-2 ring-4 ring-primary/10"></div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-bold text-foreground/90">{log.type}</h4>
                                    <span className="text-[10px] text-muted/50 font-bold">{new Date(log.created_at).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-xs text-muted/70 mt-1 leading-relaxed">{log.message}</p>
                                <span className="text-[10px] text-primary/60 font-black mt-2 inline-block">@{log.user_phone}</span>
                            </div>
                        </div>
                    )) : <p className="text-muted text-xs p-8 text-center">No update logs found.</p>}
                </LogContainer>

                {/* Change Logs */}
                <LogContainer
                    title="Feature Changelogs"
                    icon={CheckCircle2}
                    description="Official version updates and feature additions."
                >
                    {changelogs.length > 0 ? changelogs.map((log) => (
                        <div key={log.id} className="p-5 rounded-3xl bg-surface-l2 border border-white/5 mb-4 hover:border-primary/20 transition-all group">
                            <div className="flex justify-between items-center mb-3">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-lg border border-primary/20">v{log.version}</span>
                                <span className="text-[10px] text-muted/50 font-bold">{new Date(log.created_at).toLocaleDateString()}</span>
                            </div>
                            <h4 className="text-base font-black text-foreground group-hover:text-primary transition-colors">{log.title}</h4>
                            <p className="text-xs text-muted/70 mt-2 leading-relaxed">{log.description}</p>
                        </div>
                    )) : <p className="text-muted text-xs p-8 text-center">No changelogs recorded.</p>}
                </LogContainer>
            </div>
        </div>
    );
};

const VitalCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group luxury-glow relative overflow-hidden">
        <div className={`absolute -right-4 -bottom-4 w-20 h-20 opacity-5 transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-12 ${color}`}>
            <Icon size={80} />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-xl bg-surface/50 flex items-center justify-center mb-4 border border-white/5 ${color}`}>
                <Icon size={24} />
            </div>
            <h3 className="text-xs font-black text-muted uppercase tracking-widest">{label}</h3>
            <div className="text-2xl font-black text-foreground mt-1 tracking-tight">{value}</div>
            <p className="text-[10px] text-muted font-bold mt-1 opacity-60 uppercase">{sub}</p>
        </div>
    </div>
);

const LogContainer = ({ title, icon: Icon, description, children }) => (
    <div className="glass-panel p-8 rounded-[40px] border border-white/5">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-l2 flex items-center justify-center border border-white/10 luxury-glow">
                    <Icon className="text-primary" size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight">{title}</h3>
                    <p className="text-xs text-muted/60 font-bold">{description}</p>
                </div>
            </div>
            <button className="p-2.5 bg-surface-l2 rounded-xl text-muted hover:text-primary transition-colors border border-white/5">
                <Filter size={18} />
            </button>
        </div>
        <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {children}
        </div>
    </div>
);

export default BotDetails;
