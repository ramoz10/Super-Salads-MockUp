import React from 'react';
import { Trash2, Send, Plus, Minus } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Cart = ({ items, onRemove, onUpdateQuantity, onSendOrder }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
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
        <div className="card" style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            padding: '1rem',
            boxShadow: 'none'
        }}>
            <h2 style={{ 
                marginBottom: isMobile ? '1rem' : '0.75rem', 
                color: 'var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: isMobile ? '1.25rem' : '1.1rem'
            }}>
                Carrito
                <span style={{ 
                    fontSize: '0.8rem', 
                    backgroundColor: 'var(--primary)', 
                    color: 'white', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '1rem' 
                }}>
                    {totalItems.toFixed(2)}
                </span>
            </h2>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: isMobile ? '1rem' : '0.75rem' }}>
                {items.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: isMobile ? '2rem' : '1.5rem', fontSize: '0.9rem' }}>
                        El carrito está vacío
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.75rem' : '0.75rem' }}>
                        {items.map((item) => {
                            const subtotal = item.quantity * (item.price || 0);
                            
                            if (isMobile) {
                                // Vista compacta para mobile
                                return (
                                    <div 
                                        key={item.id} 
                                        style={{ 
                                            padding: '0.75rem',
                                            borderBottom: '1px solid var(--border)',
                                            backgroundColor: 'var(--surface)',
                                            borderRadius: 'var(--radius)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '0.5rem',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    <h4 style={{ 
                                                        margin: 0, 
                                                        fontSize: '0.9rem',
                                                        fontWeight: 600,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {item.name}
                                                    </h4>
                                                    <span style={{ 
                                                        fontSize: '0.75rem', 
                                                        color: 'var(--text-secondary)',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {item.unit}
                                                    </span>
                                                </div>
                                                <div style={{ 
                                                    fontSize: '0.8rem', 
                                                    color: 'var(--text-secondary)' 
                                                }}>
                                                    {formatPrice(item.price || 0)} c/u
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onRemove(item.id)}
                                                style={{ 
                                                    color: 'var(--danger)', 
                                                    background: 'transparent', 
                                                    padding: '0.25rem',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between',
                                            gap: '0.5rem'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    style={{
                                                        backgroundColor: 'var(--background)',
                                                        padding: '0.4rem',
                                                        borderRadius: 'var(--radius)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: '32px',
                                                        height: '32px'
                                                    }}
                                                >
                                                    <Minus size={14} />
                                                </button>

                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                                    min="0.01"
                                                    step="0.01"
                                                    style={{
                                                        width: '60px',
                                                        padding: '0.4rem',
                                                        borderRadius: 'var(--radius)',
                                                        border: '1px solid var(--border)',
                                                        textAlign: 'center',
                                                        fontSize: '0.85rem'
                                                    }}
                                                />

                                                <button
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    style={{
                                                        backgroundColor: 'var(--primary)',
                                                        color: 'white',
                                                        padding: '0.4rem',
                                                        borderRadius: 'var(--radius)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        minWidth: '32px',
                                                        height: '32px'
                                                    }}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            
                                            <span style={{ 
                                                fontSize: '0.9rem', 
                                                fontWeight: 600, 
                                                color: 'var(--primary)',
                                                marginLeft: 'auto'
                                            }}>
                                                {formatPrice(subtotal)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                            
                            // Vista normal para desktop
                            return (
                                <div key={item.id} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                                                {formatPrice(item.price || 0)} / {item.unit}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onRemove(item.id)}
                                            style={{ color: 'var(--danger)', background: 'transparent', padding: '0.25rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            style={{
                                                backgroundColor: 'var(--background)',
                                                padding: '0.4rem',
                                                borderRadius: 'var(--radius)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '28px',
                                                height: '28px'
                                            }}
                                        >
                                            <Minus size={14} />
                                        </button>

                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                            min="0.01"
                                            step="0.01"
                                            style={{
                                                width: '60px',
                                                padding: '0.4rem',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid var(--border)',
                                                textAlign: 'center',
                                                fontSize: '0.85rem'
                                            }}
                                        />

                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            style={{
                                                backgroundColor: 'var(--primary)',
                                                color: 'white',
                                                padding: '0.4rem',
                                                borderRadius: 'var(--radius)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minWidth: '28px',
                                                height: '28px'
                                            }}
                                        >
                                            <Plus size={14} />
                                        </button>

                                        <span style={{ marginLeft: '0.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {item.unit}
                                        </span>
                                        <span style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
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
                    padding: isMobile ? '1rem' : '0.75rem',
                    backgroundColor: 'var(--background)',
                    borderRadius: 'var(--radius)',
                    marginBottom: isMobile ? '1rem' : '0.75rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: isMobile ? '1.1rem' : '1rem', fontWeight: 600 }}>Total:</span>
                        <span style={{ fontSize: isMobile ? '1.3rem' : '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {formatPrice(totalCost)}
                        </span>
                    </div>
                </div>
            )}

            <button
                className="btn-primary"
                onClick={onSendOrder}
                disabled={items.length === 0}
                style={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    opacity: items.length === 0 ? 0.5 : 1,
                    padding: isMobile ? '0.75rem 1.5rem' : '0.65rem 1.25rem',
                    fontSize: isMobile ? '1rem' : '0.9rem'
                }}
            >
                <Send size={isMobile ? 18 : 16} />
                Enviar Pedido
            </button>
        </div>
    );
};

export default Cart;
