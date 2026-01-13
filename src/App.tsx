import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Actions } from './pages/Actions';
import { Team } from './pages/Team';
import { Missions } from './pages/Missions';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

// Placeholder for Auth Guard
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const isAuthenticated = true; // Todo: replace with real auth
//   return isAuthenticated ? children : <Navigate to="/login" />;
// };

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/inicio" replace />} />
          <Route path="inicio" element={<Dashboard />} />
          <Route path="acciones" element={<Actions />} />
          <Route path="equipo" element={<Team />} />
          <Route path="misiones" element={<Missions />} />
          <Route path="ajustes" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
