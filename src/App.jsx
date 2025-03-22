import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History';

function App() {
  const isAuthenticated = localStorage.getItem('loggedInUser');

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
