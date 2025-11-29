import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { X, ShoppingCart, History, ChefHat, FileText } from 'lucide-react';

const Sidebar = ({ isMobile = false, isOpen = false, onClose }) => {
    const navigate = useNavigate();
    
    const navItems = [
        { icon: <ChefHat size={20} />, label: 'Ingredientes', path: '/ingredients' },
        { icon: <FileText size={20} />, label: 'Listas', path: '/lists' },
        { icon: <ShoppingCart size={20} />, label: 'Realizar Pedido', path: '/order' },
        { icon: <History size={20} />, label: 'Historial', path: '/history' },
    ];

    const handleNavClick = (path) => {
        navigate(path);
        if (isMobile && onClose) {
            onClose();
        }
    };

    const sidebarStyle = {
        width: isMobile ? '280px' : 'var(--sidebar-width)',
        backgroundColor: 'var(--primary)',
        color: 'white',
        height: '100vh',
        position: isMobile ? 'fixed' : 'fixed',
        left: isMobile ? (isOpen ? '0' : '-280px') : '0',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        zIndex: 999,
        transition: 'left 0.3s ease-in-out',
        boxShadow: isMobile && isOpen ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'
    };

    return (
        <aside style={sidebarStyle}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '2rem',
                padding: '0 0.5rem'
            }}>
                <img
                    src="/SS Logo.png"
                    alt="Super Salads"
                    style={{ width: '100%', maxWidth: isMobile ? '140px' : '160px', height: 'auto', display: 'block' }}
                />
                {isMobile && (
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => handleNavClick(item.path)}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: isMobile ? '1rem' : '0.75rem 1rem',
                            borderRadius: 'var(--radius)',
                            color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                            backgroundColor: isActive ? 'white' : 'transparent',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'all 0.2s',
                            fontSize: isMobile ? '1rem' : 'inherit'
                        })}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
