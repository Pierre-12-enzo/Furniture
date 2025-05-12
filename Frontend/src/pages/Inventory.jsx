// src/pages/Inventory.jsx (Updated)
import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: '', quantity: '', type: 'ADD', notes: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, productsRes] = await Promise.all([
          api.get('/inventory'),
          api.get('/products')
        ]);
        console.log('Inventory data:', inventoryRes.data); // Debug
        setInventory(inventoryRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quantity = Number(form.quantity);
    if (!form.productId) {
      setError('Product is required');
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      setError('Quantity must be a positive number');
      return;
    }
    try {
      const response = await api.post('/inventory', { ...form, quantity });
      setInventory([...inventory, response.data]);
      setForm({ productId: '', quantity: '', type: 'ADD', notes: '' });
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update inventory');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 ml-64">
          <Navbar />
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 animate-pulse">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 ml-64 bg-gray-50">
        <Navbar />
        <h1 className="text-3xl font-bold text-teal-800 mb-8 flex items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          Inventory
        </h1>
        {error && (
          <div className="alert alert-error mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Update Inventory</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Product</label>
                <select
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.productId} value={product.productId}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="input"
                  required
                >
                  <option value="ADD">Add</option>
                  <option value="REMOVE">Remove</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Notes</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Update Inventory
            </button>
          </form>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Inventory List</h2>
          {inventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName || 'Unknown Product'}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              No inventory items found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;