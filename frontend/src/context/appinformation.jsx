// core imports
import { createContext, useState, useEffect } from 'react';
import axios from "axios";

// custom imports
import { ERROR_PROT_MSG } from "../utils/tools.js";

export const AppInformationContext = createContext({
    apiVersion: null,
    errorLogMessage: null,
    setErrorLogMessage: () => null,
    commonRoles: null,
    setCommonRoles: () => null,
    allGames: null,
    setAllGames: () => null,
    gameInformation: null,
    setGameInformation: () => null,
    oldGameProfileBlobId: null,
    setOldGameProfileBlobId: () => null,
    oldGameInformation: null,
    setOldGameInformation: () => null
});

// todo: irgenwann apiVersion durch backend call ersetzen

export const AppInformationProvider = ({children}) => {

    const apiVersion = 'v1';
    const [ errorLogMessage, setErrorMessageTemp ] = useState('');
    const [ commonRoles, setCommonRoles ] = useState('');
    const [ allGames, setAllGames ] = useState('');
    const [ oldGameProfileBlobId, setOldGameProfileBlobId] = useState('');
    const [ oldGameInformation, setOldGameInformation] = useState({
        name: '',
        gameID: '',
        description: '',
        scoreType: '',
        scoreCounting: '',
        duration: '',
        gameBlobId: '',
        profilePhoto: ''
    });
    const setErrorLogMessage = (msg) => {
        const totalErrMsg = `${errorLogMessage}\n${ERROR_PROT_MSG(msg)}`;
        localStorage.setItem('tio_err_prot_msg', totalErrMsg);
        setErrorMessageTemp(totalErrMsg);
    };

    const [gameInformation, setGameInformation] = useState({
        name: '',
        gameID: '',
        description: '',
        scoreType: '',
        scoreCounting: '',
        duration: '',
        gameBlobId: '',
        profilePhoto: ''
    });

    const value = {
        apiVersion,
        errorLogMessage,
        setErrorLogMessage,
        commonRoles,
        setCommonRoles,
        allGames,
        setAllGames,
        gameInformation,
        setGameInformation,
        oldGameProfileBlobId,
        setOldGameProfileBlobId,
        oldGameInformation,
        setOldGameInformation
    };

    return (
        <AppInformationContext.Provider value={value}>{children}</AppInformationContext.Provider>
    );
};