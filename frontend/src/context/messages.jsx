// core imports
import { createContext, useState } from 'react';

// custom import

export const MessagesContext = createContext({
    reloadMessage: null,
    setReloadMessages: () => null
});

// todo: wird hier wirklich ein context gebraucht? stand jetzt ist, dass dies nur fuer challenge erstellung
//  genutzt wird.

export const MessagesProvider = ({children}) => {
    const [ reloadMessage, setReloadMessages ] = useState(false);


    const value = {reloadMessage, setReloadMessages}

    return (
        <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
    );
};