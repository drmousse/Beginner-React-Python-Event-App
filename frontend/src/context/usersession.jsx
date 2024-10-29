// core imports
import axios from "axios";
import {createContext, useEffect, useState, useContext} from 'react';
import { PrimeReactContext } from 'primereact/api';

// custom imports
import { AppInformationContext } from "./appinformation.jsx";
import { TIO_BASE_THEME, TIO_BASE_URL } from "../utils/constants.js";

export const UserSessionContext = createContext({
    userSessionAccessKey: null,
    setUserSessionAccessKey: () => null,
    allUsers: null,
    setAllUsers: () => null,
    myUserRoles: null,
    setMyUserRoles: () => null,
    userFirstname: null,
    userLastname: null,
    setUserFirstname: () => null,
    setUserLastname: () => null,
    darkMode: null,
    setDarkMode: () => null
});

export const UserSessionProvider = ({children}) => {
    const [ userSessionAccessKey, setUserSessionAccessKey ] = useState('');
    const [ allUsers, setAllUsers ] = useState([]);
    const [ myUserRoles, setMyUserRoles ] = useState([]);
    const [ userFirstname, setUserFirstname ] = useState('');
    const [ userLastname, setUserLastname ] = useState('');
    const [ darkMode, setDarkMode ] = useState(false);

    const { apiVersion } = useContext(AppInformationContext);
    const { changeTheme } = useContext(PrimeReactContext);

    useEffect(() => {
        axios.get(`${TIO_BASE_URL}/api/${apiVersion}/users`, {
            withCredentials: true // This ensures cookies are included
        }).then(res => {
            if (res.data.succes) {
                setAllUsers(res.data.result.all_users);
            }
        }).catch(err => {
            // todo: fehlerhandling besser machen
        });
    }, [apiVersion]);

    useEffect(() => {
        // todo: das irgendwie besser machen. beim login wird der store mit diesen daten
        //  befüllt. jedoch sorgt ja ein refresh dafür, dass die daten weg sind und solange
        //  es keinen besseren weg gibt, weiterhin über den context.
        axios.get(`${TIO_BASE_URL}/api/${apiVersion}/userroles/myroles`, {
            withCredentials: true // This ensures cookies are included
        }).then(res => {
            if (res.data.success) {
                setMyUserRoles(res.data.result);
            }
        }).catch(err => {
            // todo: fehlerhandling besser machen
        });
    }, [apiVersion]);

    useEffect(() => {
        // todo: das irgendwie besser machen. beim login wird der store mit diesen daten
        //  befüllt. jedoch sorgt ja ein refresh dafür, dass die daten weg sind und solange
        //  es keinen besseren weg gibt, weiterhin über den context.
        axios.get(`${TIO_BASE_URL}/api/${apiVersion}/user/mydata`, {
            withCredentials: true // This ensures cookies are included
        }).then(res => {
            if (res.data.success) {
                setUserFirstname(res.data.result.name[0]);
                setUserLastname(res.data.result.name[1]);
            }
        }).catch(err => {
            // todo: fehlerhandling besser machen
        });
    }, [apiVersion]);

    const value = {
        userSessionAccessKey,
        setUserSessionAccessKey,
        allUsers,
        setAllUsers,
        myUserRoles,
        setMyUserRoles,
        userFirstname,
        setUserFirstname,
        userLastname,
        setUserLastname,
        darkMode,
        setDarkMode
    };

    return (
        <UserSessionContext.Provider value={value}>{children}</UserSessionContext.Provider>
    );
};