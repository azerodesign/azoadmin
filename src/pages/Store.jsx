import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
import { Plus, Package, ShoppingCart } from 'lucide-react';
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
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Store Management</h2>
                        <p className="text-gray-500 text-sm sm:text-base">Manage products and view incoming orders.</p>
                    </div>
                    <button
                        onClick={() => setIsProductModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm w-full sm:w-auto"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Orders
                    </button>
                </div>
            </header>

            {activeTab === 'products' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <Card key={product.id} className="p-5 group hover:shadow-md transition-shadow border-none shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-primary/10 transition-colors">
                                    <Package className="text-gray-400 group-hover:text-primary" size={20} />
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${product.stock > 0 ? 'bg-sky-100 text-sky-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg mb-1 text-gray-900">{product.keyword}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <span className="text-primary font-bold text-lg">{formatCurrency(product.price)}</span>
                                <button className="text-xs font-semibold text-gray-500 hover:text-primary transition-colors">Edit</button>
                            </div>
                        </Card>
                    ))}
                    {products.length === 0 && <div className="col-span-3 text-center text-gray-500 py-10">No products found.</div>}
                </div>
            ) : (
                <Card className="overflow-hidden border-none shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold tracking-wider">
                                <tr>
                                    <th className="p-4 text-left">ID</th>
                                    <th className="p-4 text-left">Customer</th>
                                    <th className="p-4 text-left">Details</th>
                                    <th className="p-4 text-left">Total</th>
                                    <th className="p-4 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</td>
                                        <td className="p-4 text-sm font-medium text-gray-900">{order.customer_jid?.split('@')[0]}</td>
                                        <td className="p-4 text-sm text-gray-500 truncate max-w-xs">{order.notes}</td>
                                        <td className="p-4 font-bold text-gray-900">{formatCurrency(order.total_amount)}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                                            ${order.status === 'completed' ? 'bg-sky-100 text-sky-700' :
                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}>
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
