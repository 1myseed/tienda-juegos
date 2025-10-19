import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tienda({ user, setUser, logout }) {
  const [products, setProducts] = useState([]);
  const [plataforma, setPlataforma] = useState('');
  const [search, setSearch] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [pedidoId, setPedidoId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [plataforma, search]);

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (plataforma) params.append('plataforma', plataforma);
    if (search) params.append('search', search);
    
    const response = await fetch(`https://tienda-juegos-backend.onrender.com/api/products?${params}`);
    const data = await response.json();
    setProducts(data);
  };

  const addToCart = (product) => {
    if (!user) {
      if (window.confirm('Debes iniciar sesión para agregar productos al carrito. ¿Quieres iniciar sesión ahora?')) {
        navigate('/login');
      }
      return;
    }
    setCarrito([...carrito, product]);
    alert('✅ Producto agregado al carrito');
  };

  const removeFromCart = (index) => {
    const newCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(newCarrito);
  };

  const comprar = async () => {
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    const response = await fetch('https://tienda-juegos-backend.onrender.com/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usuario: localStorage.getItem('token'),
        productos: carrito,
        total
      })
    });
    const data = await response.json();
    setPedidoId(data._id);
    setMostrarCarrito(false);
    setMostrarPago(true);
  };

  const copiar = (texto) => {
    navigator.clipboard.writeText(texto);
    alert('✅ Copiado');
  };

  const enviarWhatsApp = () => {
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
    const productos = carrito.map(p => p.titulo).join(', ');
    const mensaje = `Hola! Quiero confirmar mi pedido #${pedidoId.slice(-6).toUpperCase()}%0A%0AProductos: ${productos}%0ATotal: $${total}%0A%0AEnvío el comprobante de pago.`;
    const numeroWhatsApp = '5492974588341'; // ⬅️ Cambia este número por el tuyo
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
  };

  // Modal del Carrito
  if (mostrarCarrito) {
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
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
        background: 'rgba(10,14,39,0.95)',
        margin: 0,
        padding: '20px',
        overflowY: 'auto',
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          padding: '40px', 
          borderRadius: '30px', 
          boxShadow: '0 30px 90px rgba(0,0,0,0.5)', 
          maxWidth: '700px', 
          width: '100%', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>🛒 Mi Carrito</h2>
            <button 
              onClick={() => setMostrarCarrito(false)}
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: 'none', 
                color: 'white', 
                fontSize: '24px', 
                cursor: 'pointer', 
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>

          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'rgba(255,255,255,0.5)' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛒</div>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '30px' }}>
                {carrito.map((producto, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '20px', 
                      borderRadius: '15px', 
                      marginBottom: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <img 
                        src={producto.imagen} 
                        alt={producto.titulo} 
                        style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} 
                      />
                      <div>
                        <h4 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '16px' }}>{producto.titulo}</h4>
                        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0', fontSize: '13px' }}>{producto.plataforma}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <p style={{ color: '#00d4ff', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>${producto.precio}</p>
                      <button 
                        onClick={() => removeFromCart(index)}
                        style={{ 
                          background: 'rgba(255,107,107,0.2)', 
                          border: '2px solid #ff6b6b', 
                          color: '#ff6b6b', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          padding: '8px 12px',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                padding: '25px', 
                borderRadius: '20px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '8px', fontWeight: '600' }}>TOTAL</p>
                <p style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>${total}</p>
              </div>

              <button 
                onClick={comprar}
                style={{ 
                  width: '100%', 
                  padding: '18px', 
                  background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '15px', 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  boxShadow: '0 10px 30px rgba(0,212,255,0.5)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                💳 Confirmar Pedido
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (mostrarPago) {
    const total = carrito.reduce((sum, p) => sum + p.precio, 0);
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
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        margin: 0,
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{ background: 'rgba(255,255,255,0.98)', padding: '50px', borderRadius: '30px', boxShadow: '0 30px 90px rgba(0,0,0,0.5)', maxWidth: '550px', width: '100%', backdropFilter: 'blur(10px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎮</div>
            <h2 style={{ color: '#00d4ff', marginBottom: '10px', fontSize: '32px' }}>¡Pedido Confirmado!</h2>
            <p style={{ color: '#666', fontSize: '18px' }}>Pedido #{pedidoId.slice(-6).toUpperCase()}</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px', borderRadius: '20px', marginBottom: '25px', boxShadow: '0 10px 30px rgba(102,126,234,0.3)' }}>
            <h3 style={{ marginBottom: '25px', color: 'white', fontSize: '20px' }}>💳 Datos para Transferencia</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>CVU</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value="0000003100067988368399" 
                  readOnly 
                  style={{ flex: 1, padding: '14px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '500', background: 'rgba(255,255,255,0.95)' }}
                />
                <button onClick={() => copiar('0000003100067988368399')} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px', cursor: 'pointer', fontSize: '20px', transition: 'all 0.3s' }}>
                  📋
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '8px', fontWeight: '600' }}>ALIAS</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value="pablo.rnc" 
                  readOnly 
                  style={{ flex: 1, padding: '14px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '500', background: 'rgba(255,255,255,0.95)' }}
                />
                <button onClick={() => copiar('pablo.rnc')} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '12px', cursor: 'pointer', fontSize: '20px', transition: 'all 0.3s' }}>
                  📋
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '12px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '5px', fontWeight: '600' }}>TITULAR</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Pablo Rodrigo Nahuel Cejas</p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', padding: '25px', borderRadius: '20px', marginBottom: '25px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,212,255,0.3)' }}>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginBottom: '8px', fontWeight: '600' }}>TOTAL A TRANSFERIR</p>
            <p style={{ fontSize: '42px', fontWeight: 'bold', color: 'white' }}>${total}</p>
          </div>

          <button 
            onClick={enviarWhatsApp}
            style={{ 
              width: '100%', 
              padding: '18px', 
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '15px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              boxShadow: '0 10px 30px rgba(37,211,102,0.4)', 
              transition: 'transform 0.2s',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span style={{ fontSize: '24px' }}>💬</span>
            Enviar Comprobante por WhatsApp
          </button>

          <button 
            onClick={() => { setMostrarPago(false); setCarrito([]); }} 
            style={{ width: '100%', padding: '18px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '15px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 30px rgba(102,126,234,0.4)', transition: 'transform 0.2s' }}
          >
            ← Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

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
      <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '25px 40px', color: 'white', boxShadow: '0 5px 30px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>🎮 DigitalPlay</h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {user ? (
              <>
                <button 
                  onClick={() => setMostrarCarrito(true)}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '10px 20px', 
                    borderRadius: '30px', 
                    fontWeight: 'bold', 
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.3)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  🛒 {carrito.length}
                </button>
                {user.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} style={{ padding: '12px 25px', background: '#ff6b6b', border: 'none', borderRadius: '30px', color: 'white', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(255,107,107,0.4)', transition: 'transform 0.2s' }}>
                    ⚙️ Admin
                  </button>
                )}
                <button onClick={logout} style={{ padding: '12px 25px', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '30px', color: 'white', cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}>
                  🚪 Salir
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                style={{ 
                  padding: '12px 25px', 
                  background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', 
                  border: 'none', 
                  borderRadius: '30px', 
                  color: 'white', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  boxShadow: '0 5px 20px rgba(0,212,255,0.4)', 
                  transition: 'all 0.3s' 
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                🔐 Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <div style={{ padding: '50px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '50px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Buscar tu próximo juego..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '20px 25px', borderRadius: '20px', border: 'none', fontSize: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', boxSizing: 'border-box' }}
            />
          </div>
          
          <select 
            value={plataforma} 
            onChange={(e) => setPlataforma(e.target.value)} 
            style={{ padding: '20px 30px', borderRadius: '20px', border: 'none', fontSize: '16px', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
          >
            <option value="" style={{ background: '#1a1a2e', color: 'white' }}>🎯 Todas</option>
            <option value="PC" style={{ background: '#1a1a2e', color: 'white' }}>💻 PC</option>
            <option value="Xbox" style={{ background: '#1a1a2e', color: 'white' }}>🎮 Xbox</option>
            <option value="PlayStation" style={{ background: '#1a1a2e', color: 'white' }}>🕹️ PlayStation</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎮</div>
            <h2 style={{ color: 'white' }}>No hay productos disponibles</h2>
            <p>El administrador agregará juegos pronto</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {products.map(product => (
              <div 
                key={product._id} 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '25px', 
                  overflow: 'hidden', 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(102,126,234,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden', height: '220px' }}>
                  <img 
                    src={product.imagen} 
                    alt={product.titulo} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.7)', padding: '8px 15px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}>
                    {product.plataforma}
                  </div>
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{ fontSize: '20px', marginBottom: '15px', color: 'white', fontWeight: 'bold' }}>{product.titulo}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <p style={{ fontSize: '32px', fontWeight: '900', background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      ${product.precio}
                    </p>
                    <span style={{ color: '#888', fontSize: '14px' }}>Stock: {product.stock}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)} 
                    style={{ 
                      width: '100%', 
                      padding: '15px', 
                      background: user ? 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '15px', 
                      cursor: 'pointer', 
                      fontWeight: 'bold',
                      fontSize: '16px',
                      boxShadow: user ? '0 5px 20px rgba(0,212,255,0.4)' : '0 5px 20px rgba(102,126,234,0.4)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = user ? '0 8px 30px rgba(0,212,255,0.6)' : '0 8px 30px rgba(102,126,234,0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = user ? '0 5px 20px rgba(0,212,255,0.4)' : '0 5px 20px rgba(102,126,234,0.4)';
                    }}
                  >
                    {user ? '🛒 Agregar al Carrito' : '🔐 Iniciar Sesión para Comprar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
