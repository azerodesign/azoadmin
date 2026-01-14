import { ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/card';

const StatCard = ({ title, value, trend, isPrimary }) => {
    return (
        <Card className={`p-6 relative overflow-hidden transition-all duration-200 hover:shadow-lg ${isPrimary ? 'bg-primary text-white border-primary' : 'bg-white text-foreground hover:border-primary/50'
            }`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className={`text-sm font-medium mb-1 ${isPrimary ? 'text-white/80' : 'text-gray-500'}`}>{title}</p>
                    <h3 className="text-4xl font-bold">{value}</h3>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPrimary ? 'bg-white text-primary' : 'border border-gray-200 text-gray-400'
                    }`}>
                    <ArrowUpRight size={16} />
                </div>
            </div>

            <div className={`flex items-center gap-2 text-xs ${isPrimary ? 'text-white/90' : 'text-gray-500'}`}>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isPrimary ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'
                    }`}>
                    {trend}
                </span>
                <span>Increased from last month</span>
            </div>

            {isPrimary && (
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            )}
        </Card>
    );
};

export default StatCard;
