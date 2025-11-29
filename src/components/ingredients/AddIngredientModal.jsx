import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddIngredientModal = ({ isOpen, onClose, onSave, editingIngredient }) => {
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('kg');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (editingIngredient) {
            setName(editingIngredient.name);
            setUnit(editingIngredient.unit);
            setPrice(editingIngredient.price || '');
        } else {
            setName('');
            setUnit('kg');
            setPrice('');
        }
    }, [editingIngredient, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...(editingIngredient || {}),
            name,
            unit,
            price: parseFloat(price) || 0
        });
        setName('');
        setUnit('kg');
        setPrice('');
        onClose();
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

                <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    {editingIngredient ? 'Editar Ingrediente' : 'Agregar Ingrediente'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                fontSize: '1rem'
                            }}
                            placeholder="Ej. Tomate Bola"
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Unidad</label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                fontSize: '1rem',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="kg">Kilogramos (kg)</option>
                            <option value="L">Litros (L)</option>
                            <option value="g">Gramos (g)</option>
                            <option value="pz">Piezas (pz)</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                            Precio por Unidad (MXN)
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            min="0"
                            step="0.01"
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                fontSize: '1rem'
                            }}
                            placeholder="Ej. 25.50"
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
                            {editingIngredient ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddIngredientModal;
