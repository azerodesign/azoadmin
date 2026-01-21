import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Shield, Bell, Lock, Globe, Smartphone, Key, Save } from 'lucide-react';

const Settings = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header>
                <h2 className="text-2xl sm:text-3xl font-black mb-1 text-foreground tracking-tight">Settings</h2>
                <p className="text-muted text-sm font-medium">Manage your account preferences and system configurations.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* General Settings */}
                <Card className="border border-white/5 shadow-none glass-panel p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-primary" />
                        General Information
                    </h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider">Application Name</label>
                                <input
                                    type="text"
                                    defaultValue="AzoAI Panel"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider">Language</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium appearance-none">
                                    <option>English (US)</option>
                                    <option>Indonesian</option>
                                    <option>Spanish</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-wider">Support Email</label>
                            <input
                                type="email"
                                defaultValue="support@azoai.com"
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                            />
                        </div>
                    </div>
                </Card>

                {/* Notifications */}
                <Card className="border border-white/5 shadow-none glass-panel p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Bell size={18} className="text-primary" />
                        Notifications
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-foreground">Email Alerts</p>
                                <p className="text-xs text-muted">Receive updates via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                            <div className="space-y-0.5">
                                <p className="text-sm font-bold text-foreground">Push Notifications</p>
                                <p className="text-xs text-muted">Browser alerts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </Card>

                {/* Security */}
                <Card className="border border-white/5 shadow-none glass-panel p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-primary" />
                        Security & Login
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider">Current Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                />
                            </div>
                            <button className="px-4 py-2 bg-white/5 text-foreground text-xs font-bold uppercase tracking-wider rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                Change Password
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
                                <Smartphone className="text-primary mt-1" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">Two-Factor Auth</h4>
                                    <p className="text-xs text-muted mt-1 leading-relaxed">Secure your account with 2FA using Google Authenticator.</p>
                                    <button className="mt-3 text-primary text-xs font-black uppercase tracking-wider hover:underline">Enable 2FA</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* API Keys */}
                <Card className="border border-white/5 shadow-none glass-panel p-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Key size={18} className="text-primary" />
                        API Access
                    </h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                            <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Public Key</p>
                            <code className="text-xs font-mono text-primary block truncate">pk_live_51Msz...2s9K</code>
                        </div>
                        <button className="w-full py-2.5 bg-white/5 text-red-400 text-xs font-bold uppercase tracking-wider rounded-xl border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 transition-all">
                            Regenerate Keys
                        </button>
                    </div>
                </Card>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
                <button
                    disabled={loading}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-primary-hover hover:scale-105 transition-all luxury-glow shadow-lg uppercase tracking-wider text-sm"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;
