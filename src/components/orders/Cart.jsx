import React from 'react';
import { Trash2, Send, Plus, Minus } from 'lucide-react';

const Cart = ({ items, onRemove, onUpdateQuantity, onSendOrder }) => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalCost = items.reduce((acc, item) => acc + (item.quantity * (item.price || 0)), 0);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity > 0) {
            onUpdateQuantity(itemId, newQuantity);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Carrito
                <span style={{ fontSize: '0.9rem', backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>
                    {totalItems.toFixed(2)}
                </span>
            </h2>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                {items.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                        El carrito está vacío
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {items.map((item) => {
                            const subtotal = item.quantity * (item.price || 0);
                            return (
                                <div key={item.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {formatPrice(item.price || 0)} / {item.unit}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onRemove(item.id)}
                                            style={{ color: 'var(--danger)', background: 'transparent', padding: '0.5rem' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            style={{
                                                backgroundColor: 'var(--background)',
                                                padding: '0.5rem',
                                                borderRadius: 'var(--radius)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Minus size={16} />
                                        </button>

                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                            min="0.01"
                                            step="0.01"
                                            style={{
                                                width: '70px',
                                                padding: '0.5rem',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid var(--border)',
                                                textAlign: 'center',
                                                fontSize: '0.9rem'
                                            }}
                                        />

                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            style={{
                                                backgroundColor: 'var(--primary)',
                                                color: 'white',
                                                padding: '0.5rem',
                                                borderRadius: 'var(--radius)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <Plus size={16} />
                                        </button>

                                        <span style={{ marginLeft: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {item.unit}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.5rem',
                                        backgroundColor: 'var(--background)',
                                        borderRadius: 'var(--radius)'
                                    }}>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Subtotal:</span>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
                                            {formatPrice(subtotal)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {items.length > 0 && (
                <div style={{
                    padding: '1rem',
                    backgroundColor: 'var(--background)',
                    borderRadius: 'var(--radius)',
                    marginBottom: '1rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total:</span>
                        <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {formatPrice(totalCost)}
                        </span>
                    </div>
                </div>
            )}

            <button
                className="btn-primary"
                onClick={onSendOrder}
                disabled={items.length === 0}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: items.length === 0 ? 0.5 : 1 }}
            >
                <Send size={18} />
                Enviar Pedido
            </button>
        </div>
    );
};

export default Cart;
