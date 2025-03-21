import { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthForm = ({ isRegister, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
      
      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full mb-4 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {isRegister ? 'Registrarse' : 'Entrar'}
      </button>

      <div className="mt-4 text-center text-sm text-gray-700">
        {isRegister ? (
          <>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </Link>
          </>
        ) : (
          <>
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </>
        )}
      </div>
    </form>
  );
};

export default AuthForm;
