// core imports
import axios from "axios";
import {useState, useRef, useContext, useEffect} from "react";
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { MultiSelect } from "primereact/multiselect";

// custom imports
import { AppInformationContext } from '../../context/appinformation';
import TioContainer from "../../components/tio-container/tio-container.jsx";
import { customToast } from "../../utils/tools.js";
import { TIO_BASE_URL } from "../../utils/constants.js";


// todo: bilder upload implementieren
// todo: die eingaben ueber einen react-hook verzoegern, sodass nicht jeder tastenschlag ein rendering verursacht

// definition components
const CreateUsers = () => {
    /*
        this component is responsible for creating a game with all attributes needed for such.
     */

    const { apiVersion, setErrorLogMessage, commonRoles, setCommonRoles } = useContext(AppInformationContext);
    const [userInformation, setUserInformation] = useState({
        login: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: '',
        title: '',
        function: '',
        password: '',
        userRoles: '',
        userProfilePictureBlobId: '',
        userProfilePictureBlobUploadDate: '',
        profileBlobId: '',
    });
    const [tioContainerVisibility, setTioContainerVisibility] = useState(false);
    const fileUploadComp = useRef();


    const [selectedGender, setSelectedGender] = useState(null);
    const genders = [
        {name: 'M', id: 1},
        {name: 'W', id: 2},
        {name: 'D', id: 3}
    ];
    const [selectedRoles, setSelectedRoles] = useState(null);

    const [selectedTitle, setSelectedTitle] = useState(null);
    const titles = [
        {name: "Frau", id: 1},
        {name: "Herr", id: 2}
    ];

    const toast = useRef(null);

    const formIncomplete = () => {
        toast.current.show({
            severity: 'warn',
            summary: "Eingabe unvollständig.",
            detail: "Login, Passwort, Vorname und Nachname sind Pflichtfelder!",
            life: 3500
        });
    };

    const clearAllFields = () => {
        // todo: bei gelegenheit diese methode verallgemeinern in den tools
        setUserInformation({
            login: '',
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            gender: '',
            title: '',
            function: '',
            password: '',
            userRoles: '',
            userProfilePictureBlobId: '',
            userProfilePictureBlobUploadDate: '',
            profileBlobId: '',
        });
        setSelectedGender(null);
        setSelectedRoles(null);
        setSelectedTitle(null);
        fileUploadComp.current.clear();
    }

    const handleSelectedRoles = (value) => {
        setSelectedRoles(value);
        setUserInformation({...userInformation, userroles: value});
    }
    
    const handleCreateEvent = (ev) => {
        ev.preventDefault();
        
        if (!(userInformation.login && userInformation.firstname && userInformation.lastname && userInformation.password)) {
            formIncomplete();
            return null;
        }

        const create_event_call = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/create/user`, {
                    ...userInformation
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // This ensures cookies are included
                }
            );

            if (res) {
                if (res.data.success) {
                    setTioContainerVisibility(true);
                } else {
                    setErrorLogMessage(`CreateUsers.handleCreateEvent.create_event_call:: error_code:${res.data.result}:: error_msg:${res.data.error}`)
                    clearAllFields();
                    customToast(
                        toast,
                        "error",
                        "Fehler beim Usererstellung",
                        "Beim Erstellen des Users kam es zu einem Fehler. Bitte schaue ins Fehlerprotokoll.",
                        5000
                    );
                }
            }
        }
        create_event_call();
    }

    const fileUploadHandler = (e) => {
        const res = JSON.parse(e.xhr.response);

        if (res.success) {
            setUserInformation({
                ...userInformation,
                userProfilePictureBlobId: res.result.blob_id,
                userProfilePictureBlobUploadDate: res.result.blob_upload_date,
                profileBlobId: res.result.blob_id
            });
            customToast(toast, 'info', 'Uploadstatus', 'Datei erfolgreich hochgeladen', 3500);
        } else {
            switch (res.result) {
                case 'user/no-file-uploaded':
                    customToast(toast, 'error', 'Uploadstatus', 'Keine Datei hochgeladen.', 3500);
                    break
                case 'user/no-file-selected':
                    customToast(toast, 'error', 'Uploadstatus', 'Keine Datei ausgewählt.', 3500);
                    break
            }
        }
    }

    useEffect(() => {
        const getCommonRoles = async () => {
            try {

                const resp = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/roles`, {
                    roleType: 'CommonRole'
                }, {
                        withCredentials: true,
                });

                if (resp.data.success) {
                    setCommonRoles(resp.data.result);
                } else {
                    setErrorLogMessage(`CreateUsers.useEffect.getCommonRoles:: error_code:${resp.data.result}:: error_msg: ${resp.data.message}`);
                }
            } catch (err) {
                // todo: some error handling
            }
        }

        getCommonRoles();
    }, [apiVersion]);

    return (
        <>
            <h2 className="m-3">User erstellen</h2>
            <Fieldset legend="Kontoinformationen" className="m-3">
                <div className="card flex justify-content-start flex-wrap">
                    <div className="m-4">
                        <FloatLabel>
                            <InputText
                                id="login"
                                value={userInformation.login}
                                onChange={(e) => setUserInformation({
                                    ...userInformation,
                                    login: e.target.value,
                                    email: e.target.value
                                })}
                            />
                            <label htmlFor="login">Login (E-Mail)</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <InputText
                                id="password"
                                value={userInformation.password}
                                onChange={(e) => setUserInformation({...userInformation, password: e.target.value})}
                            />
                            <label htmlFor="password">Passwort</label>
                        </FloatLabel>
                    </div>
                    <Divider />
                    <div className="m-4">
                        <FileUpload
                            mode="advanced"
                            name="tio_file/profile"
                            url={`${TIO_BASE_URL}/api/${apiVersion}/upload`}
                            accept="image/*"
                            maxFileSize={1000000}
                            onUpload={fileUploadHandler}
                            auto
                            chooseLabel="Datei auswählen"
                            withCredentials
                            ref={fileUploadComp}
                        />
                    </div>
                </div>
            </Fieldset>

            <Fieldset legend="Userinformationen" className="m-3">
            <div className="card flex justify-content-start flex-wrap">
                    <div className="m-4">
                        <FloatLabel>
                            <InputText
                                id="firstname"
                                value={userInformation.firstname}
                                onChange={(e) => setUserInformation({...userInformation, firstname: e.target.value})}
                            />
                            <label htmlFor="firstname">Vorname</label>
                        </FloatLabel>
                    </div>
                    <div className="m-4">
                        <FloatLabel>
                            <InputText 
                                id="lastname"
                                value={userInformation.lastname}
                                onChange={(e) => setUserInformation({...userInformation, lastname: e.target.value})}
                            />
                            <label htmlFor="lastname">Nachname</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <Dropdown
                                inputId="gender"
                                value={selectedGender}
                                onChange={(e) => {
                                    setSelectedGender(e.value);
                                    setUserInformation({...userInformation, gender: e.value.name});
                                }}
                                options={genders}
                                optionLabel="name" 
                                placeholder="Geschlecht"
                                className="w-full"
                            />
                            <label htmlFor="gender">Geschlecht</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <Dropdown
                                inputId="title"
                                value={selectedTitle}
                                onChange={(e) => {
                                    setSelectedTitle(e.value);
                                    setUserInformation({...userInformation, title: e.value.name});
                                }}
                                options={titles}
                                optionLabel="name" 
                                placeholder="Anrede"
                                className="w-full"
                            />
                            <label htmlFor="title">Anrede</label>
                        </FloatLabel>
                    </div>

                    <Divider />

                    <div className="m-4">
                        <FloatLabel>
                            <InputText 
                                id="phone"
                                value={userInformation.phone}
                                onChange={(e) => setUserInformation({...userInformation, phone: e.target.value})}
                            />
                            <label htmlFor="phone">Rufnummer</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <InputText 
                                id="function"
                                value={userInformation.function}
                                onChange={(e) => setUserInformation({...userInformation, function: e.target.value})}
                            />
                            <label htmlFor="function">Funktion</label>
                        </FloatLabel>
                    </div>
                </div>
            </Fieldset>

            <Fieldset legend="Userrollen" className="m-3">
                <div className="card flex justify-content-start flex-wrap">
                    <div className="m-4">
                        <FloatLabel className="w-full">
                            <MultiSelect
                                value={selectedRoles}
                                onChange={(e) => handleSelectedRoles(e.value)}
                                options={commonRoles}
                                optionLabel="name"
                                className="w-full"
                                display="chip"
                                showClear
                            />
                            <label htmlFor="eventgames">Rollen auswählen</label>
                        </FloatLabel>
                    </div>
                </div>
            </Fieldset>
            <Toast ref={toast} />
            {/* todo: nachdem man auf den button geklickt hat, sollte dieser erstmal deaktiviert werden, damit
                    man nicht nochmal darauf klickt.
             */}
            <Button label="User erstellen" className="m-3" onClick={handleCreateEvent}/>
            <TioContainer content={"Der User wurde erfolgreich angelegt!"} tioContainerVisible={tioContainerVisibility} />
        </>
    );
};

export default CreateUsers;