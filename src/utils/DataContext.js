import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [filteredData, setFilteredData] = useState([]);

    return (
        <DataContext.Provider value={{ filteredData, setFilteredData }}>
            {children}
        </DataContext.Provider>
    );
};
