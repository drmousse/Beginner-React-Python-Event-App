// core imports
import axios from 'axios';
import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

// custom imports
import { UserSessionContext } from "../../context/usersession.jsx";
import { AppInformationContext } from "../../context/appinformation.jsx";
import TioInput from '../../components/tio-input/tio-input';
import TioCard from '../../components/tio-card/tio-card';
import { TIO_BASE_URL, TIO_URLS } from "../../utils/constants.js";
import { customToast } from "../../utils/tools.js";
import TioContainer from "../../components/tio-container/tio-container.jsx";


import tioLogo from '../../assets/tio_logo.png';

const FirstLogin = () => {
    const { apiVersion} = useContext(AppInformationContext);
    const { userFirstname } = useContext(UserSessionContext);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPasswort, setRepeatNewPassword] = useState('');
    const [tioContainerVisibility, setTioContainerVisibility] = useState(false);
    const navigate = useNavigate();
    const [firstLogin, setFirstLogin] = useState(false);

    const onChangeHandler = (ev) => {
        switch (ev.target.id) {
            case 'oldPassword':
                setOldPassword(ev.target.value);
                break;
            case 'newPassword':
                setNewPassword(ev.target.value);
                break;
            case 'repeatNewPassword':
                setRepeatNewPassword(ev.target.value);
                break;
            default:
                console.error("FirstLogin onChangeHandler: undefined case.");
        }
    };
    const toast = useRef(null);

    useEffect(() => {
        axios.get(`${TIO_BASE_URL}/api/${apiVersion}/user/firstlogin`,
            {
                withCredentials: true
            }
        ).then(res => {
            if (res.data.success) {
                setFirstLogin(true);
            } else {
                navigate(TIO_URLS.home);
            }
        })
    }, []);

    const onClickHandler = async (ev) => {
        ev.preventDefault();

        if (!(oldPassword && newPassword && repeatNewPasswort)) {
            customToast(
                toast,
                'warn',
                'Eingabe unvollständig',
                'Bitte alle Felder ausfüllen',
                3000
            );
            return;
        }

        if (newPassword !== repeatNewPasswort) {
            customToast(
                toast,
                'error',
                ':(',
                'Neue Passwörter stimmen nicht überein',
                3000
            );
            return;
        }

        try {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/user/firstlogin`,
                {
                    oldPW: oldPassword,
                    newPW: newPassword
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (res && res.data) {
                switch (res.data.result) {
                    case 'user/no-data':
                        customToast(
                          toast,
                          'error',
                          'Datenproblem',
                          'Es gab Probleme bei der Datenübertragung. Bitte später nochmal probieren',
                          5000
                        );
                        break;
                    case 'auth/old-pw-wrong':
                        customToast(
                            toast,
                            'error',
                            'Falsches Passwort',
                            res.data.error,
                            5000
                        );
                        break;
                    case 'user/pw-updated':
                        setTioContainerVisibility(true);
                        break;
                    default:
                        customToast(
                            toast,
                            'warning',
                            res.data.result,
                            res.data.error,
                            5000
                        );
                        break;
                }
            }
        } catch (error) {
            // handle error: show message to user
            console.error(error);
        }
    };

    const header = (
    <div className='tio-signin-logo'>
        <Image src={tioLogo} alt="tio Logo" imageStyle={{borderRadius:"50%", width: "80%"}}/>
    </div>);

    if (firstLogin) {
        return (
            <TioCard title={`Hallo ${userFirstname}`} header={header}
                     subtitle="Dies ist dein erster Login. Bitte ändere dein Passwort.">
                <div className="flex justify-content-center flex-column">
                    <div className="mt-3">
                        <FloatLabel>
                            <InputText
                                className="w-full"
                                type="password"
                                id="oldPassword"
                                value={oldPassword}
                                onChange={onChangeHandler}
                            />
                            <label htmlFor="oldPassword">Altes Passwort</label>
                        </FloatLabel>
                    </div>
                    <div className="mt-4">
                        <FloatLabel>
                            <InputText
                                className="w-full"
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={onChangeHandler}
                            />
                            <label htmlFor="newPassword">Neues Passwort</label>
                        </FloatLabel>
                    </div>
                    <div className="mt-4">
                        <FloatLabel>
                            <InputText
                                className="w-full"
                                type="password"
                                id="repeatNewPassword"
                                value={repeatNewPasswort}
                                onChange={onChangeHandler}
                            />
                            <label htmlFor="repeatNewPassword">Neues Passwort wiederholen</label>
                        </FloatLabel>
                    </div>
                    <Button type='submit' label="Passwort aktualisieren"  onClick={onClickHandler} className="mt-4" />
                    <TioContainer content={"Passwort erfolgreich geändert!"}
                                  tioContainerVisible={tioContainerVisibility}/>
                    <Toast ref={toast}/>
                </div>
            </TioCard>
    );
    }

    };

    export default FirstLogin;