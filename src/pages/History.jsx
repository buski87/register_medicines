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
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6 bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historial</h1>
        <button 
          onClick={() => navigate('/')} 
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Volver al Dashboard
        </button>
      </div>
      
      {history.length === 0 ? (
        <p>No hay registros en el historial.</p>
      ) : (
        history.map(entry => (
          <div key={entry.date} className="border p-4 mb-4 rounded bg-gray-200 dark:bg-gray-800">
            <h2 className="text-lg font-bold">{entry.date}</h2>
            {entry.tomas.map((toma, index) => (
              <p key={index}>{toma.medName}: {toma.taken ? 'Tomado' : 'No tomado'}</p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default History;
