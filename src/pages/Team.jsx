import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Plus, Mail, Shield, MoreHorizontal, User } from 'lucide-react';

const Team = () => {
    const [members] = useState([
        { id: 1, name: 'Raditya Admin', role: 'Super Admin', email: 'raditya@azoai.com', status: 'Online', lastActive: 'Just now' },
        { id: 2, name: 'Asep Support', role: 'Customer Service', email: 'asep@azoai.com', status: 'Away', lastActive: '5 min ago' },
        { id: 3, name: 'Budi Developer', role: 'Dev Admin', email: 'budi@azoai.com', status: 'Offline', lastActive: '2 hours ago' },
        { id: 4, name: 'Siti Moderator', role: 'Moderator', email: 'siti@azoai.com', status: 'Online', lastActive: '10 min ago' },
    ]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-1">Team Management</h2>
                    <p className="text-gray-500 text-sm">Manage bot administrators and staff permissions.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    <Plus size={18} />
                    Invite Member
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <Card key={member.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden group">
                        <div className="h-2 bg-primary transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${member.name}&background=random`} alt={member.name} />
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${member.status === 'Online' ? 'bg-sky-500' :
                                        member.status === 'Away' ? 'bg-yellow-500' :
                                            'bg-gray-300'
                                        }`}></div>
                                </div>
                                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <h4 className="text-lg font-bold mb-1">{member.name}</h4>
                            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-4">
                                <Shield size={14} />
                                {member.role}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <Mail size={16} />
                                    {member.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <User size={16} />
                                    Last active: {member.lastActive}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-50 flex gap-2">
                                <button className="flex-1 py-2 text-xs font-bold border rounded-lg hover:bg-gray-50 transition-colors">Edit Profile</button>
                                <button className="flex-1 py-2 text-xs font-bold bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">View logs</button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm p-8 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-4">
                    <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Security Rules</h3>
                <p className="text-gray-500 text-sm max-w-sm mb-6">Administrators have full access to bot settings and user data. Moderate roles have limited permissions.</p>
                <button className="text-primary font-bold text-sm hover:underline">Manage Role Permissions →</button>
            </Card>
        </div>
    );
};

export default Team;
