import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Activity, MessageSquare, Server } from 'lucide-react';
import { useBotStatus } from '../hooks/useBotStatus';
import { supabase } from '../lib/supabase';

const Analytics = () => {
    const { isOnline, lastActive } = useBotStatus();
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
    const [revenueData, setRevenueData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#2D63FF', '#0EA5E9', '#38BDF8', '#7DD3FC'];

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // Fetch real stats from Supabase
            const { count: usersCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            const { count: ordersCount } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            const { data: revenueResult } = await supabase
                .from('orders')
                .select('total_amount')
                .eq('status', 'completed');

            const totalRevenue = revenueResult?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

            setStats({
                users: usersCount || 0,
                orders: ordersCount || 0,
                revenue: totalRevenue
            });

            // Fetch transactions for chart data (last 7 days)
            const { data: transactions } = await supabase
                .from('transactions')
                .select('amount, created_at, category')
                .order('created_at', { ascending: false })
                .limit(50);

            // Group transactions by day for chart
            const dayMap = {};
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            days.forEach(d => { dayMap[d] = { name: d, revenue: 0, users: 0 }; });

            transactions?.forEach(tx => {
                const day = days[new Date(tx.created_at).getDay()];
                dayMap[day].revenue += Number(tx.amount) || 0;
                dayMap[day].users += 1;
            });

            setRevenueData(Object.values(dayMap));

            // Group by category for pie chart
            const catMap = {};
            transactions?.forEach(tx => {
                const cat = tx.category || 'Other';
                catMap[cat] = (catMap[cat] || 0) + 1;
            });

            const catArray = Object.entries(catMap).map(([name, value]) => ({ name, value }));
            setCategoryData(catArray.length > 0 ? catArray : [{ name: 'No Data', value: 1 }]);

        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (num) => {
        if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)}K`;
        return `Rp ${num}`;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <header>
                <h2 className="text-2xl sm:text-3xl font-black mb-1 text-foreground tracking-tight">Analytics</h2>
                <p className="text-muted text-sm font-medium">Real-time data from your Supabase database.</p>
            </header>

            {/* Bot Health Stats */}
            {/* Bot Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 relative overflow-hidden group hover:luxury-glow transition-all duration-300">
                    <div className={`absolute right-0 top-0 p-3 opacity-10 transition-colors duration-500 ${isOnline ? 'text-emerald-500' : 'text-muted'}`}>
                        <Activity size={64} />
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors duration-500 ${isOnline ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-muted border-white/10'}`}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">System Status</p>
                        <h4 className={`text-xl font-black ${isOnline ? 'text-emerald-500' : 'text-muted'}`}>
                            {isOnline ? 'Operational' : 'Offline'}
                        </h4>
                    </div>
                </Card>
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 group hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Total Transactions</p>
                        <h4 className="text-xl font-black text-foreground">{revenueData.reduce((a, b) => a + b.users, 0)}</h4>
                    </div>
                </Card>
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 group hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 border border-rose-500/20">
                        <Server size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Last Active</p>
                        <h4 className="text-xl font-black text-foreground">{lastActive ? new Date(lastActive).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</h4>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 group hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 border border-sky-500/20">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Categories</p>
                        <h4 className="text-xl font-black text-foreground">{categoryData.length}</h4>
                    </div>
                </Card>
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 group hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Total Users</p>
                        <h4 className="text-xl font-black text-foreground">{stats.users}</h4>
                    </div>
                </Card>
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 group hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 border border-purple-500/20">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Total Orders</p>
                        <h4 className="text-xl font-black text-foreground">{stats.orders}</h4>
                    </div>
                </Card>
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 group hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Net Revenue</p>
                        <h4 className="text-xl font-black text-foreground">{formatCurrency(stats.revenue)}</h4>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border border-white/5 shadow-none glass-panel">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-foreground">Transaction Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2D63FF" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#2D63FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7A7A7A', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7A7A7A', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111113', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#F9FAFB' }}
                                        itemStyle={{ color: '#F9FAFB' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#2D63FF" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-white/5 shadow-none glass-panel">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-foreground">By Category</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111113', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#F9FAFB' }}
                                        itemStyle={{ color: '#F9FAFB' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 mt-4 w-full px-4">
                            {categoryData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        <span className="text-muted font-bold">{item.name}</span>
                                    </div>
                                    <span className="font-black text-foreground">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-white/5 shadow-none glass-panel">
                <CardHeader>
                    <CardTitle className="text-lg font-black text-foreground">Activity Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7A7A7A', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#7A7A7A', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111113', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#F9FAFB' }}
                                    itemStyle={{ color: '#F9FAFB' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4, fill: '#0EA5E9', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Analytics;
