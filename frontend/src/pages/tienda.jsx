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
        usuario: user?.email || 'guest',
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
    const numeroWhatsApp = '5492975364593';
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
        background: 'rgba(0,0,0,0.85)',
        margin: 0,
        padding: '20px',
        overflowY: 'auto',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '12px', 
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)', 
          maxWidth: '700px', 
          width: '100%'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#333', fontSize: '28px', fontWeight: '700', margin: 0 }}>🛒 Mi Carrito</h2>
            <button 
              onClick={() => setMostrarCarrito(false)}
              style={{ 
                background: '#f5f5f5', 
                border: 'none', 
                color: '#666', 
                fontSize: '24px', 
                cursor: 'pointer', 
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e0e0e0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f5f5f5'}
            >
              ✕
            </button>
          </div>

          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛒</div>
              <p style={{ fontSize: '16px' }}>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '30px' }}>
                {carrito.map((producto, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      background: '#f9f9f9', 
                      padding: '15px', 
                      borderRadius: '8px', 
                      marginBottom: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid #eee'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                      <img 
                        src={producto.imagen} 
                        alt={producto.titulo} 
                        style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} 
                      />
                      <div>
                        <h4 style={{ color: '#333', margin: '0 0 5px 0', fontSize: '15px', fontWeight: '600' }}>{producto.titulo}</h4>
                        <p style={{ color: '#999', margin: '0', fontSize: '13px' }}>{producto.plataforma}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <p style={{ color: '#667eea', fontSize: '18px', fontWeight: '700', margin: 0 }}>${producto.precio}</p>
                      <button 
                        onClick={() => removeFromCart(index)}
                        style={{ 
                          background: '#fff', 
                          border: '1px solid #ff6b6b', 
                          color: '#ff6b6b', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          padding: '8px 12px',
                          fontWeight: '600',
                          fontSize: '14px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#ff6b6b';
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.color = '#ff6b6b';
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
                padding: '20px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</p>
                <p style={{ color: 'white', fontSize: '36px', fontWeight: '700', margin: 0 }}>${total}</p>
              </div>

              <button 
                onClick={comprar}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 12px rgba(0,212,255,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,212,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,212,255,0.3)';
                }}
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
        background: '#f5f5f5',
        margin: 0,
        padding: '20px',
        overflowY: 'auto'
      }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', maxWidth: '550px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <div style={{ fontSize: '70px', marginBottom: '15px' }}>🎮</div>
            <h2 style={{ color: '#00d4ff', marginBottom: '8px', fontSize: '28px', fontWeight: '700' }}>¡Pedido Confirmado!</h2>
            <p style={{ color: '#999', fontSize: '16px' }}>Pedido #{pedidoId.slice(-6).toUpperCase()}</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '25px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '20px', color: 'white', fontSize: '18px', fontWeight: '600' }}>💳 Datos para Transferencia</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CVU</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value="0000003100067988368399" 
                  readOnly 
                  style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '500', background: 'white' }}
                />
                <button onClick={() => copiar('0000003100067988368399')} style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '18px', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
                  📋
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alias</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value="pablo.rnc" 
                  readOnly 
                  style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '500', background: 'white' }}
                />
                <button onClick={() => copiar('pablo.rnc')} style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '18px', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}>
                  📋
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '6px' }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Titular</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'white', margin: 0 }}>Pablo Rodrigo Nahuel Cejas</p>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total a Transferir</p>
            <p style={{ fontSize: '36px', fontWeight: '700', color: 'white', margin: 0 }}>${total}</p>
          </div>

          <button 
            onClick={enviarWhatsApp}
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              transition: 'transform 0.2s, box-shadow 0.2s',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37,211,102,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,211,102,0.3)';
            }}
          >
            <span style={{ fontSize: '20px' }}>💬</span>
            Enviar Comprobante por WhatsApp
          </button>

          <button 
            onClick={() => { setMostrarPago(false); setCarrito([]); }} 
            style={{ 
              width: '100%', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: 'pointer', 
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102,126,234,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,0.3)';
            }}
          >
            ← Volver a la Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f5f5f5',
      margin: 0,
      padding: 0
    }}>
      <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px 30px', color: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '1px', margin: 0 }}>🎮 DigitalPlay</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {user ? (
              <>
                <button 
                  onClick={() => setMostrarCarrito(true)}
                  style={{ 
                    background: 'rgba(255,255,255,0.2)', 
                    padding: '10px 18px', 
                    borderRadius: '6px', 
                    fontWeight: '600', 
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '15px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                  🛒 {carrito.length}
                </button>
                {user.role === 'admin' && (
                  <button onClick={() => navigate('/admin')} style={{ padding: '10px 18px', background: '#ff6b6b', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'opacity 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                    ⚙️ Admin
                  </button>
                )}
                <button onClick={logout} style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}>
                  🚪 Salir
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                style={{ 
                  padding: '10px 18px', 
                  background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', 
                  border: 'none', 
                  borderRadius: '6px', 
                  color: 'white', 
                  cursor: 'pointer', 
                  fontWeight: '600', 
                  fontSize: '15px',
                  transition: 'transform 0.2s' 
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🔐 Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </header>

      <div style={{ padding: '40px 30px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar juegos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 18px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px', background: 'white', color: '#333', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
            />
          </div>
          
          <select 
            value={plataforma} 
            onChange={(e) => setPlataforma(e.target.value)} 
            style={{ padding: '14px 20px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '15px', fontWeight: '600', background: 'white', color: '#333', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
          >
            <option value="">🎯 Todas las plataformas</option>
            <option value="PC">💻 PC</option>
            <option value="Xbox">🎮 Xbox</option>
            <option value="PlayStation">🕹️ PlayStation</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '70px', marginBottom: '20px' }}>🎮</div>
            <h2 style={{ color: '#333', fontSize: '24px', marginBottom: '10px', fontWeight: '700' }}>No hay productos disponibles</h2>
            <p style={{ color: '#999', fontSize: '16px' }}>El administrador agregará juegos pronto</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {products.map((product, index) => (
              <div 
                key={product._id} 
                style={{ 
                  background: 'white', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden', height: '200px', background: '#f5f5f5' }}>
                  <img 
                    src={product.imagen} 
                    alt={product.titulo} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {index % 3 === 0 && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#00d4ff', padding: '4px 10px', borderRadius: '4px', color: 'white', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Nuevo
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', padding: '6px 12px', borderRadius: '4px', color: 'white', fontSize: '12px', fontWeight: '600' }}>
                    {product.plataforma}
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#333', fontWeight: '600', lineHeight: '1.4', minHeight: '44px' }}>{product.titulo}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#667eea', margin: 0 }}>
                      ${product.precio}
                    </p>
                    <span style={{ color: '#999', fontSize: '13px', fontWeight: '500' }}>Stock: {product.stock}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)} 
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      background: user ? 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      boxShadow: user ? '0 4px 12px rgba(0,212,255,0.3)' : '0 4px 12px rgba(102,126,234,0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = user ? '0 6px 20px rgba(0,212,255,0.4)' : '0 6px 20px rgba(102,126,234,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = user ? '0 4px 12px rgba(0,212,255,0.3)' : '0 4px 12px rgba(102,126,234,0.3)';
                    }}
                  >
                    {user ? '🛒 Agregar al Carrito' : '🔐 Iniciar Sesión'}
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
