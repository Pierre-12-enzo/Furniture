// src/pages/Reports.jsx
import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LowStockTable from '../components/LowStockTable';

const Reports = () => {
  const [data, setData] = useState({ lowStock: [], totalInventoryValue: 0 });
  const [movements, setMovements] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { startDate, endDate } = dateFilter;
      if (!startDate || !endDate) {
        setError('Please select both start and end dates');
        setIsLoading(false);
        return;
      }
      if (new Date(startDate) > new Date(endDate)) {
        setError('Start date cannot be after end date');
        setIsLoading(false);
        return;
      }
      const query = `?startDate=${startDate}&endDate=${endDate}`;
      const [dashboardRes, movementsRes] = await Promise.all([
        api.get(`/dashboard${query}`),
        api.get(`/stock-movements${query}`)
      ]);
      setData({
        lowStock: dashboardRes.data.lowStock || [],
        totalInventoryValue: Number(dashboardRes.data.totalInventoryValue) || 0
      });
      setMovements(movementsRes.data.slice(0, 5));
      if (movementsRes.data.length === 0) {
        setError('No stock movements found in the selected date range');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateChange = (e) => {
    setDateFilter({ ...dateFilter, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleResetFilter = () => {
    setDateFilter({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
    fetchData();
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6h6v6m-6 0h6m4 0h-4m-6 0H5m4-14v4m6-4v4" />
          </svg>
          Inventory Reports
        </h1>
        {error && (
          <div className="alert alert-error mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        <div className="card mb-6 border-l-4 border-teal-500">
          <h2 className="text-xl font-semibold text-teal-800 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Filter by Date Range
          </h2>
          <form onSubmit={handleFilterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={dateFilter.startDate}
                    onChange={handleDateChange}
                    className="input"
                    required
                  />
                  <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">End Date</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={dateFilter.endDate}
                    onChange={handleDateChange}
                    className="input"
                    required
                  />
                  <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <button type="submit" className="btn-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Apply Filter
                </button>
                <button type="button" onClick={handleResetFilter} className="btn-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-teal-800 mb-4">Summary</h2>
            <p className="text-3xl font-bold text-gray-800">${data.totalInventoryValue.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">Total Inventory Value</p>
            <p className="text-gray-600 mt-2">Low Stock Items: {data.lowStock.length}</p>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold text-teal-800 mb-4">Recent Stock Movements</h2>
            {movements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Type</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((movement) => (
                      <tr key={movement.movementId}>
                        <td>{movement.productName}</td>
                        <td>{movement.quantity}</td>
                        <td>{movement.type}</td>
                        <td>{new Date(movement.createdAt).toLocaleString()}</td>
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
                No stock movements in selected date range
              </p>
            )}
          </div>
        </div>
        <div className="card mt-6">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Low Stock Items</h2>
          <LowStockTable lowStock={data.lowStock} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
