import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Upload, Package, Laptop, Tag, Hash, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AddProductModal = ({ isOpen, onOpenChange, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        keyword: '',
        description: '',
        price: '',
        stock: '',
        media_url: '',
        group_jid: '120363123456789012@g.us', // Default demo group
        media_type: 'image'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('products')
                .insert([{
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    created_by: 'admin@azoai.com'
                }]);

            if (error) throw error;
            onSuccess?.();
            onOpenChange(false);
            setFormData({
                name: '', keyword: '', description: '', price: '', stock: '', media_url: '', group_jid: '120363123456789012@g.us', media_type: 'image'
            });
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product: ' + error.message);
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
                            <Package size={28} className="text-primary" />
                            Add New Product
                        </Dialog.Title>
                        <Dialog.Description className="text-muted text-sm mt-1 font-medium">
                            Fill in the details below to add a new product.
                        </Dialog.Description>
                        <Dialog.Close className="absolute top-6 right-6 p-2 text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                    <Tag size={12} className="text-primary" /> Product Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Netflix Premium"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                    <Hash size={12} className="text-primary" /> Keyword
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. netflix"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                    value={formData.keyword}
                                    onChange={(e) => setFormData({ ...formData, keyword: e.target.value.toLowerCase() })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                <FileText size={12} className="text-primary" /> Description
                            </label>
                            <textarea
                                placeholder="Describe your product..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium min-h-[80px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                    Price (Rp)
                                </label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-bold"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                    Stock
                                </label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-bold"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase flex items-center gap-2 tracking-wider">
                                <Upload size={12} className="text-primary" /> Image URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium"
                                value={formData.media_url}
                                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-widest text-xs"
                        >
                            {loading ? 'Adding Product...' : 'Create Product'}
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default AddProductModal;
