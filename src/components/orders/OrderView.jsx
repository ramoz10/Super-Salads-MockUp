import React, { useState, useEffect } from 'react';
import { Grid, List, Search, FileText, Check, ShoppingCart, X } from 'lucide-react';
import ProductGrid from './ProductGrid';
import Cart from './Cart';
import ExcelUploader from './ExcelUploader';
import { ingredientsService } from '../../services/ingredientsService';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const OrderView = ({ onOrderSubmit, savedLists = [] }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [cartItems, setCartItems] = useState([]);
    const [viewMode, setViewMode] = useState(isMobile ? 'list' : 'list'); // 'grid' or 'list'
    const [productFilter, setProductFilter] = useState('');
    const [selectedListId, setSelectedListId] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCart, setShowCart] = useState(false); // Para mobile: mostrar/ocultar carrito

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
            if (isMobile) {
                setShowCart(false);
            }
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
        <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '1.5rem', 
            height: isMobile ? 'auto' : 'calc(100vh - 4rem)',
            minHeight: isMobile ? 'calc(100vh - 2rem)' : 'auto'
        }}>
            <div style={{ 
                flex: 1, 
                overflowY: isMobile ? 'visible' : 'auto', 
                paddingRight: isMobile ? '0' : '1rem',
                paddingBottom: isMobile ? '1rem' : '0'
            }}>
                <h1 style={{ 
                    marginBottom: isMobile ? '1rem' : '1rem', 
                    color: 'var(--primary)',
                    fontSize: isMobile ? '1.5rem' : '1.5rem'
                }}>
                    Realizar Pedido
                </h1>

                {/* Sección de Listas Predefinidas */}
                {savedLists.length > 0 && (
                    <div style={{ 
                        marginBottom: isMobile ? '1rem' : '1rem',
                        padding: isMobile ? '0.75rem' : '1rem',
                        backgroundColor: 'var(--surface)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem', 
                            marginBottom: isMobile ? '0.75rem' : '0.75rem'
                        }}>
                            <FileText size={isMobile ? 16 : 18} style={{ color: 'var(--primary)' }} />
                            <h2 style={{ 
                                margin: 0, 
                                color: 'var(--primary)',
                                fontSize: isMobile ? '1rem' : '1rem'
                            }}>
                                {isMobile ? 'Aplicar Lista' : 'Aplicar Lista Predefinida'}
                            </h2>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: isMobile ? 'column' : 'row',
                            gap: isMobile ? '0.75rem' : '1rem', 
                            alignItems: isMobile ? 'stretch' : 'flex-end'
                        }}>
                            <div style={{ flex: 1 }}>
                                {!isMobile && (
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.5rem', 
                                        fontSize: '0.9rem', 
                                        color: 'var(--text-secondary)' 
                                    }}>
                                        Selecciona una lista
                                    </label>
                                )}
                                <select
                                    value={selectedListId}
                                    onChange={(e) => setSelectedListId(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: isMobile ? '0.6rem 0.75rem' : '0.75rem',
                                        borderRadius: 'var(--radius)',
                                        border: '1px solid var(--border)',
                                        fontSize: isMobile ? '0.9rem' : '1rem',
                                        backgroundColor: 'var(--background)',
                                        color: 'var(--text-primary)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="">{isMobile ? 'Selecciona lista...' : '-- Selecciona una lista --'}</option>
                                    {savedLists.map((list) => (
                                        <option key={list.id} value={list.id}>
                                            {list.name} ({list.items.length})
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
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
                                    opacity: !selectedListId ? 0.5 : 1,
                                    cursor: !selectedListId ? 'not-allowed' : 'pointer',
                                    width: isMobile ? '100%' : 'auto',
                                    fontSize: isMobile ? '0.9rem' : '1rem'
                                }}
                            >
                                <Check size={isMobile ? 16 : 18} />
                                {isMobile ? 'Aplicar' : 'Aplicar Lista'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Ocultar ExcelUploader en mobile */}
                {!isMobile && (
                    <ExcelUploader onUpload={handleExcelUpload} ingredients={products} />
                )}

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: isMobile ? '1rem' : '0.75rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                }}>
                    <h2 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '1.1rem' }}>
                        Productos Disponibles
                    </h2>

                    {/* Ocultar botones de vista en mobile, siempre usar lista */}
                    {!isMobile && (
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
                    )}
                </div>

                {/* Search Filter */}
                <div style={{ 
                    marginBottom: isMobile ? '0.75rem' : '0.75rem',
                    padding: isMobile ? '0' : undefined
                }}>
                    <div style={{ position: 'relative' }}>
                        <Search 
                            size={isMobile ? 18 : 18} 
                            style={{ 
                                position: 'absolute', 
                                left: isMobile ? '0.75rem' : '0.75rem', 
                                top: '50%', 
                                transform: 'translateY(-50%)', 
                                color: 'var(--text-secondary)' 
                            }} 
                        />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                            style={{
                                width: '100%',
                                padding: isMobile ? '0.6rem 0.75rem 0.6rem 2.5rem' : '0.6rem 0.75rem 0.6rem 2.5rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                fontSize: isMobile ? '0.9rem' : '0.9rem',
                                backgroundColor: 'var(--surface)'
                            }}
                        />
                    </div>
                </div>

                <ProductGrid products={filteredProducts} onAddToCart={addToCart} viewMode={isMobile ? 'list' : viewMode} />
            </div>

            {/* Carrito: Fixed bottom en mobile, sidebar en desktop */}
            {isMobile ? (
                <>
                    {/* Botón flotante para mostrar carrito en mobile */}
                    {cartItems.length > 0 && (
                        <button
                            onClick={() => setShowCart(true)}
                            style={{
                                position: 'fixed',
                                bottom: '1rem',
                                right: '1rem',
                                backgroundColor: 'var(--primary)',
                                color: 'white',
                                padding: '1rem 1.5rem',
                                borderRadius: '50px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 600
                            }}
                        >
                            <ShoppingCart size={20} />
                            Carrito ({cartItems.length})
                        </button>
                    )}

                    {/* Modal del carrito en mobile */}
                    {showCart && (
                        <>
                            <div
                                onClick={() => setShowCart(false)}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    zIndex: 1001
                                }}
                            />
                            <div style={{
                                position: 'fixed',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                maxHeight: '80vh',
                                zIndex: 1002,
                                backgroundColor: 'white',
                                borderTopLeftRadius: '20px',
                                borderTopRightRadius: '20px',
                                boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <h2 style={{ margin: 0, color: 'var(--primary)' }}>Carrito</h2>
                                    <button
                                        onClick={() => setShowCart(false)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            color: 'var(--text-secondary)',
                                            padding: '0.5rem'
                                        }}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                                <div style={{ overflowY: 'auto', flex: 1 }}>
                                    <Cart
                                        items={cartItems}
                                        onRemove={removeFromCart}
                                        onUpdateQuantity={updateQuantity}
                                        onSendOrder={sendOrder}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div style={{ width: '350px' }}>
                    <Cart
                        items={cartItems}
                        onRemove={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                        onSendOrder={sendOrder}
                    />
                </div>
            )}
        </div>
    );
};

export default OrderView;
