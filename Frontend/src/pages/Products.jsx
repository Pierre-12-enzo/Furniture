
// src/pages/Products.jsx (Updated)
import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', sku: '', description: '', categoryId: '', price: '', minimumStock: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
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
    try {
      const response = await api.post('/products', { ...form, price: Number(form.price), minimumStock: Number(form.minimumStock) });
      setProducts([...products, response.data]);
      setForm({ name: '', sku: '', description: '', categoryId: '', price: '', minimumStock: '' });
    } catch (error) {
      setError('Failed to add product');
    }
  };

  if (isLoading) {
    return (
       <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen ml-[20%]">
        <Navbar />
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen ml-[20%]">
        <Navbar />
        <h1 className="text-3xl font-bold text-teal-800 mb-6 flex items-center">
          <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          Products
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Add Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">Minimum Stock</label>
                <input
                  type="number"
                  value={form.minimumStock}
                  onChange={(e) => setForm({ ...form, minimumStock: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary mt-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </form>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Product List</h2>
          {products.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Minimum Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.categoryName}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.minimumStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              No products found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;