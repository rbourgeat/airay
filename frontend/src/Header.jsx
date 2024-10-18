import React from 'react';

const CustomHeader = () => {
  return (
    <div style={headerStyle}>
      <img 
        style={logoStyle}
        src="images/logo_red_light.png" 
        alt="Logo" 
      />
    </div>
  );
};

const headerStyle = {
  position: 'absolute',
  top: '25px',
  left: '25px',
  pointerEvents: 'none',
  userSelect: 'none',
};

const logoStyle = {
  maxWidth: '100px',
  maxHeight: '100px',
  height: 'auto',
  width: 'auto',
  borderRadius: '50%',
};

export default CustomHeader;