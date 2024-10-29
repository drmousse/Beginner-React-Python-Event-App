// core imports
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { Toast } from "primereact/toast";

// custom imports
import { TIO_BASE_URL } from "../../utils/constants.js";
import { setErrorMessageString, customToast } from "../../utils/tools.js";
import { AppInformationContext } from "../../context/appinformation.jsx";
import { MessagesContext } from "../../context/messages.jsx";
import MessageCard from "../tio-messagecard/tio-messagecard.jsx";



const MessageBoard = ({boardType}) => {
    // todo: langfristit müssen hier sockets reingepackt werden, damit es instant passiert
    //  oder ein timer, der alle paar minuten den stand der dinge sich abholt

    const { setErrorLogMessage, apiVersion} = useContext(AppInformationContext);
    const { reloadMessage, setReloadMessages } = useContext(MessagesContext);
    const [ editorContent, setEditorContent ] = useState('');
    const [ editorVisibility, setEditorVisibility ] = useState(false);
    const [ parentMessages, setParentMessages ] = useState('');
    const [ subMessages, setSubMessages ] = useState('');
    const [ initialLoad, setInitialLoad ] = useState(true);
    const toast = useRef(null);

    const editorVisibilityHandler = (editVisible) => {
        if (editVisible) {
            setEditorVisibility(true);
        } else {
            setEditorContent('');
            setEditorVisibility(false);
        }
    }

    const createContentHandler = async (ev) => {
        ev.preventDefault();

        try {
            const messageResp = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/message`, {
                data: {
                    content: editorContent
                }
            },{
                withCredentials: true,
            });

            if (messageResp.data.success) {
                if (messageResp.data.result.parent_id) {
                    setSubMessages({...subMessages, [parent_id]: [...subMessages[parent_id], messageResp.data.result.message]});
                } else {
                    setParentMessages([messageResp.data.result, ...parentMessages]);
                }
                setEditorContent('');
                setEditorVisibility(false);
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
                        'MessageBoard.createContentHandler',
                        messageResp.data.result,
                        messageResp.data.message
                    )
                );
            }
        } catch (err) {
            setErrorLogMessage(
                setErrorMessageString(
                    'MessageBoard.createContentHandler',
                    'unknow_error',
                    err
                )
            )
        }
    }

    useEffect(() => {
        const getMessages = async () => {
            try {
                const messagesDataResp = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/messages`,{
                    data: {
                        messageType: 'general'
                    }
                }, {
                    withCredentials: true,
                });

                if (messagesDataResp.data.success) {
                    setInitialLoad(false);
                    setReloadMessages(false);
                    setParentMessages(messagesDataResp.data.result.parent_messages);
                    setSubMessages(messagesDataResp.data.result.sub_messages)
                }
            } catch (err) {
                setErrorLogMessage(
                    setErrorMessageString(
                        'MessageBoard.useEffect.getMessages',
                        'unknow_error',
                        err
                    )
                )
            }
        };

        if (initialLoad || reloadMessage) {
            getMessages();
        }

    }, [apiVersion, reloadMessage]);

    return (
        <>
            <p className="font-bold text-lg">Pinnwand</p>

            <div className="p-2 mt-2">
                { parentMessages && parentMessages.map(msg => (<MessageCard key={msg.message_id} message={msg} subMessages={subMessages[msg.message_id]}/>))}
                { !parentMessages && <div>Bisher keine Nachrichten.</div>}
            </div>
            {
                !editorVisibility &&
                    <div className="mt-2">
                        <Button label="Neuer Beitrag" onClick={() => {editorVisibilityHandler(true)}} size="small" />
                    </div>
            }

            <div className="mt-3 mb-3" style={{visibility: editorVisibility ? 'visible' : 'hidden'}}>
                <div className="card">
                    <Editor value={editorContent} onTextChange={(e) => setEditorContent(e.htmlValue)} style={{height: editorVisibility ? '320px' : '0px'}}/>
                    {
                        editorVisibility &&
                        <div className="mt-3">
                            <Button className="mr-2" label="Beitrag erstellen" icon="pi pi-check" outlined size="small" onClick={createContentHandler}/>
                            <Button label="Abbrechen" icon="pi pi-times" outlined onClick={() => {editorVisibilityHandler(false)}} size="small" />
                        </div>
                    }
                </div>
            </div>
            <Toast ref={toast} />
        </>
    );
};

export default MessageBoard;