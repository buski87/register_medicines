import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MedicationForm from '../components/MedicationForm';
import MedicationList from '../components/MedicationList';
import DailyToma from '../components/DailyToma';
import VitalSignsForm from '../components/VitalSignsForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Manage menu open state

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    axios.get('http://localhost:5000/api/users/protected')
      .then(() => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const stored = JSON.parse(localStorage.getItem(`meds_${user.email}`)) || [];
        const storedReminders = JSON.parse(localStorage.getItem(`reminders_${user.email}`)) || [];
        setMedications(stored);
        setReminders(storedReminders);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const checkReminders = () => {
    const now = new Date().toLocaleTimeString('en-GB', { hour12: false });
    reminders.forEach(reminder => {
      if (reminder.time === now && !reminder.completed) {
        alert(`🔔 Recordatorio: ${reminder.name} - ${reminder.description}`);
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6 bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      {error && <p className="text-red-500">{error}</p>}

      {/* Menu */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Hamburger Icon */}
        <div className="block md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              // Close icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              // Hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Menu Options (Mobile) */}
        <div className={`md:flex ${isMenuOpen ? 'block' : 'hidden'} space-x-4`}>
          <button 
            onClick={() => navigate('/history')} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ver historial
          </button>
          <button 
            onClick={() => navigate('/charts')} 
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Ver gráficas
          </button>
          <button 
            onClick={() => navigate('/reminders')} 
            className="bg-yellow-500 text-black px-4 py-2 rounded"
          >
            Recordatorios
          </button>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <MedicationList meds={medications} />
          <MedicationForm onAdd={(med) => setMedications([...medications, med])} />
        </div>

        <div className="md:w-2/3 space-y-6">
          <DailyToma medications={medications} userEmail={JSON.parse(localStorage.getItem('loggedInUser')).email} />
          <VitalSignsForm userEmail={JSON.parse(localStorage.getItem('loggedInUser')).email} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
