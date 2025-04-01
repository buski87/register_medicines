import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Charts from './pages/Charts';
import Reminders from './pages/Reminders';

function App() {
  const isAuthenticated = localStorage.getItem('loggedInUser');

  return (  
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/history" element={isAuthenticated ? <History /> : <Navigate to="/login" />} />
      <Route path="/charts" element={isAuthenticated ? <Charts /> : <Navigate to="/login" />} />
      <Route path="/reminders" element={isAuthenticated ? <Reminders /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
