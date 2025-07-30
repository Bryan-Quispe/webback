import * as React from 'react';
import {useState, useEffect}from 'react';
import '../App.css'
import { getAccountData } from '../api/userDataApi';
import App from '../App';

export default function AccountData()
{
    const [name, setName]=useState("");
    const [lastname, setLastname]=useState("");
    const [email, setEmail]=useState("");
    const [phone, setPhone]=useState("");

    const handleGetAccountInfo = async () =>{
        const result=await getAccountData();
        setName(result.name);
        setLastname(result.lastname);
        setPhone(result.phoneNumber);
        setEmail(result.email);
    }

    useEffect(() => {
        handleGetAccountInfo();
    }, []);
    return (
    <>
     <div className=''>
        <ul>
            <li>Nombre: {name}</li>
            <li>Apellido: {lastname}</li>
            <li>Correo: {email}</li>
            <li>Telefono: {phone}</li>
        </ul>
     </div>
    </>
    )
}