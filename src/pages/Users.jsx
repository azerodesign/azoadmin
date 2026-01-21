import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search } from 'lucide-react';
import { Card } from '../components/ui/card';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('exp', { ascending: false })
                .limit(50);

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black mb-1 text-foreground tracking-tight">User Management</h2>
                    <p className="text-muted text-sm font-medium">View and manage bot users.</p>
                </div>
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-surface-l2 border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 w-full sm:w-64 shadow-lg text-sm transition-all focus:bg-white/5"
                    />
                </div>
            </header>

            <Card className="overflow-hidden border border-white/5 shadow-none glass-panel">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-muted uppercase text-[10px] font-black tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Phone</th>
                                <th className="p-4 text-left">EXP</th>
                                <th className="p-4 text-left">Level</th>
                                <th className="p-4 text-left">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-transparent">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-black text-foreground group-hover:text-primary transition-colors">{user.name || 'Unknown'}</td>
                                    <td className="p-4 font-mono text-sm text-muted">{user.phone}</td>
                                    <td className="p-4 text-emerald-400 font-black">{user.exp || 0}</td>
                                    <td className="p-4">
                                        <span className="px-2.5 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                            Lv. {Math.floor(Math.sqrt((user.exp || 0) / 100)) + 1}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-muted font-medium">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-muted font-bold">No users found.</div>
                )}
            </Card>
        </div>
    );
};

export default UsersPage;
