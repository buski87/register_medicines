import { useState } from 'react';

const MedicationForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [frequency, setFrequency] = useState({
    morning: false,
    noon: false,
    night: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !dose || !Object.values(frequency).includes(true)) {
      alert('Completa todos los campos');
      return;
    }

    const newMed = {
      id: crypto.randomUUID(),
      name,
      dose,
      frequency: Object.keys(frequency).filter((key) => frequency[key]),
    };

    onAdd(newMed);
    setName('');
    setDose('');
    setFrequency({ morning: false, noon: false, night: false });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Añadir Medicamento</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        type="text"
        placeholder="Nombre del medicamento"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        type="text"
        placeholder="Dosis (ej: 10mg)"
        value={dose}
        onChange={(e) => setDose(e.target.value)}
      />
      <div className="flex gap-4 mb-4">
        {['morning', 'noon', 'night'].map((time) => (
          <label key={time} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={frequency[time]}
              onChange={() =>
                setFrequency({ ...frequency, [time]: !frequency[time] })
              }
            />
            {time === 'morning' ? 'Mañana' : time === 'noon' ? 'Mediodía' : 'Noche'}
          </label>
        ))}
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Guardar
      </button>
    </form>
  );
};

export default MedicationForm;
