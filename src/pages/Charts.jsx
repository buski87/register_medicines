// src/pages/Charts.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import HealthCharts from '../components/HealthCharts';

const Charts = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const [history, setHistory] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const chartRef = useRef(null);

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

  const isDateInRange = (dateStr) => {
    if (!startDate && !endDate) return true;
    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  };

  const filteredHistory = history.filter((entry) => isDateInRange(entry.date));

  const exportAsImageOrPDF = async (type = 'png') => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    if (type === 'png') {
      const link = document.createElement('a');
      link.download = 'graficas.png';
      link.href = canvas.toDataURL();
      link.click();
    } else if (type === 'pdf') {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('graficas.pdf');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📊 Gráficas de seguimiento</h1>
        <button
          onClick={() => (window.location.href = '/history')}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Volver al historial
        </button>
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

        <div className="flex gap-2 mt-4 md:mt-6">
          <button
            onClick={() => exportAsImageOrPDF('png')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Exportar PNG
          </button>
          <button
            onClick={() => exportAsImageOrPDF('pdf')}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {filteredHistory.length > 0 ? (
        <div ref={chartRef}>
          <HealthCharts data={filteredHistory} />
        </div>
      ) : (
        <p className="text-gray-600">No hay datos disponibles para mostrar gráficas.</p>
      )}
    </div>
  );
};

export default Charts;
