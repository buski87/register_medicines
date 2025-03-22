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
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hola, {user.email}</h1>
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

      <DailyToma medications={medications} userEmail={user.email} />
      <VitalSignsForm userEmail={user.email} />
      <MedicationForm onAdd={handleAddMedication} />
      <MedicationList
        meds={medications}
        onUpdate={handleUpdateMedication}
        onDelete={handleDeleteMedication}
      />
    </div>
  );
};

export default Dashboard;
