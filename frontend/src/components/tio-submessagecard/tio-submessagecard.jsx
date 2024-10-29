// core imports
import axios from "axios";
import {useContext, useRef, useState} from 'react';
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { Editor } from "primereact/editor";
import { Button } from "primereact/button";


// custom imports
import { TIO_BASE_URL } from "../../utils/constants.js";
import { customToast, GERMAN_DATETIME_REPR, setErrorMessageString } from "../../utils/tools.js";
import { AppInformationContext } from "../../context/appinformation.jsx";
import { MessagesContext } from "../../context/messages.jsx";

import dummyUserProfile from "../../assets/dummy-user-profile.png";


// component
const SubMessageCard = ({ message}) => {
    const toast = useRef(null);
    const { setErrorLogMessage, apiVersion} = useContext(AppInformationContext);
    const [ editorVisibility, setEditorVisibility ] = useState(false);
    const [ editorContent, setEditorContent ] = useState('');
    const [ okButtonLabel, setOKButtonLabel ] = useState('');
    const [ editType, setEditType ] = useState('');
    const { reloadMessage, setReloadMessages } = useContext(MessagesContext);

    const handleEditOptions = (content, type) => {
        switch (type) {
            case 'edit':
                setEditorContent(content);
                setEditorVisibility(true);
                setOKButtonLabel('Änderung speichern');
                break;

            case 'delete':
                break;
        }
        setEditType(type);
    };

    const editorVisibilityHandler = (editVisible) => {
        if (editVisible) {
            setEditorVisibility(true);
        } else {
            setEditorContent('');
            setEditorVisibility(false);
        }
    }

    const editorOKButtonHandler = async (e, editType) => {
        e.preventDefault();

        try {
            const messageResp = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/message/multihandle`, {
                data: {
                    content: editorContent,
                    editType: editType,
                    messageId: message.message_id
                }
            },{
                withCredentials: true,
            });

            if (messageResp.data.success) {
                setEditorContent('');
                setEditorVisibility(false);
                setReloadMessages(true);
                customToast(
                    toast,
                    'success',
                    ':)',
                    'Beitrag erfolgreich abgespeichert.'
                );
            } else {
                customToast(
                    toast,
                    'error',
                    ':(',
                    'Beitrag konnte nicht abgespeichert werden. Bitte im Fehlerprotokoll nachschauen.'
                )
                setErrorLogMessage(
                    setErrorMessageString(
                        'MessageCard.editorOKButtonHandler',
                        messageResp.data.result,
                        messageResp.data.message
                    )
                );
            }
        } catch (err) {
            setErrorLogMessage(
                setErrorMessageString(
                    'MessageBoard.createContentHandler',
                    'unknown_error',
                    err
                )
            )
        }
    }

    const messageOptions = [
        {
            label: 'Löschen',
            icon: 'pi pi-trash',
            command: () => {
                customToast(
                    toast,
                    'info',
                    ':/',
                    'Funktion existiert noch nicht.',
                    4000
                );
            }
        },
        {
            label: 'Bearbeiten',
            icon: 'pi pi-pencil',
            command: () => {
                handleEditOptions(message.content, 'edit');
            }
        }
    ];

    return (
        <div>
            <div className="flex justify-content-end mb-3">
                <div className="flex align-items-end flex-column">
                    <div className="text-500 font-bold mb-3"><span className="text-green-500">Antwort von:&nbsp;</span>{message.user_name}</div>
                    <div className="text-900 font-light p-0 tio-message-content"
                         dangerouslySetInnerHTML={{__html: message.content}}/>
                    {
                        message.created_on && !message.edited_on &&
                        <div className="mt-2" style={{fontSize: '80%'}}>
                            <span className="text-500">Beitrag verfasst am </span>
                            <span className="text-green-500 font-medium">{GERMAN_DATETIME_REPR(message.created_on, true)}</span>
                        </div>
                    }
                    {
                        message.edited_on &&
                        <div className="mt-2" style={{fontSize: '80%'}}>
                            <span className="text-500">Beitrag geändert am </span>
                            <span
                                className="text-green-500 font-medium">{GERMAN_DATETIME_REPR(message.edited_on, true)}</span>
                        </div>
                    }
                </div>
            </div>
                <div className="flex align-items-start justify-content-start" style={{width: '2.5rem', height: '2.5rem'}}>
                    {
                        message.is_editable &&
                        <div style={{position: 'relative'}}>
                            <SpeedDial
                                model={messageOptions}
                                buttonStyle={{transform: 'scale(0.6)'}}
                                direction="right"
                                style={{top: 'calc(100% - 5rem)'}}
                                transitionDelay={80}
                            />
                        </div>
                    }
                </div>
            <div className="mt-3 mb-3" style={{visibility: editorVisibility ? 'visible' : 'hidden'}}>
                {
                    editorVisibility &&
                    <div className="card">
                        <Editor value={editorContent} onTextChange={(e) => setEditorContent(e.htmlValue)}
                                style={{height: editorVisibility ? '320px' : '0px'}}/>
                        <div className="mt-3">
                            <Button className="mr-2" label={okButtonLabel} icon="pi pi-check" outlined size="small" onClick={(e) => {editorOKButtonHandler(e, editType)}} />
                            <Button label="Abbrechen" icon="pi pi-times" outlined onClick={() => {editorVisibilityHandler(false)}} size="small"/>
                        </div>
                    </div>
                }
            </div>

            <Toast ref={toast}/>
        </div>
    );
};

export default SubMessageCard;
