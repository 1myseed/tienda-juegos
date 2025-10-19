import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin({ logout }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ titulo: '', precio: '', plataforma: 'PC', imagen: '', descripcion: '', stock: 0 });
  const [editId, setEditId] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
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
    setForm({ titulo: '', precio: '', plataforma: 'PC', imagen: '', descripcion: '', stock: 0 });
    setEditId(null);
    fetchProducts();
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
      <header style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', padding: '25px 40px', color: 'white', boxShadow: '0 5px 30px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '1px' }}>⚙️ PANEL DE ADMINISTRACIÓN</h1>
            <p style={{ fontSize: '14px', opacity: '0.9', marginTop: '5px' }}>Gestiona productos, pedidos y usuarios</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => navigate('/')} style={{ padding: '12px 25px', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '30px', color: 'white', cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}>
              🏪 Tienda
            </button>
            <button onClick={logout} style={{ padding: '12px 25px', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '30px', color: 'white', cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}>
              🚪 Salir
            </button>
          </div>
        </div>
      </header>

      <div style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px' }}>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '25px', marginBottom: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ color: 'white', marginBottom: '25px', fontSize: '22px', fontWeight: 'bold' }}>
                {editId ? '✏️ Editar Producto' : '➕ Agregar Producto'}
              </h2>
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Título del juego" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: 'none', fontSize: '15px', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }} required />
                <input type="number" placeholder="Precio" value={form.precio} onChange={(e) => setForm({...form, precio: e.target.value})} style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: 'none', fontSize: '15px', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }} required />
                <select value={form.plataforma} onChange={(e) => setForm({...form, plataforma: e.target.value})} style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: 'none', fontSize: '15px', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', boxSizing: 'border-box' }}>
                  <option style={{ background: '#1a1a2e' }}>PC</option>
                  <option style={{ background: '#1a1a2e' }}>Xbox</option>
                  <option style={{ background: '#1a1a2e' }}>PlayStation</option>
                </select>
                <input type="text" placeholder="URL de la imagen" value={form.imagen} onChange={(e) => setForm({...form, imagen: e.target.value})} style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: 'none', fontSize: '15px', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }} required />
                <input type="number" placeholder="Stock disponible" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: 'none', fontSize: '15px', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }} required />
                <button type="submit" style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 5px 20px rgba(0,212,255,0.4)' }}>
                  {editId ? '💾 Actualizar' : '✅ Agregar'}
                </button>
                {editId && (
                  <button type="button" onClick={() => { setEditId(null); setForm({ titulo: '', precio: '', plataforma: 'PC', imagen: '', descripcion: '', stock: 0 }); }} style={{ width: '100%', padding: '16px', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', border: '2px solid #ff6b6b', borderRadius: '12px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold', fontSize: '16px' }}>
                    ❌ Cancelar
                  </button>
                )}
              </form>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' }}>👑 Hacer Admin</h2>
              <input type="email" placeholder="email@ejemplo.com" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} style={{ width: '100%', padding: '15px', margin: '12px 0', borderRadius: '12px', border: 'none', fontSize: '15px', background: 'rgba(255,255,255,0.1)', color: 'white', boxSizing: 'border-box' }} />
              <button onClick={makeAdmin} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 5px 20px rgba(102,126,234,0.4)' }}>
                ⬆️ Convertir en Admin
              </button>
            </div>
          </div>

          <div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '25px', marginBottom: '30px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
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
                            <span style={{ background: 'rgba(102,126,234,0.3)', color: '#667eea', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{p.plataforma}</span>
                          </td>
                          <td style={{ padding: '20px', textAlign: 'center', color: 'white', fontWeight: '600' }}>{p.stock}</td>
                          <td style={{ padding: '20px', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>
                            <button onClick={() => { setForm(p); setEditId(p._id); window.scrollTo(0,0); }} style={{ padding: '8px 16px', background: 'rgba(0,212,255,0.2)', color: '#00d4ff', border: '2px solid #00d4ff', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold', fontSize: '13px' }}>✏️</button>
                            <button onClick={() => deleteProduct(p._id)} style={{ padding: '8px 16px', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', border: '2px solid #ff6b6b', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '25px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
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
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>FECHA</th>
                        <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>TOTAL</th>
                        <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>ESTADO</th>
                        <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>PRODUCTOS</th>
                        <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id} style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '20px', color: 'white', borderRadius: '12px 0 0 12px' }}>
                            {new Date(o.fecha).toLocaleDateString('es-AR')}
                          </td>
                          <td style={{ padding: '20px', textAlign: 'center', color: '#00d4ff', fontWeight: 'bold', fontSize: '18px' }}>${o.total}</td>
                          <td style={{ padding: '20px', textAlign: 'center' }}>
                            <span style={{ background: 'rgba(255,193,7,0.2)', color: '#ffc107', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>{o.estado}</span>
                          </td>
                          <td style={{ padding: '20px', textAlign: 'center', color: 'white' }}>{o.productos.length} items</td>
                          <td style={{ padding: '20px', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>
                            <button onClick={() => deleteOrder(o._id)} style={{ padding: '8px 16px', background: 'rgba(255,107,107,0.2)', color: '#ff6b6b', border: '2px solid #ff6b6b', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>🗑️</button>
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
      </div>
    </div>
  );
}
