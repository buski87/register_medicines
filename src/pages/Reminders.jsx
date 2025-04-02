import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reminders = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [repeat, setRepeat] = useState('Nunca');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) navigate('/login');

    const userEmail = user.email;
    const storedReminders = JSON.parse(localStorage.getItem(`reminders_${userEmail}`)) || [];
    const storedMedications = JSON.parse(localStorage.getItem(`meds_${userEmail}`)) || [];
    
    setReminders(storedReminders);
    setMedications(storedMedications);

    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    // Revisar cada minuto los recordatorios
    const interval = setInterval(checkReminders, 60000); // Revisa cada minuto
    return () => clearInterval(interval);
  }, [navigate]);

  // Función para revisar los recordatorios
  const checkReminders = () => {
    const now = new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5); // Formato HH:MM
    console.log("Hora actual: ", now); // Log para ver la hora actual
    reminders.forEach((reminder) => {
      console.log("Comparando con recordatorio: ", reminder.time); // Log para ver los tiempos de los recordatorios

      // Verificar si el recordatorio debe activarse
      if (reminder.time === now && !reminder.completed) {
        console.log(`Recordatorio activado: ${reminder.name} a las ${reminder.time}`);
        alert(`🔔 Recordatorio: ${reminder.name} - ${reminder.description}`);
        showNotification(reminder); // Llamada para mostrar la notificación
        reminder.completed = true; // Marca como completado
        const updatedReminders = [...reminders]; // Copia de los recordatorios
        saveReminders(updatedReminders); // Guarda la lista actualizada de recordatorios
      }
    });
  };

  // Función para mostrar notificaciones
  const showNotification = (reminder) => {
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        const medsList = reminder.meds
          .map((medId) => {
            const med = medications.find((med) => med.id === medId);
            return med ? med.name : null;
          })
          .filter(Boolean)
          .join(", ");

        registration.showNotification(`💊 Recordatorio: ${reminder.name}`, {
          body: `Descripción: ${reminder.description} - Medicamentos: ${medsList || 'Ninguno'}`,
          icon: '/path-to-your-icon.png', // Asegúrate de tener un ícono
          tag: reminder.name,
        });
      });
    } else {
      console.log("Permiso de notificación no concedido");
    }
  };

  const saveReminders = (updatedReminders) => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) return;
    
    localStorage.setItem(`reminders_${user.email}`, JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  };

  const addOrUpdateReminder = () => {
    if (!name || !time) return;

    const newReminder = { 
      name, 
      description, 
      time, 
      repeat,
      meds: selectedMeds,
      completed: false, // Asegúrate de que cada nuevo recordatorio tenga esta propiedad
    };

    let updatedReminders;

    if (editingIndex !== null) {
      updatedReminders = reminders.map((reminder, index) => index === editingIndex ? newReminder : reminder);
      setEditingIndex(null);
    } else {
      updatedReminders = [...reminders, newReminder];
    }

    saveReminders(updatedReminders);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setTime('');
    setRepeat('Nunca');
    setSelectedMeds([]);
    setEditingIndex(null);
  };

  const editReminder = (index) => {
    const reminder = reminders[index];
    setName(reminder.name);
    setDescription(reminder.description);
    setTime(reminder.time);
    setRepeat(reminder.repeat);
    setSelectedMeds(reminder.meds || []);
    setEditingIndex(index);
  };

  const deleteReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    saveReminders(updatedReminders);
  };

  const handleMedSelection = (e) => {
    const medId = e.target.value;
    if (medId && !selectedMeds.includes(medId)) {
      setSelectedMeds([...selectedMeds, medId]);
    }
  };

  const removeMed = (medId) => {
    setSelectedMeds(selectedMeds.filter((id) => id !== medId));
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6 bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recordatorios</h1>
        <button 
          onClick={() => navigate('/')} 
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Volver al Dashboard
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 space-y-4 bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Listado de Recordatorios</h2>
          {reminders.length === 0 ? (
            <p>No hay recordatorios configurados.</p>
          ) : (
            reminders.map((reminder, index) => (
              <div key={index} className="p-4 border rounded mb-4">
                <div>
                  <strong>{reminder.name}</strong> - {reminder.time} - {reminder.repeat}
                  <br />
                  Descripción: {reminder.description}
                  <br />
                  Medicamentos Asociados: 
                  <ul>
                    {reminder.meds.map((medId) => {
                      const med = medications.find(med => med.id === medId);
                      return med ? <li key={medId}>{med.name}</li> : null;
                    })}
                  </ul>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => editReminder(index)} className="bg-yellow-500 text-white px-4 py-1 rounded">Editar</button>
                  <button onClick={() => deleteReminder(index)} className="bg-red-500 text-white px-4 py-1 rounded">Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="md:w-1/2 bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">{editingIndex !== null ? 'Editar Recordatorio' : 'Añadir Recordatorio'}</h2>
          <input id="reminderName" name="reminderName" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="p-2 border rounded mb-2 w-full" />
          <input id="reminderDescription" name="reminderDescription" type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" className="p-2 border rounded mb-2 w-full" />
          <input id="reminderTime" name="reminderTime" type="time" value={time} onChange={e => setTime(e.target.value)} className="p-2 border rounded mb-2 w-full" />
          <select id="reminderRepeat" name="reminderRepeat" value={repeat} onChange={e => setRepeat(e.target.value)} className="p-2 border rounded mb-2 w-full">
            <option value="Nunca">Nunca</option>
            <option value="Diario">Diario</option>
            <option value="Semanal">Semanal</option>
            <option value="Mensual">Mensual</option>
          </select>
          <select id="medicationSelection" name="medicationSelection" onChange={handleMedSelection} className="p-2 border rounded mb-2 w-full">
            <option value="">Seleccionar Medicamento</option>
            {medications.map((med) => (
              <option key={med.id} value={med.id}>{med.name}</option>
            ))}
          </select>
          <ul>
            {selectedMeds.map((medId) => {
              const med = medications.find(med => med.id === medId);
              return med ? <li key={medId}>{med.name} <button onClick={() => removeMed(medId)}>❌</button></li> : null;
            })}
          </ul>
          <button 
            onClick={addOrUpdateReminder} 
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
          >
            {editingIndex !== null ? 'Actualizar Recordatorio' : 'Guardar Recordatorio'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
