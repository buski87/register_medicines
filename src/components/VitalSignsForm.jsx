import { useState, useEffect } from 'react';

const VitalSignsForm = ({ userEmail }) => {
  const today = new Date().toISOString().split('T')[0];
  const key = `vitals_${userEmail}_${today}`;

  const [form, setForm] = useState({
    weight: '',
    systolic: '',
    diastolic: '',
    pulse: '',
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(key));
    if (stored) {
      setForm(stored);
      setSaved(true);
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(key, JSON.stringify(form));
    setSaved(true);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registro de salud de hoy ({today})</h2>

      {saved ? (
        <div>
          <p><strong>Peso:</strong> {form.weight} kg</p>
          <p><strong>Presión:</strong> {form.systolic}/{form.diastolic} mmHg</p>
          <p><strong>Pulsaciones:</strong> {form.pulse} bpm</p>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setSaved(false)}
          >
            Editar registro
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-2">
          <input
            type="number"
            step="0.1"
            name="weight"
            placeholder="Peso (kg)"
            value={form.weight}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="systolic"
            placeholder="Presión sistólica"
            value={form.systolic}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="diastolic"
            placeholder="Presión diastólica"
            value={form.diastolic}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="pulse"
            placeholder="Pulsaciones"
            value={form.pulse}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
            Guardar registro
          </button>
        </form>
      )}
    </div>
  );
};

export default VitalSignsForm;
