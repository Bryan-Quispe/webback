import { useEffect, useRef } from 'react';
import { useState, createContext } from 'react'
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom';
import NavBarMain from '../components/NavBarMain.jsx';
import { useAlert } from '../components/alerts/alertElement.jsx';
import LawyerFooter from '../components/LawyerFooter.jsx';
import '../App.css'
import CaseNavBar from '../components/NavBarCase.jsx';

export default function LayoutLawyer() {
    const {showAlert}=useAlert();
    const timeoutRef= useRef(null);
    const [caseSelected, setCaseSelected]=useState(false);
    const [selectedCaseId, setSelectedCaseId] =useState(0);

    const handleSetSelected=(state) => setCaseSelected(state);
    const handleSetSelectedId=(state) => setSelectedCaseId(state);
    const contextSelectedCase={
      handleSetSelected,
      handleSetSelectedId
    };

  useEffect(() => {
    const limit_time = 5 * 60 * 1000;
    const warning_time = 4.5 * 60 * 1000;

    const sessionEnd = () => {
      localStorage.clear();
      showAlert('Ha estado mucho tiempo inactivo. Su sesión se ha cerrado.', 'info');
      window.location.assign('../../login'); 
    };

    const restartCount = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(sessionEnd, limit_time);
    };

    restartCount();

    const nonIdleEvents = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    nonIdleEvents.forEach(e => document.addEventListener(e, restartCount));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      nonIdleEvents.forEach(e => document.removeEventListener(e, restartCount));
    };
  }, []);


  if(!localStorage.token)
  {
    window.location.href='../unauthorized';
  }
  else{
    return (
    <>
    <div className='container flex flex-col min-h-screen min-w-screen'>
      <NavBarMain />
        {(caseSelected) ? <CaseNavBar caseId={selectedCaseId}/> : <div></div> }
        <main className='pt-5 overflow-auto min-h-screen '>
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




