// core imports
import axios, { AxiosError } from "axios";
import { useContext, useState, useRef } from "react";
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";
import { Editor } from 'primereact/editor';
import { InputNumber } from 'primereact/inputnumber';
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Divider } from 'primereact/divider';

// custom imports
import { AppInformationContext } from '../../context/appinformation';
import TioContainer from "../../components/tio-container/tio-container.jsx";
import { customToast } from "../../utils/tools.js";
import { TIO_BASE_URL } from "../../utils/constants.js";

// todo: backend. OP G-0002 fertigstellen. foto upload fehlt noch

// definition components
const CreateGames = () => {
    /*
        this component is responsible for creating a game with all attributes needed for such.
     */


    const { apiVersion, setErrorLogMessage } = useContext(AppInformationContext);
    const fileUploadComp = useRef();
    const [tioContainerVisibility, setTioContainerVisibility] = useState(false);
    const [createGameInformation, setCreateGameInformation] = useState ({
        gameName: '',
        gameDuration: '',
        gameDescription: '',
        selectedScoreType: '',
        selectedScoreCounting: '',
        gamePictureBlobId: '',
        gamePictureBlobUploadDate: '',
        gameBlobId: '',
    });

    const scoreTypes = [
        {name: "Zeit", id: 1},
        {name: "Punkte", id: 2}
    ];

    const scoreCountings = [
        {name: "Aufsteigend", id: 1},
        {name: "Abfallend", id: 2}
    ];

    const toast = useRef(null);

    const formIncomplete = () => {
        toast.current.show({
            severity: 'warn',
            summary: "Eingabe unvollständig.",
            detail: "Spielname, Punktetyp, Punktewert und Spieldauer sind Pflichtfelder!",
            life: 3500
        });
    };

    const fileUploadHandler = (e) => {
        const res = JSON.parse(e.xhr.response);

        if (res.success) {
            setCreateGameInformation({
                ...createGameInformation,
                gamePictureBlobId: res.result.blob_id,
                gamePictureBlobUploadDate: res.result.blob_upload_date,
                gamesBlobId: res.result.blob_id
            });
            customToast(toast, 'info', 'Uploadstatus', 'Datei erfolgreich hochgeladen', 3500);
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

    const clearAllFields = () => {
        // todo: bei gelegenheit diese methode verallgemeinern in den tools
        setCreateGameInformation({
            gameName: '',
            gameDuration: '',
            gameDescription: '',
            selectedScoreType: '',
            selectedScoreCounting: '',
            gamePictureBlobId: '',
            gamePictureBlobUploadDate: '',
            gameBlobId: '',
        });
        fileUploadComp.current.clear();
    };

    const handleCreateEvent = (ev) => {
        const { gameName, gameDuration, selectedScoreType, selectedScoreCounting } = createGameInformation;
        ev.preventDefault();

        if (!(gameName && gameDuration && selectedScoreType && selectedScoreCounting)) {
            formIncomplete();
            return null;
        }

        const create_event_call = async () => {
            try {
                const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/create/game`,
                    {...createGameInformation},
                    {
                        headers: {'Content-Type': 'application/json'},
                        withCredentials: true
                    }
                );

                if (res) {
                    switch (res.data.result) {
                        case 'game/already-exists':
                            customToast(
                                toast,
                                'error',
                                'Fehler beim Erstellen der Challenge',
                                res.data.error,
                                5000
                            )
                            break;
                        case 'game/creation-success':
                            setTioContainerVisibility(true);
                            break;
                        case 'db_error':
                        case 'unknown_error':
                            setErrorLogMessage(`CreateGames.handleCreateEvent.create_event_call:: error_code:${res.data.result}:: error_msg:${res.data.error}`)
                            clearAllFields();
                            customToast(
                                toast,
                                "error",
                                "Fehler bei Challengeerstellung.",
                                "Beim Erstellen der Challenge kam es zu einem Fehler. Bitte schaue ins Fehlerprotokoll.",
                                5000
                            );
                        default:
                            // todo: define some default behavior.
                            break;
                    }
                }
            } catch (AxiosError) {
                setErrorLogMessage(`TioAPI.setUserSettings.axios:: apiVersion: ${apiVersion} error_code: 'ERR_NETWORK':: error_msg: Error calling backend. Timeout?.`);
            }
        }
        create_event_call();
    };

    return (
        <>
            <h2 className="m-3">Challenge erstellen</h2>
            <Fieldset legend="Challengeinformationen" className="m-3">
                <div className="card flex justify-content-start flex-wrap">
                    <div className="m-4">
                        <FloatLabel>
                            <InputText
                                id="gamename"
                                value={createGameInformation.gameName}
                                onChange={
                                    (e) =>
                                        setCreateGameInformation({...createGameInformation, gameName: e.target.value})
                                }
                            />
                            <label htmlFor="gamename">Challengename</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <Dropdown
                                inputId="scoreType"
                                value={createGameInformation.selectedScoreType}
                                onChange={
                                    (e) =>
                                        setCreateGameInformation({...createGameInformation, selectedScoreType: e.value})
                                }
                                options={scoreTypes}
                                optionLabel="name"
                                placeholder="Punktetyp"
                                className="w-full"
                            />
                            <label htmlFor="scoreType">Punktetyp</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <Dropdown
                                value={createGameInformation.selectedScoreCounting}
                                onChange={
                                    (e) =>
                                        setCreateGameInformation({...createGameInformation, selectedScoreCounting: e.value})
                                }
                                options={scoreCountings} optionLabel="name"
                                placeholder="Punktewert"
                                className="w-full"
                                inputId="scoreCounting"
                            />
                            <label htmlFor="scoreCounting">Punktewert</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <InputNumber
                                min={1}
                                inputId="gameDuration"
                                value={createGameInformation.gameDuration}
                                onValueChange={
                                    (e) =>
                                        setCreateGameInformation({...createGameInformation, gameDuration: e.target.value})
                                }
                            />
                            <label htmlFor="gameDuration">Challengedauer</label>
                        </FloatLabel>
                    </div>
                    <Divider />
                    <div className="m-4">
                        <FileUpload
                            mode="advanced"
                            name="tio_file/challenge"
                            url={`${TIO_BASE_URL}/api/${apiVersion}/upload`}
                            accept="image/*"
                            maxFileSize={1000000}
                            onUpload={fileUploadHandler}
                            auto
                            chooseLabel="Bild auswählen"
                            withCredentials
                            ref={fileUploadComp}
                        />
                    </div>
                </div>
            </Fieldset>

            <Fieldset legend="Challengebeschreibung" className="m-3">
                <Editor
                    value={createGameInformation.gameDescription}
                    onTextChange={
                        (e) => {
                            setCreateGameInformation({...createGameInformation, gameDescription: e.htmlValue})
                        }
                    }
                    style={{height: '320px'}}
                />
            </Fieldset>

            <Toast ref={toast}/>
            <Button label="Challenge erstellen" className="m-3" onClick={handleCreateEvent}/>
            <TioContainer content={"Die Challenge wurde erfolgreich angelegt!"} tioContainerVisible={tioContainerVisibility} />
        </>
    );
};

export default CreateGames;