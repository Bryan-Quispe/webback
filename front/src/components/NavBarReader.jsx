import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import '../App.css';
import './navbar.css';
import LegalLogo from '../assets/LegalLogo.png';
import {
  UserCircleIcon,
  CalendarIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

export default function NavBarReader()
{
  const navigate = useNavigate();
    return (
    <>
      <header className="navbar text-zinc-900 py-3 px-3 shadow-sm w-full z-20">
      <div className="flex justify-between items-center">
        <div className='flex flex-row items-center font-bold text-white'>
            <Link to={'/'}>
              <img src={LegalLogo} className='h-9 w-9 inline-block hover: cursor-pointer' />
              Case Library
            </Link>
          </div>
          <div>
            <button className='flex btn items-center text-black rounded py-1 px-1'
              onClick={()=>{navigate(`/login`);}}
            >
              Iniciar Sesión
              </button>
          </div>
      </div>
    </header>
    </>
    )
}
