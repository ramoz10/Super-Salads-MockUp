import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import AddIngredientModal from './AddIngredientModal';
import { ingredientsService } from '../../services/ingredientsService';

const IngredientList = () => {
    const [ingredients, setIngredients] = useState([]);
    const [filter, setFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar ingredientes desde Supabase
    useEffect(() => {
        const loadIngredients = async () => {
            try {
                setLoading(true);
                const data = await ingredientsService.getAll();
                setIngredients(data);
            } catch (error) {
                console.error('Error al cargar ingredientes:', error);
                alert(`Error al cargar ingredientes: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadIngredients();
    }, []);

    const handleSaveIngredient = async (ingredient) => {
        try {
            if (editingIngredient) {
                // Actualizar ingrediente existente
                const updated = await ingredientsService.update(editingIngredient.id, ingredient);
                setIngredients(ingredients.map(ing =>
                    ing.id === updated.id ? updated : ing
                ));
            } else {
                // Crear nuevo ingrediente
                const newIngredient = await ingredientsService.create(ingredient);
                setIngredients([...ingredients, newIngredient]);
            }
            setEditingIngredient(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error al guardar ingrediente:', error);
            alert(`Error al guardar ingrediente: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este ingrediente?')) {
            return;
        }

        try {
            await ingredientsService.delete(id);
            setIngredients(ingredients.filter(ing => ing.id !== id));
        } catch (error) {
            console.error('Error al eliminar ingrediente:', error);
            alert(`Error al eliminar ingrediente: ${error.message}`);
        }
    };

    const handleRowClick = (ingredient) => {
        setEditingIngredient(ingredient);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingIngredient(null);
    };

    const handleNewIngredient = () => {
        setEditingIngredient(null);
        setIsModalOpen(true);
    };

    const filteredIngredients = ingredients.filter(ing =>
        ing.name.toLowerCase().includes(filter.toLowerCase())
    );

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh',
                fontSize: '1.2rem',
                color: 'var(--text-secondary)'
            }}>
                Cargando ingredientes...
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>Ingredientes</h1>
                <button className="btn-primary" onClick={handleNewIngredient} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Nuevo Ingrediente
                </button>
            </div>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar ingrediente..."
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
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Nombre</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Unidad</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Precio</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600 }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIngredients.map((ing) => (
                            <tr
                                key={ing.id}
                                style={{
                                    borderBottom: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handleRowClick(ing)}
                            >
                                <td style={{ padding: '1rem' }}>{ing.name}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: 'var(--background)',
                                        borderRadius: '1rem',
                                        fontSize: '0.875rem'
                                    }}>
                                        {ing.unit}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--primary)' }}>
                                    {formatPrice(ing.price)}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(ing.id);
                                        }}
                                        style={{ color: 'var(--danger)', background: 'transparent', padding: '0.5rem' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredIngredients.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No se encontraron ingredientes
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <AddIngredientModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveIngredient}
                editingIngredient={editingIngredient}
            />
        </div>
    );
};

export default IngredientList;
