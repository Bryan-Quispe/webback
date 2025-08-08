import { useState } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import LoginLayout from './layouts/loginLayout.jsx';
import './App.css';
import LayoutLawyer from './layouts/layoutLawyer.jsx';
import LayoutUnauthorized from './layouts/layoutUnauthorized.jsx';
import AccountData from './pages/accountData.jsx';
import EvidenciasLectura from './pages/lector/EvidenciasLectura.jsx';
import Lector from './pages/lector/Lector.jsx';
import ObservacionesLectura from './pages/lector/ObservacionesLectura.jsx';
import ProcesoResumen from './pages/lector/ProcesoResumen.jsx';
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
import CaseCreate from './lawyer/CaseCreate.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginLayout />} />
        <Route path="/lawyer" element={<LayoutLawyer />}>
          <Route path="dashboard" element={<CaseDashboard />} />
          <Route path="account" element={<AccountData />} />
          <Route path="case-info/:id" element={<CaseInfo />} />
          <Route path="event-dashboard/:caseId" element={<EventDashboard />} />
          <Route path="create-case" element={<CaseCreate />} />
          <Route path="evidences/:eventId" element={<EvidenceDashboard />} />
          <Route
            path="observations/:eventId"
            element={<ObservationDashboard />}
          />
          <Route
            path="pending-calendar/:caseId"
            element={<PendingCalendar />}
          />
          <Route path="reminders" element={<ReminderList />} />
          <Route path="audit-list" element={<AuditList />} />
          <Route path="related-cases/:caseId" element={<RelatedCases />} />
        </Route>
        <Route path="/unauthorized" element={<LayoutUnauthorized />} />
        <Route path="/" element={<ReaderLayout />}>
          <Route index element={<Lector />} />
          <Route path="lector" element={<Lector />} />
          <Route
            path="lector/proceso/:processId"
            element={<ProcesoResumen />}
          />
          <Route
            path="procesos/:processId/observaciones"
            element={<ObservacionesLectura />}
          />
          <Route
            path="procesos/:processId/evidencias"
            element={<EvidenciasLectura />}
          />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
