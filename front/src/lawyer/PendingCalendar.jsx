import React, { useState } from 'react';

// Genera los días del mes actual
const generateDays = (year, month) => {
  const days = [];
  const date = new Date(year, month, 1);
  const firstDay = date.getDay(); // 0 (domingo) a 6 (sábado)
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Relleno inicial vacío
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Días reales
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  return days;
};

const PendingCalendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const days = generateDays(year, month);

  // Eventos simulados
  const events = {
    '2025-07-30': 'Reunión con cliente',
    '2025-08-02': 'Audiencia judicial',
    '2025-08-05': 'Entrega de informe',
  };

  const getEvent = (day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events[key];
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrev} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">←</button>
        <h2 className="text-xl font-bold">{monthNames[month]} {year}</h2>
        <button onClick={handleNext} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">→</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((d) => (
          <div key={d} className="font-semibold">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`h-20 border rounded p-1 text-left ${
              day ? 'bg-gray-50' : 'bg-transparent'
            }`}
          >
            {day && (
              <>
                <div className="text-xs font-bold">{day}</div>
                {getEvent(day) && (
                  <div className="mt-1 text-xs bg-blue-100 text-blue-800 rounded px-1">
                    {getEvent(day)}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingCalendar;



