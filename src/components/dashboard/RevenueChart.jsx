import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../lib/utils';

const RevenueChart = ({ data }) => {
    return (
        <div className="glass-card p-6 h-[400px]">
            <h3 className="text-xl font-bold mb-6">Revenue Analytics</h3>

            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#6B7280"
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#6B7280"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `Rp${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1E1E2E',
                            border: '1px solid #ffffff10',
                            borderRadius: '12px',
                            padding: '12px'
                        }}
                        formatter={(value) => [formatCurrency(value), 'Revenue']}
                    />
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#7C3AED"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;
