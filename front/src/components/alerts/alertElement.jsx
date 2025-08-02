import * as React from 'react';
import { createContext, useContext, useState, useRef } from 'react';
import * as Icons from 'react-bootstrap-icons';

const AlertContext = createContext(null);

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({children}){
    const [alert, setAlert] = useState({ message: '', type: 'info', visible: false });
    const timerRef = useRef(null);

    const showAlert = (message, type, duration = 5000) => {
        setAlert({ message, type, visible: true });

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setAlert(prev => ({ ...prev, visible: false }));
    }, duration);
  };
  
    return(
        <>
      <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert.visible && (
        <div className={`fixed top-4 w-fit left-1/2 px-4 py-3 z-50 h-fit rounded shadow-lg text-white
          ${alert.type === 'error' ? 'bg-red-500' :
            alert.type === 'success' ? 'bg-green-500' :
            'bg-blue-500'}`}>
            {(alert.type === 'error')? <Icons.XCircle className='inline-block h-6 w-6 me-4'/> 
            : (alert.type === 'success') ? <Icons.CheckCircle className='inline-block h-6 w-6 me-4'/> : 
            <Icons.InfoCircle className='inline-block h-6 w-6 me-4'/> }
          {alert.message}
        </div>
      )}
    </AlertContext.Provider>
        </>
    )
}