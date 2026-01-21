import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, ShoppingCart, DollarSign, Activity, TrendingUp, Zap, Send } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import BotStatusCard from '../components/dashboard/BotStatusCard';
import { useBotStatus } from '../hooks/useBotStatus';

const UnifiedDashboard = () => {
    const { memoryUsage, latency, isOnline } = useBotStatus();
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Basic Stats
                const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
                const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
                const { data: revenueData } = await supabase.from('orders').select('total_amount').eq('status', 'completed').limit(1000);
                const totalRevenue = revenueData?.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0) || 0;

                setStats({ users: usersCount || 0, orders: ordersCount || 0, revenue: totalRevenue });

                // 2. Fetch Performance Data (Last 7 Days)
                const lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);

                const { data: orderHistory, error: chartError } = await supabase
                    .from('orders')
                    .select('created_at, total_amount')
                    .eq('status', 'completed')
                    .gte('created_at', lastWeek.toISOString());

                if (chartError) throw chartError;

                // Process data for Recharts
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const timeline = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    timeline.push({
                        name: days[d.getDay()],
                        fullDate: d.toISOString().split('T')[0],
                        value: 0
                    });
                }

                orderHistory?.forEach(order => {
                    const date = new Date(order.created_at).toISOString().split('T')[0];
                    const daySlot = timeline.find(t => t.fullDate === date);
                    if (daySlot) {
                        daySlot.value += (parseFloat(order.total_amount) || 0);
                    }
                });

                setChartData(timeline);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        // Refresh every 5 minutes
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, []);

    // Format vitals for the UI
    const memUsagePct = Math.min(Math.round((memoryUsage / 1024) * 100), 100); // Assuming 1GB limit for display
    const latencyPct = Math.min(Math.round((latency / 500) * 100), 100);

    const [activeFilter, setActiveFilter] = useState('Weekly');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. Header & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-foreground tracking-tight">Executive Overview</h1>
                    <p className="text-sm text-muted font-medium">Monitoring AzoAI ecosystem pulse.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-surface-l2 border border-white/5 rounded-xl text-sm font-bold text-muted hover:bg-white/5 transition-colors">
                        Today
                    </button>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg luxury-glow hover:bg-primary-hover transition-all">
                        <Zap size={16} fill="currentColor" />
                        Live Reports
                    </button>
                </div>
            </div>

            {/* 2. Top Grid: Stats & Bot Status (4 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.users} trend="+12%" />
                <StatCard title="Total Revenue" value={`Rp ${stats.revenue.toLocaleString('id-ID')}`} trend="+8.2%" />
                <StatCard title="Orders" value={stats.orders} trend="+15%" />
                <BotStatusCard />
            </div>

            {/* 3. Main Content Grid (Chart vs Vitals) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column (3/4): Chart & Broadcast */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {/* Main Chart Card */}
                    <div className="glass-panel p-6 rounded-3xl relative group border border-white/5">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-black text-foreground tracking-tight">Performance Analytics</h3>
                                <p className="text-xs text-muted font-bold uppercase tracking-widest opacity-60">Growth trajectory (Completed Orders)</p>
                            </div>
                            <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/5">
                                {['Daily', 'Weekly', 'Monthly'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveFilter(filter)}
                                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-300 rounded-lg ${activeFilter === filter
                                            ? 'bg-primary text-primary-foreground shadow-lg luxury-glow'
                                            : 'text-muted hover:text-foreground hover:bg-white/5'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2D63FF" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#2D63FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke="#2D63FF" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
                                    <Tooltip
                                        formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                                        contentStyle={{ backgroundColor: '#050505', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', fontSize: '12px', color: '#F9FAFB' }}
                                        itemStyle={{ color: '#F9FAFB', fontWeight: 'bold' }}
                                        cursor={{ stroke: '#2D63FF', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#525252' }} dy={10} />
                                    <YAxis hide />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Broadcast Banner */}
                    <div className="bg-gradient-to-r from-surface-l2 to-black/40 rounded-3xl p-6 text-foreground flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative group shadow-none border border-white/5">
                        <div className="relative z-10">
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 opacity-80">Announcements</div>
                            <h4 className="text-xl font-black mb-1 tracking-tight">Global Broadcast</h4>
                            <p className="text-sm text-foreground/50 font-medium">Push updates directly to all WhatsApp subscribers instantly.</p>
                        </div>
                        <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center gap-2 hover:scale-105 luxury-glow transition-all relative z-10 shrink-0 uppercase tracking-wider text-xs shadow-lg shadow-primary/20">
                            <Send size={16} />
                            Compose
                        </button>
                        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
                    </div>
                </div>

                {/* Right Column (1/4): System Vitals */}
                <div className="lg:col-span-1 flex flex-col h-full min-h-[400px]">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-none flex flex-col h-full bg-transparent group hover:border-primary/20 transition-colors duration-500">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary luxury-glow border border-primary/20">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-foreground tracking-wide">System Vitals</h3>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Real-time Metrics</p>
                            </div>
                        </div>

                        <div className="space-y-8 flex-1">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.15em]">Memory (RSS)</span>
                                    <span className="text-xs font-mono font-black text-primary">{memoryUsage}MB</span>
                                </div>
                                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="bg-primary h-full transition-all duration-1000 luxury-glow shadow-[0_0_12px_rgba(45,99,255,0.6)]"
                                        style={{ width: `${memUsagePct}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.15em]">Latency</span>
                                    <span className="text-xs font-mono font-black text-primary">{latency}ms</span>
                                </div>
                                <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className="bg-primary h-full transition-all duration-1000 luxury-glow shadow-[0_0_12px_rgba(45,99,255,0.6)]"
                                        style={{ width: `${latencyPct}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${isOnline ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                    <span className={`text-xs font-black uppercase tracking-wider ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}>Cluster Status</span>
                                    <span className={`text-[10px] font-black text-white px-2 py-1 rounded-lg uppercase tracking-widest ${isOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`}>
                                        {isOnline ? 'Healthy' : 'Down'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Mini-List */}
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-black text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                Live Traffic
                            </h4>
                            <div className="space-y-4">
                                {loading ? (
                                    <p className="text-[10px] text-muted animate-pulse font-mono">Syncing traffic...</p>
                                ) : (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3 group/item">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary transition-colors"></div>
                                            <p className="text-[10px] font-bold text-muted group-hover/item:text-foreground transition-colors truncate">Incoming webhook event processing...</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(amount);
};

export default UnifiedDashboard;
