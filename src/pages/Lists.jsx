import React from 'react';
import ListsView from '../components/lists/ListsView';

const Lists = ({ savedLists, onSaveLists }) => {
    return (
        <ListsView savedLists={savedLists} onSaveLists={onSaveLists} />
    );
};

export default Lists;
