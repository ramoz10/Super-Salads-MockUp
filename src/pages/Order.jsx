import React from 'react';
import OrderView from '../components/orders/OrderView';

const Order = ({ onOrderSubmit, savedLists }) => {
    return (
        <OrderView onOrderSubmit={onOrderSubmit} savedLists={savedLists} />
    );
};

export default Order;
