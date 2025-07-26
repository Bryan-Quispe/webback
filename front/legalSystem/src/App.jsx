import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import NavBarMain from './components/NavBarMain.jsx';
import Dashboard from './pages/dashboard.jsx'
import Appointments from './pages/appointments.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard/>}></Route>
        <Route path='/appointments' element={<Appointments/>}></Route>
      </Routes>
      <NavBarMain />
    </BrowserRouter>
  );
}

export default App
