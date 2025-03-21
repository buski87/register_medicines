import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MedicationForm from '../components/MedicationForm';
import MedicationList from '../components/MedicationList';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const [medications, setMedications] = useState([]);

  // Cargar medicamentos del usuario al cargar
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`meds_${user.email}`)) || [];
    setMedications(stored);
  }, [user.email]);

  // Añadir y guardar nuevo medicamento
  const handleAddMedication = (med) => {
    const updated = [...medications, med];
    setMedications(updated);
    localStorage.setItem(`meds_${user.email}`, JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hola, {user.email}</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <MedicationForm onAdd={handleAddMedication} />
      <MedicationList meds={medications} />
    </div>
  );
};

export default Dashboard;
