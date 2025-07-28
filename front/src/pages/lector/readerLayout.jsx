import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import NavBarMain from '../../components/NavBarMain';
import '../../App.css'
export default function ReaderLayout()
{

    return (
        <>
        <div className="bg-primario text-fondoClaro min-h-screen flex flex-col">
              <NavBarMain />
                <main className="flex-1 p-4">
                    <Outlet />
                </main>
            </div>
        </>
    );
}