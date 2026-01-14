import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, Activity, MessageSquare, Server } from 'lucide-react';
import { useBotStatus } from '../hooks/useBotStatus';

const Analytics = () => {
    const { isOnline, lastActive } = useBotStatus();

    const [revenueData] = useState([
        { name: 'Mon', revenue: 4000, users: 2400 },
        { name: 'Tue', revenue: 3000, users: 1398 },
        { name: 'Wed', revenue: 2000, users: 9800 },
        { name: 'Thu', revenue: 2780, users: 3908 },
        { name: 'Fri', revenue: 1890, users: 4800 },
        { name: 'Sat', revenue: 2390, users: 3800 },
        { name: 'Sun', revenue: 3490, users: 4300 },
    ]);

    const [categoryData] = useState([
        { name: 'Food', value: 400 },
        { name: 'Electronics', value: 300 },
        { name: 'Clothing', value: 300 },
        { name: 'Other', value: 200 },
    ]);

    const COLORS = ['#0EA5E9', '#38BDF8', '#7DD3FC', '#CBD5E1'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <header>
                <h2 className="text-3xl font-bold mb-1">Analytics</h2>
                <p className="text-gray-500 text-sm">Deep dive into your bot performance and sales.</p>
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
                        <p className="text-gray-500 text-xs font-medium">Messages Processed</p>
                        <h4 className="text-xl font-bold">8,241</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                        <Server size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Uptime This Month</p>
                        <h4 className="text-xl font-bold">99.8%</h4>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-700">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Growth Rate</p>
                        <h4 className="text-xl font-bold">+24.5%</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Active Users</p>
                        <h4 className="text-xl font-bold">1,280</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-700">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Total Orders</p>
                        <h4 className="text-xl font-bold">842</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-700">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Net Revenue</p>
                        <h4 className="text-xl font-bold">Rp 12.5M</h4>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Revenue Overview</CardTitle>
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
                        <CardTitle className="text-lg">Sales by Category</CardTitle>
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
                                    <span className="font-bold">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">User Activity Trend</CardTitle>
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
