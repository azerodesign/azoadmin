import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Plus, Search, Filter, MoreVertical, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AddTaskModal from '../components/tasks/AddTaskModal';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('admin_tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error.message);
            // Fallback to mock if table doesn't exist yet
            setTasks([
                { id: 1, title: 'Fix sticker bot slow response', status: 'In Progress', priority: 'High', due_date: '2024-01-14', group_name: 'Azo Support' },
                { id: 2, title: 'Add new TikTok downloader module', status: 'Pending', priority: 'Medium', due_date: '2024-01-15', group_name: 'Dev Team' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="text-sky-500" size={18} />;
            case 'In Progress': return <Clock className="text-blue-500" size={18} />;
            case 'Pending': return <AlertCircle className="text-orange-500" size={18} />;
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <AddTaskModal
                isOpen={isTaskModalOpen}
                onOpenChange={setIsTaskModalOpen}
                onSuccess={fetchTasks}
            />

            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-1 font-sans">Tasks</h2>
                    <p className="text-gray-500 text-sm">Manage your development and support tasks.</p>
                </div>
                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    New Task
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Completed</p>
                        <h4 className="text-xl font-bold">42</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">In Progress</p>
                        <h4 className="text-xl font-bold">12</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Pending</p>
                        <h4 className="text-xl font-bold">8</h4>
                    </div>
                </Card>
                <Card className="p-4 bg-white border-none shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-xs font-medium">Overdue</p>
                        <h4 className="text-xl font-bold">3</h4>
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
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <Filter size={16} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Task Name</th>
                                <th className="px-6 py-4">Group</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {tasks.map((task) => (
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
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-lg ${task.status === 'Completed' ? 'bg-sky-100 text-sky-700' :
                                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-orange-100 text-orange-700'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{task.due_date}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical size={16} />
                                        </button>
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
