import React, { useState, useEffect } from 'react';
import { Grid, List, Search, FileText, Check } from 'lucide-react';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import ExcelUploader from './ExcelUploader';
import { ingredientsService } from '../../services/ingredientsService';

const OrderView = ({ onOrderSubmit, savedLists = [] }) => {
    const [cartItems, setCartItems] = useState([]);
    const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
    const [productFilter, setProductFilter] = useState('');
    const [selectedListId, setSelectedListId] = useState('');
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

    const addToCart = (product, quantity) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => {
                // Comparar por ingredient_id si existe, de lo contrario por id
                if (item.ingredient_id && product.id) {
                    return item.ingredient_id === product.id;
                }
                return item.id === product.id;
            });
            
            if (existing) {
                return prev.map((item) => {
                    const isMatch = (item.ingredient_id && product.id && item.ingredient_id === product.id) ||
                                   item.id === product.id;
                    return isMatch ? { ...item, quantity: item.quantity + quantity } : item;
                });
            }
            
            // Agregar producto con ingredient_id si es un producto de la BD
            return [...prev, { 
                ...product, 
                ingredient_id: product.id, // El id del producto es el ingredient_id real
                quantity 
            }];
        });
    };

    const updateQuantity = (id, newQuantity) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleExcelUpload = (data) => {
        const newItems = data.map((row, index) => {
            const productName = row.Nombre || row.nombre || row.name || 'Desconocido';
            const productUnit = row.Unidad || row.unidad || row.unit || 'pz';
            const quantity = Number(row.Cantidad || row.cantidad || row.quantity) || 1;

            // Buscar producto coincidente en el catálogo por nombre (insensible a mayúsculas)
            const matchingProduct = products.find(p =>
                p.name.toLowerCase() === productName.toLowerCase()
            );

            return {
                id: `excel-${Date.now()}-${index}`, // ID temporal para React
                ingredient_id: matchingProduct ? matchingProduct.id : null, // ID real del ingrediente en BD
                name: productName,
                unit: matchingProduct ? matchingProduct.unit : productUnit,
                price: matchingProduct ? matchingProduct.price : 0,
                quantity: quantity
            };
        });
        setCartItems((prev) => [...prev, ...newItems]);
    };

    const handleApplyList = () => {
        if (!selectedListId) {
            return;
        }

        const selectedList = savedLists.find(list => String(list.id) === String(selectedListId));
        if (!selectedList || !selectedList.items || selectedList.items.length === 0) {
            return;
        }

        // Agregar items de la lista al carrito
        // Si un producto ya existe en el carrito, sumar las cantidades
        setCartItems((prev) => {
            const updatedItems = [...prev];
            
            selectedList.items.forEach((listItem) => {
                // Buscar por ingredient_id si existe, de lo contrario por id
                const existingIndex = updatedItems.findIndex(item => {
                    if (item.ingredient_id && listItem.id) {
                        return item.ingredient_id === listItem.id;
                    }
                    return item.id === listItem.id;
                });
                
                if (existingIndex >= 0) {
                    // Si el producto ya existe, sumar la cantidad
                    updatedItems[existingIndex] = {
                        ...updatedItems[existingIndex],
                        quantity: updatedItems[existingIndex].quantity + listItem.quantity
                    };
                } else {
                    // Si no existe, agregarlo al carrito con ingredient_id
                    updatedItems.push({
                        ...listItem,
                        ingredient_id: listItem.id, // El id del item de lista es el ingredient_id
                        id: `list-${Date.now()}-${listItem.id}` // ID temporal para React
                    });
                }
            });
            
            return updatedItems;
        });

        // Limpiar la selección después de aplicar
        setSelectedListId('');
    };

    const sendOrder = async () => {
        if (!confirm('¿Estás seguro de enviar el pedido?')) {
            return;
        }

        try {
            // Calcular total
            const total = cartItems.reduce((acc, item) => acc + (item.quantity * (item.price || 0)), 0);

            // Crear objeto de pedido
            const order = {
                items: cartItems,
                itemCount: cartItems.reduce((acc, item) => acc + item.quantity, 0),
                total: total,
                date: new Date().toISOString()
            };

            // Enviar al componente padre (App) para guardar en historial y Supabase
            if (onOrderSubmit) {
                await onOrderSubmit(order);
            }

            alert('¡Pedido enviado con éxito!');
            setCartItems([]);
        } catch (error) {
            console.error('Error al enviar pedido:', error);
            alert(`Error al enviar pedido: ${error.message}`);
        }
    };

    // Filter products by search term
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
        <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 4rem)' }}>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
                <h1 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Realizar Pedido</h1>

                {/* Sección de Listas Predefinidas */}
                {savedLists.length > 0 && (
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <FileText size={20} style={{ color: 'var(--primary)' }} />
                            <h2 style={{ margin: 0, color: 'var(--primary)' }}>Aplicar Lista Predefinida</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Selecciona una lista
                                </label>
                                <select
                                    value={selectedListId}
                                    onChange={(e) => setSelectedListId(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        fontSize: '1rem',
                                        backgroundColor: 'var(--background)',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="">-- Selecciona una lista --</option>
                                    {savedLists.map((list) => (
                                        <option key={list.id} value={list.id}>
                                            {list.name} ({list.items.length} producto{list.items.length !== 1 ? 's' : ''})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleApplyList}
                                disabled={!selectedListId}
                                className="btn-primary"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.5rem',
                                    opacity: !selectedListId ? 0.5 : 1,
                                    cursor: !selectedListId ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <Check size={18} />
                                Aplicar Lista
                            </button>
                        </div>
                    </div>
                )}

                <ExcelUploader onUpload={handleExcelUpload} ingredients={products} />

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
                            title="Vista de cuadrícula"
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
                            title="Vista de lista"
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* Search Filter */}
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

                <ProductGrid products={filteredProducts} onAddToCart={addToCart} viewMode={viewMode} />
            </div>

            <div style={{ width: '350px' }}>
                <Cart
                    items={cartItems}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                    onSendOrder={sendOrder}
                />
            </div>
        </div>
    );
};

export default OrderView;
