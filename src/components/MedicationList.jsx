const MedicationList = ({ meds }) => {
    if (meds.length === 0) return <p>No hay medicamentos guardados.</p>;
  
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Tus Medicamentos</h2>
        <ul className="space-y-2">
          {meds.map((med) => (
            <li key={med.id} className="border p-2 rounded">
              <strong>{med.name}</strong> – {med.dose}  
              <div className="text-sm text-gray-600">
                Toma: {med.frequency.map((f) =>
                  f === 'morning' ? 'Mañana' : f === 'noon' ? 'Mediodía' : 'Noche'
                ).join(', ')}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default MedicationList;
  