import React, { useState } from 'react';
import { Search, Calendar, ChevronRight } from 'lucide-react';

const HistoryView = ({ orders = [] }) => {
    const [filter, setFilter] = useState('');

    const getStatusColor = (status) => {
        switch (status) {
            case 'Entregado': return '#10b981';
            case 'Pendiente': return '#f59e0b';
            case 'En Camino': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(filter.toLowerCase()) ||
        order.status.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Historial de Pedidos</h1>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por ID o estado..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 3rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            fontSize: '1rem'
                        }}
                    />
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>ID Pedido</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Fecha</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Items</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Total</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No hay pedidos en el historial
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{order.id}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={16} />
                                            {formatDate(order.date)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{order.itemCount}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>
                                        {formatPrice(order.total)}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: `${getStatusColor(order.status)}20`,
                                            color: getStatusColor(order.status),
                                            borderRadius: '1rem',
                                            fontSize: '0.875rem',
                                            fontWeight: 500
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                                            <ChevronRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryView;
