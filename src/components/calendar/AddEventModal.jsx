import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, Type, Clock, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AddEventModal = ({ isOpen, onOpenChange, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        event_type: 'Meeting',
        description: '',
        event_date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!supabase) {
            alert("Supabase client not initialized.");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('admin_events')
                .insert([formData]);

            if (error) throw error;
            onSuccess?.();
            onOpenChange(false);
            setFormData({
                title: '', event_type: 'Meeting', description: '', event_date: new Date().toISOString().split('T')[0]
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
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-primary p-6 text-white relative">
                        <Dialog.Title className="text-2xl font-bold flex items-center gap-3">
                            <Calendar size={28} />
                            New Event
                        </Dialog.Title>
                        <Dialog.Description className="text-white/70 text-sm mt-1">
                            Schedule a new event or reminder.
                        </Dialog.Description>
                        <Dialog.Close className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Type size={12} /> Event Title
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Team Planning"
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Clock size={12} /> Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    value={formData.event_date}
                                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Layers size={12} /> Type
                                </label>
                                <select
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium appearance-none"
                                    value={formData.event_type}
                                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                                >
                                    <option value="Meeting">Meeting</option>
                                    <option value="Update">Update</option>
                                    <option value="Deadline">Deadline</option>
                                    <option value="Holiday">Holiday</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <FileText size={12} /> Description
                            </label>
                            <textarea
                                placeholder="Details about this event..."
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium min-h-[60px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Add Event'}
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

// Start icon workaround if Layers is undefined
const Layers = ({ size }) => <div style={{ width: size, height: size, background: 'currentColor', opacity: 0.2 }} />;

export default AddEventModal;
