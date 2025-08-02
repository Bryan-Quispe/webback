import { useEffect, useRef } from 'react';
import { useState, createContext } from 'react'
import { BrowserRouter, Outlet, Route, Router, Routes, Navigate } from 'react-router-dom';
import NavBarMain from '../components/NavBarMain.jsx';
import { useAlert } from '../components/alerts/alertElement.jsx';
import LawyerFooter from '../components/LawyerFooter.jsx';
import '../App.css'
import CaseNavBar from '../components/NavBarCase.jsx';

export default function LayoutLawyer() {
    const {showAlert}=useAlert();
    const limit_time = 5 * 60 * 1000;
    const warning_time = limit_time-(20*1000);
    const remainingTime=useRef(0);
    const timeoutRef= useRef(null);
    const warningTimeoutRef=useRef(null);
    const [caseSelected, setCaseSelected]=useState(false);
    const [selectedCaseId, setSelectedCaseId] =useState(0);
    const [inactivityWarning, setInactivityWarning]=useState(false);
    const handleSetSelected=(state) => setCaseSelected(state);
    const handleSetSelectedId=(state) => setSelectedCaseId(state);

    const warning_visble=(inactivityWarning) ? "" : "hidden";
    const contextSelectedCase={
      handleSetSelected,
      handleSetSelectedId
    };

    const sessionEnd = () => {
      setInactivityWarning(false);
      localStorage.clear();
      showAlert('Ha estado mucho tiempo inactivo. Su sesión se ha cerrado.', 'info');
      window.location.assign('../../login'); 
    };

    const sessionClose = () => {
      localStorage.clear();
      window.location.assign('../../login'); 
    };
    
    const countTimer=useRef(null);

    const restartCount = () => {
      if (inactivityWarning) return;
      if (timeoutRef.current) 
        {
          clearTimeout(timeoutRef.current);
        }
      if(warningTimeoutRef.current)
        {
          clearTimeout(warningTimeoutRef.current);
        }
      timeoutRef.current = setTimeout(sessionEnd, limit_time);
      warningTimeoutRef.current = setTimeout(activateWarning, warning_time);
    };

    const extendSession=()=>{
      restartCount();
      setInactivityWarning(false);
    }

    const activateWarning = () =>{
      console.log('Warning: session about to end');
      setInactivityWarning(true);
    };

    const count = () =>{
        remainingTime.current=remainingTime-1000;
        if(countTimer.current) clearTimeout(countTimer.current);
        countTimer.current=setTimeout(count,1000);   
    }

  useEffect(() => {

    restartCount();

    const handleActivity = () => {
      if (!inactivityWarning) {
        restartCount();
      }
    };

    const nonIdleEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    nonIdleEvents.forEach(e => document.addEventListener(e, handleActivity));


    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      nonIdleEvents.forEach((e) => document.removeEventListener(e, handleActivity));
    };
  }, []);


  if(!localStorage.token)
  {
    window.location.href='../unauthorized';
  }
  else{
    return (
    <>
    {inactivityWarning && (
  <div className="fixed inset-0  z-40"></div>
  )}
  <div className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-50 ${warning_visble} flex flex-col items-center p-4 bg-amber-200 text-amber-700 shadow-lg rounded`}>
    <p className='mb-4'>Su sesión está por caducar debido a inactividad. ¿Desea extender su sesión?</p>
    <div className="flex space-x-4">
      <button className="bg-amber-800 text-white px-4 py-2 rounded" onClick={extendSession}>
        Extender
      </button>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={sessionClose}>
        Salir
      </button>
    </div>
  </div>
    <div className='container flex flex-col min-h-screen min-w-screen'>
      <NavBarMain />
        {(caseSelected) ? <CaseNavBar caseId={selectedCaseId}/> : <div></div> }
        <main className='pt-5 overflow-auto min-h-screen'>
            <Outlet context={contextSelectedCase}/>
        </main>
      <footer className='relative bottom-0'>
          <LawyerFooter/>
        </footer>
    </div>
    </>
  );
  }
}




