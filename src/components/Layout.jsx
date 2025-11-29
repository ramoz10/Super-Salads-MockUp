import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useMediaQuery } from '../hooks/useMediaQuery';

const Layout = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
            <Sidebar 
                isMobile={isMobile} 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)} 
            />
            
            {/* Overlay para mobile cuando el sidebar está abierto */}
            {isMobile && sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 998,
                        transition: 'opacity 0.3s'
                    }}
                />
            )}

            <main style={{
                marginLeft: isMobile ? '0' : 'var(--sidebar-width)',
                flex: 1,
                padding: isMobile ? '1rem' : '2rem',
                backgroundColor: 'var(--background)',
                width: isMobile ? '100%' : 'calc(100% - var(--sidebar-width))',
                transition: 'margin-left 0.3s'
            }}>
                {/* Botón hamburguesa para mobile */}
                {isMobile && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{
                            position: 'fixed',
                            top: '1rem',
                            left: '1rem',
                            zIndex: 999,
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                )}
                
                <Outlet context={{ isMobile }} />
            </main>
        </div>
    );
};

export default Layout;
