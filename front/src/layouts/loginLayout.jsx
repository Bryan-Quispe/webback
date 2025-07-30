import { useState } from 'react'
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom';
import LoginElement from '../components/loginElement';
import '../App.css'
export default function LoginLayout() {


  return (
    <>
    <div className='container flex min-h-screen min-w-screen bg-[url(../assets/legalBg.png)] bg-cover'>
      <div className='w-1/3 m-auto self-center'>
        <LoginElement />
      </div>
    </div>
    </>
  );
}

