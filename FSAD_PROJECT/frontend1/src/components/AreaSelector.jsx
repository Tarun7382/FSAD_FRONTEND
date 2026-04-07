import React, { useState } from 'react';

const ruralIssues = [
  { category: 'Agriculture & Farming', list: [
    'Crop damage due to pests',
    'Irrigation water shortage',
    'Fertilizer subsidy issues',
    'Farm equipment availability',
  ]},
  { category: 'Infrastructure', list: [
    'Rural road conditions',
    'Electricity supply problems',
    'Drinking water availability',
    'Public transportation issues',
  ]},
  { category: 'Healthcare & Education', list: [
    'Primary health center facilities',
    'School infrastructure problems',
    'Teacher availability in schools',
    'Mobile health camp requests',
  ]}
];

const urbanIssues = [
  { category: 'Infrastructure & Utilities', list: [
    'Road maintenance and potholes',
    'Water supply and quality issues',
    'Waste management problems',
    'Public transportation overcrowding',
  ]},
  { category: 'Housing & Environment', list: [
    'Affordable housing concerns',
    'Park maintenance and safety',
    'Noise pollution complaints',
    'Air quality issues',
  ]},
  { category: 'Public Services', list: [
    'Healthcare facility accessibility',
    'School quality and resources',
    'Public safety and policing',
    'Community center availability',
  ]}
];

function AreaSelector({ reportText, setReportText, selectedArea, setSelectedArea }) {
  function handleIssue(issue) {
    setReportText(issue);
  }
  return (
    <div className="area-selection">
      <h5>Select Your Area Type:</h5>
      <div className="area-options">
        <button className={`area-btn ${selectedArea === 'rural' ? 'active' : ''}`} onClick={() => setSelectedArea('rural')}>Rural Area</button>
        <button className={`area-btn ${selectedArea === 'urban' ? 'active' : ''}`} onClick={() => setSelectedArea('urban')}>Urban Area</button>
      </div>
      <div className={!selectedArea || selectedArea === 'rural' ? "area-content" : "area-content hidden"}>
        {ruralIssues.map(cat => (
          <div className="issue-category" key={cat.category}>
            <strong>{cat.category}</strong>
            <ul className="issue-list">
              {cat.list.map(issue =>
                <li key={issue} onClick={() => handleIssue(issue)}>{issue}</li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className={selectedArea === 'urban' ? "area-content" : "area-content hidden"}>
        {urbanIssues.map(cat => (
          <div className="issue-category" key={cat.category}>
            <strong>{cat.category}</strong>
            <ul className="issue-list">
              {cat.list.map(issue =>
                <li key={issue} onClick={() => handleIssue(issue)}>{issue}</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AreaSelector;
