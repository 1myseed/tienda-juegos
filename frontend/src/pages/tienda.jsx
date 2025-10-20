import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tienda({ user, setUser, logout }) {
  const [products, setProducts] = useState([]);
  const [categoria, setCategoria] = useState('todos');
  const [search, setSearch] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tipoCuenta, setTipoCuenta] = useState('primaria');
  const [cantidad, setCantidad] = useState(1);
  const [pedidoId, setPedidoId] = useState('');
  const [bannerActual, setBannerActual] = useState(0);
  const navigate = useNavigate();

  // Banners del hero - PUEDES CAMBIAR ESTAS IMÁGENES
  const banners = [
    {
      imagen: 'https://imgs.search.brave.com/jCVK3p2YE2jbRZe_H2sU5hNdBLoEhhQogqX3U72fWvk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDE0NTA1/MTQzLmpwZw',
      titulo: 'Ea Sports FC 26',
      descripcion: 'Domina la cancha como nunca',
      juego: 'fc26'
    },
    {
      imagen: 'https://imgs.search.brave.com/_yoWBpE5auKY-P00YmPk9vaGHUmmnFqOdz9LEhlC6DY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvY2Fs/bC1vZi1kdXR5LWdo/b3N0cy1zb2xkaWVy/cy1jb3Zlci1lbzhh/eGJvbzNlcmExenV3/LmpwZw',
      titulo: 'Call of Duty',
      descripcion: 'La batalla más épica te espera',
      juego: 'cod'
    },
    {
      imagen: 'https://imgs.search.brave.com/Nmn9V9e2s-Qj2NtLCIS3XT7GGz01r0tRS1bLzRc17-o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvZ3Rh/LTUtcGljdHVyZXMt/cGFuNmNhcHl0NWsz/Mm0zdi5qcGc',
      titulo: 'GTA V',
      descripcion: 'Vive la experiencia más realista',
      juego: 'gta5'
    },
    {
      imagen: 'https://imgs.search.brave.com/CBjcQpBYIaOYFtg5ejRtOAxgGAsAk9WAG29ZvCMVjzc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDI1MTM1/MTYuanBn',
      titulo: 'Spider-Man',
      descripcion: 'Sé el Heroe que nueva york necesita',
      juego: 'spider'
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, [categoria, search]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerActual((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (categoria !== 'todos') params.append('categoria', categoria);
    if (search) params.append('search', search);
    
    const response = await fetch(`https://tienda-juegos-backend.onrender.com/api/products?${params}`);
    const data = await response.json();
    setProducts(data);
  };

  const abrirModalProducto = (product) => {
    if (!user) {
      if (window.confirm('Debes iniciar sesión para agregar productos al carrito. ¿Quieres iniciar sesión ahora?')) {
        navigate('/login');
      }
      return;
    }
    setProductoSeleccionado(product);
    setMostrarModal(true);
    setTipoCuenta('primaria');
    setCantidad(1);
  };

  const addToCart = () => {
    const itemCarrito = {
      ...productoSeleccionado,
      tipoCuenta,
      cantidad,
      precioTotal: productoSeleccionado.precio * cantidad
    };
    setCarrito([...carrito, itemCarrito]);
    setMostrarModal(false);
    alert('✅ Producto agregado al carrito');
  };

  const removeFromCart = (index) => {
    const newCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(newCarrito);
  };

  const comprar = async () => {
    const total = carrito.reduce((sum, p) => sum + p.precioTotal, 0);
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
    const total = carrito.reduce((sum, p) => sum + p.precioTotal, 0);
    const productos = carrito.map(p => `${p.titulo} (${p.tipoCuenta} x${p.cantidad})`).join(', ');
    const mensaje = `Hola! Quiero confirmar mi pedido #${pedidoId.slice(-6).toUpperCase()}%0A%0AProductos: ${productos}%0ATotal: $${total}%0A%0AEnvío el comprobante de pago.`;
    const numeroWhatsApp = '5492975364593';
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
  };

  const irAJuego = (juegoId) => {
    setSearch(juegoId);
    window.scrollTo({ top: 800, behavior: 'smooth' });
  };

  // Modal de selección de cuenta y cantidad
  if (mostrarModal && productoSeleccionado) {
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
          maxWidth: '550px', 
          width: '100%',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>⚙️ Configurar Compra</h2>
            <button 
              onClick={() => setMostrarModal(false)}
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

          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <img src={productoSeleccionado.imagen} alt={productoSeleccionado.titulo} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
            <h3 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>{productoSeleccionado.titulo}</h3>
            <p style={{ color: '#00d4ff', fontSize: '32px', fontWeight: '900', margin: 0 }}>${productoSeleccionado.precio}</p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Tipo de Cuenta</label>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => setTipoCuenta('primaria')}
                style={{
                  flex: 1,
                  padding: '18px',
                  background: tipoCuenta === 'primaria' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  border: tipoCuenta === 'primaria' ? 'none' : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  transition: 'all 0.3s',
                  boxShadow: tipoCuenta === 'primaria' ? '0 10px 30px rgba(102,126,234,0.5)' : 'none'
                }}
              >
                🔐 Primaria
              </button>
              <button
                onClick={() => setTipoCuenta('secundaria')}
                style={{
                  flex: 1,
                  padding: '18px',
                  background: tipoCuenta === 'secundaria' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  border: tipoCuenta === 'secundaria' ? 'none' : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  transition: 'all 0.3s',
                  boxShadow: tipoCuenta === 'secundaria' ? '0 10px 30px rgba(102,126,234,0.5)' : 'none'
                }}
              >
                👥 Secundaria
              </button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '10px', textAlign: 'center' }}>
              {tipoCuenta === 'primaria' ? '✓ Acceso completo a tu cuenta' : '✓ Juega desde otra consola'}
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Cantidad</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                −
              </button>
              <div style={{
                minWidth: '80px',
                padding: '15px 25px',
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{cantidad}</span>
              </div>
              <button
                onClick={() => setCantidad(cantidad + 1)}
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', 
            padding: '25px', 
            borderRadius: '20px', 
            marginBottom: '25px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,212,255,0.5)'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</p>
            <p style={{ color: 'white', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>${productoSeleccionado.precio * cantidad}</p>
          </div>

          <button 
            onClick={addToCart}
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
            🛒 Agregar al Carrito
          </button>
        </div>
      </div>
    );
  }

  // Modal del Carrito
  if (mostrarCarrito) {
    const total = carrito.reduce((sum, p) => sum + p.precioTotal, 0);
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
                        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0', fontSize: '13px' }}>
                          {producto.tipoCuenta === 'primaria' ? '🔐 Primaria' : '👥 Secundaria'} • x{producto.cantidad}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <p style={{ color: '#00d4ff', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>${producto.precioTotal}</p>
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
    const total = carrito.reduce((sum, p) => sum + p.precioTotal, 0);
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
      {/* Header Principal */}
      <header style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '25px 40px', color: 'white', boxShadow: '0 5px 30px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Logo y Eslogan */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)', margin: '0 0 5px 0' }}>🎮 DigitalPlay</h1>
              <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', opacity: 0.9 }}>Domina la cancha como nunca</p>
            </div>
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

          {/* Navegación por Categorías */}
          <nav style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setCategoria('todos')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                fontWeight: categoria === 'todos' ? '900' : '600', 
                fontSize: '15px', 
                padding: '8px 0',
                borderBottom: categoria === 'todos' ? '3px solid white' : 'none',
                opacity: categoria === 'todos' ? 1 : 0.7,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = categoria === 'todos' ? '1' : '0.7'}
            >
              INICIO
            </button>
            <button 
              onClick={() => setCategoria('ofertas')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                fontWeight: categoria === 'ofertas' ? '900' : '600', 
                fontSize: '15px', 
                padding: '8px 0',
                borderBottom: categoria === 'ofertas' ? '3px solid white' : 'none',
                opacity: categoria === 'ofertas' ? 1 : 0.7,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = categoria === 'ofertas' ? '1' : '0.7'}
            >
              🔥 OFERTAS
            </button>
            <button 
              onClick={() => setCategoria('ps-plus')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                fontWeight: categoria === 'ps-plus' ? '900' : '600', 
                fontSize: '15px', 
                padding: '8px 0',
                borderBottom: categoria === 'ps-plus' ? '3px solid white' : 'none',
                opacity: categoria === 'ps-plus' ? 1 : 0.7,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = categoria === 'ps-plus' ? '1' : '0.7'}
            >
              PS PLUS
            </button>
            <button 
              onClick={() => setCategoria('ps4')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                fontWeight: categoria === 'ps4' ? '900' : '600', 
                fontSize: '15px', 
                padding: '8px 0',
                borderBottom: categoria === 'ps4' ? '3px solid white' : 'none',
                opacity: categoria === 'ps4' ? 1 : 0.7,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = categoria === 'ps4' ? '1' : '0.7'}
            >
              PS4
            </button>
            <button 
              onClick={() => setCategoria('ps5')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                fontWeight: categoria === 'ps5' ? '900' : '600', 
                fontSize: '15px', 
                padding: '8px 0',
                borderBottom: categoria === 'ps5' ? '3px solid white' : 'none',
                opacity: categoria === 'ps5' ? 1 : 0.7,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = categoria === 'ps5' ? '1' : '0.7'}
            >
              PS5
            </button>
            <button 
              onClick={() => navigate('/faq')} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                fontWeight: '600', 
                fontSize: '15px', 
                padding: '8px 0',
                opacity: 0.7,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
            >
              ❓ PREGUNTAS FRECUENTES
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Banner Rotativo */}
      <div style={{ position: 'relative', height: '500px', overflow: 'hidden', background: '#000' }}>
        {banners.map((banner, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: bannerActual === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${banner.imagen})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ 
              textAlign: 'center', 
              color: 'white', 
              maxWidth: '800px', 
              padding: '40px',
              animation: bannerActual === index ? 'fadeInUp 0.8s ease-out' : 'none'
            }}>
              <h2 style={{ 
                fontSize: '64px', 
                fontWeight: '900', 
                marginBottom: '20px', 
                textShadow: '3px 3px 15px rgba(0,0,0,0.7)',
                letterSpacing: '2px'
              }}>
                {banner.titulo}
              </h2>
              <p style={{ 
                fontSize: '24px', 
                marginBottom: '40px', 
                textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
                fontWeight: '500'
              }}>
                {banner.descripcion}
              </p>
            </div>
          </div>
        ))}

        {/* Indicadores de Banner */}
        <div style={{ 
          position: 'absolute', 
          bottom: '30px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          display: 'flex', 
          gap: '12px', 
          zIndex: 10 
        }}>
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setBannerActual(index)}
              style={{
                width: bannerActual === index ? '50px' : '15px',
                height: '15px',
                background: bannerActual === index ? '#00d4ff' : 'rgba(255,255,255,0.4)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.4s',
                boxShadow: bannerActual === index ? '0 0 20px rgba(0,212,255,0.8)' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{ padding: '50px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Barra de Búsqueda */}
        <div style={{ marginBottom: '50px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar tu próximo juego..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '20px 25px', 
              borderRadius: '20px', 
              border: 'none', 
              fontSize: '16px', 
              background: 'rgba(255,255,255,0.1)', 
              color: 'white', 
              backdropFilter: 'blur(10px)', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)', 
              boxSizing: 'border-box',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(102,126,234,0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            }}
          />
        </div>

        {/* Grid de Productos */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', color: '#666' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎮</div>
            <h2 style={{ color: 'white' }}>No hay productos disponibles</h2>
            <p>El administrador agregará juegos pronto</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {products.map((product, index) => (
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
                  cursor: 'pointer',
                  position: 'relative'
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
                  {index % 3 === 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '15px', 
                      left: '15px', 
                      background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)', 
                      padding: '6px 12px', 
                      borderRadius: '20px', 
                      color: 'white', 
                      fontSize: '11px', 
                      fontWeight: 'bold', 
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 15px rgba(0,212,255,0.5)'
                    }}>
                      NUEVO
                    </div>
                  )}
                  <div style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    right: '15px', 
                    background: 'rgba(0,0,0,0.7)', 
                    padding: '8px 15px', 
                    borderRadius: '20px', 
                    color: 'white', 
                    fontSize: '12px', 
                    fontWeight: 'bold', 
                    backdropFilter: 'blur(10px)' 
                  }}>
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
                    onClick={() => abrirModalProducto(product)} 
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

      {/* Animaciones CSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
