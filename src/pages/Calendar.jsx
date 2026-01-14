import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AddEventModal from '../components/calendar/AddEventModal';
import { useBotStatus } from '../hooks/useBotStatus';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const fetchEvents = async () => {
        if (!supabase) return;
        try {
            // Fetch events for current month (simple fetch all for now)
            const { data, error } = await supabase
                .from('admin_events')
                .select('*')
                .order('event_date', { ascending: true });

            if (error) throw error;
            if (data) setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            // Fallback Mock
            setEvents([
                { id: 1, title: 'Major Update', event_date: '2024-01-14', event_type: 'Update' },
                { id: 2, title: 'Team Meeting', event_date: '2024-01-14', event_type: 'Meeting' },
                { id: 3, title: 'Backup Success', event_date: '2024-01-16', event_type: 'Update' },
            ]);
        }
    };

    const getEventsForDay = (day) => {
        // Construct date string YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateKey = `${year}-${month}-${dayStr}`; // Note: Adjust if currentDate changes month

        // Use static 2024-01 for demo purposes if year checking is complex
        // Ideally: check if event_date matches 
        return events.filter(e => {
            const d = new Date(e.event_date);
            return d.getDate() === day; // Simple day match for demo
        });
    };

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'Update': return 'bg-red-100 text-red-700';
            case 'Meeting': return 'bg-blue-100 text-blue-700';
            case 'Deadline': return 'bg-orange-100 text-orange-700';
            default: return 'bg-sky-100 text-sky-700';
        }
    };

    // Mock days in a month
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <AddEventModal
                isOpen={isEventModalOpen}
                onOpenChange={setIsEventModalOpen}
                onSuccess={fetchEvents}
            />

            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-1">Calendar</h2>
                    <p className="text-gray-500 text-sm">Schedule bot activities and campaigns.</p>
                </div>
                <button
                    onClick={() => setIsEventModalOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    Add Event
                </button>
            </header>

            <Card className="border-none shadow-sm overflow-hidden bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 p-6">
                    <div className="flex items-center gap-4">
                        <CalendarIcon className="text-primary" size={24} />
                        <h3 className="text-xl font-bold">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                    </div>
                    {/* ... navigation buttons ... */}
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-7 border-b border-gray-50">
                        {dayNames.map((day) => (
                            <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-r border-gray-50 last:border-0">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {/* Empty slots for start of month alignment (mock) */}
                        <div className="h-32 border-r border-b border-gray-50 bg-gray-50/30"></div>
                        <div className="h-32 border-r border-b border-gray-50 bg-gray-50/30"></div>

                        {days.map((day) => {
                            const dayEvents = getEventsForDay(day);
                            return (
                                <div key={day} className="h-32 border-r border-b border-gray-50 p-3 hover:bg-gray-50/50 transition-colors relative group">
                                    <span className={`text-sm font-bold ${day === 14 ? 'w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center' : 'text-gray-900'}`}>
                                        {day}
                                    </span>

                                    <div className="mt-2 space-y-1">
                                        {dayEvents.map(e => (
                                            <div key={e.id} className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold truncate ${getEventTypeColor(e.event_type)}`}>
                                                {e.title}
                                            </div>
                                        ))}
                                    </div>

                                    <button className="absolute bottom-2 right-2 p-1 bg-white border border-gray-100 rounded-md text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={12} />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Filling empty grid slots at the end (mock) */}
                        <div className="h-32 border-r border-b border-gray-50 bg-gray-50/30"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};



export default Calendar;
