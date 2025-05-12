
// src/pages/StockMovements.jsx (Updated)
import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const StockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const response = await api.get('/stock-movements');
        setMovements(response.data);
      } catch (error) {
        setError('Failed to load stock movements');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovements();
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
          </svg>
          Stock Movements
        </h1>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        <div className="card">
          <h2 className="text-xl font-semibold text-teal-800 mb-4">Movement History</h2>
          {movements.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Type</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.movementId}>
                    <td>{movement.productName}</td>
                    <td>{movement.quantity}</td>
                    <td>{movement.type}</td>
                    <td>{movement.username}</td>
                    <td>{new Date(movement.createdAt).toLocaleString()}</td>
                    <td>{movement.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              No stock movements found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockMovements;