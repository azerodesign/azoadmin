import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Plus, Search, Filter, MoreVertical, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [taskStats, setTaskStats] = useState({ completed: 0, inProgress: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            // Fetch real tasks from Supabase (tasks table from bot)
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                // Map task data to expected format
                const mappedTasks = data.map(task => ({
                    id: task.id,
                    title: task.title || task.description || 'Untitled Task',
                    status: task.is_completed ? 'Completed' : (task.deadline && new Date(task.deadline) < new Date() ? 'Overdue' : 'Pending'),
                    priority: task.priority || 'Medium',
                    due_date: task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID') : '-',
                    group_name: task.user_phone || 'Unknown',
                    raw: task
                }));
                setTasks(mappedTasks);

                // Calculate stats
                const completed = mappedTasks.filter(t => t.status === 'Completed').length;
                const pending = mappedTasks.filter(t => t.status === 'Pending').length;
                const overdue = mappedTasks.filter(t => t.status === 'Overdue').length;
                setTaskStats({ completed, inProgress: 0, pending, overdue });
            }
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="text-sky-500" size={18} />;
            case 'In Progress': return <Clock className="text-blue-500" size={18} />;
            case 'Pending': return <AlertCircle className="text-orange-500" size={18} />;
            case 'Overdue': return <AlertCircle className="text-red-500" size={18} />;
            default: return null;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700';
            case 'Medium': return 'bg-orange-100 text-orange-700';
            case 'Low': return 'bg-sky-100 text-sky-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-sky-100 text-sky-700';
            case 'In Progress': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-orange-100 text-orange-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1 font-sans">Tasks</h2>
                    <p className="text-gray-500 text-sm">View tasks from your WhatsApp Bot users.</p>
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Completed</p>
                        <h4 className="text-xl font-bold">{taskStats.completed}</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Pending</p>
                        <h4 className="text-xl font-bold">{taskStats.pending}</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Overdue</p>
                        <h4 className="text-xl font-bold">{taskStats.overdue || 0}</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Total</p>
                        <h4 className="text-xl font-bold">{tasks.length}</h4>
                    </div>
                </Card>
            </div>

            <Card className="overflow-hidden border-none shadow-sm">
                <div className="p-4 border-b border-gray-50 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchTasks}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-gray-50/50">
                            <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Task Name</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Deadline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">Loading...</td>
                                </tr>
                            ) : tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No tasks found in database.</td>
                                </tr>
                            ) : tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(task.status)}
                                            <span className="text-sm font-bold text-gray-900">{task.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{task.group_name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{task.due_date}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Tasks;
