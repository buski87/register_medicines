import { useState } from 'react';

const MedicationList = ({ meds, onUpdate, onDelete }) => {
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    dose: '',
    frequency: [],
  });

  const startEdit = (med) => {
    setEditId(med.id);
    setEditForm({
      name: med.name,
      dose: med.dose,
      frequency: med.frequency,
    });
  };

  const handleCheckbox = (time) => {
    setEditForm((prev) => ({
      ...prev,
      frequency: prev.frequency.includes(time)
        ? prev.frequency.filter((f) => f !== time)
        : [...prev.frequency, time],
    }));
  };

  const handleSave = () => {
    onUpdate(editId, editForm);
    setEditId(null);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Tus Medicamentos</h2>

      {meds.length === 0 ? (
        <p>No hay medicamentos guardados.</p>
      ) : (
        <ul className="space-y-4">
          {meds.map((med) => (
            <li key={med.id} className="border p-3 rounded">
              {editId === med.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border p-1 rounded"
                  />
                  <input
                    type="text"
                    value={editForm.dose}
                    onChange={(e) => setEditForm({ ...editForm, dose: e.target.value })}
                    className="w-full border p-1 rounded"
                  />
                  <div className="flex gap-4">
                    {['morning', 'noon', 'night'].map((time) => (
                      <label key={time} className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={editForm.frequency.includes(time)}
                          onChange={() => handleCheckbox(time)}
                        />
                        {time === 'morning' ? 'Mañana' : time === 'noon' ? 'Mediodía' : 'Noche'}
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleSave}>
                      Guardar
                    </button>
                    <button className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditId(null)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{med.name}</strong> – {med.dose}
                    <div className="text-sm text-gray-600">
                      Frecuencia: {med.frequency.map((f) =>
                        f === 'morning' ? 'Mañana' : f === 'noon' ? 'Mediodía' : 'Noche'
                      ).join(', ')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => startEdit(med)}
                    >
                      Editar
                    </button>
                    <button
                      className="text-sm bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => onDelete(med.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicationList;
