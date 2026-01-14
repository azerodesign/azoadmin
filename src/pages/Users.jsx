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
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-2">User Management</h2>
                    <p className="text-gray-500">View and manage bot users.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 shadow-sm"
                    />
                </div>
            </header>

            <Card className="overflow-hidden border-none shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                        <tr>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-left">EXP</th>
                            <th className="p-4 text-left">Level</th>
                            <th className="p-4 text-left">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-semibold text-gray-900">{user.name || 'Unknown'}</td>
                                <td className="p-4 font-mono text-sm text-gray-500">{user.phone}</td>
                                <td className="p-4 text-primary font-bold">{user.exp || 0}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">
                                        Lv. {Math.floor(Math.sqrt((user.exp || 0) / 100)) + 1}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No users found.</div>
                )}
            </Card>
        </div>
    );
};

export default UsersPage;
