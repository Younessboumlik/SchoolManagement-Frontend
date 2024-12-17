import React, { createContext, useState } from "react";

// Create the Context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [logedin, setLogedin] = useState(false);

    return (
        <AppContext.Provider value={{ logedin, setLogedin }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContext;
