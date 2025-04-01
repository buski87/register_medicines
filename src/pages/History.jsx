import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const History = () => {
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
            dates.push({ date, tomas });
          }
        });

        dates.sort((a, b) => b.date.localeCompare(a.date));
        setHistory(dates);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6 bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historial</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/charts')} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ver Gráficas
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No hay registros en el historial.</p>
        ) : (
          history.map(entry => (
            <div key={entry.date} className="p-4 border rounded bg-gray-200 dark:bg-gray-700 mb-4">
              <h2 className="text-lg font-bold">{entry.date}</h2>
              {entry.tomas.map((toma, index) => (
                <p key={index}>{toma.medName}: {toma.taken ? '✅ Tomado' : '❌ No tomado'}</p>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
