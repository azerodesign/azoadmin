import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
import { Plus, Package, ShoppingCart, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import AddProductModal from '../components/store/AddProductModal';

const Store = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    useEffect(() => {
        fetchStoreData();
    }, []);

    const fetchStoreData = async () => {
        // Fetch Products
        const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (prodData) setProducts(prodData || []);

        // Fetch Orders
        const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(20);
        if (orderData) setOrders(orderData || []);
    };

    const handleSuccess = () => {
        fetchStoreData();
    };

    const deleteProduct = async (id, name) => {
        if (!confirm(`Are you sure you want to delete product "${name}"?`)) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchStoreData();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product: ' + error.message);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <AddProductModal
                isOpen={isProductModalOpen}
                onOpenChange={setIsProductModalOpen}
                onSuccess={handleSuccess}
            />

            <header className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black mb-2 text-foreground tracking-tight">Store Management</h2>
                        <p className="text-muted text-sm sm:text-base font-medium">Manage products and view incoming orders.</p>
                    </div>
                    <button
                        onClick={() => setIsProductModalOpen(true)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-hover hover:scale-105 transition-all luxury-glow shadow-lg text-sm uppercase tracking-wider w-full sm:w-auto"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
                <div className="flex bg-black/20 p-1 rounded-xl border border-white/5 w-full sm:w-auto backdrop-blur-md">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'products' ? 'bg-primary text-primary-foreground shadow-lg luxury-glow' : 'text-muted hover:text-foreground hover:bg-white/5'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'orders' ? 'bg-primary text-primary-foreground shadow-lg luxury-glow' : 'text-muted hover:text-foreground hover:bg-white/5'}`}
                    >
                        Orders
                    </button>
                </div>
            </header>

            {activeTab === 'products' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <Card key={product.id} className="p-5 group hover:luxury-glow transition-all duration-300 border border-white/5 glass-panel bg-transparent">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/20 transition-colors border border-white/10 group-hover:border-primary/30">
                                    <Package className="text-muted group-hover:text-primary transition-colors" size={20} />
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${product.stock > 0 ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                </span>
                            </div>
                            <h3 className="font-black text-lg mb-1 text-foreground tracking-tight group-hover:text-primary transition-colors">{product.keyword}</h3>
                            <p className="text-muted text-sm mb-4 line-clamp-2 font-medium">{product.description}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <span className="text-primary font-black text-lg tracking-tight shadow-primary/20 drop-shadow-sm">{formatCurrency(product.price)}</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => deleteProduct(product.id, product.keyword)}
                                        className="p-1.5 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Product"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button className="text-xs font-bold text-muted hover:text-foreground uppercase tracking-widest transition-colors flex items-center gap-1">
                                        Edit <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {products.length === 0 && <div className="col-span-3 text-center text-muted py-10 font-bold">No products found.</div>}
                </div>
            ) : (
                <Card className="overflow-hidden border border-white/5 shadow-none glass-panel">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-black/20 text-muted uppercase text-[10px] font-black tracking-[0.2em] border-b border-white/5">
                                <tr>
                                    <th className="p-4 text-left">ID</th>
                                    <th className="p-4 text-left">Customer</th>
                                    <th className="p-4 text-left">Details</th>
                                    <th className="p-4 text-left">Total</th>
                                    <th className="p-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 font-mono text-xs text-muted group-hover:text-primary transition-colors">#{order.id.slice(0, 8)}</td>
                                        <td className="p-4 text-sm font-bold text-foreground">{order.customer_jid?.split('@')[0]}</td>
                                        <td className="p-4 text-sm text-muted truncate max-w-xs font-medium">{order.notes}</td>
                                        <td className="p-4 font-black text-foreground">{formatCurrency(order.total_amount)}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border
                                            ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    order.status === 'processing' ? 'bg-primary/10 text-primary border-primary/20' :
                                                        'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Store;
