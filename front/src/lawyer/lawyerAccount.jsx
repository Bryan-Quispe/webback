import * as React from 'react';
import {useState, useEffect}from 'react';
import '../App.css'
import { getAccountData, updateAccountData } from '../api/userDataApi';
import * as Icons from 'react-bootstrap-icons';
import { useAlert } from '../components/alerts/alertElement';
import App from '../App';

export default function AccountData()
{
    const {showAlert}=useAlert();
    const [name, setName]=useState("");
    const [lastname, setLastname]=useState("");
    const [email, setEmail]=useState("");
    const [phone, setPhone]=useState("");
    const [editingOn, setEditing]=useState(false);

    const handleOpenEdit = () => {setEditing(true)};
    const handleCloseEdit = () => {setEditing(false)};

    const handleGetAccountInfo = async () =>{
        const result=await getAccountData();
        setName(result.name);
        setLastname(result.lastname);
        setPhone(result.phoneNumber);
        setEmail(result.email);
    }

    const handleSubmit = async () =>{
        const userData={
        name: name,
        lastname: lastname,
        email: email,
        phoneNumber: phone
    };
    console.log(JSON.stringify(userData));
        const updatedData=await updateAccountData(userData);
        if(updatedData!=null)
        {
            console.log('Data updated successfully');
            showAlert('Actualizado con exito', 'success');
        }
        else{
            console.log('Fail to update');
            showAlert('Error al actualizar', 'error');
        }
        handleGetAccountInfo();
        handleCloseEdit();
    };

    useEffect(() => {
        handleGetAccountInfo();
    }, []);


    return (
    <>
    <div className="max-w-9/10 w-8/10 mx-auto p-4 bg-regal-blue shadow mt-8">
      <h1 className="text-4xl mb-6 items-center">
        <Icons.PersonCircle className='inline-block h-9 w-9'/>  Datos Personales
      </h1>
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm text-bone-white mb-1" htmlFor="name">
            Nombre
          </label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              disabled={!editingOn}
              onChange={(e)=>{setName(e.target.value)}}
              className="w-full border rounded-sm text-black bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="flex-1">
          <label className="block text-sm text-bone-white mb-1" htmlFor="lastname">
            Apellido
          </label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={lastname}
              disabled={!editingOn}
              onChange={(e)=>{setLastname(e.target.value)}}
              className="w-full border rounded-sm text-black bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>

      {/* Segunda fila: Email y Teléfono */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm text-bone-white mb-1" htmlFor="email">
            Correo electrónico
          </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              disabled={!editingOn}
              onChange={(e)=>{setEmail(e.target.value)}}
              className="w-full border rounded-sm text-black bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        <div className="flex-1">
          <label className="block text-sm text-bone-white mb-1" htmlFor="phone">
            Teléfono
          </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={phone}
              disabled={!editingOn}
              onChange={(e)=>{setPhone(e.target.value)}}
              className="w-full border rounded-sm text-black bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>
      {/* Botones */}
      <div className="flex justify-end gap-3">
        {editingOn ? (
          <>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-600 text-white px-5 py-2 hover:bg-green-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={ handleCloseEdit}
              className="bg-gray-300 text-gray-800 px-5 py-2 hover:bg-gray-400"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleOpenEdit}
            className="bg-blue-600 text-white px-5 py-2 hover:bg-blue-700"
            
          >
            <Icons.PencilFill className='inline-block h-4 w-4 me-2'/>
            Editar
          </button>
        )}
      </div>
    </div>
    </>
    )
}