import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddToCartModal = ({ isOpen, onClose, product, onConfirm }) => {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quantity > 0) {
            onConfirm(product, quantity);
            setQuantity(1);
            onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '400px', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', padding: 0 }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Agregar al Carrito</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Unidad: {product.unit}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Cantidad ({product.unit})
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            min="0.01"
                            step="0.01"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                fontSize: '1rem'
                            }}
                            placeholder="Ej. 5.5"
                            autoFocus
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)', padding: '0.75rem 1.5rem' }}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary">
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToCartModal;
