// core imports
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

// custom imports
import { UserInformationContext } from "../../context/userinformation.jsx";
import { AppInformationContext } from "../../context/appinformation.jsx";
import UserDetails from "./tio-userdetails.jsx";
import { customToast } from "../../utils/tools.js";
import { TIO_BASE_URL } from "../../utils/constants.js";

const UserDetailsContainer = () => {

    const {
        userInformation,
        oldUserInformation,
        setOldUserInformation,
        setUserInformation
    } = useContext(UserInformationContext);
    const toast = useRef(null);
    const [passwordModalVisibility, setPasswordModalVisibility] = useState(false);
    const { setErrorLogMessage, apiVersion } = useContext(AppInformationContext);
    const [ userPassword, setUserPassword ] = useState('');

    const handleSaveEvent = (ev) => {
        ev.preventDefault();

        const updateEventCall = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/user/update`, {
                    ...userInformation
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // This ensures cookies are included
                }
            );

            if (res) {
                if (res.data.success) {
                    setOldUserInformation({...userInformation});
                    customToast(
                        toast,
                        "success",
                        ":)",
                        "Aktualisieren der Userdaten war erfolgreich.",
                        3000
                    );
                } else {
                    setErrorLogMessage(`UserDetailsContainer.handleSaveEvent.updateEventCall:: error_code:${res.data.result}:: error_msg:${res.data.error}`)
                    setUserInformation({...oldUserInformation});
                    customToast(
                        toast,
                        "error",
                        ":(",
                        "Beim Updaten der Userdaten kam es zu einem Fehler. Alte Daten wiederhergestellt. Weitere Infos im Fehlerprotokoll.",
                        4000
                    );
                }
            }
        }
        updateEventCall();
    };

    const handlePasswordSave = (ev) => {
        ev.preventDefault();
        setPasswordModalVisibility(false);

        if (!userPassword) {
            customToast(
              toast,
              'warning',
              'Fehlende Eingabe',
              'Bitte neues Passwort eingeben',
              2500
            );
            return;
        }

        const updatePasswordCall = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/user/password`, {
                    userId: userInformation.userId,
                    password: userPassword
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // This ensures cookies are included
                }
            );

            if (res) {
                if (res.data.success) {
                    customToast(
                        toast,
                        "success",
                        ":)",
                        "Password erfolgreich geändert.",
                        3000
                    );
                } else {
                    setErrorLogMessage(`UserDetailsContainer.handlePasswordSave.updatePasswordCall:: error_code:${res.data.result}:: error_msg:${res.data.error}`)
                    customToast(
                        toast,
                        "error",
                        ":(",
                        "Beim Updaten des Passworts kam es zu einem Fehler. Weitere Infos im Fehlerprotokoll.",
                        4000
                    );
                }
            }
        }
        updatePasswordCall();
    }

    const handlePasswordCancel = (ev) => {
        ev.preventDefault();

        setUserPassword('');
        setPasswordModalVisibility(false);
    }

    const handleUserAccountFlag = (accountStatus) => {
        const update_account_status = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/user/status`, {
                    accountStatus: accountStatus,
                    userId: userInformation.userId
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // This ensures cookies are included
                }
            );

            if (res) {
                if (res.data.success) {
                    const account_status_txt = accountStatus  ? 'aktiviert' : 'deaktiviert';
                    setUserInformation({...userInformation, active: accountStatus });
                    customToast(
                        toast,
                        "success",
                        ":)",
                        `User wurde erfolgreich ${account_status_txt}`,
                        5000
                    );
                } else {
                    setErrorLogMessage(`UserDetailsContainer.handleUserAccountFlag.update_account_status:: error_code:${res.data.result}:: error_msg:${res.data.error}`)
                    customToast(
                        toast,
                        "error",
                        "Fehler bei Kontostatusänderung",
                        "Beim Setzen des Kontostatus kam es zu einem Fehler. Bitte schau ins Fehlerprotokoll.",
                        5000
                    );
                }
            }
        }
        update_account_status();
    }

    const startContent = () => {

        if (!userInformation) return;

        return  (
            <>
                <Button
                    icon="pi pi-play-circle"
                    className="mr-2"
                    tooltip="User aktivieren"
                    disabled={userInformation ? userInformation.active : 0}
                    onClick={() => {handleUserAccountFlag(1)} }
                />
                <Button
                    icon="pi pi-ban"
                    className="mr-2"
                    tooltip="User deaktieren"
                    disabled={userInformation ? !userInformation.active : 0}
                    onClick={() => {handleUserAccountFlag(0)} }
                />
                <Button
                    icon="pi pi-key"
                    className="mr-2"
                    tooltip="Passwort ändern"
                    onClick={() => setPasswordModalVisibility(true)}
                />
            </>
        );
    }

    const endContent = (
        <>
            <Button label="Account löschen" className="m-3" disabled />
            <Button label="Speichern" className="m-3" onClick={handleSaveEvent} />
        </>
    );

    return (
        <div>
            <div className="card">
                <Toolbar start={startContent} end={endContent}/>
            </div>
            <Dialog
                visible={passwordModalVisibility}
                modal
                onHide={() => {if (!passwordModalVisibility) return; setPasswordModalVisibility(false); }}
                content={() => (
                    <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <div className="inline-flex flex-column gap-2">
                            <label htmlFor="passwort" className="text-primary-50 font-semibold">
                                Passwort
                            </label>
                            <InputText
                                id="password"
                                label="Passwort"
                                className="bg-white-alpha-20 border-none p-3 text-primary-50"
                                onChange={(e) => setUserPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Button
                                label="Ändern"
                                onClick={handlePasswordSave}
                                text
                                className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                            />
                            <Button
                                label="Abbrechen"
                                onClick={handlePasswordCancel}
                                text
                                className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"
                            />
                        </div>
                    </div>
                )}
            ></Dialog>
            <UserDetails />
            <Toast ref={toast} />
        </div>
    );
};

export default UserDetailsContainer;
