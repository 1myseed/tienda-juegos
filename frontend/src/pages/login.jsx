import { useState } from 'react';

export default function Login({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 🎨 PERSONALIZACIÓN: Coloca aquí la URL de tu logo
  const LOGO_URL = 'https://chatgpt.com/backend-api/estuary/content?id=file_00000000cf8862308215d789cef258af&ts=489142&p=fs&cid=1&sig=eb838e2010b488cfbac7b7402a1e7ba1f3513662bc83b20d4bf733fdc3ec796b&v=0'; // ⬅️ Cambia esta URL por la de tu logo

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isRegister ? '/api/register' : '/api/login';
      const response = await fetch(`https://tienda-juegos-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error');
      }
      
      if (isRegister) {
        alert('Usuario creado. Ahora inicia sesión');
        setIsRegister(false);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        setUser({ token: data.token, role: data.role });
      }
    } catch (err) {
      setError(err.message || 'Error');
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#0a0e27',
      margin: 0,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '50px', 
        borderRadius: '30px', 
        boxShadow: '0 30px 90px rgba(0,0,0,0.5)', 
        maxWidth: '450px',
        width: '100%',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img 
            src={LOGO_URL} 
            alt="Logo" 
            style={{ 
              width: '120px', 
              height: '120px', 
              marginBottom: '20px',
              borderRadius: '50%',
              boxShadow: '0 10px 30px rgba(102,126,234,0.4)',
              objectFit: 'cover'
            }} 
          />
          <h1 style={{ 
            color: 'white', 
            fontSize: '32px',
            fontWeight: '900',
            letterSpacing: '1px',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🎮 DigitalPlay
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {isRegister ? 'Crear Nueva Cuenta' : 'Iniciar Sesión'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              📧 Email
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '2px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                fontSize: '16px', 
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = 'rgba(255,255,255,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🔒 Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '2px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                fontSize: '16px', 
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = 'rgba(255,255,255,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              required
            />
          </div>
          
          {error && (
            <div style={{
              background: 'rgba(255,107,107,0.2)',
              border: '2px solid #ff6b6b',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#ff6b6b', margin: '0', fontSize: '14px', fontWeight: '600' }}>
                ⚠️ {error}
              </p>
            </div>
          )}
          
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(102,126,234,0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 40px rgba(102,126,234,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(102,126,234,0.4)';
            }}
          >
            {isRegister ? '✨ Registrarse' : '🚀 Entrar'}
          </button>
        </form>
        
        <div style={{ 
          marginTop: '25px', 
          textAlign: 'center',
          paddingTop: '25px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button 
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: '#00d4ff',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#00a8cc'}
            onMouseLeave={(e) => e.target.style.color = '#00d4ff'}
          >
            {isRegister ? '← ¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate →'}
          </button>
        </div>
      </div>
    </div>
  );
}
