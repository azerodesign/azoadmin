import { LayoutDashboard, CheckSquare, Calendar, BarChart2, Users, Settings, HelpCircle, LogOut, ShoppingBag, X, Activity, LineChart } from 'lucide-react';
import { useBotStatus } from '../../hooks/useBotStatus';

const Sidebar = ({ activePage, setActivePage, isOpen, onClose }) => {
    const { isOnline } = useBotStatus();

    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'bot-details', icon: Activity, label: 'Bot Details' },
        { id: 'tasks', icon: CheckSquare, label: 'Tasks', badge: '12+' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'analytics', icon: BarChart2, label: 'Analytics' },
        { id: 'team', icon: Users, label: 'Team' },
        { id: 'store', icon: ShoppingBag, label: 'Store' },
        { id: 'statistics', icon: BarChart2, label: 'Statistics' },
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
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-white/5 transform transition-transform duration-500 ease-elastic lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col p-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 luxury-glow group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 overflow-hidden p-2">
                            <img src="/logo.png" alt="AzoAI Logo" className="w-full h-full object-contain invert dark:invert-0" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-foreground tracking-tighter">AzoAI Panel</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                                <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Bot Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-2 mb-4 text-xs font-bold text-muted/50 uppercase tracking-widest">
                        Menu
                    </div>

                    <nav className="space-y-1 mb-8">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActivePage(item.id); onClose(); }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${activePage === item.id
                                    ? 'bg-primary/10 text-primary font-black border border-primary/20 luxury-glow'
                                    : 'text-muted hover:bg-white/5 hover:text-foreground'
                                    }`}
                            >
                                <item.icon size={20} className={activePage === item.id ? 'text-primary' : 'text-muted group-hover:text-foreground'} />
                                <span className="text-sm tracking-tight">{item.label}</span>
                                {item.badge && (
                                    <span className="absolute right-4 px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black rounded-lg border border-primary/20">
                                        {item.badge}
                                    </span>
                                )}
                                {activePage === item.id && (
                                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(45,99,255,0.8)]"></div>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="px-2 mb-4 text-xs font-bold text-muted/50 uppercase tracking-widest">
                        General
                    </div>
                    <nav className="space-y-1">
                        <button
                            onClick={() => handleNavClick('settings')}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors ${activePage === 'settings' ? 'bg-white/5 text-foreground font-bold' : 'text-muted hover:bg-white/5 hover:text-foreground'}`}
                        >
                            <Settings size={20} className={activePage === 'settings' ? 'text-primary' : 'text-muted'} />
                            <span className="text-sm">Settings</span>
                        </button>
                        <button
                            onClick={() => handleNavClick('help')}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors ${activePage === 'help' ? 'bg-white/5 text-foreground font-bold' : 'text-muted hover:bg-white/5 hover:text-foreground'}`}
                        >
                            <HelpCircle size={20} className={activePage === 'help' ? 'text-primary' : 'text-muted'} />
                            <span className="text-sm">Help Center</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-3 text-muted hover:bg-white/5 hover:text-red-400 rounded-2xl transition-colors">
                            <LogOut size={20} className="text-muted" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all duration-700"></div>
                            <h4 className="text-xs font-black text-foreground mb-1 relative z-10">AzoAI Mobile</h4>
                            <p className="text-[10px] text-muted mb-4 relative z-10 font-bold opacity-70">Manage bot on the go</p>
                            <button className="w-full py-2.5 bg-foreground text-background text-xs font-black rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 relative z-10">
                                Download Now
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
