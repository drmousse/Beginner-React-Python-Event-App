// core imports
import axios, { AxiosError } from "axios";

// custom imports
import {TIO_BASE_URL} from "../utils/constants.js";

// functions

const TioAPI =  {

    setUserSettings: async (key, value, apiVersion) => {
        try {
            const resp = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/user/settings`,
                {
                    mode: 'set',
                    data: [
                        {key: key, value: value}
                    ]
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (resp.data.success) {
                return [true, null, null];
            } else {
                return [false, resp.data.result, resp.data.error];
            }
        } catch ( AxiosError ) {
            return [false, 'ERR_NETWORK', 'Error calling backend. Timeout?'];
        }


    }
}

export const setUserSettings = TioAPI.setUserSettings;
export default TioAPI;