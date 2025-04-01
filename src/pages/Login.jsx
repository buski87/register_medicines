import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('expiredMessage')) {
      setError(localStorage.getItem('expiredMessage'));
      localStorage.removeItem('expiredMessage');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('loggedInUser', JSON.stringify({ email }));
      navigate('/');
    } catch (error) {
      setError(error.response.data.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6 bg-white dark:bg-gray-800 dark:text-white">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 dark:text-white rounded shadow p-6">
        <h1 className="text-2xl mb-4">Iniciar sesión</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded" 
            />
          </div>
          <div className="mb-4">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded" 
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full">Entrar</button>
          <p className="mt-4 text-sm text-center">¿No tienes una cuenta? <Link to="/register" className="text-blue-500">Regístrate aquí</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;
