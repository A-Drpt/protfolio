import React from 'react';
import { createRoot } from 'react-dom/client';
import { AdminDashboard } from './components/AdminDashboard.jsx';
import ProjectsTab from './components/ProjectsTab.jsx';
import SkillsTab from './components/SkillsTab.jsx';
import ExperiencesTab from './components/ExperiencesTab.jsx';

function App() {
  const [activeTab, setActiveTab] = React.useState('projects');

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Dashboard Administration</h1>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projets
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Compétences
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'experiences' ? 'active' : ''}`}
            onClick={() => setActiveTab('experiences')}
          >
            Expériences
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'projects' && <ProjectsTab />}
        {activeTab === 'skills' && <SkillsTab />}
        {activeTab === 'experiences' && <ExperiencesTab />}
      </div>
    </div>
  );
}

// Mount React app
const rootElement = document.getElementById('admin-react-root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <AdminDashboard>
      <App />
    </AdminDashboard>
  );
}
