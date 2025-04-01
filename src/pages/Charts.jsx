import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HealthCharts from '../components/HealthCharts';

const Charts = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

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
        const allKeys = Object.keys(localStorage);
        const dates = [];

        allKeys.forEach((key) => {
          if (key.startsWith(`tomas_${user.email}_`)) {
            const date = key.split(`tomas_${user.email}_`)[1];
            const tomas = JSON.parse(localStorage.getItem(key));
            const vitalsKey = `vitals_${user.email}_${date}`;
            const vitals = JSON.parse(localStorage.getItem(vitalsKey));
            dates.push({ date, tomas, vitals });
          }
        });

        dates.sort((a, b) => a.date.localeCompare(b.date));
        setHistory(dates);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message || 'Token inválido o expirado.';
        
        if (errorMessage.includes('expirado')) {
          localStorage.setItem('expiredMessage', errorMessage);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        navigate('/login');
      });
  }, [navigate]);

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6 bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gráficas de seguimiento</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/history')} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ver historial
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <p>No hay registros disponibles para mostrar gráficas.</p>
      ) : (
        <HealthCharts data={history} />
      )}
    </div>
  );
};

export default Charts;
