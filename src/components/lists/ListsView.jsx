import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import ListBuilder from './ListBuilder';
import { listsService } from '../../services/listsService';

const ListsView = ({ savedLists = [], onSaveLists }) => {
    const [lists, setLists] = useState(savedLists);
    const [isBuilding, setIsBuilding] = useState(false);
    const [editingList, setEditingList] = useState(null);
    const [loading, setLoading] = useState(false);

    // Sincronizar con el componente padre cuando cambien las listas
    useEffect(() => {
        if (onSaveLists) {
            onSaveLists(lists);
        }
    }, [lists, onSaveLists]);

    const handleSaveList = async (list) => {
        try {
            setLoading(true);
            let savedList;
            
            if (editingList) {
                // Actualizar lista existente
                savedList = await listsService.update(editingList.id, list);
                setLists(lists.map(l => l.id === savedList.id ? savedList : l));
            } else {
                // Crear nueva lista
                savedList = await listsService.create(list);
                setLists([...lists, savedList]);
            }
            
            setIsBuilding(false);
            setEditingList(null);
        } catch (error) {
            console.error('Error al guardar lista:', error);
            alert(`Error al guardar lista: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEditList = (list) => {
        setEditingList(list);
        setIsBuilding(true);
    };

    const handleDeleteList = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta lista?')) {
            return;
        }

        try {
            setLoading(true);
            await listsService.delete(id);
            setLists(lists.filter(l => l.id !== id));
        } catch (error) {
            console.error('Error al eliminar lista:', error);
            alert(`Error al eliminar lista: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNewList = () => {
        setEditingList(null);
        setIsBuilding(true);
    };

    const handleCancel = () => {
        setIsBuilding(false);
        setEditingList(null);
    };

    if (isBuilding) {
        return (
            <ListBuilder
                onSave={handleSaveList}
                onCancel={handleCancel}
                editingList={editingList}
            />
        );
    }

    if (loading && lists.length === 0) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '50vh',
                fontSize: '1.2rem',
                color: 'var(--text-secondary)'
            }}>
                Cargando listas...
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)' }}>Listas Predefinidas</h1>
                <button className="btn-primary" onClick={handleNewList} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} />
                    Nueva Lista
                </button>
            </div>

            {lists.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <FileText size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>No hay listas creadas</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Crea listas predefinidas para agilizar tus pedidos recurrentes
                    </p>
                    <button className="btn-primary" onClick={handleNewList}>
                        Crear Primera Lista
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {lists.map((list) => (
                        <div key={list.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>{list.name}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {list.items.length} producto{list.items.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            <div style={{ marginBottom: '1rem', flex: 1 }}>
                                <div style={{
                                    backgroundColor: 'var(--background)',
                                    borderRadius: 'var(--radius)',
                                    padding: '0.75rem',
                                    maxHeight: '150px',
                                    overflowY: 'auto'
                                }}>
                                    {list.items.slice(0, 5).map((item, index) => (
                                        <div key={index} style={{
                                            fontSize: '0.85rem',
                                            marginBottom: '0.25rem',
                                            color: 'var(--text-secondary)'
                                        }}>
                                            • {item.name} ({item.quantity} {item.unit})
                                        </div>
                                    ))}
                                    {list.items.length > 5 && (
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                            +{list.items.length - 5} más...
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleEditList(list)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <Edit size={16} />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteList(list.id)}
                                    style={{
                                        backgroundColor: 'var(--danger)',
                                        color: 'white',
                                        padding: '0.6rem',
                                        borderRadius: 'var(--radius)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ListsView;
