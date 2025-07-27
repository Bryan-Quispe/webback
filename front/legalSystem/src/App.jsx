import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx'
import Appointments from './pages/appointments.jsx'
import LayoutLawyer from './layouts/layoutLawyer.jsx';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LayoutLawyer/>}>
          <Route path='/dashboard' element={<Dashboard/>}></Route>
          <Route path='/appointments' element={<Appointments/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
