<<<<<<< HEAD
import { useState } from 'react'
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx'
import Appointments from './pages/appointments.jsx'
import LoginLayout from './layouts/loginLayout.jsx';
import './App.css'
import LayoutLawyer from './layouts/layoutLawyer.jsx';
import LayoutUnauthorized from './layouts/layoutUnauthorized.jsx';
import AccountData from './pages/accountData.jsx';
=======
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBarMain from './components/NavBarMain.jsx';
import Dashboard from './pages/dashboard.jsx';
import Appointments from './pages/appointments.jsx';
import EvidenciasLectura from './pages/lector/EvidenciasLectura.jsx';
import Lector from './pages/lector/Lector.jsx';
import ObservacionesLectura from './pages/lector/ObservacionesLectura.jsx';
import ProcesoResumen from './pages/lector/ProcesoResumen.jsx';
import './App.css';
>>>>>>> 53a4b78 (Frontent Lector desing front in react v1.0.0)

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <Routes>
        <Route path='/' element={<LoginLayout />}>
        </Route>
          <Route path='/lawyer/' element={<LayoutLawyer />}>
            <Route path='/lawyer/dashboard' element={<Dashboard/>}></Route>
            <Route path='/lawyer/appointments' element={<Appointments/>}></Route>
            <Route path='/lawyer/account' element={<AccountData />}></Route>
          </Route>
          <Route path='/unauthorized' element={<LayoutUnauthorized />}></Route>
      </Routes>
=======
      <div className="bg-primario text-fondoClaro min-h-screen flex flex-col">
        <NavBarMain />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/lector" element={<Lector />} />
            <Route
              path="/lector/proceso/:processId"
              element={<ProcesoResumen />}
            />{' '}
            <Route
              path="/procesos/:processId/observaciones"
              element={<ObservacionesLectura />}
            />
            <Route
              path="/procesos/:processId/evidencias"
              element={<EvidenciasLectura />}
            />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
>>>>>>> 53a4b78 (Frontent Lector desing front in react v1.0.0)
    </BrowserRouter>
  );
}

export default App;
