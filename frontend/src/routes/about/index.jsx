// core imports
import axios from "axios";
import { useContext, useEffect, useState } from "react";

// custom imports
import { AppInformationContext } from "../../context/appinformation.jsx";
import { TIO_BASE_URL } from "../../utils/constants.js";


const About = () => {
        const { setErrorLogMessage, apiVersion} = useContext(AppInformationContext);
        const [ appData, setAppData ] = useState('');

    useEffect(() => {
        const getAppInformation = async () => {
            try {
                const appDataRes = await axios.get(`${TIO_BASE_URL}/api/${apiVersion}/about`,{
                    withCredentials: true,
                });

                if (appDataRes.data.success) {
                    setAppData(appDataRes.data.result);
                } else {
                    setErrorLogMessage(`About.useEffect.getAppInformation:: error_code:${appDataRes.data.result}:: error_msg: ${appDataRes.data.message}`);
                }
            } catch (err) {
                setErrorLogMessage(`About.useEffect.getAppInformation:: error_code:unknow_error:: error_msg: ${err}`);
            }
        };

        getAppInformation();
    }, [apiVersion]);

    return (
        <div className="surface-0">
            <div className="font-medium text-3xl text-900 mb-3">TIO APP</div>
            <div className="text-500 mb-5">Eine Teamevent App der Some Company</div>
            <ul className="list-none p-0 m-0">
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">
                        Name
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {appData ? appData.name : ''}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Verantwortlich für den Inhalt nach § 55 Abs. 2
                        RStV:
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {appData ? `${appData.responsibleName} / ${appData.responsibleStreet} / ${appData.responsibleZipCity}` : ''}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">
                        Entwickler
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {appData ? appData.coding_name : ''}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">
                        Version
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {appData ? appData.version : ''}
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">
                        Copyright
                    </div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {appData ? appData.copyright : ''}
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default About;