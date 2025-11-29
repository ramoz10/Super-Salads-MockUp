import React from 'react';
import HistoryView from '../components/history/HistoryView';

const History = ({ orders }) => {
    return (
        <HistoryView orders={orders} />
    );
};

export default History;
