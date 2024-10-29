// core imports
import { useContext } from "react";
import axios from "axios";

// custom imports
import { TIO_BASE_URL } from "./constants.js";

export const validateSession = async (userSessionAccessKey, apiVersion) => {
    /* 
        Session will be validated by checking, if access token is still valid.
        If access token is not valid, then a new token will be demanded with the help
        of the refresh token.
        If there is also no refresh token, then the user will be redirected to login
        page
    */

    let validateResponse;
    let respState;
    let respCode;

    try {
        if (userSessionAccessKey) {
            validateResponse = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/validate_access`,
                {
                    tio_access_token: userSessionAccessKey
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
        } else {
            validateResponse = await axios.get(`${TIO_BASE_URL}/api/${apiVersion}/validate_access`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
        }
    } catch (error) {
        if (error.code === 'ERR_BAD_REQUEST') {
            respState = false;
            respCode = 'b_t_login';
        }
    }

    if (validateResponse) {
        switch (validateResponse.data.result) {
            case 'auth/not-authorized':
                respState = false;
                respCode = 'b_t_login'
                break;
            case 'auth/fully-authorized':
                respState = true;
                respCode = 'auth/fully-authorized';
                break
            case 'auth/partially-authorized':
                respState = true;
                respCode = 'auth/partially-authorized';
                break
        }

        if (respState) {
            return {success: respState, code: respCode}
        } else {
            return {success: respState, code: respCode}
        }
    }
}
