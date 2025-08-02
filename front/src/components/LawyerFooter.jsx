import * as React from 'react';
import { useState, useEffect } from 'react';
import * as Icon from 'react-bootstrap-icons';
import '../App.css';
import './navbar.css';

export default function LawyerFooter()
{
    return (
    <>
        <div className='w-full bg-regal-blue h-fit py-2 items-center'>
            <p className='text-light-gold text-center m-auto font-bold'>Case Library (C) CrazyProgrammers 2025</p>
        </div>
    </>
    )
}