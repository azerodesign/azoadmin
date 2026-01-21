import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, RefreshCw, PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AddEventModal from '../components/dashboard/AddEventModal';
import EventDetailsModal from '../components/dashboard/EventDetailsModal';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

            // Fetch manual events
            const { data: adminEventsData } = await supabase
                .from('admin_events')
                .select('*')
                .order('event_date', { ascending: true });

            // Combine into events
            const taskEvents = (tasksData || []).map(t => ({
                id: `task-${t.id}`,
                title: t.title || 'Task',
                event_date: t.deadline,
                event_type: t.is_completed ? 'Completed' : 'Deadline',
                description: `Deadline for task: ${t.title}`
            }));

            const txEvents = (transactionsData || []).map(t => ({
                id: `tx-${t.id}`,
                title: `${t.type}: ${t.category || t.description || 'Transaction'}`,
                event_date: t.created_at,
                event_type: t.type === 'income' ? 'Income' : 'Expense',
                description: `Transaction amount: ${t.amount}`
            }));

            const manualEvents = (adminEventsData || []).map(e => ({
                id: `evt-${e.id}`,
                title: e.title,
                event_date: e.event_date,
                event_type: e.type.charAt(0).toUpperCase() + e.type.slice(1),
                description: e.description
            }));

            setEvents([...taskEvents, ...txEvents, ...manualEvents]);
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
            case 'Deadline': return 'bg-red-500/20 text-red-400 border border-red-500/20';
            case 'Completed': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20';
            case 'Income': return 'bg-sky-500/20 text-sky-400 border border-sky-500/20';
            case 'Expense': return 'bg-orange-500/20 text-orange-400 border border-orange-500/20';
            default: return 'bg-white/10 text-muted border border-white/10';
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
                    <h2 className="text-2xl sm:text-3xl font-black mb-1 text-foreground tracking-tight">Calendar</h2>
                    <p className="text-muted text-sm font-medium">View tasks deadlines and transactions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAddEventOpen(true)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-600 hover:scale-105 transition-all luxury-glow shadow-lg text-xs uppercase tracking-wider"
                    >
                        <Plus size={16} />
                        Add Event
                    </button>
                    <button
                        onClick={fetchEvents}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold flex items-center gap-2 hover:bg-primary-hover hover:scale-105 transition-all luxury-glow shadow-lg text-xs uppercase tracking-wider"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </header>

            <Card className="border border-white/5 shadow-none overflow-hidden glass-panel bg-transparent">
                <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 p-4 sm:p-6 bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 luxury-glow hidden sm:block">
                            <CalendarIcon className="text-primary" size={24} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight uppercase">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-foreground transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg text-muted hover:text-foreground transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[700px]">
                        <div className="grid grid-cols-7 border-b border-white/5 bg-black/20">
                            {dayNames.map((day) => (
                                <div key={day} className="py-3 text-center text-[10px] font-black text-muted uppercase tracking-[0.2em] border-r border-white/5 last:border-0">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 bg-black/10">
                            {/* Empty slots for start of month alignment */}
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-24 sm:h-28 border-r border-b border-white/5 bg-white/[0.02]"></div>
                            ))}

                            {days.map((day) => {
                                const dayEvents = getEventsForDay(day);
                                return (
                                    <div key={day} className="h-24 sm:h-28 border-r border-b border-white/5 p-2 hover:bg-white/5 transition-colors relative group">
                                        <span className={`text-xs sm:text-sm font-black ${isToday(day) ? 'w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center luxury-glow shadow-lg' : 'text-muted-foreground'}`}>
                                            {day}
                                        </span>

                                        <div className="mt-2 space-y-1 overflow-hidden max-h-16">
                                            {dayEvents.slice(0, 2).map(e => (
                                                <button
                                                    key={e.id}
                                                    onClick={() => {
                                                        setSelectedEvent(e);
                                                        setIsDetailsOpen(true);
                                                    }}
                                                    className={`w-full text-left text-[9px] px-1.5 py-0.5 rounded-md font-bold truncate tracking-tight hover:brightness-110 transition-all ${getEventTypeColor(e.event_type)}`}
                                                >
                                                    {e.title}
                                                </button>
                                            ))}
                                            {dayEvents.length > 2 && (
                                                <div className="text-[9px] text-muted font-bold pl-1">+{dayEvents.length - 2} more</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AddEventModal
                isOpen={isAddEventOpen}
                onOpenChange={setIsAddEventOpen}
                onSuccess={fetchEvents}
            />

            <EventDetailsModal
                isOpen={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                event={selectedEvent}
                onDeleteSuccess={fetchEvents}
            />
        </div>
    );
};

export default Calendar;
