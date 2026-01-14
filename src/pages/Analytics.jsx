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

    const COLORS = ['#0EA5E9', '#38BDF8', '#7DD3FC', '#CBD5E1'];

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
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">Analytics</h2>
                <p className="text-gray-500 text-sm">Real-time data from your Supabase database.</p>
            </header>

            {/* Bot Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4 relative overflow-hidden">
                    <div className={`absolute right-0 top-0 p-3 opacity-10 ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                        <Activity size={64} />
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isOnline ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">System Status</p>
                        <h4 className={`text-xl font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                            {isOnline ? 'Operational' : 'Offline'}
                        </h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Total Transactions</p>
                        <h4 className="text-xl font-bold">{revenueData.reduce((a, b) => a + b.users, 0)}</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                        <Server size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Last Active</p>
                        <h4 className="text-xl font-bold">{lastActive ? new Date(lastActive).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</h4>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-700">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Categories</p>
                        <h4 className="text-xl font-bold">{categoryData.length}</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Total Users</p>
                        <h4 className="text-xl font-bold">{stats.users}</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Total Orders</p>
                        <h4 className="text-xl font-bold">{stats.orders}</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-700">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Net Revenue</p>
                        <h4 className="text-xl font-bold">{formatCurrency(stats.revenue)}</h4>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Transaction Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">By Category</CardTitle>
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
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-4 w-full px-4">
                            {categoryData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        <span className="text-gray-600">{item.name}</span>
                                    </div>
                                    <span className="font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Activity Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Analytics;
