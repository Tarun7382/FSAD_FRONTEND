import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CitizenSection from './CitizenSection';
import PoliticianSection from './PoliticianSection';
import ModeratorSection from './ModeratorSection';
import AdminSection from './AdminSection';

function MainContent({ role, username, onLogout }) {
  const [section, setSection] = useState(role);

  return (
    <div className="main-background" style={{ minHeight: '100vh' }}>
      <Sidebar active={section} setActiveSection={setSection} onLogout={onLogout} />
      <div className="content">
        <header>
          <div className="user-info">
            <i className="fas fa-user-circle"></i> <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
          </div>
          <h2>Citizen & Politician Interaction Platform</h2>
          <p>Transparency | Engagement | Responsiveness</p>
        </header>
        {section === 'citizen' && <CitizenSection />}
        {section === 'politician' && <PoliticianSection />}
        {section === 'moderator' && <ModeratorSection />}
        {section === 'admin' && <AdminSection />}
      </div>
    </div>
  );
}

export default MainContent;
