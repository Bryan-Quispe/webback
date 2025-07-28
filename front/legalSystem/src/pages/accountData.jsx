import * as React from 'react';
import {useState, useEffect}from 'react';
import '../App.css'
import App from '../App';

export default function AccountData()
{
    const [name, setName]=useState("");
    const [lastname, setLastname]=useState("");
    const [email, setEmail]=useState("");
    const [phone, setPhone]=useState("");

    const handleGetAccountInfo = async () =>{
        const uri="http://localhost:3000/legalsystem/account/"+localStorage.getItem("userId");
        const response = await fetch(uri,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to add Stand");
            }
            else{
                const result=await response.json();
                setName(result.name);
                setLastname(result.lastname);
                setPhone(result.phoneNumber);
                setEmail(result.email);
            }
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