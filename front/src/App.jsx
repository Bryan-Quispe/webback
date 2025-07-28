import { useState } from 'react'
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx'
import Appointments from './pages/appointments.jsx'
import LoginLayout from './layouts/loginLayout.jsx';
import './App.css'
import LayoutLawyer from './layouts/layoutLawyer.jsx';
import LayoutUnauthorized from './layouts/layoutUnauthorized.jsx';
import AccountData from './pages/accountData.jsx';
import NavBarMain from './components/NavBarMain.jsx';
import EvidenciasLectura from './pages/lector/EvidenciasLectura.jsx';
import Lector from './pages/lector/Lector.jsx';
import ObservacionesLectura from './pages/lector/ObservacionesLectura.jsx';
import ProcesoResumen from './pages/lector/ProcesoResumen.jsx';
import './App.css';
import ReaderLayout from './pages/lector/readerLayout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginLayout />}>
        </Route>
          <Route path='/lawyer/' element={<LayoutLawyer />}>
            <Route path='/lawyer/dashboard' element={<Dashboard/>}></Route>
            <Route path='/lawyer/appointments' element={<Appointments/>}></Route>
            <Route path='/lawyer/account' element={<AccountData />}></Route>
          </Route>
          <Route path='/unauthorized' element={<LayoutUnauthorized />}></Route>
          <Route path='/' element={<ReaderLayout />}>
            <Route path='/lector' element={<Lector />}></Route>
            <Route
                path="/lector/proceso/:processId"
                element={<ProcesoResumen />}
              />
            <Route
                path="/procesos/:processId/observaciones"
                element={<ObservacionesLectura />}
              />
            <Route
                path="/procesos/:processId/evidencias"
                element={<EvidenciasLectura />}
              />
              <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
