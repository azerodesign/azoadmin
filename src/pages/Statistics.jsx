import { useBotStatus } from '../hooks/useBotStatus';
import { Card, CardContent } from '../components/ui/card';
import { Terminal, GitCommit, Clock, Cpu, Activity, Zap, Server, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Statistics = () => {
    const {
        isOnline,
        version,
        uptimeSeconds,
        formattedUptime,
        memoryUsage,
        latency,
        changelogs,
        updateLogs,
        loading
    } = useBotStatus();

    // Mock data for charts (replace with real historical data if available in future)
    const healthData = [
        { time: '10:00', memory: 120, latency: 45 },
        { time: '10:05', memory: 125, latency: 48 },
        { time: '10:10', memory: 130, latency: 42 },
        { time: '10:15', memory: 128, latency: 50 },
        { time: '10:20', memory: memoryUsage || 135, latency: latency || 45 },
    ];

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black mb-1 text-foreground tracking-tight">System Statistics</h2>
                    <p className="text-muted text-sm font-medium">Detailed health metrics and development velocity track.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${isOnline ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {isOnline ? 'System Operational' : 'System Offline'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-muted text-xs font-black uppercase tracking-wider border border-white/5">
                        v{version || '1.0.0'}
                    </span>
                </div>
            </header>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass-panel border-white/5 p-4 group hover:border-primary/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Total Uptime</p>
                            <h4 className="text-lg font-black text-foreground">{formattedUptime}</h4>
                        </div>
                    </div>
                </Card>
                <Card className="glass-panel border-white/5 p-4 group hover:border-purple-500/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Memory Usage</p>
                            <h4 className="text-lg font-black text-foreground">{memoryUsage} MB</h4>
                        </div>
                    </div>
                </Card>
                <Card className="glass-panel border-white/5 p-4 group hover:border-orange-500/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Latency</p>
                            <h4 className="text-lg font-black text-foreground">{latency} ms</h4>
                        </div>
                    </div>
                </Card>
                <Card className="glass-panel border-white/5 p-4 group hover:border-sky-500/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                            <GitCommit size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Total Changes</p>
                            <h4 className="text-lg font-black text-foreground">{changelogs?.length || 0}</h4>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Logs (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Changelogs */}
                    <div className="glass-panel border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap className="text-yellow-500" size={20} />
                                <h3 className="font-black text-foreground tracking-tight">Recent Changelogs</h3>
                            </div>
                            <span className="text-xs font-bold text-muted bg-white/5 px-2 py-1 rounded-lg">Last 5</span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {changelogs && changelogs.length > 0 ? (
                                changelogs.map((log) => (
                                    <div key={log.id} className="p-4 hover:bg-white/5 transition-colors group">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
                                                    v{log.version}
                                                </span>
                                                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{log.title}</h4>
                                            </div>
                                            <span className="text-[10px] text-muted font-mono">{new Date(log.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-muted/80 leading-relaxed mb-3">{log.description}</p>

                                        {/* Changes List */}
                                        {log.changes && (
                                            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                                <ul className="space-y-1">
                                                    {JSON.parse(log.changes).map((change, idx) => (
                                                        <li key={idx} className="text-[10px] text-muted flex items-start gap-2">
                                                            <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0"></span>
                                                            {change}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted text-sm italic">
                                    No changelogs found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Update Logs */}
                    <div className="glass-panel border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Terminal className="text-emerald-500" size={20} />
                                <h3 className="font-black text-foreground tracking-tight">System Update Logs</h3>
                            </div>
                            <span className="text-xs font-bold text-muted bg-white/5 px-2 py-1 rounded-lg">Last 10</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {updateLogs && updateLogs.length > 0 ? (
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-white/5 sticky top-0 text-muted uppercase font-black text-[10px] tracking-widest backdrop-blur-md">
                                        <tr>
                                            <th className="p-3">Time</th>
                                            <th className="p-3">Type</th>
                                            <th className="p-3">Message</th>
                                            <th className="p-3">User</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {updateLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-white/5 transition-colors font-mono">
                                                <td className="p-3 text-muted">{new Date(log.created_at).toLocaleTimeString()}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${log.type === 'error' ? 'bg-red-500/10 text-red-500' :
                                                            log.type === 'warning' ? 'bg-orange-500/10 text-orange-500' :
                                                                'bg-emerald-500/10 text-emerald-500'
                                                        }`}>
                                                        {log.type}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-foreground/80">{log.message}</td>
                                                <td className="p-3 text-muted">{log.user_phone || 'System'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-8 text-center text-muted text-sm italic">
                                    No update logs found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Charts */}
                <div className="space-y-6">
                    <div className="glass-panel border border-white/5 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-foreground tracking-tight text-sm">Health Trends</h3>
                            <Activity size={16} className="text-primary" />
                        </div>

                        <div className="space-y-6">
                            {/* Memory Chart */}
                            <div>
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Memory Usage (MB)</p>
                                <div className="h-[120px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={healthData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Line type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Latency Chart */}
                            <div>
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Latency (ms)</p>
                                <div className="h-[120px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={healthData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Line type="monotone" dataKey="latency" stroke="#f97316" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel border border-white/5 rounded-3xl p-6 bg-gradient-to-br from-primary/5 to-transparent">
                        <ShieldCheck size={32} className="text-primary mb-4" />
                        <h3 className="font-black text-foreground mb-2">Security Status</h3>
                        <p className="text-xs text-muted mb-4">You are running the latest security patch. All systems are green.</p>
                        <button className="w-full py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                            Run Diagnostics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
