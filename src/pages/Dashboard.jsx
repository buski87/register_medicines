import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicationForm from '../components/MedicationForm';
import MedicationList from '../components/MedicationList';
import DailyToma from '../components/DailyToma';
import VitalSignsForm from '../components/VitalSignsForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const [medications, setMedications] = useState([]);

  // 🌙 Cambiar modo oscuro
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Cargar medicamentos al iniciar
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`meds_${user.email}`)) || [];
    setMedications(stored);
  }, [user.email]);

  // Añadir nuevo medicamento
  const handleAddMedication = (med) => {
    const updated = [...medications, med];
    setMedications(updated);
    localStorage.setItem(`meds_${user.email}`, JSON.stringify(updated));
  };

  // Editar medicamento
  const handleUpdateMedication = (id, updatedData) => {
    const updated = medications.map((med) =>
      med.id === id ? { ...med, ...updatedData } : med
    );
    setMedications(updated);
    localStorage.setItem(`meds_${user.email}`, JSON.stringify(updated));
  };

  // Eliminar medicamento
  const handleDeleteMedication = (id) => {
    const updated = medications.filter((med) => med.id !== id);
    setMedications(updated);
    localStorage.setItem(`meds_${user.email}`, JSON.stringify(updated));
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-white text-black dark:bg-gray-900 dark:text-white rounded shadow">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Hola, {user.email}</h1>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="bg-gray-800 text-white px-4 py-2 rounded dark:bg-yellow-400 dark:text-black"
          >
            Cambiar tema
          </button>
          <button
            onClick={() => navigate('/history')}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Ver historial
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Columna izquierda: listado de medicación + formulario */}
        <div className="md:w-1/3 space-y-6">
          <MedicationList
            meds={medications}
            onUpdate={handleUpdateMedication}
            onDelete={handleDeleteMedication}
          />
          <MedicationForm onAdd={handleAddMedication} />
        </div>

        {/* Columna derecha: contenido principal */}
        <div className="md:w-2/3 space-y-6">
          <DailyToma medications={medications} userEmail={user.email} />
          <VitalSignsForm userEmail={user.email} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
