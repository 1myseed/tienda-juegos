import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin({ logout }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ titulo: '', precio: '', plataforma: 'PS4', imagen: '', descripcion: '', stock: 0, categoria: 'todos' });
  const [bannerForm, setBannerForm] = useState({ imagen: '', titulo: '', descripcion: '', juego: '' });
  const [editId, setEditId] = useState(null);
  const [editBannerId, setEditBannerId] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const navigate = useNavigate();

  // URL del icono
  const iconoUrl = 'https://i.ibb.co/1YZ7vVcK/cd38d169-310a-4163-95fd-532dbb7c9544.png';

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchBanners();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('https://tienda-juegos-backend.onrender.com/api/products');
    const data = await response.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const response = await fetch('https://tienda-juegos-backend.onrender.com/api/orders');
    const data = await response.json();
    setOrders(data);
  };

  const fetchBanners = async () => {
    const response = await fetch('https://tienda-juegos-backend.onrender.com/api/banners');
    const data = await response.json();
    setBanners(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await fetch(`https://tienda-juegos-backend.onrender.com/api/products/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });
    } else {
      await fetch('https://tienda-juegos-backend.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });
    }
    setForm({ titulo: '', precio: '', plataforma: 'PS4', imagen: '', descripcion: '', stock: 0, categoria: 'todos' });
    setEditId(null);
    fetchProducts();
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editBannerId) {
        const response = await fetch(`https://tienda-juegos-backend.onrender.com/api/banners/${editBannerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerForm)
        });
        if (response.ok) {
          alert('✅ Banner actualizado correctamente');
        }
      } else {
        const response = await fetch('https://tienda-juegos-backend.onrender.com/api/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerForm)
        });
        if (response.ok) {
          alert('✅ Banner agregado correctamente');
        }
      }
      setBannerForm({ imagen: '', titulo: '', descripcion: '', juego: '' });
      setEditBannerId(null);
      await fetchBanners();
    } catch (error) {
      alert('❌ Error al guardar el banner. Verifica tu conexión.');
      console.error('Error:', error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      await fetch(`https://tienda-juegos-backend.onrender.com/api/products/${id}`, {
        method: 'DELETE'
      });
      fetchProducts();
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm('¿Eliminar este pedido?')) {
      await fetch(`https://tienda-juegos-backend.onrender.com/api/orders/${id}`, {
        method: 'DELETE'
      });
      fetchOrders();
    }
  };

  const deleteBanner = async (id) => {
    if (window.confirm('¿Eliminar este banner?')) {
      await fetch(`https://tienda-juegos-backend.onrender.com/api/banners/${id}`, {
        method: 'DELETE'
      });
      fetchBanners();
    }
  };

  const makeAdmin = async () => {
    await fetch('https://tienda-juegos-backend.onrender.com/api/make-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: adminEmail })
    });
    alert('✅ Usuario convertido en administrador');
    setAdminEmail('');
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: '100vh', 
      background: '#0a0e27',
      margin: 0,
      padding: 0,
      overflowY: 'auto'
    }}>
      <header style={{ background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)', padding: '25px 40px', color: 'white', boxShadow: '0 5px 30px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '2px solid #00d4ff' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={iconoUrl} alt="DigitalPlay Icon" style={{ width: '50px', height: '50px', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,212,255,0.5)' }} />
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', margin: '0 0 5px 0', color: '#00d4ff' }}>Panel Admin</h1>
              <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', opacity: 0.9 }}>Gestiona productos, pedidos, banners y usuarios</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => navigate('/')} style={{ padding: '12px 25px', background: 'rgba(0,212,255,0.2)', border: '2px solid rgba(0,212,255,0.5)', borderRadius: '30px', color: 'white', cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}>
              🏪 Tienda
            </button>
            <button onClick={logout} style={{ padding: '12px 25px', background: 'rgba(0,212,255,0.2)', border: '2px solid rgba(0,212,255,0.5)', borderRadius: '30px', color: 'white', cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}>
              🚪 Salir
            </button>
          </div>
        </div>
      </header>

      <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Tabs de navegación */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveTab('products')}
            style={{ 
              padding: '12px 25px', 
              background: activeTab === 'products' ? 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)' : 'rgba(255,255,255,0.05)', 
              border: activeTab === 'products' ? 'none' : '2px solid rgba(0,212,255,0.3)', 
              borderRadius: '15px', 
              color: 'white', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '15px',
              boxShadow: activeTab === 'products' ? '0 5px 20px rgba(0,212,255,0.4)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            🎮 Productos
          </button>
          <button 
            onClick={() => setActiveTab('banners')}
            style={{ 
              padding: '12px 25px', 
              background: activeTab === 'banners' ? 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)' : 'rgba(255,255,255,0.05)', 
              border: activeTab === 'banners' ? 'none' : '2px solid rgba(0,212,255,0.3)', 
              borderRadius: '15px', 
              color: 'white', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '15px',
              boxShadow: activeTab === 'banners' ? '0 5px 20px rgba(0,212,255,0.4)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            🖼️ Banners
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ 
              padding: '12px 25px', 
              background: activeTab === 'orders' ? 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)' : 'rgba(255,255,255,0.05)', 
              border: activeTab === 'orders' ? 'none' : '2px solid rgba(0,212,255,0.3)', 
              borderRadius: '15px', 
              color: 'white', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '15px',
              boxShadow: activeTab === 'orders' ? '0 5px 20px rgba(0,212,255,0.4)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            📋 Pedidos
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            style={{ 
              padding: '12px 25px', 
              background: activeTab === 'admin' ? 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)' : 'rgba(255,255,255,0.05)', 
              border: activeTab === 'admin' ? 'none' : '2px solid rgba(0,212,255,0.3)', 
              borderRadius: '15px', 
              color: 'white', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '15px',
              boxShadow: activeTab === 'admin' ? '0 5px 20px rgba(0,212,255,0.4)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            👑 Admins
          </button>
        </div>

        {/* Contenido de Productos */}
        {activeTab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px' }}>
            <div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>
                  {editId ? '✏️ Editar Producto' : '➕ Agregar Producto'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    placeholder="Título del juego" 
                    value={form.titulo} 
                    onChange={(e) => setForm({...form, titulo: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
                    required 
                  />
                  <input 
                    type="number" 
                    placeholder="Precio" 
                    value={form.precio} 
                    onChange={(e) => setForm({...form, precio: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
                    required 
                  />
                  <select 
                    value={form.plataforma} 
                    onChange={(e) => setForm({...form, plataforma: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option style={{ background: '#0a0e27' }}>PS4</option>
                    <option style={{ background: '#0a0e27' }}>PS5</option>
                    <option style={{ background: '#0a0e27' }}>PS4/PS5</option>
                  </select>
                  <select 
                    value={form.categoria} 
                    onChange={(e) => setForm({...form, categoria: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <option style={{ background: '#0a0e27' }} value="todos">Todos</option>
                    <option style={{ background: '#0a0e27' }} value="ofertas">Ofertas</option>
                    <option style={{ background: '#0a0e27' }} value="ps-plus">PS Plus</option>
                    <option style={{ background: '#0a0e27' }} value="ps4">PS4</option>
                    <option style={{ background: '#0a0e27' }} value="ps5">PS5</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="URL de la imagen" 
                    value={form.imagen} 
                    onChange={(e) => setForm({...form, imagen: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
                    required 
                  />
                  <input 
                    type="number" 
                    placeholder="Stock disponible" 
                    value={form.stock} 
                    onChange={(e) => setForm({...form, stock: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
                    required 
                  />
                  <button 
                    type="submit" 
                    style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 5px 20px rgba(0,212,255,0.4)', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {editId ? '💾 Actualizar' : '✅ Agregar'}
                  </button>
                  {editId && (
                    <button 
                      type="button" 
                      onClick={() => { setEditId(null); setForm({ titulo: '', precio: '', plataforma: 'PS4', imagen: '', descripcion: '', stock: 0, categoria: 'todos' }); }} 
                      style={{ width: '100%', padding: '16px', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', border: '2px solid #ff6b6b', borderRadius: '12px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold', fontSize: '16px', transition: 'all 0.3s' }}
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </form>
              </div>
            </div>

            <div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '24px', fontWeight: 'bold' }}>📦 Productos ({products.length})</h2>
                {products.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                    <div style={{ fontSize: '60px', marginBottom: '15px' }}>🎮</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>No hay productos. Agrega el primero.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                      <thead>
                        <tr style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                          <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>PRODUCTO</th>
                          <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>PRECIO</th>
                          <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>PLATAFORMA</th>
                          <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>CATEGORÍA</th>
                          <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>STOCK</th>
                          <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p._id} style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '20px', borderRadius: '12px 0 0 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={p.imagen} alt={p.titulo} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                                <span style={{ color: 'white', fontWeight: '600' }}>{p.titulo}</span>
                              </div>
                            </td>
                            <td style={{ padding: '20px', textAlign: 'center', color: '#00d4ff', fontWeight: 'bold', fontSize: '18px' }}>${p.precio}</td>
                            <td style={{ padding: '20px', textAlign: 'center' }}>
                              <span style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{p.plataforma}</span>
                            </td>
                            <td style={{ padding: '20px', textAlign: 'center' }}>
                              <span style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>{p.categoria || 'todos'}</span>
                            </td>
                            <td style={{ padding: '20px', textAlign: 'center', color: 'white', fontWeight: '600' }}>{p.stock}</td>
                            <td style={{ padding: '20px', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>
                              <button 
                                onClick={() => { setForm(p); setEditId(p._id); window.scrollTo(0,0); }} 
                                style={{ padding: '8px 16px', background: 'rgba(0,212,255,0.2)', color: '#00d4ff', border: '2px solid #00d4ff', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.3s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,212,255,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,212,255,0.2)'}
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => deleteProduct(p._id)} 
                                style={{ padding: '8px 16px', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', border: '2px solid #ff6b6b', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.3s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,107,107,0.3)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,107,107,0.2)'}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Banners */}
        {activeTab === 'banners' && (
          <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px' }}>
            <div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>
                  {editBannerId ? '✏️ Editar Banner' : '➕ Agregar Banner'}
                </h2>
                <form onSubmit={handleBannerSubmit}>
                  <input 
                    type="text" 
                    placeholder="URL de la imagen del banner" 
                    value={bannerForm.imagen} 
                    onChange={(e) => setBannerForm({...bannerForm, imagen: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Título del banner" 
                    value={bannerForm.titulo} 
                    onChange={(e) => setBannerForm({...bannerForm, titulo: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Descripción" 
                    value={bannerForm.descripcion} 
                    onChange={(e) => setBannerForm({...bannerForm, descripcion: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="ID del juego (para búsqueda)" 
                    value={bannerForm.juego} 
                    onChange={(e) => setBannerForm({...bannerForm, juego: e.target.value})} 
                    style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '15px', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
                    required 
                  />
                  {bannerForm.imagen && (
                    <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginBottom: '10px' }}>Vista previa:</p>
                      <img 
                        src={bannerForm.imagen} 
                        alt="Preview" 
                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px' }}
                      />
                    </div>
                  )}
                  <button 
                    type="submit" 
                    style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 5px 20px rgba(0,212,255,0.4)', transition: 'transform 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {editBannerId ? '💾 Actualizar' : '✅ Agregar'}
                  </button>
                  {editBannerId && (
                    <button 
                      type="button" 
                      onClick={() => { setEditBannerId(null); setBannerForm({ imagen: '', titulo: '', descripcion: '', juego: '' }); }} 
                      style={{ width: '100%', padding: '16px', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', border: '2px solid #ff6b6b', borderRadius: '12px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold', fontSize: '16px', transition: 'all 0.3s' }}
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </form>
              </div>
            </div>

            <div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '24px', fontWeight: 'bold' }}>🖼️ Banners del Hero ({banners.length})</h2>
                {banners.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                    <div style={{ fontSize: '60px', marginBottom: '15px' }}>🖼️</div>
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>No hay banners. Agrega el primero.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    {banners.map(b => (
                      <div 
                        key={b._id} 
                        style={{ 
                          background: 'rgba(255,255,255,0.03)', 
                          borderRadius: '15px', 
                          overflow: 'hidden',
                          border: '1px solid rgba(0,212,255,0.2)',
                          transition: 'all 0.3s'
                        }}
                      >
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={b.imagen} 
                            alt={b.titulo} 
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                          />
                          <div style={{ 
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            padding: '20px'
                          }}>
                            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{b.titulo}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>{b.descripcion}</p>
                          </div>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '0 0 5px 0' }}>ID del juego:</p>
                            <p style={{ color: '#00d4ff', fontWeight: 'bold', margin: 0 }}>{b.juego}</p>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              onClick={() => { setBannerForm(b); setEditBannerId(b._id); window.scrollTo(0,0); }} 
                              style={{ padding: '8px 16px', background: 'rgba(0,212,255,0.2)', color: '#00d4ff', border: '2px solid #00d4ff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.3s' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,212,255,0.3)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,212,255,0.2)'}
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deleteBanner(b._id)} 
                              style={{ padding: '8px 16px', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', border: '2px solid #ff6b6b', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.3s' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,107,107,0.3)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,107,107,0.2)'}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contenido de Pedidos */}
        {activeTab === 'orders' && (
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '24px', fontWeight: 'bold' }}>📋 Pedidos ({orders.length})</h2>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>📦</div>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>No hay pedidos aún.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                  <thead>
                    <tr style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>USUARIO</th>
                      <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>FECHA</th>
                      <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>TOTAL</th>
                      <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>PRODUCTOS</th>
                      <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id} style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '20px', color: 'white', borderRadius: '12px 0 0 12px', fontWeight: '500' }}>
                          {o.usuario || 'guest'}
                        </td>
                        <td style={{ padding: '20px', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                          {new Date(o.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '20px', textAlign: 'center', color: '#00d4ff', fontWeight: 'bold', fontSize: '18px' }}>${o.total}</td>
                        <td style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
                          {o.productos.length} {o.productos.length === 1 ? 'item' : 'items'}
                        </td>
                        <td style={{ padding: '20px', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>
                          <button 
                            onClick={() => deleteOrder(o._id)} 
                            style={{ padding: '8px 16px', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', border: '2px solid #ff6b6b', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.3s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,107,107,0.3)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,107,107,0.2)'}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Contenido de Admins */}
        {activeTab === 'admin' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '40px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>👑</div>
                <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Gestión de Administradores</h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px' }}>Convierte usuarios en administradores</p>
              </div>
              <input 
                type="email" 
                placeholder="email@ejemplo.com" 
                value={adminEmail} 
                onChange={(e) => setAdminEmail(e.target.value)} 
                style={{ width: '100%', padding: '18px', margin: '12px 0', borderRadius: '12px', border: '2px solid rgba(0,212,255,0.3)', fontSize: '16px', background: 'rgba(255,255,255,0.05)', color: 'white', boxSizing: 'border-box' }} 
              />
              <button 
                onClick={makeAdmin} 
                style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 5px 20px rgba(0,212,255,0.4)', transition: 'transform 0.2s', marginTop: '10px' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ⬆️ Convertir en Administrador
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
