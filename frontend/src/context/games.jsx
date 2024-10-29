// core imports
import { createContext, useState, useEffect, useContext } from 'react';
import axios from "axios";

// custom import
import { AppInformationContext } from "./appinformation.jsx";

export const GamesContext = createContext({
    allGames: null,
    setAllGames: () => null
});

// todo: wird hier wirklich ein context gebraucht? stand jetzt ist, dass dies nur fuer challenge erstellung
//  genutzt wird.

export const GamesProvider = ({children}) => {
    const { apiVersion } = useContext(AppInformationContext);
    const [ allGames, setAllGames ] = useState([]);

    /*useEffect(() => {
        axios.get(`${TIO_BASE_URL}/api/${apiVersion}/games`, {
            withCredentials: true // This ensures cookies are included
        }).then(res => {
            console.log("GamesProvider, useEffect, res", res)
        }).catch(err => {
            console.log("GamesProvider, useEffect, error", err)
        })
    }, []);*/

    const value = {allGames, setAllGames}

    return (
        <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
    );
};