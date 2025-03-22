// src/pages/History.jsx
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';


const History = () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const [history, setHistory] = useState([]);
  const [exportFormat, setExportFormat] = useState('json');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

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

    dates.sort((a, b) => b.date.localeCompare(a.date));
    setHistory(dates);
  }, [user]);

  const triggerDownload = (blob, filename) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleExport = (format) => {
    const filename = `historial_${user.email.replace(/[@.]/g, '_')}.${format}`;

    if (format === 'json') {
      const jsonStr = JSON.stringify(history, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      triggerDownload(blob, filename);
    }

    if (format === 'csv') {
      const csvRows = [
        'Fecha,Medicamento,Franja,Tomado,Peso,Presión sistólica,Presión diastólica,Pulsaciones',
      ];

      history.forEach((entry) => {
        entry.tomas.forEach((toma) => {
          csvRows.push(
            `${entry.date},"${toma.medName}",${toma.time},${toma.taken ? 'Sí' : 'No'},` +
              `${entry.vitals?.weight || ''},${entry.vitals?.systolic || ''},` +
              `${entry.vitals?.diastolic || ''},${entry.vitals?.pulse || ''}`
          );
        });
      });

      const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      triggerDownload(csvBlob, filename);
    }

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(12);
      let y = 10;

      history.forEach((entry, index) => {
        doc.text(`📅 ${entry.date}`, 10, y);
        y += 6;

        entry.tomas.forEach((toma) => {
          doc.text(
            `- ${toma.medName} – ${toma.time === 'morning' ? 'Mañana' : toma.time === 'noon' ? 'Mediodía' : 'Noche'}: ${
              toma.taken ? '✅ Tomado' : '❌ No tomado'
            }`,
            10,
            y
          );
          y += 5;
        });

        if (entry.vitals) {
          doc.text(
            `🩺 Peso: ${entry.vitals.weight} kg – Presión: ${entry.vitals.systolic}/${entry.vitals.diastolic} – Pulso: ${entry.vitals.pulse} bpm`,
            10,
            y
          );
          y += 8;
        } else {
          doc.text('🩺 Sin datos de salud.', 10, y);
          y += 8;
        }

        if (index < history.length - 1) {
          doc.line(10, y, 200, y);
          y += 8;
        }

        if (y > 270) {
          doc.addPage();
          y = 10;
        }
      });

      doc.save(filename);
    }
  };

  const isDateInRange = (dateStr) => {
    if (!startDate && !endDate) return true;
    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  };

  const filteredHistory = history.filter((entry) => isDateInRange(entry.date));

  const completedStreak = (() => {
    let streak = 0;
    for (let i = 0; i < filteredHistory.length; i++) {
      const entry = filteredHistory[i];
      const allTomas = entry.tomas.length > 0 && entry.tomas.every((t) => t.taken);
      const vitals = entry.vitals?.weight && entry.vitals?.systolic && entry.vitals?.diastolic && entry.vitals?.pulse;
      if (allTomas && vitals) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historial</h1>
        <div className="flex gap-2 items-center">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="border p-2 rounded text-sm"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV (Excel)</option>
            <option value="pdf">PDF</option>
          </select>

          <button
            onClick={() => handleExport(exportFormat)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Descargar historial
          </button>

          <button
            onClick={() => window.location.href = '/charts'}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            >
            Ver gráficas
            </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Desde:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Hasta:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {filteredHistory.length > 0 && (
        <div className="mb-6">
          <p className="text-green-700 font-semibold">
            🔁 Días consecutivos completando todo: {completedStreak}
          </p>
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <p>No hay registros en este rango de fechas.</p>
      ) : (
        <div className="space-y-6">
          {filteredHistory.map((entry) => (
            <div key={entry.date} className="border rounded p-4 bg-white shadow">
              <h2 className="text-lg font-semibold mb-2">📅 {entry.date}</h2>

              <div className="mb-3">
                <h3 className="font-semibold">💊 Tomas:</h3>
                <ul className="list-disc list-inside text-sm">
                  {entry.tomas.map((toma) => (
                    <li key={`${toma.medId}-${toma.time}`}>
                      <strong>{toma.medName}</strong> –{' '}
                      {toma.time === 'morning'
                        ? 'Mañana'
                        : toma.time === 'noon'
                        ? 'Mediodía'
                        : 'Noche'}{' '}
                      → {toma.taken ? '✅ Tomado' : '❌ No tomado'}
                    </li>
                  ))}
                </ul>
              </div>

              {entry.vitals ? (
                <div>
                  <h3 className="font-semibold">🩺 Datos de salud:</h3>
                  <p>Peso: {entry.vitals.weight} kg</p>
                  <p>Presión arterial: {entry.vitals.systolic}/{entry.vitals.diastolic} mmHg</p>
                  <p>Pulsaciones: {entry.vitals.pulse} bpm</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 italic">Sin registro de salud.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
