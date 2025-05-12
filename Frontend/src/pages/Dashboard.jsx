// src/pages/Dashboard.jsx (Updated)
import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LowStockTable from '../components/LowStockTable';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({ lowStock: [], totalInventoryValue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/dashboard');
        setDashboardData({
          lowStock: response.data.lowStock || [],
          totalInventoryValue: Number(response.data.totalInventoryValue) || 0
        });
      } catch (error) {
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-teal-800 mb-4">Summary</h2>
            <p className="text-2xl font-bold">
              Total Inventory Value: ${(dashboardData.totalInventoryValue).toFixed(2)}
            </p>
            <p className="mt-2 text-gray-600">Low Stock Items: {dashboardData.lowStock.length}</p>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold text-teal-800 mb-4">Low Stock</h2>
            <LowStockTable lowStock={dashboardData.lowStock} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;