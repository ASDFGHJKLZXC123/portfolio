import { Navigate, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio.jsx';
import AllWorks from './pages/AllWorks.jsx';
import Project from './pages/Project.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/all-works" element={<AllWorks />} />
      <Route path="/project/:slug" element={<Project />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
