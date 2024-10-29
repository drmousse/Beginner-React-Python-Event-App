// core imports
import { useContext, useEffect, useState } from 'react';

// custom imports
import { UserSessionContext } from "../../context/usersession.jsx";
import { AppInformationContext } from "../../context/appinformation.jsx";
import { validateSession } from '../../utils/validator.js';
import { ProgressSpinner } from 'primereact/progressspinner';

const Validator = ({children}) => {


    const validatorStatus = true;

    // todo: nach der Testphase die condition wieder rausnehmen
    if (validatorStatus) {
        const { userSessionAccessKey } = useContext(UserSessionContext);
        const { apiVersion } = useContext(AppInformationContext);
        const [isAuthenticated, setIsAuthenticated] = useState(null);

        useEffect(() => {
            const validate = async () => {
                const validateResp = await validateSession(userSessionAccessKey, apiVersion);

                if (validateResp &&
                    (validateResp.code === 'auth/fully-authorized' ||  validateResp.code === 'auth/partially-authorized')) {
                    setIsAuthenticated(true);
                } else {
                    window.location.href = '/login';
                }
            };

            validate();
        }, );

        if (isAuthenticated === null) {
            return (
                <div className="card flex justify-content-center">
                    <ProgressSpinner />
                </div>
            );
        }
    }

    return (
        <>
            {
                children
            }
        </>
    );

};

export default Validator;