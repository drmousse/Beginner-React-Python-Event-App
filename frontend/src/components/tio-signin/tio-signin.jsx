// core imports
import axios from 'axios';
import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Checkbox } from "primereact/checkbox";
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { PrimeReactContext } from 'primereact/api';

// custom imports
import { UserSessionContext } from "../../context/usersession.jsx";
import TioInput from '../../components/tio-input/tio-input';
import TioCard from '../../components/tio-card/tio-card';
import { TIO_BASE_URL, TIO_BASE_THEME } from "../../utils/constants.js";
import { TIO_URLS } from "../../utils/constants.js";
import { customToast } from "../../utils/tools.js";

import tioLogo from '../../assets/tio_logo.png';
import './tio-signin.scss';

const TioSignIn = () => {
    const {
        setUserSessionAccessKey,
        setMyUserRoles,
        setUserFirstname,
        setUserLastname
    } = useContext(UserSessionContext);
    const { changeTheme } = useContext(PrimeReactContext);
    const [username, setUsername] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const navigate = useNavigate();


    const onChangeHandler = (ev) => {
        if (ev.key === 'Enter') {
            onClickHandler(ev);
            return;
        }

        switch (ev.target.id) {
            case 'username':
                setUsername(ev.target.value);
                break;
            case 'password':
                setUserPassword(ev.target.value);
                break;
            default:
                console.error("Authentication ChangeHandler: undefined case.");
        }
    };

    const toast = useRef(null);

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: "Eingabe unvollständig.", detail: "Bitte beide Felder ausfüllen", life: 3000 });
    };

    const onClickHandler = async (ev) => {
        ev.preventDefault();

        if (!(username && userPassword)) {
            reject();
            return;
        }

        try {
            const res = await axios.post(`${TIO_BASE_URL}/api/login`,
                {
                    login: username,
                    password: userPassword
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
                    case 'auth/login-success':
                        setUserSessionAccessKey(res.data.tio_access_token);
                        if (res.data.tio_user_settings) {
                            res.data.tio_user_settings.forEach(({setting_id, value}) => {
                                localStorage.setItem(setting_id, JSON.stringify(value));
                                if (setting_id === 'tio_dark_mode' && value === '1') {
                                    changeTheme(
                                        TIO_BASE_THEME('light'),
                                        TIO_BASE_THEME('dark'),
                                        'tio-event-app-theme'
                                    )
                                }
                            });
                        }
                        if (res.data.tio_games) {
                            localStorage.setItem('tio_games', JSON.stringify(res.data.tio_games));
                            localStorage.setItem('tio_games_date', JSON.stringify(new Date()));
                        }
                        if (res.data.tio_event_formats) {
                            localStorage.setItem('tio_event_formats', JSON.stringify(res.data.tio_event_formats));
                            localStorage.setItem('tio_event_formats_date', JSON.stringify(new Date()));
                        }
                        if (res.data.tio_my_roles) {
                            setMyUserRoles(res.data.tio_my_roles);
                        }
                        if (res.data.tio_user_data) {
                            if (res.data.tio_user_data.name) {
                                setUserFirstname(res.data.tio_user_data.name[0]);
                                setUserLastname(res.data.tio_user_data.name[1]);
                            }
                        }
                        // for every login the error protocol should be cleared
                        localStorage.setItem('tio_err_prot_msg', null);
                        if (parseInt(res.data.tio_first_login)) {
                            navigate(TIO_URLS.firstLogin);
                            break;
                        } else {
                            navigate(TIO_URLS.home); // Ensure this matches your route
                            break;
                        }
                    case 'auth/login-fail':
                        customToast(
                            toast,
                            'error',
                            'Ungültige Eingabe',
                            res.data.error,
                            4000
                        );
                        break;
                    default:
                        // handle error: show message to user
                        break;
                }
            }
        } catch (error) {
            // handle error: show message to user
            console.error(error);
        }
    };

    const onCheckboxChange = () => {
        setCheckboxChecked(!checkboxChecked);
        setPasswordVisibility(!passwordVisibility);
    }

    const header = (
    <div className='tio-signin-logo'>
        <Image src={tioLogo} alt="tio Logo" imageStyle={{borderRadius:"50%", width: "80%"}}/>
    </div>);

    const footer = (<Button type='submit' label="Login" onClick={onClickHandler} />);

    return (
        <TioCard title={'Tio Event App'} footer={footer} header={header}>
            <TioInput
                inputFieldID={'username'}
                value={username}
                onChangeHandler={onChangeHandler}
                placeholder={'E-Mail'}
                inputIcon={'pi-user'}
                onK
            />
            <TioInput
                inputType='password'
                inputFieldID={'password'}
                value={userPassword}
                onChangeHandler={onChangeHandler}
                placeholder={'Passwort'}
                inputIcon={'pi-key'}
                toggleVisibility={passwordVisibility}
            />
            <div>
                <Checkbox onChange={onCheckboxChange} checked={checkboxChecked} name='password-visibility-checker' value='show_password'/>
                <label htmlFor="password-visibility-checker" className="ml-2">Passwort anzeigen</label>
            </div>
            <Toast ref={toast} />
        </TioCard>
    );
};

export default TioSignIn;