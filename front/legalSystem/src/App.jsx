import { useState } from 'react'
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx'
import Appointments from './pages/appointments.jsx'
import LoginLayout from './layouts/loginLayout.jsx';
import './App.css'
import LayoutLawyer from './layouts/layoutLawyer.jsx';
import LayoutUnauthorized from './layouts/layoutUnauthorized.jsx';
import AccountData from './pages/accountData.jsx';

function App() {

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App
