import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { email, password });
      setSuccess(response.data.message);
      setError('');
      navigate('/login');
    } catch (error) {
      setError(error.response.data.message || 'Error al registrar el usuario');
      setSuccess('');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 dark:text-white rounded shadow">
      <h1 className="text-2xl mb-4">Registro</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Registrar</button>
        <p className="mt-4 text-sm">¿Ya tienes una cuenta? <Link to="/login" className="text-blue-500">Inicia sesión aquí</Link></p>
      </form>
    </div>
  );
};

export default Register;
