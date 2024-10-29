// core imports
import { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Checkbox } from "primereact/checkbox";
import { AutoComplete } from "primereact/autocomplete";

// custom imports
import { AppInformationContext } from '../../context/appinformation';
import { GamesContext, GamesProvider } from "../../context/games.jsx";
import { UserSessionContext } from "../../context/usersession.jsx";
import TioContainer from "../../components/tio-container/tio-container.jsx";
import { customToast, GERMAN_DATETIME_REPR, olderThan24Hours } from "../../utils/tools.js";
import { TIO_BASE_URL } from "../../utils/constants.js";
import { ERROR_PROT_MSG } from "../../utils/tools.js";
import dummyUserProfile from "../../assets/dummy-user-profile.png";

// todo: backend. OP E-0009 fertigstellen


const CreateEvents = () => {
    /*
        this component is responsible for creating an event with all attributes needed for such.
     */

    const { apiVersion, setErrorLogMessage } = useContext(AppInformationContext);
    const { allGames, setAllGames } = useContext(GamesContext);
    // todo: die user nicht über sessioncontext generell abholen, sondern jedes mal, wenn diese
    //  seite aufgerufen wird!!!!!!!!!!!!!!
    const { allUsers, setAllUsers } = useContext(UserSessionContext);

    const [ multiMode, setMultiMode] = useState(false);
    const [ multiActive, setMultiActive ] = useState(true);
    const [ challengeHelper, setChallengeHelper ] = useState('');
    const [ eventId, setEventId ] = useState('');
    const [ eventFormats, setEventFormats ] = useState('');
    const [ eventInformation, setEventInformation ] = useState({
        eventName: '',
        eventCode: '',
        eventDate: '',
        numTeams: '',
        eventStart: '',
        eventEnd: '',
        selectedGames: '',
        selectedEventFormat: '',
        eventPictureBlobId: '',
        eventPictureBlobUploadDate: '',
        eventBlobId: '',
        greetingDuration: 15,
        challengesDuration: 20,
        transferDuration: 5,
        ceremonyDuration: 10,
        multiMode: 0,
        stationDuplicates: '',
        eventLeadId: ''
    });
    const [ tioContainerVisibility, setTioContainerVisibility ] = useState(false);

    const toast = useRef(null);
    const fileUploadComp = useRef();

    useEffect(() => {
        // todo: wenn jmd games erstellt und keine 24 Stunden vergangen sind, dann tauchen die games nicht auf
        //  daher den code so umschreiben, dass die games immer gezogen werden
        if (apiVersion) {
            const localStorageGames = localStorage.getItem('tio_games') ?
                JSON.parse(localStorage.getItem('tio_games')) : null;
            const localStorageFormats = localStorage.getItem('tio_event_formats') ?
                JSON.parse(localStorage.getItem('tio_event_formats')) : null;
            const localStorageFormatDate = localStorage.getItem('tio_event_formats_date') ?
                JSON.parse(localStorage.getItem('tio_event_formats_date')) : null;
            const localStorageGamesDate = localStorage.getItem('tio_games_date') ?
                JSON.parse(localStorage.getItem('tio_games_date')) : null;

            if (!localStorageGames || olderThan24Hours(localStorageGamesDate)) {
                axios.get(`${TIO_BASE_URL}/api/${apiVersion}/games`, {
                    withCredentials: true // This ensures cookies are included
                }).then(res => {
                    localStorage.setItem('tio_games', JSON.stringify(res.data.tio_games));
                    localStorage.setItem('tio_games_date', JSON.stringify(new Date()));
                    setAllGames(res.data.tio_games);
                }).catch(err => {
                    setErrorLogMessage(`CreateEvents.useEffect.get.games:: apiVersion: ${apiVersion}:: error_code: no_code:: error_msg: ${err}`);
                });
            } else {
                setAllGames(localStorageGames);
            }

            if (!localStorageFormats || olderThan24Hours(localStorageFormatDate)) {
                axios.get(`${TIO_BASE_URL}/api/${apiVersion}/eformats`, {
                    withCredentials: true // This ensures cookies are included
                }).then(res => {
                    setEventFormats(res.data.tio_event_formats);
                    localStorage.setItem('tio_event_formats_date', JSON.stringify(new Date()));
                    localStorage.setItem('tio_event_formats', JSON.stringify(res.data.tio_event_format));
                }).catch(err => {
                    setErrorLogMessage(`CreateEvents.useEffect.get.event_formats:: apiVersion: ${apiVersion}:: error_code: no_code:: error_msg: ${err}`);
                });
            } else {
                setEventFormats(localStorageFormats);
            }

            axios.get(`${TIO_BASE_URL}/api/${apiVersion}/users`, {
                withCredentials: true,
            }).then(res => {
                if (res.data.success) {
                    setAllUsers(res.data.result);
                } else {
                    setErrorLogMessage(`CreateEvents.useEffect.get_all_users:: error_code:${res.data.result}:: error_msg: ${res.data.message}`);
                }
            });
        }
    }, [apiVersion]);

    useEffect(() => {
        setChallengeHelper( allUsers.map(user => {
            return {...user, name: `${user.firstname} ${user.lastname}`, gameId: '', key: user.userId};
        }));
    }, [allUsers]);

    const clearAllFields = () => {
        // todo: bei gelegenheit diese methode verallgemeinern in den tools (falls moeglich)
        setEventInformation({
            eventName: '',
            eventCode: '',
            eventDate: '',
            numTeams: '',
            eventStart: '',
            eventEnd: '',
            selectedGames: '',
            selectedEventFormat: '',
            eventPictureBlobId: '',
            eventPictureBlobUploadDate: '',
            eventBlobId: '',
            greetingDuration: 15,
            challengesDuration: 20,
            transferDuration: 5,
            ceremonyDuration: 10,
            multiMode: 0,
            stationDuplicates: '',
            eventLeadId: ''
        });
        fileUploadComp.current.clear();
    };

    const handleEventSchedule = (attr, val) => {
        if (eventInformation.eventStart !== '' || eventInformation.eventStart !== null) {
            const {eventStart} = eventInformation;
            /*
            greetingDuration,
            challengesDuration,
            transferDuration,
            ceremonyDuration
        */

            let setDate = new Date(eventStart);

            /*
                since we are not getting the entered number right away into the corresponding object entry,
                we have compare, if the attribute we changed is the same as the one we are looping over.
                if it is the same, we won't take the 'not-updated' number from eventInformation, but
                instead we are going to take the update number from the inputform.
            */
            const durations = {
                greetingDuration: eventInformation.greetingDuration,
                transferDuration: eventInformation.transferDuration,
                ceremonyDuration: eventInformation.ceremonyDuration,
                challengesDuration: eventInformation.challengesDuration
            };
            let totalMinutes = 0;
            let tempMin = 0;

            for (const [_attr, _val] of Object.entries(durations)) {
                let tempVal = _val;
                if (_attr === attr) {
                    tempVal = val;
                }

                if (_attr === 'challengesDuration') {
                    let numSelectedGames = 0
                    if (attr === 'selectedGames') {
                        numSelectedGames = val.length;
                    } else {
                        numSelectedGames = eventInformation.selectedGames.length
                    }

                    tempMin = parseInt(tempVal) * numSelectedGames;
                    if (tempMin !== null && !Number.isNaN(tempMin)) {
                        totalMinutes += tempMin;
                        continue;
                    }
                }

                if (_attr === 'transferDuration') {
                    let numSelectedGames = 0
                    if (attr === 'selectedGames') {
                        numSelectedGames = val.length;
                    } else {
                        numSelectedGames = eventInformation.selectedGames.length
                    }

                    if (numSelectedGames === 0) continue;

                    tempMin = parseInt(tempVal) * (numSelectedGames - 1);
                    if (tempMin !== null && !Number.isNaN(tempMin)) {
                        totalMinutes += tempMin;
                        continue;
                    }
                }

                tempMin = parseInt(tempVal);
                if (tempMin !== null && !Number.isNaN(tempMin)) {
                    totalMinutes += tempMin;
                }
            }

            setDate.setMinutes(setDate.getMinutes() + totalMinutes);

            setEventInformation({
                ...eventInformation, [attr]: val,
                eventEnd: GERMAN_DATETIME_REPR(setDate)
            });
        } else {
            setEventInformation({...eventInformation, [attr]: val});
        }
    }

    const tioGames = allGames.map(game => {
        return {...game, gameLeadId: null, key: game.gameID, numRounds: 1}
    });

    // todo: wenn die user nicht im speicher sind, dann erneut anfordern
    //  das gleich für die challenges und formate
    const gameLeads = allUsers.map(user => {
        return {...user, name: `${user.firstname} ${user.lastname}`, gameLeadId: user.userId};
    });

    const eventLeads = allUsers.map(user => {
        return {...user, name: `${user.firstname} ${user.lastname}`}
    });

    const formIncomplete = (msg) => {
        toast.current.show({
            severity: 'warn',
            summary: "Eingabe unvollständig.",
            detail: msg,
            life: 3500
        });
    };
    
    const handleCreateEvent = (ev) => {
        ev.preventDefault();
        const { eventName, eventStart, numTeams, selectedGames, selectedEventFormat } = eventInformation;

        if (!(eventName && eventStart && numTeams && selectedGames && selectedEventFormat)) {
            formIncomplete("Kundenname, Eventformat, Datum, und Anzahl Teams sind Pflichtfelder!");
            return null;
        }

        selectedGames.forEach(game => {
            if (!game.gameLeadId) {
                formIncomplete("Bitte wähle für jedes deiner Spiele einen Lead aus!");
                return null;
            }
        })

        if (eventInformation.multiMode && numTeams !== 2 * eventInformation.stationDuplicates * eventInformation.selectedGames.length) {
            formIncomplete("Du hast den Multimodus ausgewählt. Die Anzahl der Teams ist reicht für die Anzahl der Challenges und Duplikate nicht aus.");
            return null;
        }

        const create_event_call = async () => {
            try {
                const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/create/event`,
                    { ...eventInformation, challengeHelper },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );

                if (res) {
                    if (res.data.success) {
                        setEventId(res.data.result);
                        setTioContainerVisibility(true);
                    } else {
                        setErrorLogMessage(`CreateUsers.handleCreateEvent.create_event_call:: error_code:${res.data.result}:: error_msg:${res.data.error}`)
                        //clearAllFields();
                        customToast(
                            toast,
                            "error",
                            "Fehler bei Eventerstellung",
                            "Beim Erstellen des Events kam es zu einem Fehler. Bitte schauen Sie ins Fehlerprotokoll.",
                            5000
                        );
                    }
                }
            } catch (err) {
                setErrorLogMessage(`CreateUsers.handleCreateEvent.create_event_call:: error_code:AxiosError:: error_msg:${err}`)
                customToast(
                    toast,
                    "error",
                    "Fehler bei Eventerstellung",
                    "Beim Erstellen des Events kam es zu einem Fehler. Bitte schauen Sie ins Fehlerprotokoll.",
                    5000
                );
            }
        }
        create_event_call();
    };

    const handleGameLeadChange = (gameId, {name, gameLeadId}) => {
        /*
            how primereact-dropdown works:
                e.g. options gets a list of objects. with optionlabel you define, what will be shown.
                value is actually the id, which corresponds to the selected object, which means, if you
                set the id somewhere else, you have to handle, that in value, the correct id is provided
                to value.
        */
        const games = eventInformation.selectedGames.map(game => {
            if (game.gameID === gameId) {
                return {...game, gameLeadId, key: game.gameID};
            }
            return {...game};
        });
        setEventInformation({...eventInformation, selectedGames: games});
    };

    const handleEventLeadChange = ({name, userId}) => {
        /*
            how primereact-dropdown works:
                e.g. options gets a list of objects. with optionlabel you define, what will be shown.
                value is actually the id, which corresponds to the selected object, which means, if you
                set the id somewhere else, you have to handle, that in value, the correct id is provided
                to value.
        */

        setEventInformation({...eventInformation, eventLeadId: userId});
    };

    const handleNumRoundsChange = (gameId, numRounds) => {
        const games = eventInformation.selectedGames.map(game => {
            if (game.gameID === gameId) {
                return {...game, numRounds, key: game.gameID};
            }
            return {...game};
        });
        setEventInformation({...eventInformation, selectedGames: games});
    };

    const fileUploadHandler = (e) => {
        const res = JSON.parse(e.xhr.response);

        if (res.success) {
            setEventInformation({
                ...eventInformation,
                eventPictureBlobId: res.result.blob_id,
                eventPictureBlobUploadDate: res.result.blob_upload_date,
                eventBlobId: res.result.blob_id
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

    const handlerMultiMode = (e) => {
        setMultiMode(e.checked);
        setMultiActive(!multiActive);
        if (!multiActive) {
            setEventInformation({...eventInformation, stationDuplicates: '', multiMode: 0})
        } else {
            setEventInformation({...eventInformation, multiMode: 1})
        }
    }

    const handleHelperChange = (gameId, helper) => {
        const numRoundsGame = parseInt(eventInformation.stationDuplicates) - 1;
        let numRoundsGameCounter = 0;

        for (const ch of challengeHelper) {
            if (ch.gameId === gameId) {
                numRoundsGameCounter++;
            }
        }

        if (numRoundsGameCounter === numRoundsGame) {
            customToast(
                toast,
                'error',
                ':(',
                'Maximale Anzahl an Helfern gewählt',
                3000
            );
            return;
        }

        for (const sg of eventInformation.selectedGames) {
            if (sg.gameLeadId === helper.userId) {
                customToast(
                toast,
                'error',
                ':(',
                'Challengelead kann nicht als Helfer ausgewählt werden.',
                3000
            );
            return;
            }
        }

        const _challengeHelper = challengeHelper.map(ch => {
            if (ch.userId === helper.userId) {
                return {...ch, gameId}
            }
            return {...ch}
        });

        setChallengeHelper(_challengeHelper);
    }

    const handleRemoveHelper = (helperId) => {

        setChallengeHelper(challengeHelper.map(ch => {
            if (ch.userId === helperId) {
                return {...ch, gameId: ''}
            }
            return {...ch}
        }));
    }

    return (
        <>
            <h2 className="m-3">Event erstellen</h2>
            <Fieldset legend="Eventinformationen" className="m-3">
                <div className="card flex justify-content-start flex-wrap">
                    <div className="m-4">
                        <FloatLabel>
                            <InputText
                                id="eventname"
                                value={eventInformation.eventName}
                                onChange={
                                    (e) => setEventInformation({
                                        ...eventInformation, eventName: e.target.value
                                    })
                                }
                            />
                            <label htmlFor="eventname">Kundenname</label>
                        </FloatLabel>
                    </div>
                    <div className="m-4">
                        <FloatLabel>
                            <Dropdown
                                inputId="eventFormat"
                                value={eventInformation.selectedEventFormat}
                                onChange={
                                    (e) =>
                                        setEventInformation({...eventInformation, selectedEventFormat: e.value})
                                }
                                options={eventFormats}
                                optionLabel="name"
                                placeholder="Eventformat"
                                className="w-full"
                            />
                            <label htmlFor="eventFormat">Eventformat</label>
                        </FloatLabel>
                    </div>
                    <div className="m-4">
                        <FloatLabel>
                            <Calendar
                                inputId="eventdate"
                                value={eventInformation.eventDate}
                                onChange={
                                    (e) => setEventInformation({
                                        ...eventInformation, eventDate: e.target.value
                                    })
                                }
                                locale="de"
                                hourFormat="24"
                                dateFormat="dd.mm.yy"
                            />
                            <label htmlFor="eventdate">Datum</label>
                        </FloatLabel>
                    </div>

                    {/* not used in this version of the tool
                    <div className="m-4">
                        <FloatLabel>
                            <InputText
                                id="eventcode"
                                value={eventCode}
                                onChange={(e) => setEventCode(e.target.value)}
                            />
                            <label htmlFor="eventcode">Eventcode</label>
                        </FloatLabel>
                    </div>*/
                    }
                    <div className="m-4">
                        <FloatLabel>
                            <InputNumber
                                min={1}
                                inputId="numTeams"
                                value={eventInformation.numTeams}
                                onValueChange={
                                    (e) => setEventInformation({
                                        ...eventInformation, numTeams: e.target.value
                                    })
                                }
                            />
                            <label htmlFor="numTeams">Anzahl Teams</label>
                        </FloatLabel>
                    </div>
                    <div className="m-4">
                        <FloatLabel>
                            <Dropdown
                                inputId="eventLead"
                                required
                                value={eventLeads.filter(el => el.userId === eventInformation.eventLeadId)[0]}
                                onChange={(e) => {
                                    handleEventLeadChange(e.value)
                                }}
                                options={eventLeads}
                                optionLabel="name"
                                placeholder="Teamlead auswählen"
                                className="w-full"
                            />
                            <label htmlFor="eventLead">Teamlead</label>
                        </FloatLabel>
                    </div>

                    <Divider/>
                    <div className="m-4">
                        <FileUpload
                            mode="advanced"
                            name="tio_file/customer"
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

            <Fieldset legend="Challenges" className="m-3">
                <div className="flex align-items-center m-4">
                    <Checkbox inputId="ingredient1" name="pizza" value="Multimodus" onChange={handlerMultiMode} checked={multiMode}/>
                    <label htmlFor="ingredient1" className="ml-2">Multimodus</label>
                     <FloatLabel>
                            <InputNumber
                                disabled={multiActive}
                                className="pl-3"
                                min={2}
                                inputId="numTeams"
                                value={eventInformation.stationDuplicates}
                                onValueChange={
                                    (e) => setEventInformation({
                                        ...eventInformation, stationDuplicates: e.target.value
                                    })
                                }
                            />
                            <label className="pl-3" htmlFor="numTeams">Stationsduplikate</label>
                        </FloatLabel>

                </div>
                <div className="card flex justify-content-start flex-wrap">
                    <div className="m-4">
                        <FloatLabel className="w-full">
                            <MultiSelect
                                value={eventInformation.selectedGames}
                                onChange={(e) => handleEventSchedule('selectedGames', e.target.value)}
                                options={tioGames}
                                optionLabel="name"
                                className="w-full"
                                display="chip"
                                showClear
                            />
                            <label htmlFor="eventgames">Challenge auswählen</label>
                        </FloatLabel>
                    </div>
                </div>

                <div className="card flex justify-content-start flex-wrap">
                    {
                        eventInformation.selectedGames && eventInformation.selectedGames.map(game => {
                            return (
                                <div className="card m-2" key={game.code}>
                                    <Card title={game.name}>
                                        <Dropdown
                                            className="w-full mb-4"
                                            required
                                            value={gameLeads.filter(({gameLeadId}) => gameLeadId === game.gameLeadId)[0]}
                                            onChange={(e) => {
                                                handleGameLeadChange(game.gameID, e.value)
                                            }}
                                            options={gameLeads}
                                            optionLabel="name"
                                            placeholder="Lead auswählen"
                                            style={{marginTop: "10px"}}
                                        />
                                        <FloatLabel className="mt-2">
                                            <InputText
                                                type="number"
                                                id="gamerounds"
                                                value={game.numRounds}
                                                onChange={(e) => {
                                                    handleNumRoundsChange(game.gameID, e.target.value)
                                                }}
                                            />
                                            <label htmlFor="eventname">Anzahl Runden</label>
                                        </FloatLabel>
                                        {/*  durch eine unordered list ersetzen. idee ist, man wählt user aus einem AutoComplete mit Dropdown aus */}
                                        { !multiActive && eventInformation.stationDuplicates &&
                                            <>
                                                <Dropdown
                                                    className="w-full mb-2 mt-3"
                                                    required
                                                    value="Helfer auswählen"
                                                    onChange={(e) => {
                                                        handleHelperChange(game.gameID, e.value)
                                                    }}
                                                    options={challengeHelper}
                                                    optionLabel="name"
                                                    placeholder="Helfer auswählen"
                                                />
                                                <ul>
                                                    {
                                                        challengeHelper.map(ch => {
                                                            if (ch.gameId === game.gameID) {
                                                                return (
                                                                    <li className="mb-2">
                                                                        {ch.name}<i className="pi pi-times-circle ml-3" style={{fontSize: '1rem'}} onClick={() => {handleRemoveHelper(ch.userId)}}></i>
                                                                    </li>
                                                                );
                                                            }
                                                        })
                                                    }
                                                </ul>
                                            </>
                                        }
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            </Fieldset>

            <Fieldset legend="Event Schedule" className="m-3">
                <div className="card flex justify-content-start flex-wrap">
                    <div className="m-4">
                        <FloatLabel>
                            <Calendar
                                inputId="eventdate"
                                value={eventInformation.eventStart}
                                onChange={(e) => handleEventSchedule('eventStart', e.target.value)}
                                locale="de"
                                showTime
                                hourFormat="24"
                                dateFormat="dd.mm.yy"
                            />
                            <label htmlFor="eventdate">Eventbeginn</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <InputNumber
                                min={1}
                                inputId="greetingtime"
                                value={eventInformation.greetingDuration}
                                onChange={(e) => handleEventSchedule('greetingDuration', e.value)}
                            />
                            <label htmlFor="greetingtime">Begrüßung</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <InputNumber
                                min={1}
                                inputId="challengestime"
                                value={eventInformation.challengesDuration}
                                onChange={(e) => handleEventSchedule('challengesDuration', e.value)}
                            />
                            <label htmlFor="challengestime">Challenges</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <InputNumber
                                min={1}
                                inputId="challengestime"
                                value={eventInformation.transferDuration}
                                onChange={(e) => handleEventSchedule('transferDuration', e.value)}
                            />
                            <label htmlFor="challengestime">Transfer</label>
                        </FloatLabel>
                    </div>

                    <div className="m-4">
                        <FloatLabel>
                            <InputNumber
                                min={1}
                                inputId="awardtime"
                                value={eventInformation.ceremonyDuration}
                                onChange={(e) => handleEventSchedule('ceremonyDuration', e.value)}
                            />
                            <label htmlFor="awardtime">Siegerehrung</label>
                        </FloatLabel>
                    </div>

                    <Divider />
                    <div className="m-4">
                        <i className="pi pi-calendar-clock" style={{ fontSize: '1.5rem' }}></i> Voraussichtliches Eventende: {eventInformation.eventEnd}
                    </div>
                </div>
            </Fieldset>
            
            <Toast ref={toast} />
            <Button label="Event erstellen" className="m-3" onClick={handleCreateEvent}/>
            { eventId &&
                <TioContainer
                    content={"Das Event wurde erfolgreich angelegt!"}
                    tioContainerVisible={tioContainerVisibility}
                    whereTo={`/event/${eventId}`}
                />
            }
        </>
    );
};

export default CreateEvents;