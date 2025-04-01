import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Charts from './pages/Charts';
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Intentar acceder a una ruta protegida para validar el token
      axios.get('http://localhost:5000/api/users/protected')
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('loggedInUser');
        });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
      <Route path="/charts" element={isAuthenticated ? <Charts /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
