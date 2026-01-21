import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Plus, Search, Filter, MoreVertical, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';

import { supabase } from '../lib/supabase';
import AddTaskModal from '../components/tasks/AddTaskModal';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [taskStats, setTaskStats] = useState({ completed: 0, inProgress: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);

            // 1. Fetch Bot Tasks
            const { data: botTasks, error: botError } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (botError) throw botError;

            // 2. Fetch Admin Tasks
            const { data: adminTasks, error: adminError } = await supabase
                .from('admin_tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (adminError && adminError.code !== '42P01') throw adminError; // Ignore if table doesn't exist yet

            let allTasks = [];

            // Process Bot Tasks
            if (botTasks) {
                const mappedBotTasks = botTasks.map(task => ({
                    id: task.id,
                    type: 'bot', // Identify source
                    title: task.title || task.description || 'Untitled Task',
                    status: task.is_completed ? 'Completed' : (task.deadline && new Date(task.deadline) < new Date() ? 'Overdue' : 'Pending'),
                    priority: task.priority || 'Medium',
                    due_date: task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID') : '-',
                    group_name: task.user_phone || 'Unknown',
                    raw: task
                }));
                allTasks = [...allTasks, ...mappedBotTasks];
            }

            // Process Admin Tasks
            if (adminTasks) {
                const mappedAdminTasks = adminTasks.map(task => ({
                    id: task.id,
                    type: 'admin', // Identify source
                    title: task.title,
                    status: task.status,
                    priority: task.priority,
                    due_date: task.due_date ? new Date(task.due_date).toLocaleDateString('id-ID') : '-',
                    group_name: task.group_name || 'General',
                    raw: task,
                    created_at: task.created_at
                }));
                allTasks = [...allTasks, ...mappedAdminTasks];
            }

            // Sort by combined date (newest first)
            allTasks.sort((a, b) => {
                const dateA = new Date(a.raw.created_at || 0);
                const dateB = new Date(b.raw.created_at || 0);
                return dateB - dateA;
            });

            setTasks(allTasks);

            // Calculate stats
            const completed = allTasks.filter(t => t.status === 'Completed').length;
            const pending = allTasks.filter(t => t.status === 'Pending').length;
            const overdue = allTasks.filter(t => t.status === 'Overdue').length;
            setTaskStats({ completed, inProgress: 0, pending, overdue });

        } catch (error) {
            console.error('Error fetching tasks:', error.message);
            // Don't clear tasks on error, strictly speaking, just log it. 
            // But if critical, we might want to alert. For now just keep partial data if any.
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (task) => {
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            const table = task.type === 'admin' ? 'admin_tasks' : 'tasks';

            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', task.id);

            if (error) throw error;

            const newTasks = tasks.filter(t => t.id !== task.id);
            setTasks(newTasks);

            // Recalculate stats
            const completed = newTasks.filter(t => t.status === 'Completed').length;
            const pending = newTasks.filter(t => t.status === 'Pending').length;
            const overdue = newTasks.filter(t => t.status === 'Overdue').length;
            setTaskStats({ completed, inProgress: 0, pending, overdue });

        } catch (error) {
            console.error('Error deleting task:', error.message);
            alert('Failed to delete task: ' + error.message);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="text-emerald-500 luxury-glow" size={18} />;
            case 'In Progress': return <Clock className="text-primary luxury-glow" size={18} />;
            case 'Pending': return <AlertCircle className="text-orange-500" size={18} />;
            case 'Overdue': return <AlertCircle className="text-red-500 luxury-glow" size={18} />;
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
            case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
            case 'In Progress': return 'bg-primary/10 text-primary border border-primary/20';
            case 'Pending': return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
            case 'Overdue': return 'bg-red-500/10 text-red-500 border border-red-500/20';
            default: return 'bg-white/5 text-muted border border-white/10';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black mb-1 font-sans text-foreground tracking-tight">Tasks</h2>
                    <p className="text-muted text-sm font-medium">View tasks from your WhatsApp Bot users.</p>
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Completed</p>
                        <h4 className="text-xl font-black text-foreground">{taskStats.completed}</h4>
                    </div>
                </Card>
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Pending</p>
                        <h4 className="text-xl font-black text-foreground">{taskStats.pending}</h4>
                    </div>
                </Card>
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 border border-red-500/20">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Overdue</p>
                        <h4 className="text-xl font-black text-foreground">{taskStats.overdue || 0}</h4>
                    </div>
                </Card>
                <Card className="p-4 glass-panel border border-white/5 flex items-center gap-4 hover:luxury-glow transition-all duration-300">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-muted text-[10px] font-black uppercase tracking-widest">Total</p>
                        <h4 className="text-xl font-black text-foreground">{tasks.length}</h4>
                    </div>
                </Card>
            </div>

            <Card className="overflow-hidden border border-white/5 shadow-none bg-transparent">
                <div className="p-4 border-b border-white/5 glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted/50"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsAddTaskOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 hover:scale-105 transition-all luxury-glow shadow-lg"
                        >
                            <Plus size={16} />
                            Add Task
                        </button>
                        <button
                            onClick={fetchTasks}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground bg-primary rounded-xl hover:bg-primary-hover hover:scale-105 transition-all luxury-glow shadow-lg"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto glass-panel">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-white/5">
                            <tr className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                                <th className="px-6 py-4">Task Name</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Deadline</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-muted animate-pulse">Syncing tasks...</td>
                                </tr>
                            ) : tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-muted">No entries found in database.</td>
                                </tr>
                            ) : tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(task.status)}
                                            <span className="text-sm font-bold text-foreground">{task.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-muted">{task.group_name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-lg tracking-wider ${getStatusColor(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono text-muted">{task.due_date}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteTask(task)}
                                            className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete Task"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AddTaskModal
                isOpen={isAddTaskOpen}
                onOpenChange={setIsAddTaskOpen}
                onSuccess={fetchTasks}
            />
        </div>
    );
};

export default Tasks;
