// core imports
import {createContext, useState} from 'react';

// custom imports


export const UserInformationContext = createContext({
    userInformation: null,
    oldUserInformation: null,
    setUserInformation: () => null,
    setOldUserInformation: () => null
});

export const UserInformationProvider = ({children}) => {
    const [ oldUserInformation, setOldUserInformation ] = useState(null);
    const [ userInformation, setUserInformation ] = useState({
        firstname: '',
        lastname: '',
        fullname: '',
        email: '',
        phone: '',
        gender: '',
        title: '',
        function: '',
        profilePhoto: '',
        active: ''
    });

    const value = {
        userInformation,
        oldUserInformation,
        setUserInformation,
        setOldUserInformation
    };

    return (
        <UserInformationContext.Provider value={value}>{children}</UserInformationContext.Provider>
    );
};