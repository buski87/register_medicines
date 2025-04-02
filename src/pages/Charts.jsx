import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HealthCharts from '../components/HealthCharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Charts = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const chartsRef = useRef(null); // Referencia para capturar las gráficas

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

  const downloadAsImage = async () => {
    if (!chartsRef.current) return;
    const canvas = await html2canvas(chartsRef.current);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'charts.png';
    link.click();
  };

  const downloadAsPDF = async () => {
    if (!chartsRef.current) return;
    const canvas = await html2canvas(chartsRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('charts.pdf');
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6 bg-gray-100 dark:bg-gray-900 dark:text-white rounded-lg shadow-lg">
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">📊 Gráficas de seguimiento</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/history')} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Ver Historial
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
        <div className="flex justify-end gap-4 mb-4">
          <button 
            onClick={downloadAsImage} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Descargar como Imagen
          </button>
          <button 
            onClick={downloadAsPDF} 
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-all"
          >
            Descargar como PDF
          </button>
        </div>

        <div ref={chartsRef}>
          {history.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No hay registros disponibles para mostrar gráficas.</p>
          ) : (
            <HealthCharts data={history} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
