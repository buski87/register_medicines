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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6 bg-white dark:bg-gray-900 dark:text-white rounded shadow relative">

      {error && <p className="text-red-500">{error}</p>}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Menu Options (Desktop) */}
        <div className="hidden md:flex space-x-4">
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

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-white focus:outline-none bg-gray-800 p-2 rounded"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 h-full w-3/4 bg-gray-800 text-white shadow-lg z-50 transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 space-y-6">
          <button 
            onClick={() => { setIsMenuOpen(false); navigate('/history'); }} 
            className="bg-blue-500 text-white px-4 py-2 rounded w-full text-left"
          >
            Ver historial
          </button>
          <button 
            onClick={() => { setIsMenuOpen(false); navigate('/charts'); }} 
            className="bg-green-500 text-white px-4 py-2 rounded w-full text-left"
          >
            Ver gráficas
          </button>
          <button 
            onClick={() => { setIsMenuOpen(false); navigate('/reminders'); }} 
            className="bg-yellow-500 text-black px-4 py-2 rounded w-full text-left"
          >
            Recordatorios
          </button>
          <button 
            onClick={() => { setIsMenuOpen(false); handleLogout(); }} 
            className="bg-red-500 text-white px-4 py-2 rounded w-full text-left"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
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
