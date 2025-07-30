import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import '../App.css';
import './navbar.css';
import LegalLogo from '../assets/LegalLogo.png';
import {
  UserCircleIcon,
  CalendarIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { getAccountData } from '../api/userDataApi';
import userData from '../testData/userData';

export default function NavBarMain()
{
    const [userName, SetUsername] = useState("");
    const [userLastname, SetUserLastname] = useState("");
    const [accountClicked, handleAccountOptions] = useState(false);
    const toggleAccountOptions = () => handleAccountOptions(!accountClicked);
    const closeAccountOptions = () => {
      localStorage.clear();
      window.location.href='../../login';
    };
    const handleGetUserData = async () =>{
      const userData=await getAccountData();
      SetUsername(userData.name);
      SetUserLastname(userData.lastname);
    }
    useEffect(()=>{handleGetUserData},[]);
    const accountOptionsState = (accountClicked) ? "block" : "hidden";

    return (
    <>
      <header className="navbar text-zinc-900 py-3 px-3 shadow-sm w-screen z-20">
      <div className="flex justify-between items-center">
        <div className='flex flex-row items-center'>
          <div>
            <img src={LegalLogo} className='h-9 w-9 inline-block' />
          </div>
          <div className=" font-bold text-x1">{userName} {userLastname}</div>
        </div>
        <div className=''>
          <nav>
            <ul className='flex flex-row space-x-3'>
              <li>
                <Link className="navLink text-bone-white me-3 text-decoration-none" to={'/lawyer/dashboard'}>
              <HomeIcon className='inline-block h-4 w-4'/>Inicio
            </Link>
              </li>
            <li>
              <Link className="navLink text-bone-white me-3 text-decoration-none" to={'/lawyer/appointments'}>
              <CalendarIcon className='inline-block h-4 w-4'/>Pendientes
            </Link>
            </li>
            <li className="navLink text-bone-white me-3">
              <Icon.Bell className='inline-block h-4 w-4'/>
            </li>
            <li id="accountButton" className="navLink text-bone-white me-3 text-decoration-none" onClick={toggleAccountOptions}>
              <UserCircleIcon className='inline-block h-6 w-6'/>
              <div className={`bg-bone-white ${accountOptionsState} absolute rounded-md shadow-lg w-fit  mx-2 text-right right-0 mt-3 z-10}`}>
                  <ul className='accountOptions'>
                    <li>
                      <Link className='text-decoration-none me-3' to={'/lawyer/account'}>Datos Personales</Link>
                    </li>
                    <li>
                      <Link className='text-decoration-none me-3' to={'/lawyer/profile'}>Perfil Publico</Link>
                    </li>
                    <li>
                      <Link className='text-decoration-none me-3' onClick={closeAccountOptions}>Cerrar Sesion</Link>
                    </li>
                  </ul>
              </div>
            </li>
            </ul>
          </nav>

        </div>
      </div>
    </header>
    </>
    )
}
