import React from 'react';
import AGCStaking from './components/AGCStaking';
import './App.css';

const appStyle: React.CSSProperties = {
  backgroundImage: 'url("https://miro.medium.com/v2/resize:fit:720/format:webp/1*T76DZTQfDBqKUfF8K6MVEw.jpeg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontFamily: 'Arial, sans-serif'
};

const warningStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 0, 0, 0.8)',
  color: 'white',
  padding: '15px',
  textAlign: 'center',
  fontWeight: 'bold',
  marginBottom: '30px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  maxWidth: '800px',
  width: '90%'
};

const headerStyle: React.CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  maxWidth: '600px',
  width: '90%'
};

const titleStyle: React.CSSProperties = {
  fontSize: '36px',
  marginBottom: '20px',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '18px',
  marginBottom: '30px',
  opacity: 0.8
};

const footerStyle: React.CSSProperties = {
  marginTop: '40px',
  textAlign: 'center',
  fontSize: '14px',
  opacity: 0.7
};

function App() {
  return (
    <div className="App" style={appStyle}>
      <div style={warningStyle}>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>This is part of on-going Audit by Tephracore.</p>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>DO NOT INTERACT WITH THIS PAGE YOU WILL LOSE YOUR FUNDS, if you are not part of the Audit, please disconnect immediately.</p>
        <p style={{ fontSize: '16px', marginBottom: '0' }}>Please contact@tephracore.com for more information</p>
      </div>
      <header className="App-header" style={headerStyle}>
        <h1 style={titleStyle}>
          AGC Token Staking
        </h1>
        <p style={subtitleStyle}>
          Stake your AGC tokens and earn rewards!
        </p>
        <AGCStaking />
      </header>
      <footer style={footerStyle}>
        <p>© 2023 AGC Token Staking. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;