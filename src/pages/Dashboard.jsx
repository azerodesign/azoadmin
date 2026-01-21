import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, DollarSign, ShoppingCart, User } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import AddProductModal from '../components/store/AddProductModal';
import BotStatusCard from '../components/dashboard/BotStatusCard';

const Dashboard = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
    const [chartData, setChartData] = useState([]);
    const [recentActions, setRecentActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    useEffect(() => {
        fetchRealData();
    }, []);

    const fetchRealData = async () => {
        try {
            // Fetch Users Count
            const { count: usersCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            // Fetch Orders Count
            const { count: ordersCount } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true });

            // Fetch Total Revenue (Completed Orders)
            const { data: revenueData } = await supabase
                .from('orders')
                .select('total_amount')
                .eq('status', 'completed');

            const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

            setStats({
                users: usersCount || 0,
                orders: ordersCount || 0,
                revenue: totalRevenue
            });

            // Fetch real transaction data for chart
            const { data: transactions } = await supabase
                .from('transactions')
                .select('amount, created_at, type, category, description')
                .order('created_at', { ascending: false })
                .limit(50);

            // Group by day of week
            const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            const dayMap = {};
            dayNames.forEach((d, i) => { dayMap[i] = { day: d, val: 0 }; });

            transactions?.forEach(tx => {
                const dayIndex = new Date(tx.created_at).getDay();
                dayMap[dayIndex].val += Number(tx.amount) || 0;
            });

            setChartData(Object.values(dayMap));

            // Build recent actions from transactions
            const actions = (transactions || []).slice(0, 4).map(tx => {
                const timeDiff = Date.now() - new Date(tx.created_at).getTime();
                const mins = Math.floor(timeDiff / 60000);
                const hours = Math.floor(mins / 60);
                const timeAgo = hours > 0 ? `${hours}h ago` : mins > 0 ? `${mins}m ago` : 'Just now';

                return {
                    title: `${tx.type === 'income' ? 'Income' : 'Expense'}: ${tx.category || tx.description || 'Transaction'}`,
                    date: timeAgo,
                    icon: tx.type === 'income' ? DollarSign : ShoppingCart,
                    color: tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                };
            });
            setRecentActions(actions);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProductSuccess = () => {
        fetchRealData();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AddProductModal
                isOpen={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
                onSuccess={handleAddProductSuccess}
            />

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">AzoAI Dashboard</h2>
                    <p className="text-gray-500 text-sm sm:text-base">Real-time statistics from Supabase.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchRealData}
                        className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsProductModalOpen(true)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add Product</span>
                        <span className="sm:hidden">Add</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    trend="+0"
                    isPrimary={true}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    trend="+0"
                    isPrimary={false}
                />
                <StatCard
                    title="Revenue"
                    value={`Rp ${stats.revenue.toLocaleString()}`}
                    trend="+0%"
                    isPrimary={false}
                />
                <BotStatusCard />
            </div>

            {/* Analytics & Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Transaction Analytics</CardTitle>
                        <span className="text-xs font-bold px-2 py-1 bg-sky-100 text-sky-700 rounded">Weekly</span>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barSize={40}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(value) => [`Rp ${value.toLocaleString()}`, 'Amount']}
                                    />
                                    <Bar dataKey="val" radius={[20, 20, 20, 20]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.val > 0 ? '#0EA5E9' : '#E5E7EB'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Actions */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Latest Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActions.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-6">No recent transactions</p>
                            ) : recentActions.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

