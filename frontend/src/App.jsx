import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Tienda from './pages/tienda';
import Admin from './pages/admin';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setUser({ token, role });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda user={user} setUser={setUser} logout={logout} />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
        <Route path="/admin" element={user?.role === 'admin' ? <Admin logout={logout} /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;