import { useBotStatus } from '../../hooks/useBotStatus';
import { Wifi, WifiOff, Clock, MessageCircle, Activity } from 'lucide-react';

const BotStatusCard = () => {
    const {
        isOnline,
        formattedUptime,
        messagesToday,
        formattedLastMessage,
        formattedLastActive,
        loading,
        version
    } = useBotStatus();

    if (loading) {
        return (
            <div className="glass-panel rounded-3xl p-6 animate-pulse border-white/5">
                <div className="h-24 bg-white/5 rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-500 glass-panel group ${isOnline
            ? 'luxury-glow border-primary/20'
            : 'opacity-80 border-white/5'
            }`}>
            {/* Status Indicator */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={`relative p-3 rounded-2xl transition-all duration-500 ${isOnline ? 'bg-primary/20 luxury-glow' : 'bg-white/5'}`}>
                        {isOnline ? (
                            <Wifi className="w-6 h-6 text-primary" />
                        ) : (
                            <WifiOff className="w-6 h-6 text-muted" />
                        )}
                        {/* Pulse animation for online */}
                        {isOnline && (
                            <span className="absolute top-1 right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_10px_#2D63FF]"></span>
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-black text-foreground tracking-tight">Bot Status</h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-primary' : 'text-muted'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>
                {version && (
                    <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded-lg text-muted/60 border border-white/5 uppercase tracking-tighter">
                        v{version}
                    </span>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
                {/* Uptime */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 text-center border border-white/5 group-hover:border-primary/20 transition-all duration-500">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-black text-foreground">{formattedUptime}</p>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">Uptime</p>
                </div>

                {/* Messages Today */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 text-center border border-white/5 group-hover:border-primary/20 transition-all duration-500">
                    <MessageCircle className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-black text-foreground">{messagesToday}</p>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">Msgs</p>
                </div>

                {/* Last Active */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3 text-center border border-white/5 group-hover:border-primary/20 transition-all duration-500">
                    <Activity className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-sm font-black text-foreground">{isOnline ? 'Now' : formattedLastActive}</p>
                    <p className="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">Active</p>
                </div>
            </div>

            {/* Last Message */}
            {messagesToday > 0 && (
                <p className="mt-4 text-[10px] text-center text-muted font-bold opacity-40 uppercase tracking-tight">
                    Heartbeat: {formattedLastMessage}
                </p>
            )}
        </div>
    );
};

export default BotStatusCard;
