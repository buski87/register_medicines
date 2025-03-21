import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find((u) => u.email === cleanEmail && u.password === password);
    if (!user) {
      alert('Credenciales inválidas');
      return;
    }

    localStorage.setItem('loggedInUser', JSON.stringify(user));
    navigate('/');
  };

  return <AuthForm isRegister={false} onSubmit={handleLogin} />;
};

export default Login;
