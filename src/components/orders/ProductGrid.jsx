import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const ProductGrid = ({ products, onAddToCart, viewMode = 'grid' }) => {
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

    // List View
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                    <tr>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Producto</th>
                        <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Unidad</th>
                        <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Precio</th>
                        <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, width: '150px' }}>Cantidad</th>
                        <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, width: '150px' }}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '1rem' }}>
                                <h4 style={{ marginBottom: '0.25rem' }}>{product.name}</h4>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: 'var(--background)',
                                    borderRadius: '1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    {product.unit}
                                </span>
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>
                                {formatPrice(product.price)}
                            </td>
                            <td style={{ padding: '1rem' }}>
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
                                        textAlign: 'center'
                                    }}
                                    placeholder="Ej. 5.5"
                                />
                            </td>
                            <td style={{ padding: '1rem', textAlign: 'center' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => handleAddToCart(product)}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
                                >
                                    <Plus size={18} />
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
