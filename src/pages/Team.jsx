import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Plus, Mail, Shield, MoreHorizontal, User, Phone, RefreshCw, Trash2, UserPlus } from 'lucide-react';

import { supabase } from '../lib/supabase';
import AddUserModal from '../components/dashboard/AddUserModal';

const Team = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id, name) => {
        if (!confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user: ' + error.message);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black mb-1 text-foreground tracking-tight">Users</h2>
                    <p className="text-muted text-sm font-medium">WhatsApp Bot users from Supabase database.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAddUserOpen(true)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 hover:scale-105 transition-all luxury-glow shadow-lg text-xs uppercase tracking-wider"
                    >
                        <UserPlus size={16} />
                        Add User
                    </button>
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-primary-hover hover:scale-105 transition-all luxury-glow shadow-lg text-xs uppercase tracking-wider"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </header >

            {
                loading ? (
                    <div className="text-center py-20 text-muted font-bold animate-pulse" > Loading users...</div>
                ) : users.length === 0 ? (
                    <Card className="glass-panel border-none p-10 text-center">
                        <User size={48} className="mx-auto text-muted mb-4" />
                        <h3 className="text-lg font-black text-foreground mb-2">No Users Found</h3>
                        <p className="text-muted text-sm font-medium">Users will appear here when they interact with the bot.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <Card key={user.id} className="border border-white/5 glass-panel overflow-hidden group hover:luxury-glow transition-all duration-300">
                                <div className="h-1 bg-gradient-to-r from-primary to-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.phone)}&background=2D63FF&color=fff&bold=true`} alt={user.name || 'User'} />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#050505] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <button
                                                onClick={() => deleteUser(user.id, user.name || user.phone)}
                                                className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border tracking-wider ${user.ai_mode === 'formal' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'}`}>
                                                {user.ai_mode || 'casual'}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-black mb-1 text-foreground tracking-tight group-hover:text-primary transition-colors">{user.name || 'Anonymous'}</h4>
                                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-4 bg-emerald-500/5 w-fit px-2 py-1 rounded-md border border-emerald-500/10">
                                        <Shield size={14} />
                                        {user.exp || 0} XP
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-muted">
                                            <div className="p-1.5 rounded-md bg-white/5">
                                                <Phone size={14} />
                                            </div>
                                            <span className="font-mono">{user.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-muted">
                                            <div className="p-1.5 rounded-md bg-white/5">
                                                <User size={14} />
                                            </div>
                                            Joined: {formatDate(user.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

            <Card className="border border-white/5 shadow-none p-6 sm:p-8 glass-panel rounded-3xl border-dashed flex flex-col items-center text-center group hover:border-primary/30 transition-colors">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 luxury-glow border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <User size={32} />
                </div>
                <h3 className="text-xl font-black mb-2 text-foreground tracking-tight">User Statistics</h3>
                <p className="text-muted text-sm max-w-sm mb-4">
                    Total: <span className="font-black text-primary text-base">{users.length}</span> registered users
                </p>
            </Card>

            <AddUserModal
                isOpen={isAddUserOpen}
                onOpenChange={setIsAddUserOpen}
                onSuccess={fetchUsers}
            />
        </div>
    );
};

export default Team;
