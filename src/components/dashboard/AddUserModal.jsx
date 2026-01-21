import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, UserPlus, Phone, User, Shield, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AddUserModal = ({ isOpen, onOpenChange, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        exp: 0,
        ai_mode: 'casual'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if phone already exists (optional safety)
            const { data: existing } = await supabase
                .from('users')
                .select('id')
                .eq('phone', formData.phone)
                .single();

            if (existing) {
                alert('A user with this phone number already exists.');
                setLoading(false);
                return;
            }

            const { error } = await supabase
                .from('users')
                .insert([{
                    ...formData,
                    created_at: new Date().toISOString()
                }]);

            if (error) throw error;

            onSuccess?.();
            onOpenChange(false);
            setFormData({ name: '', phone: '', exp: 0, ai_mode: 'casual' });

        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user: ' + error.message);
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
                            <UserPlus size={28} className="text-primary" />
                            Add User
                        </Dialog.Title>
                        <Dialog.Description className="text-muted text-sm mt-1 font-medium">
                            Manually register a new user for the bot.
                        </Dialog.Description>
                        <Dialog.Close className="absolute top-6 right-6 p-2 text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                <User size={12} className="text-primary" /> Name
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. John Doe"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                <Phone size={12} className="text-primary" /> Phone Number
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. 628123456789"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium font-mono"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                    <Shield size={12} className="text-primary" /> Initial XP
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                    value={formData.exp}
                                    onChange={(e) => setFormData({ ...formData, exp: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                    <Sparkles size={12} className="text-primary" /> AI Mode
                                </label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium appearance-none"
                                    value={formData.ai_mode}
                                    onChange={(e) => setFormData({ ...formData, ai_mode: e.target.value })}
                                >
                                    <option value="casual">Casual</option>
                                    <option value="formal">Formal</option>
                                    <option value="excited">Excited</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-xs"
                        >
                            {loading ? 'Adding User...' : 'Add User'}
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default AddUserModal;
