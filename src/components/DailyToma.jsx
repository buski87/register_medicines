import { useState, useEffect } from 'react';

const DailyToma = ({ medications, userEmail }) => {
  const today = new Date().toISOString().split('T')[0];
  const key = `tomas_${userEmail}_${today}`;

  const [tomas, setTomas] = useState(() => {
    return JSON.parse(localStorage.getItem(key)) || [];
  });

  const handleMark = (medId, time, taken) => {
    const updated = [...tomas.filter(t => !(t.medId === medId && t.time === time)), {
      medId,
      time,
      taken,
      timestamp: new Date().toISOString(),
    }];
    setTomas(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const isTaken = (medId, time) =>
    tomas.find(t => t.medId === medId && t.time === time)?.taken;

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Tomas de hoy ({today})</h2>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Medicamento</th>
            <th>Mañana</th>
            <th>Mediodía</th>
            <th>Noche</th>
          </tr>
        </thead>
        <tbody>
          {medications.map((med) => (
            <tr key={med.id}>
              <td>{med.name}</td>
              {['morning', 'noon', 'night'].map((time) => (
                <td key={time} className="text-center">
                  {med.frequency.includes(time) ? (
                    <button
                      className={`px-2 py-1 rounded text-white ${
                        isTaken(med.id, time) ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                      onClick={() => handleMark(med.id, time, !isTaken(med.id, time))}
                    >
                      {isTaken(med.id, time) ? '✓' : 'Marcar'}
                    </button>
                  ) : (
                    '-'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyToma;
