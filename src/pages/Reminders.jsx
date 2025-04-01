import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reminders = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [repeat, setRepeat] = useState('Nunca');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) navigate('/login');

    const storedReminders = JSON.parse(localStorage.getItem(`reminders_${user.email}`)) || [];
    setReminders(storedReminders);
  }, [navigate]);

  const saveReminders = (updatedReminders) => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    localStorage.setItem(`reminders_${user.email}`, JSON.stringify(updatedReminders));
    setReminders(updatedReminders);
  };

  const addReminder = () => {
    if (!name || !time) return;

    const newReminder = { 
      name, 
      description, 
      time, 
      repeat, 
      completed: false, 
      lastCompleted: null 
    };

    const updatedReminders = [...reminders, newReminder];
    saveReminders(updatedReminders);

    setName('');
    setDescription('');
    setTime('');
    setRepeat('Nunca');
  };

  const toggleComplete = (index) => {
    const updatedReminders = reminders.map((reminder, i) => {
      if (i === index) {
        const now = new Date().toISOString().split('T')[0];
        return { ...reminder, completed: !reminder.completed, lastCompleted: now };
      }
      return reminder;
    });
    saveReminders(updatedReminders);
  };

  const deleteReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    saveReminders(updatedReminders);
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto space-y-6 bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      
      {/* Barra superior con botones */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recordatorios</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
      
      {/* Contenedor principal con dos columnas */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Columna izquierda - Listado de recordatorios */}
        <div className="md:w-1/2 space-y-4 bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Listado de Recordatorios</h2>
          {reminders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No hay recordatorios configurados.</p>
          ) : (
            reminders.map((reminder, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded ${reminder.completed ? 'bg-green-200 dark:bg-green-700' : 'bg-gray-200 dark:bg-gray-800'} flex justify-between items-center`}
              >
                <div>
                  <strong>{reminder.name}</strong> - {reminder.description || "Sin descripción"} - {reminder.time}
                  <br/>
                  <em>Repetición: {reminder.repeat}</em>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleComplete(index)} 
                    className={`px-4 py-1 rounded ${reminder.completed ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                  >
                    {reminder.completed ? 'Incompleto' : 'Completado'}
                  </button>
                  <button 
                    onClick={() => deleteReminder(index)} 
                    className="bg-gray-500 text-white px-4 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Columna derecha - Formulario de añadir recordatorios */}
        <div className="md:w-1/2 bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Añadir Recordatorio</h2>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre" 
            className="p-2 border rounded mb-2 w-full dark:bg-gray-700 dark:text-white"
          />
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción" 
            className="p-2 border rounded mb-2 w-full dark:bg-gray-700 dark:text-white"
          />
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            className="p-2 border rounded mb-2 w-full dark:bg-gray-700 dark:text-white"
          />
          <select 
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="p-2 border rounded mb-2 w-full dark:bg-gray-700 dark:text-white"
          >
            <option value="Nunca">Nunca</option>
            <option value="Diario">Diario</option>
            <option value="Semanal">Semanal</option>
            <option value="Mensual">Mensual</option>
          </select>
          <button 
            onClick={addReminder} 
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
          >
            Añadir Recordatorio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
