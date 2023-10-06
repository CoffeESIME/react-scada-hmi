import React from 'react';
import './TankPump.css';

const TankPump: React.FC = () => {
  return (
    <div className="container">
      <div className="pump">
        <div className="pump-head"></div>
        <div className="pump-body">Pump</div>
      </div>
      <div className="tank">
        Water Level
      </div>
    </div>
  );
};

export default TankPump;