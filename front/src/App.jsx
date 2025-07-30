import { useState } from 'react';
import { BrowserRouter, Outlet, Route, Router, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard.jsx';
import Appointments from './pages/appointments.jsx';
import LoginLayout from './layouts/loginLayout.jsx';
import './App.css';
import LayoutLawyer from './layouts/layoutLawyer.jsx';
import LayoutUnauthorized from './layouts/layoutUnauthorized.jsx';
import AccountData from './pages/accountData.jsx';
import NavBarMain from './components/NavBarMain.jsx';
import EvidenciasLectura from './pages/lector/EvidenciasLectura.jsx';
import Lector from './pages/lector/Lector.jsx';
import ObservacionesLectura from './pages/lector/ObservacionesLectura.jsx';
import ProcesoResumen from './pages/lector/ProcesoResumen.jsx';
import './App.css';
import ReaderLayout from './pages/lector/readerLayout.jsx';
import CaseDashboard from './lawyer/CaseDashboard.jsx';
import CaseInfo from './lawyer/CaseInfo.jsx';
import EventDashboard from './lawyer/EventDashboard.jsx';
import EvidenceDashboard from './lawyer/EvidenceDashboard.jsx';
import ObservationDashboard from './lawyer/ObservationDashboard.jsx';
import PendingCalendar from './lawyer/PendingCalendar.jsx';
import ReminderList from './lawyer/ReminderList.jsx';
import AuditList from './lawyer/AuditList.jsx';
import RelatedCases from './lawyer/RelatedCases.jsx';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginLayout />}></Route>
        <Route path="/lawyer" element={<LayoutLawyer />}>
          <Route path="dashboard" element={<CaseDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="account" element={<AccountData />} />
          <Route path="case-info/:id" element={<CaseInfo />} />
          <Route path="event-dashboard/:caseId" element={<EventDashboard />} />
          <Route
            path="evidence-dashboard/:caseId"
            element={<EvidenceDashboard />}
          />
          <Route
            path="observation-dashboard/:caseId"
            element={<ObservationDashboard />}
          />
          <Route
            path="pending-calendar/:caseId"
            element={<PendingCalendar />}
          />
          <Route path="reminder-list" element={<ReminderList />} />
          <Route path="audit-list" element={<AuditList />} />
          <Route path="related-cases/:caseId" element={<RelatedCases />} />
        </Route>
        <Route path="/unauthorized" element={<LayoutUnauthorized />}></Route>
        <Route path="/" element={<Lector />}>
          <Route
            path="/lector/proceso/:processId"
            element={<ProcesoResumen />}
          />
          <Route
            path="/procesos/:processId/observaciones"
            element={<ObservacionesLectura />}
          />
          <Route
            path="/procesos/:processId/evidencias"
            element={<EvidenciasLectura />}
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
