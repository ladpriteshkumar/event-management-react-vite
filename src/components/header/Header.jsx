import React from 'react';

const Header = () => {
    return (
        <>
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            padding : '0px 20px',
            width: '100vw',
            zIndex: 1000,
            background: '#282c34',
            color: '#fff',
            margin: 0,
            boxSizing: 'border-box'
        }}>
            <h1>Event Management</h1>
        </header>
        </>
    );
};

export default Header;