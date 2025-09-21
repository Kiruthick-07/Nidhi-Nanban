// FinanceLanding.jsx
// Single-file React component (JSX) using inline style objects.
// Place a finance-related image in the same folder and name it `finance-image.png` OR
// update the import path below to point to your image file (e.g. './Screenshot 2025-09-21 005818.png').

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FinanceLanding() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const navigate = useNavigate();

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Inline style objects
  const page = {
    fontFamily: "Inter, Arial, sans-serif",
    background: 'linear-gradient(135deg, #f7fbff 0%, #f1f6ff 100%)',
    minHeight: '100vh',
    padding: isMobile ? '20px 18px' : '48px 72px',
    paddingTop: isMobile ? '100px' : '120px', // Account for navbar
    boxSizing: 'border-box',
    color: '#0f1724',
    width: '100%'
  };

  const container = {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    gap: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: isMobile ? 'column-reverse' : 'row'
  };

  const leftCol = {
    flex: 1,
    minWidth: 280
  };

  const eyebrow = {
    display: 'inline-block',
    background: 'rgba(99,102,241,0.08)',
    color: '#4f46e5',
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    marginBottom: 18
  };

  const heading = {
    fontSize: isMobile ? 28 : 44,
    lineHeight: isMobile ? '34px' : '52px',
    margin: '6px 0 18px 0',
    fontWeight: 700,
    color: '#0b1220'
  };

  const sub = {
    fontSize: 15,
    color: '#425063',
    marginBottom: 22
  };

  const buttonsRow = {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap'
  };

  const primaryBtn = {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '12px 18px',
    borderRadius: 10,
    cursor: 'pointer',
    boxShadow: '0 6px 18px rgba(79,70,229,0.16)'
  };

  const ghostBtn = {
    background: 'transparent',
    color: '#4f46e5',
    border: '1.5px solid rgba(79,70,229,0.16)',
    padding: '10px 16px',
    borderRadius: 10,
    cursor: 'pointer'
  };

  const logosStrip = {
    display: 'flex',
    gap: 18,
    alignItems: 'center',
    marginTop: 28,
    flexWrap: 'wrap'
  };

  const rightCol = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const imageCard = {
    width: isMobile ? '100%' : 420,
    maxWidth: '100%',
    borderRadius: 18,
    padding: 22,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,255,0.7))',
    boxShadow: '0 12px 30px rgba(16,24,40,0.06)',
    boxSizing: 'border-box'
  };

  const navbar = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '12px 18px' : '16px 72px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  };

  const navbarBrand = {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 'bold',
    color: '#4f46e5',
    textDecoration: 'none'
  };

  const navbarLinks = {
    display: 'flex',
    gap: isMobile ? '16px' : '24px',
    alignItems: 'center'
  };

  const navbarLink = {
    color: '#425063',
    textDecoration: 'none',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  };

  const navbarButton = {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  };

  const smallText = {
    fontSize: 12,
    color: '#6b7280'
  };

  return (
    <div style={page}>
      {/* Navbar */}
      <nav style={navbar}>
        <div style={navbarBrand}>Nidhi Nanban</div>
        <div style={navbarLinks}>
          <a href="#features" style={navbarLink}>Features</a>
          <a href="#about" style={navbarLink}>About</a>
          <a href="#contact" style={navbarLink}>Contact</a>
          <button
            style={navbarButton}
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </nav>

      <div style={container}>
        <div style={leftCol}>
          <span style={eyebrow}>Your Money. Your Control.</span>
          <h1 style={heading}>Take Control of Your Financial Future</h1>
          <p style={sub}>Track your spending, save smartly, and grow your wealth with simple tools designed for everyone — all in one easy-to-use web app.</p>

          <div style={buttonsRow}>
            <button style={primaryBtn} aria-label="Get started" onClick={() => navigate('/login')}>Get Started</button>
            <button style={ghostBtn} aria-label="Learn more" onClick={() => navigate('/signup')}>Learn More</button>
          </div>

          <div style={logosStrip}>
            <span style={smallText}>Trusted by</span>
            <img src="https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3" alt="company" style={{height:28, opacity:0.85, borderRadius:6}} />
            <div style={{width:1, height:20, background:'#e6eef8', marginLeft:6}} />
            <span style={smallText}>25k+ businesses</span>
          </div>
        </div>

        <div style={rightCol}>
          <div style={imageCard}>
            {/* Use a finance-related image here. The component imports `FinanceImage` at the top. */}
            <img
              src="https://images.unsplash.com/photo-1559526324-593bc073d938?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3"
              alt="finance overview"
              style={{width: '100%', height: 'auto', display: 'block', borderRadius: 12, objectFit: 'cover'}}
            />

            <div style={{marginTop:12, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                <div style={{fontSize:14, fontWeight:700}}>SmarTrack</div>
                <div style={{fontSize:12, color:'#6b7280'}}>Smart financial dashboard</div>
              </div>
              <div style={{fontSize:12, color:'#10b981', fontWeight:700}}>Trusted · Secure</div>
            </div>
          </div>
        </div>
      </div>

      <footer style={{maxWidth:1200, margin:'22px auto 0', textAlign:'center', color:'#94a3b8', fontSize:13}}>
        <div>© {new Date().getFullYear()} Nidhi Nanban · Built with React (JSX)</div>
      </footer>
    </div>
  );
}
