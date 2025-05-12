// src/context/UserContext.jsx (New)
import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };
    const token = localStorage.getItem('token');
    if (token) fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
