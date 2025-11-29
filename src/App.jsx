import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Ingredients from './pages/Ingredients';
import Lists from './pages/Lists';
import Order from './pages/Order';
import History from './pages/History';
import { listsService } from './services/listsService';
import { ordersService } from './services/ordersService';
import { isSupabaseConfigured } from './lib/supabase';
import './index.css';

function App() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [savedLists, setSavedLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Supabase al montar el componente
  useEffect(() => {
    const loadData = async () => {
      // Si Supabase no está configurado, usar datos vacíos
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [lists, orders] = await Promise.all([
          listsService.getAll(),
          ordersService.getAll()
        ]);
        setSavedLists(lists);
        // Transformar pedidos al formato esperado
        const formattedOrders = orders.map(order => ({
          id: order.order_number,
          status: order.status,
          total: order.total,
          itemCount: order.item_count,
          date: order.date,
          items: order.items
        }));
        setOrderHistory(formattedOrders);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        // No mostrar alert si es un error de configuración
        if (!error.message.includes('configurado')) {
          alert(`Error al cargar datos: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleOrderSubmit = async (order) => {
    try {
      const orderNumber = `ORD-${String(orderHistory.length + 1).padStart(3, '0')}`;
      const newOrder = {
        ...order,
        id: orderNumber,
        status: 'Pendiente'
      };
      
      // Guardar en Supabase
      const savedOrder = await ordersService.create(newOrder);
      
      // Actualizar estado local
      const formattedOrder = {
        id: savedOrder.order_number,
        status: savedOrder.status,
        total: savedOrder.total,
        itemCount: savedOrder.item_count,
        date: savedOrder.date,
        items: savedOrder.items
      };
      setOrderHistory(prev => [formattedOrder, ...prev]);
    } catch (error) {
      console.error('Error al guardar pedido:', error);
      alert(`Error al guardar pedido: ${error.message}`);
      throw error;
    }
  };

  const handleSaveLists = async (lists) => {
    // Este método se llama desde ListsView cuando se actualiza una lista
    // La actualización real se hace en ListsView usando listsService
    setSavedLists(lists);
  };

  // Mostrar mensaje de configuración si Supabase no está configurado
  if (!isSupabaseConfigured) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
          ⚠️ Configuración Requerida
        </h1>
        <div style={{ 
          backgroundColor: 'var(--background)', 
          padding: '2rem', 
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          marginBottom: '1rem'
        }}>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            Para usar esta aplicación, necesitas configurar Supabase.
          </p>
          <ol style={{ textAlign: 'left', color: 'var(--text-primary)', lineHeight: '2' }}>
            <li>Crea o edita el archivo <code style={{ backgroundColor: 'var(--background)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>.env</code> en la raíz del proyecto</li>
            <li>Agrega las siguientes líneas con tus credenciales de Supabase:</li>
          </ol>
          <pre style={{ 
            backgroundColor: '#1e1e1e', 
            color: '#d4d4d4', 
            padding: '1rem', 
            borderRadius: 'var(--radius)',
            overflow: 'auto',
            textAlign: 'left',
            marginTop: '1rem',
            fontSize: '0.9rem'
          }}>
{`VITE_SUPABASE_URL=tu_project_url_aqui
VITE_SUPABASE_ANON_KEY=tu_api_key_supabase_aqui`}
          </pre>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Después de configurar el archivo, reinicia el servidor de desarrollo.
          </p>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Consulta <code style={{ backgroundColor: 'var(--background)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>SUPABASE_SETUP.md</code> para más detalles.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: 'var(--text-secondary)'
      }}>
        Cargando datos...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/order" replace />} />
          <Route path="ingredients" element={<Ingredients />} />
          <Route path="lists" element={<Lists savedLists={savedLists} onSaveLists={handleSaveLists} />} />
          <Route path="order" element={<Order onOrderSubmit={handleOrderSubmit} savedLists={savedLists} />} />
          <Route path="history" element={<History orders={orderHistory} />} />
        </Route>
        {/* Redirección adicional para asegurar que cualquier ruta no encontrada vaya a /order */}
        <Route path="*" element={<Navigate to="/order" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
