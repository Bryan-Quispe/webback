import { useState } from 'react'
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom';
import NavBarMain from '../components/NavBarMain.jsx';
import Sidebar from '../components/Sidebar.jsx';
import '../App.css'

export default function LayoutLawyer() {

    const timeoutRef= useRef(null);

  useEffect(() => {
    const limit_time = 5 * 60 * 1000;

    const sessionEnd = () => {
      localStorage.clear();
      alert('Ha estado mucho tiempo inactivo. Su sesión se ha cerrado.');
      window.location.assign('../'); 
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
    <div className='container flex flex-col min-h-screen'>
      <NavBarMain />
      <div className='flex flex-row flex-1 mr-1'>
        <Sidebar/>
        <main className='flex-1 pl-3 overflow-auto'>
            <Outlet />
        </main>
      </div>
    </div>
    </>
  );
  }
}




