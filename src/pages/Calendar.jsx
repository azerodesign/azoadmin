import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            // Fetch tasks with deadlines as events
            const { data: tasksData } = await supabase
                .from('tasks')
                .select('id, title, deadline, is_completed, user_phone')
                .not('deadline', 'is', null);

            // Fetch transactions as financial events
            const { data: transactionsData } = await supabase
                .from('transactions')
                .select('id, description, created_at, type, amount, category')
                .order('created_at', { ascending: false })
                .limit(20);

            // Combine into events
            const taskEvents = (tasksData || []).map(t => ({
                id: `task-${t.id}`,
                title: t.title || 'Task',
                event_date: t.deadline,
                event_type: t.is_completed ? 'Completed' : 'Deadline'
            }));

            const txEvents = (transactionsData || []).map(t => ({
                id: `tx-${t.id}`,
                title: `${t.type}: ${t.category || t.description || 'Transaction'}`,
                event_date: t.created_at,
                event_type: t.type === 'income' ? 'Income' : 'Expense'
            }));

            setEvents([...taskEvents, ...txEvents]);
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const getEventsForDay = (day) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        return events.filter(e => {
            const eventDate = new Date(e.event_date);
            return eventDate.getFullYear() === year &&
                eventDate.getMonth() === month &&
                eventDate.getDate() === day;
        });
    };

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'Deadline': return 'bg-red-100 text-red-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Income': return 'bg-sky-100 text-sky-700';
            case 'Expense': return 'bg-orange-100 text-orange-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const isToday = (day) =>
        today.getDate() === day &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1">Calendar</h2>
                    <p className="text-gray-500 text-sm">View tasks deadlines and transactions.</p>
                </div>
                <button
                    onClick={fetchEvents}
                    className="px-4 py-2 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </header>

            <Card className="border-none shadow-sm overflow-hidden bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 p-4 sm:p-6">
                    <div className="flex items-center gap-4">
                        <CalendarIcon className="text-primary hidden sm:block" size={24} />
                        <h3 className="text-lg sm:text-xl font-bold">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[700px]">
                        <div className="grid grid-cols-7 border-b border-gray-50">
                            {dayNames.map((day) => (
                                <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-r border-gray-50 last:border-0">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {/* Empty slots for start of month alignment */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-24 sm:h-28 border-r border-b border-gray-50 bg-gray-50/30"></div>
                            ))}

                            {days.map((day) => {
                                const dayEvents = getEventsForDay(day);
                                return (
                                    <div key={day} className="h-24 sm:h-28 border-r border-b border-gray-50 p-2 hover:bg-gray-50/50 transition-colors relative group">
                                        <span className={`text-xs sm:text-sm font-bold ${isToday(day) ? 'w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center' : 'text-gray-900'}`}>
                                            {day}
                                        </span>

                                        <div className="mt-1 space-y-0.5 overflow-hidden max-h-16">
                                            {dayEvents.slice(0, 2).map(e => (
                                                <div key={e.id} className={`text-[9px] px-1 py-0.5 rounded font-bold truncate ${getEventTypeColor(e.event_type)}`}>
                                                    {e.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <div className="text-[9px] text-gray-400 font-medium">+{dayEvents.length - 2} more</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Calendar;
