import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthCharts from '../components/HealthCharts';

const Charts = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) return;

    const allKeys = Object.keys(localStorage);
    const meds = JSON.parse(localStorage.getItem(`meds_${user.email}`)) || [];
    const dates = [];

    allKeys.forEach((key) => {
      if (key.startsWith(`tomas_${user.email}_`)) {
        const date = key.split(`tomas_${user.email}_`)[1];
        const tomas = JSON.parse(localStorage.getItem(key));
        const vitalsKey = `vitals_${user.email}_${date}`;
        const vitals = JSON.parse(localStorage.getItem(vitalsKey));

        const enrichedTomas = tomas.map((toma) => {
          const med = meds.find((m) => m.id === toma.medId);
          return {
            ...toma,
            medName: med ? med.name : 'Desconocido',
          };
        });

        dates.push({ date, tomas: enrichedTomas, vitals });
      }
    });

    dates.sort((a, b) => a.date.localeCompare(b.date));
    setHistory(dates);
  }, [user]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Gráficas de seguimiento</h1>
        <button
        onClick={() => (window.location.href = '/history')}
        className="bg-gray-600 text-white px-4 py-2 rounded"
        >
        Volver al historial
        </button>
      </div>

      {history.length > 0 ? (
        <HealthCharts data={history} />
      ) : (
        <p className="text-gray-600">No hay datos disponibles para mostrar gráficas.</p>
      )}
    </div>
  );
};

export default Charts;
