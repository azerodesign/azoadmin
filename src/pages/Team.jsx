import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Plus, Mail, Shield, MoreHorizontal, User, Phone, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Team = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1">Users</h2>
                    <p className="text-gray-500 text-sm">WhatsApp Bot users from Supabase database.</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </header>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading users...</div>
            ) : users.length === 0 ? (
                <Card className="border-none shadow-sm p-10 text-center">
                    <User size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-bold text-gray-600 mb-2">No Users Found</h3>
                    <p className="text-gray-400 text-sm">Users will appear here when they interact with the bot.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden group">
                            <div className="h-2 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.phone)}&background=0EA5E9&color=fff`} alt={user.name || 'User'} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-sky-500"></div>
                                    </div>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg ${user.ai_mode === 'formal' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>
                                        {user.ai_mode || 'casual'}
                                    </span>
                                </div>

                                <h4 className="text-lg font-bold mb-1">{user.name || 'Anonymous'}</h4>
                                <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-4">
                                    <Shield size={14} />
                                    {user.exp || 0} XP
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <Phone size={16} />
                                        {user.phone}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <User size={16} />
                                        Joined: {formatDate(user.created_at)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Card className="border-none shadow-sm p-6 sm:p-8 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-4">
                    <User size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">User Statistics</h3>
                <p className="text-gray-500 text-sm max-w-sm mb-4">
                    Total: <span className="font-bold text-primary">{users.length}</span> registered users
                </p>
            </Card>
        </div>
    );
};

export default Team;
