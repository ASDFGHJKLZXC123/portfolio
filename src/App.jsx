import { Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio.jsx';
import AllWorks from './pages/AllWorks.jsx';
import Now from './pages/Now.jsx';
import Writing from './pages/Writing.jsx';
import Post from './pages/Post.jsx';
import Project from './pages/Project.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/all-works" element={<AllWorks />} />
      <Route path="/now" element={<Now />} />
      <Route path="/writing" element={<Writing />} />
      <Route path="/post/:slug" element={<Post />} />
      <Route path="/project/:slug" element={<Project />} />
      <Route path="*" element={<Portfolio />} />
    </Routes>
  );
}
