import * as React from 'react';
import { useState, useEffect } from 'react';
import * as Icon from 'react-bootstrap-icons';
import '../App.css';
import './navbar.css';
import { getAccountData, getProfileData } from '../api/mainLawyerData';

export default function ReaderFooter() {
  const [lawyerName, setLawyerName] = useState('');
  const [lawyerTitle, setLawyerTitle] = useState('');
  const [lawyerPhone, setLawyerPhone] = useState('');
  const [lawyerMail, setLawyerMail] = useState('');
  const [lawyerAddress, setLawyerAddress] = useState('');

  const handleGetFooterData = async () => {
    const personalData = await getAccountData();
    const profileData = await getProfileData();
    setLawyerName(personalData.name + ' ' + personalData.lastname);
    setLawyerTitle(profileData.title);
    setLawyerPhone(personalData.phoneNumber);
    setLawyerMail(personalData.email);
    setLawyerAddress(profileData.address);
  };

  useEffect(() => {
    handleGetFooterData();
  }, []);

  return (
    <>
      <div className="w-full bg-regal-blue text-bone-white h-fit mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm">
            <strong>Abog. {lawyerName}</strong>
          </p>
          <p className="text-sm">{lawyerTitle}</p>
        </div>

        <div className="text-center md:text-left">
          <p className="text-sm font-bold">Información de Contacto:</p>
          <p className="text-sm">
            <strong>Celular:</strong>
            {lawyerPhone}
          </p>
          <p className="text-sm">
            <strong>Correo:</strong>
            {lawyerMail}
          </p>
          <p className="text-sm">
            <strong>Dirección: </strong>
            {lawyerAddress}
          </p>
        </div>

        {/* Iconos de redes sociales */}
        <div className="flex gap-4 text-xl">
          <a
            href="https://github.com/tuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <Icon.Facebook />
          </a>
          <a
            href="https://linkedin.com/in/tuusuario"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-400"
          >
            <Icon.Linkedin />
          </a>
        </div>
      </div>
    </>
  );
}
