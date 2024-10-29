// core imports
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Chip } from 'primereact/chip';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from "primereact/toast";
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';


// custom imports
import { AppInformationContext} from "../../context/appinformation.jsx";
import { UserSessionContext } from "../../context/usersession.jsx";
import { getHourMinutes, GERMAN_DATE_REPR, customToast, setErrorMessageString } from "../../utils/tools.js";
import { TIO_BASE_URL } from "../../utils/constants.js";
import ScoreResultTable from "../../components/tio-scoreresulttable/tio-scoreresulttable.jsx";

import dummyUserProfile from "../../assets/dummy-user-profile.png";
import {InputTextarea} from "primereact/inputtextarea";

const EventPage = () => {

    const {  myUserRoles} = useContext(UserSessionContext);
    const { setErrorLogMessage, apiVersion} = useContext(AppInformationContext);
    const { eventId } = useParams();
    const [ eventData, setEventData ] = useState('');
    const [ eventFormats, setEventFormats ] = useState(JSON.parse(localStorage.getItem('tio_event_formats')));
    const [ challengeCommentVis, setChallengeCommentVis ] = useState(false);
    const toast = useRef(null);
    const [ openDialogId, setOpenDialogId ] = useState(null);
    const [ editScoreResultVis, setEditScoreResultVis] = useState(false);
    const [ eventScores, setEventScores ] = useState('');
    let eventDataTable = [];

    useEffect(() => {
        if (eventId) {
            const get_event = async () => {
                try {
                    const eventDataRes = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/event`,{
                        eventId
                    }, {
                        withCredentials: true,
                    });

                    if (eventDataRes.data.success) {
                        setEventData(eventDataRes.data.result);
                        setEventScores(eventDataRes.data.result.event_scores);
                    } else {
                        setErrorLogMessage(`EventPage.useEffect.get_event:: error_code:${eventDataRes.data.result}:: error_msg: ${eventDataRes.data.message}`);
                    }
                } catch (err) {
                    setErrorLogMessage(`EventPage.useEffect.get_event:: error_code:unknow_error:: error_msg: ${err}`);
                }
            };

            get_event();
        }
    }, [apiVersion]);

    useEffect(() => {
        if (!eventFormats) {
            axios.get(`${TIO_BASE_URL}/api/${apiVersion}/eformats`, {
                    withCredentials: true // This ensures cookies are included
                }).then(res => {
                    setEventFormats(res.data.tio_event_format);
                    localStorage.setItem('tio_event_formats_date', JSON.stringify(new Date()));
                    localStorage.setItem('tio_event_formats', JSON.stringify(res.data.tio_event_format));
                }).catch(err => {
                    setErrorLogMessage(`EventPage.useEffect.get_event_formats:: apiVersion: ${apiVersion}:: error_code: no_code:: error_msg: ${err}`);
                });
        }
    }, [apiVersion])

    if (eventData) {
        const isMultiMode = parseInt(eventData.event.multi_mode);
        let startTime = new Date(eventData.event.start_fcast);
        startTime.setMinutes(startTime.getMinutes() + parseInt(eventData.event.greeting_duration));

        for (let i = 0; i < eventData.games.length; i++) {
            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + parseInt(eventData.event.challenges_duration));
            const timeSlot = `${getHourMinutes(startTime)} - ${getHourMinutes(endTime)}`;

            let rowObject = { timeSlot };

            if (isMultiMode) {
                for (const gameId of Object.keys(eventData.groups_round_distribution)) {
                    rowObject = { ...rowObject, [gameId]: eventData.groups_round_distribution[gameId][i].group_name };
                }
            } else {
                const gameStations = eventData.game_stations.filter(gs => gs.game_no === (i + 1));
                for (const gameStation of gameStations) {
                    const team_a = eventData.teams[gameStation.team_a_id].name || eventData.teams[gameStation.team_a_id].number;
                    const team_b = eventData.teams[gameStation.team_b_id].name || eventData.teams[gameStation.team_b_id].number;
                    rowObject = { ...rowObject, [gameStation.game_id]: `${team_a} - ${team_b}` };
                }
            }

            eventDataTable.push(rowObject);
            startTime = new Date(endTime);
            startTime.setMinutes(startTime.getMinutes() + parseInt(eventData.event.transfer_duration));
        }
    }

    const setEventStatusHandler = async (ev, newStatus) => {
        ev.preventDefault();
        try {
            const eventStatusRes = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/event/status`,{
                data: {
                    eventStatus: newStatus,
                    eventId: eventData.event.event_id
                }
            }, {
                withCredentials: true,
            });

            if (eventStatusRes.data.success) {
                const newEventData = Object.assign({}, eventData);
                newEventData.event.status = newStatus;
                setEventData(newEventData);
                let statusWord = '';
                switch (newStatus) {
                    case 0:
                        statusWord = 'zurückgesetzt';
                        break;
                    case 50:
                        statusWord = 'gestartet';
                        break;
                    case 100:
                        statusWord = 'beendet';
                        break;
                    case 180:
                        statusWord = 'verworfen';
                        break;
                }
                customToast(
                    toast,
                    'success',
                    ':)',
                    `Event wurde erfolgreich ${statusWord}`
                );
            } else {
                customToast(
                    toast,
                    'error',
                    ':(',
                    'Status konnte nicht geändert werden. Bitte ins Fehlerprotokoll schauen.'
                );
                setErrorLogMessage(`EventPage.setEventStatus:: error_code:${eventStatusRes.data.result}:: error_msg: ${eventStatusRes.data.message}`);
            }
        } catch (err) {
            setErrorLogMessage(`EventPage.setEventStatus:: error_code:unknow_error:: error_msg: ${err}`);
        }
    }

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex flex-wrap justify-content-end gap-2">
                { eventData &&
                    (
                        (eventData.event.status === 0 &&
                            <>
                                <Button
                                    icon="pi pi-play-circle"
                                    rounded
                                    raised
                                    severity="info"
                                    onClick={(e) => setEventStatusHandler(e, 50)}
                                >
                                    <span className="pl-2">Starten</span>
                                </Button>
                                <Button
                                    icon="pi pi-play-circle"
                                    rounded
                                    raised
                                    severity="danger"
                                    onClick={(e) => setEventStatusHandler(e, 180)}
                                >
                                    <span className="pl-2">Verwerfen</span>
                                </Button>
                            </>
                        ) || (eventData.event.status === 50 &&
                            <>
                                <Button
                                    icon="pi pi-play-circle"
                                    rounded
                                    raised
                                    severity="success"
                                    onClick={(e) => setEventStatusHandler(e, 100)}
                                >
                                    <span className="pl-2">Beenden</span>
                                </Button>
                                <Button
                                    icon="pi pi-play-circle"
                                    rounded
                                    raised
                                    severity="danger"
                                    onClick={(e) => setEventStatusHandler(e, 180)}
                                >
                                    <span className="pl-2">Verwerfen</span>
                                </Button>
                            </>
                        ) || ([100, 180].includes(eventData.event.status) && myUserRoles.some(r => r.name === 'Admin') &&
                            <Button
                                icon="pi pi-play-circle"
                                rounded
                                raised
                                onClick={(e) => setEventStatusHandler(e, 0)}
                            >
                                <span className="pl-2">Reset</span>
                            </Button>
                        )
                    )
                }
            </div>
        </div>
    );

    const eventScoreButtonHandler = async (ev, action) => {
        ev.preventDefault();

        if (!action) {
            setEventScores(eventData.event_scores);
            setEditScoreResultVis(false);
            return;
        }

        try {
            const eventScoreEditRes = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/eventscores/update`,{
                data: {
                    eventId: eventData.event.event_id,
                    eventScores
                }
            }, {
                withCredentials: true
            });

            if (eventScoreEditRes.data.success) {
                const tempFinalPlacements = eventData.final_placements.map(fp => {
                    return {...fp, score_points: fp.score + eventScores[fp.team_id]}
                });

                setEventData({...eventData, event_scores: eventScores, final_placements: tempFinalPlacements});
                setEditScoreResultVis(false);
                customToast(
                    toast,
                    'success',
                    ':)',
                    'Zusätzliche Scorepunkte erfolgreich hinzugefügt.',
                    3000
                );
            } else {
                setEventScores(eventData.event_scores);
                setErrorLogMessage(
                    setErrorMessageString(
                        'EventPage.eventScoreButtonHandler',
                        eventScoreEditRes.data.result,
                        eventScoreEditRes.data.message
                    )
                );
                customToast(
                    toast,
                    'error',
                    ':(',
                    'Zusätzliche Scorepunkte konnten nicht aktualisiert werden. Bitte ins Fehlerprotokoll schauen.',
                    3000
                );
            }
        } catch (err) {
            setErrorLogMessage(
                setErrorMessageString(
                    'EventPage.eventScoreButtonHandler',
                    'unknow_error',
                    err
                )
            );
            customToast(
                toast,
                'error',
                ':(',
                'Unbekannter Fehler. Bitte ins Fehlerprotokoll schauen.',
                3000
            );
        }
    };

    const eventScoreEditHandler = (value, teamId) => {
        setEventScores({ ...eventScores, [teamId]: value });
    };

    if (eventData) {
        const isMultiMode = parseInt(eventData.event.multi_mode);

        const eventHeader = (
            <span className="text-3xl text-800 font-medium">
                <Chip
                    className="pl-4 pr-4"
                    image={
                        eventData.event.event_blob_name ?
                            `../media/customer/${eventData.event.event_blob_name}` :
                            dummyUserProfile
                    }
                    label={
                        `${eventData.event.customer} - 
                        ${eventFormats.find(ef => ef.formatID === eventData.event.event_format).name} - 
                        ${GERMAN_DATE_REPR(eventData.event.event_date)}`
                    }
                />
            </span>
        );

        const eventDetails = (
            <div className="surface-0">
                <div className="font-medium text-xl text-900 mb-3">
                    Teamlead: {eventData.event_lead}
                </div>
                <div className="font-medium text-xl text-900 mb-3 border-top-1 border-300 pt-3">
                    Status: {eventData.event_states.find(es => es.status === eventData.event.status).name}
                </div>
                <div className="font-medium text-xl text-900 mb-3 border-top-1 border-300 pt-3">
                    Stationleads:
                </div>
                <ul className="list-none p-0 m-0">
                    {
                        eventData.station_lead_distribution.map(sld => {
                            const stationLead = eventData.station_leads.find(sl => sl.user_id === sld.lead_id);
                            return (
                                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap"
                                    key={sld.lead_id}>
                                    <div className="text-500 w-6 md:w-3 font-medium">{sld.game_name}</div>
                                    <div className="text-900 w-full md:w-5 md:flex-order-0 flex-order-1">
                                        {`${stationLead.firstname} ${stationLead.lastname}`}
                                    </div>
                                    <div className="w-6 md:w-4 flex justify-content-end">
                                        <Button
                                            label="Kommentare"
                                            icon="pi pi-comment"
                                            className="p-button-text"
                                            onClick={() => setOpenDialogId(sld.lead_id)}
                                        />
                                        <Dialog
                                            header={`${sld.game_name} - Kommentare`}
                                            visible={openDialogId === sld.lead_id}
                                            style={{width: '35vw'}}
                                            onHide={() => setOpenDialogId(null)}
                                            dismissableMask={true}
                                        >
                                            <InputTextarea
                                                value={eventData.game_comments[sld.game_id]}
                                                style={{width: '100%'}}
                                                variant='filled'
                                                autoResize
                                            />
                                        </Dialog>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );

        let dataTable = null;
        let groupDistribution = null;

        if (isMultiMode) {
            dataTable = (
            <DataTable value={eventDataTable} stripedRows header={header}>
                {eventData && <Column field="timeSlot" header=""/>}
                {
                    eventData && Object.keys(eventData.groups_round_distribution).map(
                        gameId => <Column
                            field={gameId}
                            header={eventData.game_names[gameId]}
                            key={gameId}
                        />
                    )
                }
            </DataTable>
        );
        } else {
            dataTable = (
                <DataTable value={eventDataTable} stripedRows header={header}>
                    {eventData && <Column field="timeSlot" header=""/>}
                    {
                        eventData && eventData.games.map(
                            game => <Column
                                field={Object.values(game)[0].game_id}
                                header={Object.values(game)[0].name}
                                key={Object.values(game)[0].game_id}
                            />
                        )
                    }
                </DataTable>
            );
        }

        const challengeResults = (
            ![0, 180].includes(eventData.event.status) && (
                <>
                    {
                        Object.keys(eventData.team_placements).map(gameId => (
                            <div key={gameId}>
                                <ScoreResultTable
                                    teams={eventData.team_placements[gameId]}
                                    gameName={eventData.game_names[gameId]}
                                />
                                <Divider/>
                            </div>
                        ))
                    }
                </>
            )
        );

        const finalResults = (
            ![0, 180].includes(eventData.event.status) && (
                <>
                    <ScoreResultTable teams={eventData.final_placements} gameName="Gesamt" showTeamScoreLabel={false}/>
                </>
            )
        );

        if (isMultiMode) {
            groupDistribution = (
                <Card>
                    <h1 className="text-lg">Gruppenverteilung</h1>
                    {
                        Object.keys(eventData.group_distribution).map(groupName => (
                            <div key={groupName}>
                                <h2 className="mb-2 font-semibold text-gray-900 dark:text-white">Gruppe {groupName}</h2>
                                <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                    {
                                        eventData.group_distribution[groupName].map(teamId => (
                                            <li key={teamId}>
                                                Team:&nbsp;
                                                {
                                                eventData.teams[teamId].name ?
                                                    `${eventData.teams[teamId].name} (${eventData.teams[teamId].number})` :
                                                    eventData.teams[teamId].number
                                                }
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        ))
                    }
                </Card>
            );
        }

        const editScoreResults = (
            ![0, 180].includes(eventData.event.status) &&
            <>
                <Button
                    icon="pi pi-pen-to-square"
                    rounded
                    raised
                    severity="info"
                    onClick={(e) => setEditScoreResultVis(true)}
                >
                    <span className="pl-2">Gesamtscore anpassen</span>
                </Button>
                <Dialog
                    header="Zusätzliche Scorepunkte hinzufügen"
                    visible={editScoreResultVis}
                    style={{width: '20vw'}}
                    onHide={() => {
                        if (!editScoreResultVis) return;
                        setEditScoreResultVis(false);
                    }}
                    draggable
                    resizable
                    closable={false}
                >
                    <div className="card flex flex-column gap-3 p-fluid">
                        {
                            eventScores && Object.keys(eventScores).map(es => (
                                <div key={es}>
                                    <label htmlFor={es} className="font-bold block mb-1">Team {eventData.teams[es].name ? `${eventData.teams[es].name} (${eventData.teams[es].number})` : eventData.teams[es].number}</label>
                                    <InputNumber
                                        inputId={es}
                                        value={eventScores[es] ?? ''}
                                        onChange={(e) => {eventScoreEditHandler(e.value, es)}}
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <div className="flex justify-content-around flex-wrap mt-3">
                        <div className="flex align-items-center justify-content-center">
                            <Button

                                label="Speichern"
                                icon="pi pi-save"
                                onClick={(e) => eventScoreButtonHandler(e, true)}
                            />
                        </div>
                        <div className="flex align-items-center justify-content-center">
                            <Button
                                className="flex align-items-center justify-content-center"
                                label="Abbrechen"
                                icon="pi pi-times-circle"
                                onClick={(e) => eventScoreButtonHandler(e, false)}
                            />
                        </div>
                    </div>
                </Dialog>
            </>
    );

    return (
        <>
            <div className="card">
                <div className="grid m-4">
                    <div className="col-7">
                        <Card>
                            <div>{eventData && eventHeader}</div>
                            <Divider />
                            {eventData && eventDetails}
                            <Divider />
                            {dataTable}
                            <Divider />
                            {challengeResults}
                            {finalResults}
                            <Divider />
                            {editScoreResults}
                        </Card>
                    </div>
                    { isMultiMode ? <div className="card col-2">{groupDistribution}</div> : null }
                </div>
            </div>
            <Toast ref={toast}/>
        </>
        );
    } else {
        return (<ProgressSpinner />);
    }
};

export default EventPage;