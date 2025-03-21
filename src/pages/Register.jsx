import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.find((u) => u.email === cleanEmail);
    if (userExists) {
      alert('El usuario ya existe');
      return;
    }

    users.push({ email: cleanEmail, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuario creado correctamente');
    navigate('/login');
  };

  return <AuthForm isRegister={true} onSubmit={handleRegister} />;
};

export default Register;
