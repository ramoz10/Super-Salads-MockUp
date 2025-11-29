import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, History, ChefHat, FileText } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: <ChefHat size={20} />, label: 'Ingredientes', path: '/ingredients' },
        { icon: <FileText size={20} />, label: 'Listas', path: '/lists' },
        { icon: <ShoppingCart size={20} />, label: 'Realizar Pedido', path: '/order' },
        { icon: <History size={20} />, label: 'Historial', path: '/history' },
    ];

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--primary)',
            color: 'white',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem'
        }}>
            <div style={{ marginBottom: '3rem', padding: '0 0.5rem' }}>
                <img
                    src="/SS Logo.png"
                    alt="Super Salads"
                    style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }}
                />
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius)',
                            color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                            backgroundColor: isActive ? 'white' : 'transparent',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'all 0.2s'
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
