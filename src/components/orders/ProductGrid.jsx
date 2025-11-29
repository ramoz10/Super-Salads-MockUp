import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const ProductGrid = ({ products, onAddToCart, viewMode = 'grid' }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (productId, value) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: value
        }));
    };

    const handleAddToCart = (product) => {
        const quantity = quantities[product.id] || 1;
        if (quantity > 0) {
            onAddToCart(product, quantity);
            // Reset quantity after adding
            setQuantities(prev => ({
                ...prev,
                [product.id]: 1
            }));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    // Grid View
    if (viewMode === 'grid') {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                {products.map((product) => (
                    <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ height: '100px', backgroundColor: '#f3f4f6', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                            <span style={{ fontSize: '0.85rem' }}>Imagen</span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{product.name}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                Unidad: {product.unit}
                            </p>
                            <p style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 600 }}>
                                {formatPrice(product.price)} / {product.unit}
                            </p>
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
                                Cantidad
                            </label>
                            <input
                                type="number"
                                value={quantities[product.id] || 1}
                                onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                                min="0.01"
                                step="0.01"
                                style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    fontSize: '0.95rem',
                                    marginBottom: '0.75rem'
                                }}
                                placeholder="Ej. 5.5"
                            />
                            <button
                                className="btn-primary"
                                onClick={() => handleAddToCart(product)}
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.7rem' }}
                            >
                                <Plus size={18} />
                                Agregar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Vista compacta para mobile
    if (isMobile) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {products.map((product) => (
                    <div 
                        key={product.id} 
                        style={{ 
                            backgroundColor: 'var(--surface)',
                            borderRadius: 'var(--radius)',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}
                    >
                        {/* Información del producto */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                marginBottom: '0.25rem'
                            }}>
                                <h4 style={{ 
                                    margin: 0, 
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {product.name}
                                </h4>
                                <span style={{
                                    padding: '0.15rem 0.5rem',
                                    backgroundColor: 'var(--background)',
                                    borderRadius: '0.5rem',
                                    fontSize: '0.75rem',
                                    color: 'var(--text-secondary)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {product.unit}
                                </span>
                            </div>
                            <div style={{ 
                                fontSize: '0.85rem', 
                                color: 'var(--primary)', 
                                fontWeight: 600 
                            }}>
                                {formatPrice(product.price)}
                            </div>
                        </div>

                        {/* Cantidad y botón */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            flexShrink: 0
                        }}>
                            <input
                                type="number"
                                value={quantities[product.id] || 1}
                                onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                                min="0.01"
                                step="0.01"
                                style={{
                                    width: '60px',
                                    padding: '0.5rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    fontSize: '0.9rem',
                                    textAlign: 'center'
                                }}
                                placeholder="1"
                            />
                            <button
                                className="btn-primary"
                                onClick={() => handleAddToCart(product)}
                                style={{ 
                                    padding: '0.5rem',
                                    minWidth: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                title="Agregar"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // List View para desktop
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}>Producto</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>Unidad</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem' }}>Precio</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, width: '120px', fontSize: '0.9rem' }}>Cantidad</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 600, width: '120px', fontSize: '0.9rem' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '0.75rem' }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>{product.name}</h4>
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                <span style={{
                                    padding: '0.2rem 0.6rem',
                                    backgroundColor: 'var(--background)',
                                    borderRadius: '1rem',
                                    fontSize: '0.8rem'
                                }}>
                                    {product.unit}
                                </span>
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>
                                {formatPrice(product.price)}
                            </td>
                            <td style={{ padding: '0.75rem' }}>
                                <input
                                    type="number"
                                    value={quantities[product.id] || 1}
                                    onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                                    min="0.01"
                                    step="0.01"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        fontSize: '0.85rem',
                                        textAlign: 'center'
                                    }}
                                    placeholder="1"
                                />
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => handleAddToCart(product)}
                                    style={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        gap: '0.4rem', 
                                        padding: '0.5rem 0.85rem',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <Plus size={16} />
                                    Agregar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductGrid;
