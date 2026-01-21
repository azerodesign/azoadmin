import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, Clock, AlignLeft, Tag, Type } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AddEventModal = ({ isOpen, onOpenChange, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        type: 'meeting'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('admin_events')
                .insert([{
                    ...formData,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            onSuccess?.();
            onOpenChange(false);
            setFormData({
                title: '',
                description: '',
                event_date: new Date().toISOString().split('T')[0],
                type: 'meeting'
            });

        } catch (error) {
            console.error('Error adding event:', error);
            alert('Failed to add event: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-panel border border-white/10 rounded-3xl shadow-2xl z-[101] overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-primary/20 backdrop-blur-xl p-6 border-b border-white/10 relative">
                        <Dialog.Title className="text-2xl font-bold flex items-center gap-3 text-white">
                            <Calendar size={28} className="text-primary" />
                            Add New Event
                        </Dialog.Title>
                        <Dialog.Description className="text-muted text-sm mt-1 font-medium">
                            Create a new event on the calendar.
                        </Dialog.Description>
                        <Dialog.Close className="absolute top-6 right-6 p-2 text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                <Type size={12} className="text-primary" /> Event Title
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Team Meeting"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                    <Clock size={12} className="text-primary" /> Date
                                </label>
                                <input
                                    required
                                    type="date"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                    value={formData.event_date}
                                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                    <Tag size={12} className="text-primary" /> Type
                                </label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium appearance-none"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="meeting">Meeting</option>
                                    <option value="reminder">Reminder</option>
                                    <option value="holiday">Holiday</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                <AlignLeft size={12} className="text-primary" /> Description
                            </label>
                            <textarea
                                placeholder="Event details..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium min-h-[80px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-xs"
                        >
                            {loading ? 'Creating Event...' : 'Create Event'}
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default AddEventModal;
