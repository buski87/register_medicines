import {
    Line
  } from 'react-chartjs-2';
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  const HealthCharts = ({ data }) => {
    const labels = data.map((entry) => entry.date);
  
    const weightData = {
      labels,
      datasets: [
        {
          label: 'Peso (kg)',
          data: data.map((entry) => entry.vitals?.weight || null),
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.3,
        },
      ],
    };
  
    const pressureData = {
      labels,
      datasets: [
        {
          label: 'Sistólica',
          data: data.map((entry) => entry.vitals?.systolic || null),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.3,
        },
        {
          label: 'Diastólica',
          data: data.map((entry) => entry.vitals?.diastolic || null),
          borderColor: 'rgb(255, 159, 64)',
          tension: 0.3,
        },
      ],
    };
  
    const pulseData = {
      labels,
      datasets: [
        {
          label: 'Pulsaciones (bpm)',
          data: data.map((entry) => entry.vitals?.pulse || null),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.3,
        },
      ],
    };
  
    return (
      <div className="space-y-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2">📈 Evolución del peso</h3>
          <Line data={weightData} />
        </div>
        <div>
          <h3 className="font-semibold mb-2">📊 Presión arterial</h3>
          <Line data={pressureData} />
        </div>
        <div>
          <h3 className="font-semibold mb-2">❤️ Pulsaciones</h3>
          <Line data={pulseData} />
        </div>
      </div>
    );
  };
  
  export default HealthCharts;
  