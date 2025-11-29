import React, { useState, useEffect } from 'react';
import { Plus, Grid, List as ListIcon, Search, Save, X } from 'lucide-react';
import ProductGrid from '../orders/ProductGrid';
import { ingredientsService } from '../../services/ingredientsService';

const ListBuilder = ({ onSave, onCancel, editingList }) => {
    const [listName, setListName] = useState(editingList?.name || '');
    const [listItems, setListItems] = useState(editingList?.items || []);
    const [viewMode, setViewMode] = useState('list');
    const [productFilter, setProductFilter] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar productos/ingredientes desde Supabase
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await ingredientsService.getAll();
                setProducts(data);
            } catch (error) {
                console.error('Error al cargar productos:', error);
                alert(`Error al cargar productos: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const addToList = (product, quantity) => {
        setListItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const updateQuantity = (id, newQuantity) => {
        setListItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeFromList = (id) => {
        setListItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleSave = () => {
        if (!listName.trim()) {
            alert('Por favor ingresa un nombre para la lista');
            return;
        }
        if (listItems.length === 0) {
            alert('Por favor agrega al menos un producto a la lista');
            return;
        }

        onSave({
            id: editingList?.id || Date.now(),
            name: listName,
            items: listItems
        });
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(productFilter.toLowerCase())
    );

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
                Cargando productos...
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>
                    {editingList ? 'Editar Lista' : 'Nueva Lista'}
                </h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onCancel}
                        style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)', padding: '0.75rem 1.5rem' }}
                    >
                        <X size={18} style={{ marginRight: '0.5rem', display: 'inline' }} />
                        Cancelar
                    </button>
                    <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={20} />
                        Guardar Lista
                    </button>
                </div>
            </div>

            {/* List Name Input */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre de la Lista</label>
                <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Ej. Pedido Semanal, Lista de Verduras..."
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        fontSize: '1rem'
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ margin: 0 }}>Productos Disponibles</h2>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => setViewMode('grid')}
                                style={{
                                    padding: '0.6rem',
                                    borderRadius: 'var(--radius)',
                                    backgroundColor: viewMode === 'grid' ? 'var(--primary)' : 'var(--background)',
                                    color: viewMode === 'grid' ? 'white' : 'var(--text-primary)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Grid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                style={{
                                    padding: '0.6rem',
                                    borderRadius: 'var(--radius)',
                                    backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'var(--background)',
                                    color: viewMode === 'list' ? 'white' : 'var(--text-primary)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <ListIcon size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="card" style={{ marginBottom: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                value={productFilter}
                                onChange={(e) => setProductFilter(e.target.value)}
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

                    <ProductGrid products={filteredProducts} onAddToCart={addToList} viewMode={viewMode} />
                </div>

                <div style={{ width: '350px' }}>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>
                            Items en la Lista ({listItems.length})
                        </h2>

                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                            {listItems.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                                    La lista está vacía
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {listItems.map((item) => (
                                        <div key={item.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ marginBottom: '0.25rem' }}>{item.name}</h4>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        {item.unit}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeFromList(item.id)}
                                                    style={{ color: 'var(--danger)', background: 'transparent', padding: '0.5rem' }}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                                min="0.01"
                                                step="0.01"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.5rem',
                                                    borderRadius: 'var(--radius)',
                                                    border: '1px solid var(--border)',
                                                    textAlign: 'center',
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListBuilder;
