// src/pages/Categories.jsx (Updated)
import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/categories', form);
      setCategories([...categories, response.data]);
      setForm({ name: '', description: '' });
    } catch (error) {
      setError('Failed to add category');
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
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen ml-[20%]">
        <Navbar />
        <h1 className="text-3xl font-bold text-teal-800 mb-6 flex items-center">
          <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Categories
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
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Add Category</h2>
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
                <label className="block mb-1 font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary mt-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          </form>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Category List</h2>
          {categories.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.categoryId}>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              No categories found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;