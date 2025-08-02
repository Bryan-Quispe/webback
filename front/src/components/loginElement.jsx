import React from 'react';
import { useState } from 'react';
import { useAlert } from './alerts/alertElement';

export default function LoginElement() {
  const {showAlert}=useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSendLoginInfo = async () => {
    const uri="https://webback-x353.onrender.com/legalsystem/account/login";
    const response = await fetch(uri,
    {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to login");
    }
    else
    {
        showAlert('Ingreso realizado con exito','success');
        const result=await response.json();
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId",result.user.accountId);
        window.location.href='/lawyer/dashboard';
    }
    
      setEmail("");
      setPassword("");      
  }


  return (
    <div className="w-full space-y-2 max-w-md mx-auto bg-white/10 text-bone-white p-6 rounded-xl shadow-md backdrop-blur">
      <h2 className="text-2xl font-bold mb-5 text-center">Iniciar Sesión</h2>
        <div>
          <label htmlFor="userMail" className="block text-sm mb-1">
            Correo
          </label>
          <input
            type="email"
            id="userMail"
            name="userMail"
            value={`${email}`}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-bone-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={`${password}`}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-bone-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSendLoginInfo}
          className="w-full bg-regal-blue hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
        >
          Iniciar Sesión
        </button>
    </div>
  );
}
