import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Video, Download, CheckSquare } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import AddProductModal from '../components/store/AddProductModal';
import { useBotStatus } from '../hooks/useBotStatus';

const Dashboard = () => {
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
    // ... existing state ...
    const { isOnline, lastActive } = useBotStatus();
    // const isOnline = true; // Fallback
    // const lastActive = new Date();
    const [chartData, setChartData] = useState([]);
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

            // Mock chart data based on recent orders trend
            setChartData([
                { day: 'S', val: 30 }, { day: 'M', val: 45 }, { day: 'T', val: 60 },
                { day: 'W', val: 80 }, { day: 'T', val: 50 }, { day: 'F', val: 40 },
                { day: 'S', val: 55 }
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProductSuccess = () => {
        // Refetch or show notification
        alert('Product added successfully!');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AddProductModal
                isOpen={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
                onSuccess={handleAddProductSuccess}
            />

            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold mb-2">AzoAI Dashboard</h2>
                    <p className="text-gray-500">Real-time statistics for your WhatsApp Business Bot.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                        Export Report
                    </button>
                    <button
                        onClick={() => setIsProductModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    trend="+5"
                    isPrimary={true}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    trend="+2"
                    isPrimary={false}
                />
                <StatCard
                    title="Revenue"
                    value={`Rp ${stats.revenue.toLocaleString()}`}
                    trend="+15%"
                    isPrimary={false}
                />
                <StatCard
                    title="Bot Status"
                    value={isOnline ? "Online" : "Offline"}
                    trend={isOnline ? "Active" : "Inactive"}
                    isPrimary={false}
                    icon={isOnline ? "wifi" : "wifi-off"}
                    className={isOnline ? "text-green-600 bg-green-50" : "text-gray-500 bg-gray-50"}
                />
            </div>

            {/* Analytics & Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Project Analytics</CardTitle>
                        <span className="text-xs font-bold px-2 py-1 bg-sky-100 text-sky-700 rounded">Monthly</span>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barSize={40}>
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="val" radius={[20, 20, 20, 20]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 3 ? '#0EA5E9' : entry.val % 2 === 0 ? '#BAE6FD' : `url(#striped)`} />
                                        ))}
                                    </Bar>
                                    <defs>
                                        <pattern id="striped" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                            <line x1="0" y1="0" x2="0" y2="4" stroke="#e5e7eb" strokeWidth="2" />
                                        </pattern>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Project List */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">Latest Actions</CardTitle>
                        <button className="text-xs px-3 py-1 border rounded-lg hover:bg-gray-50">+ New</button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { title: 'Upload TikTok Video', date: 'Just now', icon: Video, color: 'bg-blue-100 text-blue-600' },
                                { title: 'Download Sticker', date: '2 min ago', icon: Download, color: 'bg-orange-100 text-orange-600' },
                                { title: 'New User Registered', date: '1 hour ago', icon: Plus, color: 'bg-sky-100 text-sky-600' },
                                { title: 'Order Completed', date: '3 hours ago', icon: CheckSquare, color: 'bg-purple-100 text-purple-600' },
                            ].map((item, i) => (
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
