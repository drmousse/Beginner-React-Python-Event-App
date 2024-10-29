// core imports
import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";


// custom imports
import { AppInformationContext } from "../../context/appinformation.jsx";
import { UserSessionContext } from "../../context/usersession.jsx";
import { customToast } from "../../utils/tools.js";
import { TIO_BASE_URL } from "../../utils/constants.js";

// component
const UserProfile = () => {
    // todo: konsistenz-checks einbauen: email adresse sollte noch nicht vergeben sein. und prüfung auf pflichtfelder
    const { apiVersion, setErrorLogMessage } = useContext(AppInformationContext);
    const { setUserFirstname, setUserLastname } = useContext(UserSessionContext);
    const [ userInformation, setUserInformation ] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: '',
        title: '',
        function: '',
        profilePhoto: '',
        userProfilePictureBlobId: '',
        userProfilePictureBlobUploadDate: '',
        profileBlobId: ''
    });
    const [ userTempInformation, setUserTempInformation ] = useState({});
    const toast = useRef(null);
    const [ oldProfilePictureBlobId, setOldProfilePictureBlobId ] = useState('');
    const [ revertProfilePhotoButtonStatus , setRevertProfilePhotoButtonStatus ] = useState(true);
    const fileUploadComp = useRef();

    useEffect(() => {
        axios.get(`${TIO_BASE_URL}/api/${apiVersion}/user/mydata`, {
                    withCredentials: true // This ensures cookies are included
                }).then(res => {
                    if (res.data.success) {
                        setUserInformation({...userInformation, ...res.data.result.user_data});
                        setUserTempInformation({...userInformation, ...res.data.result.user_data});
                    }
                }).catch(err => {
                    // todo: fehlerhandling besser machen
                });
    }, [apiVersion]);

    const handleSaveEvent = (ev) => {
        ev.preventDefault();

        const updateEventCall = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/user/updatedata`, {
                    ...userInformation
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // This ensures cookies are included
                }
            );

            if (res) {
                if (res.data.success) {
                    setUserFirstname(userInformation.firstname);
                    setUserLastname(userInformation.lastname);
                    setUserTempInformation({...userInformation});
                    setRevertProfilePhotoButtonStatus(true);
                    customToast(
                        toast,
                        "success",
                        ":)",
                        "Aktualisieren deiner Daten war erfolgreich.",
                        3000
                    );
                } else {
                    setErrorLogMessage(`UserProfile.handleSaveEvent.updateEventCall:: error_code:${res.data.result}:: error_msg:${res.data.error}`)
                    setUserInformation({...userTempInformation});
                    customToast(
                        toast,
                        "error",
                        ":(",
                        "Beim Updaten deiner Daten kam es zu einem Fehler. Alte Daten wiederhergestellt. Weitere Infos im Fehlerprotokoll.",
                        4000
                    );
                }
            }
        }
        updateEventCall();
    }

    const handleRevertProfilePhoto = (ev) => {
        // todo: muss noch umgesetzt werden
    }

    const fileUploadHandler = (e) => {
        const res = JSON.parse(e.xhr.response);

        if (res.success) {
            setOldProfilePictureBlobId(userInformation.userProfilePictureBlobId);
            setUserInformation({
                ...userInformation,
                userProfilePictureBlobId: res.result.blob_id,
                userProfilePictureBlobUploadDate: res.result.blob_upload_date,
                profilePhoto: res.result.filename,
                profileBlobId: res.result.blob_id
            });
            // todo: Revert feature implementieren
            // setRevertProfilePhotoButtonStatus(false);
            customToast(
                toast,
                'success',
                'Uploadstatus',
                'Profilbild erfolgreich aktualisiert.',
                3500
            );
        } else {
            switch (res.result) {
                case 'event/no-file-uploaded':
                    customToast(toast, 'error', 'Uploadstatus', 'Keine Datei hochgeladen.', 3500);
                    break
                case 'event/no-file-selected':
                    customToast(toast, 'error', 'Uploadstatus', 'Keine Datei ausgewählt.', 3500);
                    break
            }
        }
    }

    const icon = (<i className="pi pi-search"></i>);

    return (
        <div className="justify-content-center w-full p-4 m-2">
            <div className="grid">
                <div className="col-12 md:col-4 lg:col-4">
                    <Image
                        src={`/media/profile/${userInformation.profilePhoto || 'dummy-profile.png'}`}
                        indicatorIcon={icon}
                        alt="Profilbild"
                        preview
                        width="200"
                        imageStyle={{borderRadius: '50%'}}
                    />
                    <FileUpload
                        auto
                        mode="basic"
                        name="tio_file/profile"
                        url={`${TIO_BASE_URL}/api/${apiVersion}/upload`}
                        accept="image/*"
                        maxFileSize={1000000}
                        onUpload={fileUploadHandler}
                        chooseLabel="Upload neues Profilfoto"
                        className="mt-4"
                        withCredentials
                        ref={fileUploadComp}
                    />

                    {
                        // todo: das revert feature implementieren
                        false && <Button disabled={revertProfilePhotoButtonStatus} label="Profilbild zurücksetzen" icon="pi pi-undo" onClick={handleRevertProfilePhoto} className="mt-8"/>
                    }

                </div>
                <div className="col-12 md:col-8 lg:col-8">
                        <div className="font-medium text-3xl text-900 mb-3">Hallo {userInformation.firstname}</div>
                        <div className="text-500 mb-5">Hier kannst du deine persönlichen Daten ändern.</div>
                        <ul className="list-none p-0 m-0">
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Anrede</div>
                                <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                    <InputText
                                        type="text"
                                        className="p-inputtext-sm"
                                        placeholder="Anrede"
                                        value={userInformation.title}
                                        onChange={
                                            (e) => setUserInformation({
                                                ...userInformation, title: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Vorname</div>
                                <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                    <InputText
                                        type="text"
                                        className="p-inputtext-sm"
                                        placeholder="Vorname"
                                        value={userInformation.firstname}
                                        onChange={
                                            (e) => setUserInformation({
                                                ...userInformation, firstname: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Nachname</div>
                                <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                    <InputText
                                        type="text"
                                        className="p-inputtext-sm"
                                        placeholder="Nachname"
                                        value={userInformation.lastname}
                                        onChange={
                                            (e) => setUserInformation({
                                                ...userInformation, lastname: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Geschlecht</div>
                                <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                    <InputText
                                        type="text"
                                        className="p-inputtext-sm"
                                        placeholder="Geschlecht"
                                        value={userInformation.gender || ''}
                                        onChange={
                                            (e) => setUserInformation({
                                                ...userInformation, gender: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Funktion</div>
                                <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                    <InputText
                                        type="text"
                                        className="p-inputtext-sm"
                                        placeholder="Funktion"
                                        value={userInformation.function || ''}
                                        onChange={
                                            (e) => setUserInformation({
                                                ...userInformation, function: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">
                                    <i className="pi pi-at" style={{fontSize: '1.5rem'}}></i>
                                </div>
                                <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                    <InputText
                                        type="text"
                                        className="p-inputtext-sm"
                                        placeholder="Email"
                                        value={userInformation.email}
                                        onChange={
                                            (e) => setUserInformation({
                                                ...userInformation, email: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">
                                    <i className="pi pi-mobile" style={{fontSize: '1.5rem'}}></i>
                                </div>
                                <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                    <InputText
                                        type="text"
                                        className="p-inputtext-sm"
                                        placeholder="Rufnummer"
                                        value={userInformation.phone || ''}
                                        onChange={
                                            (e) => setUserInformation({
                                                ...userInformation, phone: e.target.value
                                            })
                                        }
                                    />
                                </div>
                            </li>
                        </ul>
                    <Button label="Speichern" icon="pi pi-check" onClick={handleSaveEvent} className="mt-8"/>
                    <Toast ref={toast} />
                    </div>
            </div>
        </div>
    );
};

export default UserProfile;
