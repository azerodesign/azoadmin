import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar, Clock, AlignLeft, Tag, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const EventDetailsModal = ({ isOpen, onOpenChange, event, onDeleteSuccess }) => {
    const [loading, setLoading] = useState(false);

    if (!event) return null;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        setLoading(true);

        try {
            let table = '';
            // Determine table based on ID prefix
            if (event.id.startsWith('task-')) table = 'tasks';
            else if (event.id.startsWith('evt-')) table = 'admin_events';
            else {
                alert('This type of event cannot be deleted.');
                setLoading(false);
                return;
            }

            // Extract real ID (remove prefix)
            const realId = event.id.split('-')[1];

            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', realId);

            if (error) throw error;

            onDeleteSuccess?.();
            onOpenChange(false);

        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const isDeletable = event.id?.startsWith('task-') || event.id?.startsWith('evt-');

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-panel border border-white/10 rounded-3xl shadow-2xl z-[101] overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-primary/20 backdrop-blur-xl p-6 border-b border-white/10 relative">
                        <Dialog.Title className="text-xl font-bold flex items-center gap-3 text-white">
                            <Calendar size={24} className="text-primary" />
                            Event Details
                        </Dialog.Title>
                        <Dialog.Close className="absolute top-6 right-6 p-2 text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </Dialog.Close>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Title</span>
                            <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Date</span>
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                    <Clock size={14} className="text-primary" />
                                    {new Date(event.event_date).toLocaleDateString()}
                                </div>
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Type</span>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${event.event_type === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                        {event.event_type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {event.description && (
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted block mb-1">Description</span>
                                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                            </div>
                        )}

                        {isDeletable && (
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="w-full py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all uppercase tracking-widest text-xs"
                            >
                                <Trash2 size={16} />
                                {loading ? 'Deleting...' : 'Delete Event'}
                            </button>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default EventDetailsModal;
