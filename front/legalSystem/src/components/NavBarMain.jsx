import * as React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'

export default function NavBarMain()
{
    return (
    <>
      <header className="bg-dark-card text-white py-3 shadow-sm w-100">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="fw-bold fs-5">🖼️ Abg. Luz Romero</div>
        <nav>
          <Link className="text-white me-3 text-decoration-none" to={'/'}>Inicio</Link>
          <Link className="text-white me-3 text-decoration-none" to={'/appointments'}>Pendientes</Link>
        </nav>
      </div>
    </header>
    </>
    )
}
