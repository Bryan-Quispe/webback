import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as Icon from 'react-bootstrap-icons';
import '../App.css';
import './navbar.css';
import {
  UserCircleIcon,
  CalendarIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

export default function CaseNavBar({caseId}){
    return (
        <>
        <div className='navbar2 w-full h-fit'>
                <ul className='flex flex-row space-x-6 h-full items-center justify-center'>
                    <li>
                        <Link className='navLink2 flex flex-row items-center space-x-2 text-decoration-none' to={`/lawyer/case-info/${caseId}`}>
                            <Icon.Folder2Open className='h-4 w-4 inline-block'/>
                            <p>Proceso</p>
                        </Link>
                    </li>
                    <li>
                        <Link className='navLink2 flex flex-row items-center space-x-2 text-decoration-none' to={`/lawyer/event-dashboard/${caseId}`}>
                            <Icon.Grid3x2Gap className='h-4 w-4 inline-block'/>
                            <p >Eventos</p>
                        </Link>
                    </li>
                    <li>
                        <Link className='navLink2 flex flex-row items-center space-x-2 text-decoration-none' to={`/lawyer/pending-calendar/${caseId}`}>
                            <Icon.Calendar2Check className='h-4 w-4 inline-block'/>
                            <p>Calendario</p>
                        </Link>
                    </li>
                </ul>
        </div>
        </>
    )
}