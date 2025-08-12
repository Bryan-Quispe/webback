import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Trash2, Edit, Bell, BellRing, X } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('es');

const ReminderList = () => {
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    dateTime: '',
    activeFlag: true,
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUpcoming, setHasUpcoming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(null);
  const toastRefs = useRef({});
  const token = localStorage.getItem('token');
  
  // Añadido: referencia para los recordatorios
  const remindersRef = useRef(reminders);

  // Actualizar referencia de recordatorios
  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  // Cargar recordatorios al inicio
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await axios.get('https://webback-x353.onrender.com/legalsystem/reminders');
        setReminders(res.data);
        checkUpcomingReminders(res.data);
      } catch (err) {
        console.error('Error fetching reminders', err);
      }
    };

    fetchReminders();
    
    // Verificar cada minuto
    const interval = setInterval(() => {
      checkUpcomingReminders(remindersRef.current);
    }, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Verificar recordatorios próximos
  const checkUpcomingReminders = (remindersList) => {
    const now = dayjs();
    let hasUpcomingFlag = false;
    const newNotifications = [];
    
    // Manejo correcto de localStorage
    const storedData = localStorage.getItem('notifiedReminders');
    const notifiedIds = storedData ? JSON.parse(storedData) : [];

    remindersList.forEach((r) => {
      if (!r.activeFlag || notifiedIds.includes(r.reminderId)) return;
      
      const reminderDate = dayjs(r.dateTime);
      const daysDiff = reminderDate.diff(now, 'day');
      const hoursDiff = reminderDate.diff(now, 'hour');
      
      if (daysDiff === 1 || daysDiff === 7) {
        const message = daysDiff === 1 
          ? `⚠️ "${r.title}" vence mañana!` 
          : `📅 "${r.title}" vence en una semana!`;
        
        newNotifications.push({
          id: Date.now() + r.reminderId,
          reminderId: r.reminderId,
          message,
          timestamp: new Date(),
          type: 'urgent'
        });
        
        hasUpcomingFlag = true;
        
        // Registrar como notificado
        const updatedNotifiedIds = [...new Set([...notifiedIds, r.reminderId])];
        localStorage.setItem('notifiedReminders', JSON.stringify(updatedNotifiedIds));
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications]);
      setHasUpcoming(true);
      
      // Reproducir sonido de notificación
      if (!isMuted && audioRef.current) {
        audioRef.current.play().catch(e => console.log("Error playing sound:", e));
      }
      
      // Mostrar notificación del navegador
      if (Notification.permission === 'granted') {
        newNotifications.forEach(notif => {
          new Notification('Recordatorio Próximo', {
            body: notif.message,
            icon: '/notification-icon.png',
            requireInteraction: true
          });
        });
      }
    }
  };

  // Solicitar permisos de notificación
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Este navegador no soporta notificaciones");
      return;
    }
    
    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("Permisos para notificaciones concedidos");
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Rellenar formulario para editar
  const handleEdit = (reminder) => {
    // Formatear fecha correctamente para input datetime-local
    const formattedDateTime = dayjs(reminder.dateTime).format('YYYY-MM-DDTHH:mm');
    
    setFormData({
      title: reminder.title,
      dateTime: formattedDateTime,
      activeFlag: reminder.activeFlag,
    });
    setEditingId(reminder.reminderId);
  };

  // Borrar recordatorio
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://webback-x353.onrender.com/legalsystem/reminder/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReminders((prev) => prev.filter((r) => r.reminderId !== id));
      setNotifications(prev => prev.filter(n => n.reminderId !== id));
    } catch (err) {
      console.error('Error deleting reminder', err);
    }
  };

  // Crear o actualizar recordatorio
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      dateTime: new Date(formData.dateTime),
      activeFlag: formData.activeFlag,
    };

    try {
      if (editingId) {
        // Actualizar
        const res = await axios.put(
          `https://webback-x353.onrender.com/legalsystem/reminder/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Actualizar la lista de recordatorios
        setReminders(prev =>
          prev.map(r => r.reminderId === editingId ? res.data : r)
        );
      } else {
        // Crear
        const res = await axios.post(
          'https://webback-x353.onrender.com/legalsystem/reminder',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReminders(prev => [...prev, res.data]);
      }

      // Reiniciar formulario
      setFormData({ title: '', dateTime: '', activeFlag: true });
      setEditingId(null);
    } catch (err) {
      console.error('Error saving reminder', err);
      alert('Error al guardar el recordatorio: ' + (err.response?.data?.message || err.message));
    }
  };

  // Obtener alerta de proximidad
  const getProximityAlert = (dateTime) => {
    const now = dayjs();
    const reminderDate = dayjs(dateTime);
    
    if (reminderDate.isBefore(now)) return null;
    
    const daysDiff = reminderDate.diff(now, 'day');
    
    if (daysDiff === 1) return '⚠️ Falta 1 día!';
    if (daysDiff === 7) return '📅 Falta 1 semana!';
    return null;
  };

  // Limpiar notificaciones
  const clearNotifications = () => {
    setNotifications([]);
    setHasUpcoming(false);
    localStorage.removeItem('notifiedReminders');
  };

  // Eliminar notificación individual
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Manejar cierre de toast
  const handleToastClose = (id) => {
    // Usar ref para manejar la animación de salida
    if (toastRefs.current[id]) {
      toastRefs.current[id].classList.add('animate-fadeOut');
      
      // Eliminar después de la animación
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1a3a] to-[#1C2C54] text-white p-4">
      {/* Audio para notificaciones */}
      <audio ref={audioRef} src="/notification.mp3" />
      
      <div className="max-w-3xl mx-auto bg-[#1C2C54] p-6 rounded-xl shadow-2xl relative">
        {/* Encabezado con controles de sonido */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BellRing className="text-yellow-400" size={28} />
              Gestor de Recordatorios
            </h1>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="ml-4 p-2 rounded-full bg-[#2a3d75] hover:bg-[#3a4d95]"
              title={isMuted ? "Activar sonido" : "Desactivar sonido"}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
          
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full bg-[#2a3d75] hover:bg-[#3a4d95]"
          >
            <Bell size={24} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* Panel de notificaciones */}
        {showNotifications && (
          <div className="absolute top-16 right-0 bg-white text-gray-800 rounded-lg shadow-xl z-20 w-80 max-h-96 overflow-y-auto border border-gray-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold flex items-center gap-2">
                <BellRing size={18} className="text-blue-500" />
                Notificaciones
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={clearNotifications}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  Limpiar todo
                </button>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Bell size={40} className="text-gray-300 mb-2" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <ul>
                {notifications.map((notif) => (
                  <li 
                    key={notif.id}
                    className={`p-4 border-b hover:bg-gray-50 flex items-start gap-3 ${
                      notif.type === 'urgent' ? 'bg-red-50' : 'bg-yellow-50'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      notif.type === 'urgent' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <BellRing 
                        size={18} 
                        className={notif.type === 'urgent' ? 'text-red-500' : 'text-yellow-500'} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">{notif.message}</p>
                        <button 
                          onClick={() => removeNotification(notif.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {dayjs(notif.timestamp).format('DD/MM/YYYY h:mm a')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Formulario de recordatorios */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-blue-200 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit size={20} /> Editar Recordatorio
              </>
            ) : (
              <>
                <Bell size={20} /> Nuevo Recordatorio
              </>
            )}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-blue-100 mb-1">Título del recordatorio *</label>
              <input
                type="text"
                name="title"
                placeholder="Ej: Reunión con cliente"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-blue-100 mb-1">Fecha y hora *</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="activeFlag"
                checked={formData.activeFlag}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-blue-100">Activar recordatorio</label>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
              >
                {editingId ? 'Actualizar' : 'Agregar'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: '', dateTime: '', activeFlag: true });
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de recordatorios */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-200 flex items-center gap-2">
            <BellRing size={20} /> Recordatorios Activos
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2">
              {reminders.filter(r => r.activeFlag).length}
            </span>
          </h2>
          
          {reminders.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <Bell size={40} className="mx-auto text-blue-300 mb-3" />
              <p className="text-blue-200">No hay recordatorios creados</p>
              <p className="text-sm text-blue-300 mt-2">Agrega tu primer recordatorio usando el formulario</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders
                .filter(r => r.activeFlag)
                .map((r) => {
                  const alert = getProximityAlert(r.dateTime);
                  const daysLeft = dayjs(r.dateTime).diff(dayjs(), 'day');
                  
                  return (
                    <div
                      key={r.reminderId}
                      className={`bg-gradient-to-r ${
                        daysLeft < 0 
                          ? 'from-red-900/30 to-red-800/20' 
                          : daysLeft <= 1 
                            ? 'from-orange-900/30 to-orange-800/20' 
                            : daysLeft <= 3 
                              ? 'from-yellow-900/30 to-yellow-800/20' 
                              : 'from-green-900/30 to-green-800/20'
                      } border border-white/10 rounded-xl p-5`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="bg-white/10 p-2 rounded-lg">
                              <Bell size={20} className="text-blue-300" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-white">{r.title}</h3>
                              <p className="text-blue-200 mt-1">
                                {dayjs(r.dateTime).format('dddd, D [de] MMMM [de] YYYY [a las] h:mm a')}
                              </p>
                              
                              {alert && (
                                <div className="mt-2 inline-flex items-center gap-2 bg-red-900/50 px-3 py-1 rounded-full">
                                  <Bell size={16} className="text-red-300" />
                                  <span className="text-red-200 font-medium">{alert}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(r)}
                            className="bg-blue-600/50 hover:bg-blue-700/50 p-2 rounded-lg border border-blue-500/30"
                            title="Editar"
                          >
                            <Edit size={18} className="text-blue-200" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.reminderId)}
                            className="bg-red-600/50 hover:bg-red-700/50 p-2 rounded-lg border border-red-500/30"
                            title="Eliminar"
                          >
                            <Trash2 size={18} className="text-red-200" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center">
                        <div className="flex-1 bg-black/20 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              daysLeft < 0 
                                ? 'bg-red-500' 
                                : daysLeft <= 1 
                                  ? 'bg-orange-500' 
                                  : daysLeft <= 3 
                                    ? 'bg-yellow-500' 
                                    : 'bg-green-500'
                            }`}
                            style={{ 
                              width: daysLeft < 0 
                                ? '100%' 
                                : `${Math.min(100, 100 - (daysLeft / 30) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className="ml-3 text-xs text-blue-300">
                          {daysLeft < 0 
                            ? 'Vencido' 
                            : `${daysLeft} día${daysLeft !== 1 ? 's' : ''} restante${daysLeft !== 1 ? 's' : ''}`
                          }
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.slice(0, 3).map((notif) => (
          <div 
            key={notif.id}
            ref={el => toastRefs.current[notif.id] = el}
            className={`bg-gradient-to-r ${
              notif.type === 'urgent' 
                ? 'from-red-600 to-orange-600' 
                : 'from-yellow-600 to-amber-600'
            } text-white shadow-xl rounded-lg p-4 w-80 animate-fadeIn`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                notif.type === 'urgent' ? 'bg-red-700' : 'bg-yellow-700'
              }`}>
                <BellRing size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{notif.message}</p>
                <p className="text-xs text-white/80 mt-1">
                  {dayjs(notif.timestamp).format('h:mm a')}
                </p>
              </div>
              <button 
                onClick={() => handleToastClose(notif.id)}
                className="text-white/70 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Solicitud de permisos */}
      {Notification.permission === 'default' && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-white p-4 rounded-xl shadow-xl max-w-xs border border-amber-400/30">
          <div className="flex items-start gap-3">
            <BellRing size={24} className="text-white flex-shrink-0" />
            <div>
              <p className="font-medium">Activar notificaciones</p>
              <p className="text-sm mb-3">Recibe alertas de recordatorios importantes</p>
              <button
                onClick={() => Notification.requestPermission()}
                className="bg-white text-yellow-700 px-4 py-1 rounded-lg font-medium hover:bg-gray-100"
              >
                Permitir notificaciones
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animaciones CSS para los toasts */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ReminderList;







