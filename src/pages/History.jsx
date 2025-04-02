import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import axios from 'axios';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [exportFormat, setExportFormat] = useState('json');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

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
        setFilteredHistory(dates);
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    let filtered = history;

    if (selectedYear) {
      filtered = filtered.filter(entry => entry.date.startsWith(selectedYear));
    }

    if (selectedMonth) {
      filtered = filtered.filter(entry => entry.date.slice(5, 7) === selectedMonth);
    }

    setFilteredHistory(filtered);
  }, [selectedYear, selectedMonth, history]);

  const triggerDownload = (blob, filename) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleExport = () => {
    const filename = `historial.${exportFormat}`;
    const exportData = filteredHistory;

    if (exportFormat === 'json') {
      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      triggerDownload(blob, filename);
    }

    if (exportFormat === 'csv') {
      const csvRows = ['Fecha,Medicamento,Tomado'];
      
      exportData.forEach((entry) => {
        entry.tomas.forEach((toma) => {
          csvRows.push(`${entry.date},${toma.medName},${toma.taken ? 'Sí' : 'No'}`);
        });
      });

      const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      triggerDownload(csvBlob, filename);
    }

    if (exportFormat === 'pdf') {
      const doc = new jsPDF();
      let y = 10;

      exportData.forEach((entry) => {
        doc.text(`Fecha: ${entry.date}`, 10, y);
        y += 10;
        entry.tomas.forEach((toma) => {
          doc.text(`- ${toma.medName}: ${toma.taken ? 'Sí' : 'No'}`, 10, y);
          y += 8;
        });
        y += 10;
      });

      doc.save(filename);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6 bg-gray-100 dark:bg-gray-900 dark:text-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">📅 Historial</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/charts')} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Ver Gráficas
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border p-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seleccionar Año</option>
            {Array.from(new Set(history.map(entry => entry.date.split('-')[0]))).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border p-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Seleccionar Mes</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="border p-2 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-white"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
          <button
            onClick={handleExport}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Descargar Historial
          </button>
        </div>
        
        {filteredHistory.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No hay registros en el historial.</p>
        ) : (
          filteredHistory.map(entry => (
            <div key={entry.date} className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 mb-4">
              <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">{entry.date}</h2>
              {entry.tomas.map((toma, index) => (
                <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                  {toma.medName}: {toma.taken ? '✅ Tomado' : '❌ No tomado'}
                </p>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
