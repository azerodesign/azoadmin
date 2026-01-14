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
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="bg-primary p-6 text-white relative">
                        <Dialog.Title className="text-2xl font-bold flex items-center gap-3">
                            <Package size={28} />
                            Add New Product
                        </Dialog.Title>
                        <Dialog.Description className="text-white/70 text-sm mt-1">
                            Fill in the details below to add a new product to your bot store.
                        </Dialog.Description>
                        <Dialog.Close className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </Dialog.Close>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Tag size={12} /> Product Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Netflix Premium"
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Hash size={12} /> Keyword
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. netflix"
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    value={formData.keyword}
                                    onChange={(e) => setFormData({ ...formData, keyword: e.target.value.toLowerCase() })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <FileText size={12} /> Description
                            </label>
                            <textarea
                                placeholder="Describe your product..."
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium min-h-[80px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    Price (Rp)
                                </label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0"
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    Stock
                                </label>
                                <input
                                    required
                                    type="number"
                                    placeholder="0"
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Upload size={12} /> Image URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                value={formData.media_url}
                                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
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
