// core imports
import axios from "axios";
import { useRef, useState, useContext, Fragment, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { InputSwitch } from "primereact/inputswitch";
import { Dialog } from 'primereact/dialog';
import { PrimeReactContext } from 'primereact/api';

// custom imports
import TioAPI from "../../api/api.js";
import Validator from "../../components/tio-validator/tio-validator.jsx";
import { AppInformationContext } from "../../context/appinformation.jsx";
import { UserSessionContext } from "../../context/usersession.jsx";
import { TIO_URLS, TIO_BASE_THEME, TIO_BASE_URL } from '../../utils/constants';

import tioLogo from '../../assets/tio_logo.png';
import './navigation.scss';


const Navigation = () => {
    const { changeTheme } = useContext(PrimeReactContext);
    const { setUserSessionAccessKey, myUserRoles, userFirstname, darkMode, setDarkMode } = useContext(UserSessionContext);
    const { errorLogMessage, apiVersion, setErrorLogMessage } = useContext(AppInformationContext);
    //const [ darkMode, setDarkMode ] = useState();
    const [ theme, setTheme ] = useState(darkMode ? 'dark' : 'light');
    const [ errorLogVisibility, setErrorLogVisibility] = useState(false);

    const userProfileMenu = useRef(null);
    const sessionSettingsMenu = useRef(null);

    const navigate = useNavigate();

    const adminMenu = !!(myUserRoles.find(myUserRole => myUserRole['name'] === 'Admin'));
    const managerMenu = !!(myUserRoles.find(myUserRole => myUserRole['name'] === 'Manager'));

    const handleThemeChange = (event) => {
        const newTheme = event.value ? 'dark' : 'light';
        setDarkMode(event.value);
        localStorage.setItem('tio_dark_mode', event.value ? '1' : '0');
        const apiUserSettingCall = async () => {
            const [success, result, error] = await TioAPI.setUserSettings('tio_dark_mode', event.value, apiVersion);

            if (!success) {
                setErrorLogMessage(`TioAPI.setUserSettings.axios:: key: tio_dark_mode, value: ${event.value}:: apiVersion: ${apiVersion} error_code: ${result}:: error_msg: ${error}.`);
            }
        }
        apiUserSettingCall();

        changeTheme(
            TIO_BASE_THEME(theme),
            TIO_BASE_THEME(newTheme),
            'tio-event-app-theme',
            () => setTheme(newTheme)
        );

    };

    const themeSettingRenderer = (item) => (
        <div className='p-menuitem-content'>
            <div className="flex align-items-center p-menuitem-link">
                <span className={item.icon} />
                <span className="mx-2">{item.label}</span>
                <InputSwitch checked={darkMode} onChange={handleThemeChange} className='ml-auto' />
            </div>
        </div>
    );

    const handleLogOut = async () => {
        setUserSessionAccessKey('');
        const resp = await axios.get(`${TIO_BASE_URL}/api/logout`, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        if (resp) {
            navigate(TIO_URLS.login);
        }
    };

    const navigationMenuItems = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate(TIO_URLS.base)
        },
        {
            label: 'Events',
            icon: 'pi pi-star',
            items: [
                {
                    label: 'Event erstellen',
                    icon: 'pi pi-file-plus',
                    visible: adminMenu || managerMenu,
                    command: () => navigate(TIO_URLS.createEvent)
                },
                {
                    // todo: das sieht noch nicht wirklich schön aus im frontend. hier vlt. ne andere lösung finden
                    separator: adminMenu || managerMenu
                },
                {
                    label: 'Aktive Events',
                    icon: 'pi pi-circle-fill',
                    command: () => navigate(`${TIO_URLS.events}/active`)
                },
                {
                    label: 'Geplante Events',
                    icon: 'pi pi-clock',
                    command: () => navigate(`${TIO_URLS.events}/new`)
                },
                {
                    label: 'Abgeschlossene Events',
                    icon: 'pi pi-check-circle',
                    command: () => navigate(`${TIO_URLS.events}/closed`)
                },
                {
                    label: 'Verworfene Events',
                    icon: 'pi pi-times-circle'
                }
            ]
        },
        {
            label: 'User',
            icon: 'pi pi-users',
            visible: adminMenu,
            items: [
                {
                    label: 'User erstellen',
                    icon: 'pi pi-user-plus',
                    command: () => navigate(TIO_URLS.createUser)
                },
                {
                    label: 'User verwalten',
                    icon: 'pi pi-user-edit',
                    command: () => navigate(TIO_URLS.user)
                }
            ]
        },
        {
            label: 'Challenge Planner',
            icon: 'pi pi-box',
            visible: adminMenu || managerMenu,
            items: [
                {
                    label: 'Challenge erstellen',
                    icon: 'pi pi-play-circle',
                    command: () => navigate(TIO_URLS.createGame)
                },
                {
                    label: 'Challenges verwalten',
                    icon: 'pi pi-pencil',
                    command: () => navigate(TIO_URLS.game)
                }
            ]
        },
        {
            label: 'Academy',
            icon: 'pi pi-building-columns',
            items: [
                {
                    label: 'App Guide',
                    icon: 'pi pi-directions'
                },
                {
                    label: 'How-To\'s',
                    icon: 'pi pi-book',
                    items: [
                        {
                            label: 'Code of Behaviour'
                        },
                        {
                            label: 'Moderation'
                        },
                        {
                            label: 'Siegerehrung'
                        }
                    ]
                },
                {
                    label: 'Challenges',
                    icon: 'pi pi-box'
                },

            ]
        },
        {
            // todo: für produktiveschaltung rausnehmen
            label: 'Testcomp',
            icon: 'pi pi-home',
            command: () => navigate(TIO_URLS.test),
            visible: false
        },
    ];

    const userProfileMenuItems = [
        {
            // todo: einen renderer für das benutzermenue erstellen, sodass hier label durch ein cooles
            //  benutzermenue ersetzt wird
            // OP U-0001
            label: `Hallo ${userFirstname}`,
            items: [
                {
                    label: 'Persönliche Daten ändern',
                    icon: 'pi pi-user-edit',
                    command: () => navigate(TIO_URLS.userProfile)
                },
                {
                    label: 'Passwort ändern',
                    icon: 'pi pi-key',
                    command: () => navigate(TIO_URLS.userPW)
                },
                {
                    separator: true
                },
                {
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: () => handleLogOut()
                }
            ]
        }
    ];

    const sessionSettingsMenuItems = [
        {
            label: 'App - Einstellungen',
            items: [
                {
                    label: 'Dark Mode',
                    icon: 'pi pi-moon',
                    template: themeSettingRenderer
                },
                {
                    label: 'Fehlerprotokoll',
                    icon: 'pi pi-receipt',
                    command: () => setErrorLogVisibility(true)
                },
                {
                    separator: true
                },
                {
                    label: 'Über TIO-APP',
                    icon: 'pi pi-info-circle',
                    command: () => navigate(TIO_URLS.about)
                }
            ]
        }
    ];

    const start = <img alt="logo" src={tioLogo} height="40" className="mr-2" shape="circle" />;
    const end = (
        <div className="flex align-items-center gap-2">
            <Menu model={sessionSettingsMenuItems} popup ref={sessionSettingsMenu} popupAlignment="right" />
            <Button
                text
                icon="pi pi-cog"
                className="mr-2"
                onClick={(event) => sessionSettingsMenu.current.toggle(event)}
                aria-controls="popup_menu_right" aria-haspopup
            />
            <Menu model={userProfileMenuItems} popup ref={userProfileMenu} popupAlignment="right" />
            <Button
                text
                icon="pi pi-user"
                className="mr-2"
                onClick={(event) => userProfileMenu.current.toggle(event)}
                aria-controls="popup_menu_right" aria-haspopup
            />
        </div>
    );

    if (JSON.parse(localStorage.getItem('tio_dark_mode')) === '1') {
        setDarkMode(true);
    }

    // todo: den overflow fixen. mit overflow-x-hidden funktioniert es, aber dann sieht man die menues nicht mehr
    return (
        <Validator>
            <div className="card tio-navigation">
                <Menubar
                    model={navigationMenuItems}
                    start={start}
                    end={end}
                    style={{marginTop:'-10px', marginLeft: '-10px', marginRight: '-10px'}}
                />
                <Dialog
                    header="Fehlerprotokoll"
                    visible={errorLogVisibility}
                    style={{ width: '50vw' }}
                    onHide={() => {if (!errorLogVisibility) return; setErrorLogVisibility(false); }}
                >
                    <div className="mb-5 tio-error-log-box">
                        {
                            (localStorage.getItem('tio_err_prot_msg') || errorLogMessage)
                                .split('\n')
                                .map((line, index) => (
                                    <Fragment key={index}>
                                        <p style={{marginBottom: '5px'}}>{line}</p>
                                    </Fragment>
                                    )
                                )
                        }
                    </div>
                </Dialog>
            </div>
            <Outlet/>
        </Validator>
    );
};

export default Navigation;