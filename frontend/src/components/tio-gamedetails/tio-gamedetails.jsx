// core imports
import {useContext, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Fieldset } from "primereact/fieldset";
import {Editor} from "primereact/editor";
import { Tag } from 'primereact/tag';
import { Image } from "primereact/image";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";

// custom imports
import { AppInformationContext } from "../../context/appinformation.jsx";
import { customToast } from "../../utils/tools.js";
import { TIO_BASE_URL } from "../../utils/constants.js";

import dummyGamePicture from "../../assets/dummy-game-profile.png";

// component
const GameDetails = () => {
    // todo: konsistenz-checks einbauen: email adresse sollte noch nicht vergeben sein. und prüfung auf pflichtfelder

    const toast = useRef(null);
    const {
        gameInformation,
        setGameInformation,
        setOldGameProfileBlobId,
        apiVersion
    } = useContext(AppInformationContext);
    const icon = (<i className="pi pi-search"></i>);
    const fileUploadComp = useRef();

    const fileUploadHandler = (e) => {
        const res = JSON.parse(e.xhr.response);

        if (res.success) {
            setOldGameProfileBlobId(gameInformation.gameBlobId);
            setGameInformation({
                ...gameInformation,
                profilePhoto: res.result.filename,
                gameBlobId: res.result.blob_id
            });
            customToast(
                toast,
                'success',
                'Uploadstatus',
                'Challengeprofilbild erfolgreich aktualisiert.',
                3500
            );
            //fileUploadComp.current.clear();
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

    return (
        <>
            <div className="grid">
                <div className="col-6">
                    <Fieldset legend="Challengedetails" className="m-3">
                        <div className="justify-content-center w-full p-4 m-2">
                            <div className="justify-content-start w-full pl-0 pb-4 m-2">
                                <div className="text-500 font-medium">Challengestatus: {gameInformation && parseInt(gameInformation.active) ? <Tag severity='success' value='Aktiviert' /> :  <Tag severity='danger' value='Deaktiviert' />}</div>
                            </div>
                            <ul className="list-none p-0 m-0">
                                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                    <div className="text-500 w-6 md:w-4 font-medium">Name</div>
                                    <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                        <InputText
                                            type="text"
                                            className="p-inputtext-sm"
                                            placeholder="Name"
                                            value={gameInformation ? gameInformation.name : ''}
                                            onChange={
                                                (e) => setGameInformation({
                                                    ...gameInformation, name: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </li>
                                <li className="flex align-items-center py-3 px-2 flex-wrap">
                                    <div className="text-500 w-6 md:w-4 font-medium">Punktetyp</div>
                                    <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                        <InputText
                                            type="text"
                                            className="p-inputtext-sm"
                                            placeholder="Punktetyp"
                                            value={gameInformation ? gameInformation.scoreType : ''}
                                            onChange={
                                                (e) => setGameInformation({
                                                    ...gameInformation, scoreType: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </li>
                                <li className="flex align-items-center py-3 px-2 flex-wrap">
                                    <div className="text-500 w-6 md:w-4 font-medium">Punktewert</div>
                                    <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                        <InputText
                                            type="text"
                                            className="p-inputtext-sm"
                                            placeholder="Punktewert"
                                            value={gameInformation ? gameInformation.scoreCounting : ''}
                                            onChange={
                                                (e) => setGameInformation({
                                                    ...gameInformation, scoreCounting: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </li>
                                <li className="flex align-items-center py-3 px-2 flex-wrap">
                                    <div className="text-500 w-6 md:w-4 font-medium">Dauer</div>
                                    <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                        <InputText
                                            type="text"
                                            className="p-inputtext-sm"
                                            placeholder="Dauer"
                                            value={gameInformation ? gameInformation.duration : ''}
                                            onChange={
                                                (e) => setGameInformation({
                                                    ...gameInformation, duration: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Fieldset>
                </div>
                <div className="col-6">
                    <Fieldset legend="Challengeprofilbild" className="m-3">
                        <Image
                            src={gameInformation.profilePhoto ? `media/challenge/${gameInformation.profilePhoto}` : dummyGamePicture}
                            indicatorIcon={icon}
                            alt="Profilbild"
                            preview
                            width="200"
                            imageStyle={{borderRadius: '50%'}}
                        />
                        <FileUpload
                            auto
                            mode="basic"
                            name="tio_file/challenge"
                            url={`${TIO_BASE_URL}/api/${apiVersion}/upload`}
                            accept="image/*"
                            maxFileSize={1000000}
                            onUpload={fileUploadHandler}
                            chooseLabel="Upload neues Challengefoto"
                            className="mt-4"
                            withCredentials
                            ref={fileUploadComp}
                        />
                    </Fieldset>
                </div>
            </div>
            <div className="grid">
                <div className="col-12">
                    <div className="justify-content-center w-full p-4 m-2">
                        <Fieldset legend="Challengebeschreibung" className="m-3">
                            <Editor
                                value={gameInformation.description}
                                onTextChange={
                                    (e) =>
                                        setGameInformation({...gameInformation, description: e.htmlValue})
                                }
                                style={{height: '320px'}}
                            />
                        </Fieldset>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </>
    );
};

export default GameDetails;
