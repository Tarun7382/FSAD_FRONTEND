import React from "react";

const RoleSelection = ({ onSelect }) => (
  <div className="role-selection-page">
    <div className="role-container">
      <div className="role-header">
        <h1>
          <i className="fas fa-users"></i> Civic Connect
        </h1>
        <p>Select your role to continue to the platform</p>
      </div>

      <div className="role-cards">
        <div className="role-card citizen">
          <div className="role-icon">
            <i className="fas fa-user"></i>
          </div>
          <h3>Citizen</h3>
          <p>
            Report issues, provide feedback, and stay informed about community
            matters.
          </p>
          <button
            className="select-btn"
            onClick={() => onSelect("citizen")}
          >
            Select Citizen
          </button>
        </div>

        <div className="role-card politician">
          <div className="role-icon">
            <i className="fas fa-landmark"></i>
          </div>
          <h3>Politician</h3>
          <p>
            Respond to citizen concerns, post updates, and engage with your
            constituents.
          </p>
          <button
            className="select-btn"
            onClick={() => onSelect("politician")}
          >
            Select Politician
          </button>
        </div>

        <div className="role-card admin">
          <div className="role-icon">
            <i className="fas fa-cogs"></i>
          </div>
          <h3>Administrator</h3>
          <p>
            Manage platform settings, users, and ensure system integrity.
          </p>
          <button
            className="select-btn"
            onClick={() => onSelect("admin")}
          >
            Select Admin
          </button>
        </div>

        <div className="role-card moderator">
          <div className="role-icon">🛡️</div>
          <h3>Moderator</h3>
          <p>
            Monitor reports, verify issues, and ensure respectful communication.
          </p>
          <button
            className="select-btn"
            onClick={() => onSelect("moderator")}
          >
            Select Moderator
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default RoleSelection;