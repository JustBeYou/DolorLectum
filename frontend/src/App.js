import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LampPage from './pages/LampPage';
import SoundPage from './pages/SoundPage';
import TvMovementPage from './pages/TvMovementPage';
import ThermoPage from './pages/ThermoPage';
import VacuumPage from './pages/VacuumPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lamp" element={<LampPage />} />
        <Route path="/sound" element={<SoundPage />} />
        <Route path="/move" element={<TvMovementPage />} />
        <Route path="/thermo" element={<ThermoPage />} />
        <Route path="/vacuum" element={<VacuumPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
