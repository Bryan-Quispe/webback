import { useEffect, useState } from 'react';
import { useOutletContext} from 'react-router-dom'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ArrowLeft, Trash2, Edit } from 'lucide-react';
import {
  parseISO,
  isAfter,
  isBefore,
  differenceInDays,
  isWithinInterval,
  format,
} from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';

// Paleta de colores cíclica
const COLORS = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#FB923C'];

const calendarContainerStyle = {
  maxWidth: '768px',
  margin: 'auto',
  padding: '1.5rem',
  backgroundColor: '#1C2C54', // azul oscuro
  color: 'white',
  border: '2px solid white',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
};

const eventsListItemStyle = {
  padding: '0.75rem',
  borderLeftWidth: '4px',
  borderRadius: '6px',
  backgroundColor: 'rgba(28, 44, 84, 0.7)', // azul oscuro translúcido
  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
  marginBottom: '0.75rem',
};

const PendingCalendar = () => {
  const { handleSetSelected: isCaseSelected, handleSetSelectedId: setCaseId } = useOutletContext();
  const { caseId } = useParams();
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURI = 'https://webback-x353.onrender.com/legalsystem';
  const navigate = useNavigate();
  useEffect(() => {
    isCaseSelected(true);
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${baseURI}/events/searchByProcess/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al obtener eventos');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [caseId]);

  const getStatus = (start, end) => {
    const now = new Date();
    const startDate = parseISO(start);
    const endDate = end ? parseISO(end) : startDate;

    if (isAfter(startDate, now)) return 'Por iniciar';
    if (isBefore(endDate, now)) return 'Inactivo';
    return 'Activo';
  };

  const getCountdown = (start, end) => {
    const now = new Date();
    const startDate = parseISO(start);
    const endDate = end ? parseISO(end) : startDate;

    if (isAfter(startDate, now)) {
      return `Faltan ${differenceInDays(startDate, now)} días para iniciar`;
    }
    if (isAfter(endDate, now)) {
      return `Finaliza en ${differenceInDays(endDate, now)} días`;
    }
    return `Finalizó hace ${Math.abs(differenceInDays(endDate, now))} días`;
  };

  // Eventos en cierto día
  const getEventsByDate = (date) => {
    return events.filter((ev) => {
      const start = parseISO(ev.dateStart);
      const end = ev.dateEnd ? parseISO(ev.dateEnd) : start;
      return isWithinInterval(date, { start, end });
    });
  };

  // Estilos para los días del calendario
  const calendarStyles = {
    backgroundColor: '#1C2C54',
    color: 'white',
    border: '2px solid white',
    borderRadius: '8px',
    padding: '8px',
    width: '100%',
    boxSizing: 'border-box',
  };

  // Modificación de estilos con clases de react-calendar por JS no es directo,
  // pero podemos usar tileClassName para agregar clases personalizadas y luego usar inline styles por CSS normal.
  // Aquí haremos inline styles para tileContent y seleccionados.

  // Contenido visual por día (puntos de colores)
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const dayEvents = getEventsByDate(date);

    if (dayEvents.length === 0) return null;

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        {dayEvents.map((ev) => {
          const color = COLORS[events.indexOf(ev) % COLORS.length];
          return (
            <div
              key={ev.eventId}
              title={ev.name}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: color,
                margin: '0 1px',
              }}
            />
          );
        })}
      </div>
    );
  };

  // Para personalizar la clase de los tiles y aplicar color blanco, 
  // usamos tileClassName para días normales y días seleccionados
  const tileClassName = ({ date, view, activeStartDate, isActive }) => {
    if (view !== 'month') return '';
    // Seleccionado
    if (date.toDateString() === selectedDate.toDateString()) {
      return 'selected-tile';
    }
    return 'normal-tile';
  };

  if (loading) return <p style={{ color: '#3B82F6' }}>Cargando calendario...</p>;
  if (error) return <p style={{ color: '#DC2626' }}>Error: {error}</p>;

  const eventsForDay = getEventsByDate(selectedDate);

  return (
    <div style={calendarContainerStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'white' }}>
        Calendario de Eventos del Proceso #{caseId}
      </h2>
         <button
        onClick={() => navigate(-1)}
        className="flex items-center text-white hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="mr-2" size={20} />
        Volver
      </button>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        // style no funciona directo en Calendar, se usa className o CSS
        // pero aplicamos style al wrapper div del calendario
        className="custom-calendar"
      />

      <div style={{ marginTop: '1.5rem', color: 'white' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
          Eventos para {format(selectedDate, 'dd/MM/yyyy')}:
        </h3>
        

        {eventsForDay.length === 0 ? (
          <p style={{ color: '#D1D5DB', marginTop: '0.5rem' }}>No hay eventos este día.</p>
        ) : (
          <ul style={{ marginTop: '1rem', listStyle: 'none', paddingLeft: 0 }}>
            {eventsForDay.map((ev) => (
              <li
                key={ev.eventId}
                style={{
                  ...eventsListItemStyle,
                  borderLeftColor: COLORS[events.indexOf(ev) % COLORS.length],
                }}
              >
                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {ev.name}
                </h4>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>{ev.description}</p>
                <p style={{ fontSize: '0.875rem' }}>
                  <strong>Inicio:</strong> {format(parseISO(ev.dateStart), 'dd/MM/yyyy HH:mm')}
                  <br />
                  {ev.dateEnd && (
                    <>
                      <strong>Fin:</strong> {format(parseISO(ev.dateEnd), 'dd/MM/yyyy HH:mm')}
                      <br />
                    </>
                  )}
                  <strong>Estado:</strong> {getStatus(ev.dateStart, ev.dateEnd)}
                  <br />
                  <strong>Cuenta regresiva:</strong> {getCountdown(ev.dateStart, ev.dateEnd)}
                </p>
              </li>
            ))}
          </ul>
        )}
        
        
      </div>
      

      {/* Estilos CSS dentro de JSX para react-calendar (días normales y seleccionado) */}
      <style>{`
        .custom-calendar {
          background-color: #1C2C54 !important;
          color: white !important;
          border: 2px solid white;
          border-radius: 8px;
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }
        .custom-calendar .react-calendar__tile {
          color: white !important;
          border-radius: 6px;
          border: 1px solid transparent;
        }
        .custom-calendar .react-calendar__tile:hover {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          color: white !important;
          border-bottom: 1px solid white;
        }
        .custom-calendar .react-calendar__month-view__days {
          border-top: 1px solid white;
        }
        .custom-calendar button {
          color: white !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer;
        }
        .custom-calendar button:focus {
          outline: 2px solid white !important;
        }
        .custom-calendar button[disabled] {
          color: #6b7280 !important;
        }
        .selected-tile {
          background-color: #2563eb !important;
          color: white !important;
          border-radius: 6px !important;
        }
        .normal-tile {
          /* nada extra */
        }
      `}</style>
    </div>
  );
};

export default PendingCalendar;







