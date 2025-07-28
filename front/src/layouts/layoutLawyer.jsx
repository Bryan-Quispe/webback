import { useState } from 'react'
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom';
import NavBarMain from '../components/NavBarMain.jsx';
import Sidebar from '../components/Sidebar.jsx';
import '../App.css'

export default function LayoutLawyer() {

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




