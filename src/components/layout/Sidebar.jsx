import { LayoutDashboard, CheckSquare, Calendar, BarChart2, Users, Settings, HelpCircle, LogOut, ShoppingBag, X } from 'lucide-react';
import { useBotStatus } from '../../hooks/useBotStatus';

const Sidebar = ({ activePage, setActivePage, isOpen, onClose }) => {
    const { isOnline } = useBotStatus();

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'tasks', icon: CheckSquare, label: 'Tasks', badge: '12+' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'analytics', icon: BarChart2, label: 'Analytics' },
        { id: 'team', icon: Users, label: 'Team' },
        { id: 'store', icon: ShoppingBag, label: 'Store' },
    ];

    const handleNavClick = (id) => {
        setActivePage(id);
        onClose?.(); // Close sidebar on mobile after navigation
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                w-64 h-screen bg-white flex flex-col fixed left-0 top-0 py-8 px-6 border-r border-gray-100 z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Logo Area */}
                <div className="flex items-center gap-3 mb-10 px-2 justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-primary relative">
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-foreground">AzoAI Panel</span>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500/50'}`} />
                                <span className={`text-[10px] font-medium ${isOnline ? 'text-green-500' : 'text-slate-400'}`}>
                                    {isOnline ? 'BOT ONLINE' : 'BOT OFFLINE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Label */}
                <div className="px-2 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Menu
                </div>

                <nav className="space-y-1 mb-8">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group ${activePage === item.id
                                ? 'bg-primary text-white font-medium shadow-md shadow-primary/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} className={activePage === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'} />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activePage === item.id ? 'bg-white/20 text-white' : 'bg-primary text-white'
                                    }`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="px-2 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    General
                </div>
                <nav className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                        <Settings size={20} className="text-gray-400" />
                        <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                        <HelpCircle size={20} className="text-gray-400" />
                        <span>Help</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors">
                        <LogOut size={20} className="text-gray-400" />
                        <span>Logout</span>
                    </button>
                </nav>

                {/* Bottom Card */}
                <div className="mt-auto bg-primary rounded-2xl p-4 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mb-3">
                            <LayoutDashboard size={16} />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">AzoAI Mobile</h4>
                        <p className="text-xs text-white/70 mb-3">Get access anywhere</p>
                        <button className="w-full py-2 bg-white text-primary text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
                            Download
                        </button>
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
