// core imports
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { Chip } from 'primereact/chip';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Toast } from "primereact/toast";
import { InputTextarea } from 'primereact/inputtextarea';

// custom imports
import { AppInformationContext } from "../../context/appinformation.jsx";
import { UserSessionContext } from "../../context/usersession.jsx";
import { getHourMinutes, setErrorMessageString, customToast } from "../../utils/tools.js";
import { TIO_BASE_URL } from "../../utils/constants.js";
import ScoreResultTable from "../../components/tio-scoreresulttable/tio-scoreresulttable.jsx";
import ScoreEditTable from "../../components/tio-scoreedittable/tio-scoreedittable.jsx";

import dummyUserProfile from "../../assets/dummy-user-profile.png";
import dummyGameProfile from "../../assets/dummy-game-profile.png";

// component
const GameStationPage = () => {

    // todo: wenn man den score (zum ersten mal?) abspeichert, wird keine scoretabelle angezeigt

    const { setErrorLogMessage, apiVersion} = useContext(AppInformationContext);
    const { userFirstname } = useContext(UserSessionContext);
    const { eventId} = useParams();
    const [ gameStationData, setGameStationData ] = useState('');
    const [ eventFormats, setEventFormats ] = useState(JSON.parse(localStorage.getItem('tio_event_formats')));
    const [ gameDescVis, setGameDescVis ] = useState(false);
    const [ gameCommentVis, setGameCommentVis ] = useState(false);
    const [ teamScores, setTeamScores ] = useState('');
    const toast = useRef(null);
    const [ challengeComments, setChallengeComments ] = useState('');
    let gameStationTableData = [];

    useEffect(() => {
        if (eventId) {
            const getGameStation = async () => {
                try {
                    const gameStationDataRes = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/gamestation`,{
                        eventId
                    }, {
                        withCredentials: true,
                    });

                    if (gameStationDataRes.data.success) {
                        setTeamScores(gameStationDataRes.data.result.team_scores);
                        setGameStationData(gameStationDataRes.data.result);
                        setChallengeComments(gameStationDataRes.data.result.game_comment);
                    } else {
                        setErrorLogMessage(
                            setErrorMessageString(
                                'GameStationPage.useEffect.getGameStation',
                                gameStationDataRes.data.result,
                                gameStationDataRes.data.message
                            )
                        );
                    }
                } catch (err) {
                    setErrorLogMessage(
                        setErrorMessageString(
                            'GameStationPage.useEffect.getGameStation',
                            'unknow_error',
                            err
                        )
                    )
                }
            };

            getGameStation();
        }
    }, [apiVersion]);

    if (gameStationData) {
        // set everything, which is needed to render page
        const isMultiMode = parseInt(gameStationData.event.multi_mode);
        let startTime = new Date(gameStationData.event.start_fcast);
        startTime.setMinutes(startTime.getMinutes() + parseInt(gameStationData.event.greeting_duration));

        const processMultiMode = () => {
            const groupDistributions = [];
            for (const group of gameStationData.groups_rounds_distribution[gameStationData.game.game_id]) {
                groupDistributions.push(group.group_name);
            }
            for (const gd of groupDistributions) {
                const endTime = new Date(startTime);
                endTime.setMinutes(endTime.getMinutes() + parseInt(gameStationData.event.challenges_duration));
                const timeSlot = `${getHourMinutes(startTime)} - ${getHourMinutes(endTime)}`;
                let rowObject = { timeSlot };
                let columnCount = 0;

                for (const gameStation of gameStationData.game_stations) {
                    if (gameStation.group_name === gd) {
                        const team_a = gameStationData.teams[gameStation.team_a_id].name ?
                            `${gameStationData.teams[gameStation.team_a_id].name} (${gameStationData.teams[gameStation.team_a_id].number})` :
                            gameStationData.teams[gameStation.team_a_id].number;
                        const team_b = gameStationData.teams[gameStation.team_b_id].name ?
                            `${gameStationData.teams[gameStation.team_b_id].name} (${gameStationData.teams[gameStation.team_b_id].number})` :
                            gameStationData.teams[gameStation.team_b_id].number;
                        rowObject = { ...rowObject, [`tvt-${columnCount}`]: `${team_a} - ${team_b}` };
                        columnCount++;
                    }
                }
                gameStationTableData.push(rowObject);
                startTime = new Date(endTime);
                startTime.setMinutes(startTime.getMinutes() + parseInt(gameStationData.event.transfer_duration));
            }
        };

        const processSingleMode = () => {
            let counter = 1;

            const createRowObject = (startTime, duration, tvt = '') => {
                const endTime = new Date(startTime);
                endTime.setMinutes(endTime.getMinutes() + parseInt(duration));
                const timeSlot = `${getHourMinutes(startTime)} - ${getHourMinutes(endTime)}`;
                return { timeSlot, tvt };
            };

            const getTeamLabel = (team) => team.name ? `${team.name} (${team.number})` : team.number;

            for (const gameStation of gameStationData.game_stations) {
                while (counter !== gameStation.game_no) {
                    gameStationTableData.push(createRowObject(startTime, gameStationData.event.challenges_duration));
                    startTime.setMinutes(startTime.getMinutes() + parseInt(gameStationData.event.challenges_duration) + parseInt(gameStationData.event.transfer_duration));
                    counter++;
                }

                const teamA = getTeamLabel(gameStationData.teams[gameStation.team_a_id]);
                const teamB = getTeamLabel(gameStationData.teams[gameStation.team_b_id]);
                gameStationTableData.push(createRowObject(startTime, gameStationData.event.challenges_duration, `${teamA} - ${teamB}`));

                startTime.setMinutes(startTime.getMinutes() + parseInt(gameStationData.event.challenges_duration) + parseInt(gameStationData.event.transfer_duration));
                counter++;
            }
        };

        if (isMultiMode) {
            processMultiMode();
        } else {
            processSingleMode();
        }
   }

    const eventStarted = () => {
        return ![0, 100, 180].includes(gameStationData.event.status);
    };
    const teamNameChangeHandler = (teamId, teamName) => {
        let newTeams = Object.assign({}, gameStationData.teams);
        let newTeamPlacementTemp = Object.assign([], gameStationData.team_placement);

        for (const _teamId in newTeams) {
            if (_teamId === teamId) {
                newTeams[teamId].name = teamName;
                break;
            }
        }

        const newTeamPlacement = newTeamPlacementTemp.map(tp => {
            if (tp.team_id === teamId) {
                return {...tp, team_name: teamName}
            }
            return {...tp}
        });

        setGameStationData({...gameStationData, teams: newTeams, team_placement: newTeamPlacement});
    }

    const teamScoreHandler = (stationId, teamId, numRound, score) => {
        const newTeamScore = Object.assign({}, teamScores);

        for (const _stationId in newTeamScore) {
            if (_stationId === stationId) {
                for (const _teamId in newTeamScore[stationId]) {
                    if (_teamId === teamId) {
                        for (const _numRound in newTeamScore[stationId][teamId]) {
                            if (parseInt(_numRound) === numRound) {
                                newTeamScore[stationId][teamId][numRound] = score
                            }
                        }
                    }
                }
            }
        }
        setTeamScores(newTeamScore);
    }
    const saveTeamNames = (ev) => {
        ev.preventDefault();

        const updateTeamNamesCall = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/teams/names`, {
                    teams: gameStationData.teams
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
                        "Aktualisieren der Teamnamen war erfolgreich.",
                        3000
                    );
                } else {
                    setErrorLogMessage(
                        setErrorMessageString(
                            'GameStationPage.saveTeamNames.updateTeamNamesCall',
                            res.data.result,
                            res.data.error
                        )
                    );
                    customToast(
                        toast,
                        "error",
                        ":(",
                        "Beim Updaten der Teamnamen kam es zu einem Fehler. Weitere Infos im Fehlerprotokoll.",
                        4000
                    );
                }
            }
        }

        if (!eventStarted()) {
            customToast(
                toast,
                'error',
                ':(',
                'Operation nicht möglich, da event noch nicht gestartet oder schon beendet.'
            );
            return null;
        }
        updateTeamNamesCall();
    }

    const saveTeamScores = (ev) => {
        ev.preventDefault();

        const updateTeamScores = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/stationscore/update`, {
                    eventId: gameStationData.event.event_id,
                    teamScores: teamScores
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
                        "Aktualisieren der Teamscores war erfolgreich.",
                        3000
                    );
                } else {
                    setErrorLogMessage(
                        setErrorMessageString(
                            'GameStationPage.saveTeamScores.updateTeamScores',
                            res.data.result,
                            res.data.error
                        )
                    );
                    customToast(
                        toast,
                        "error",
                        ":(",
                        "Beim Updaten der Teamscores kam es zu einem Fehler. Weitere Infos im Fehlerprotokoll.",
                        4000
                    );
                }
            }
        };

        const getNewTeamPlacements = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/stationscore/placement`, {
                    eventId: gameStationData.event.event_id,
                    gameId: gameStationData.game.game_id
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // This ensures cookies are included
                }
            );

            if (res) {
                if (res.data.success) {
                    setGameStationData({...gameStationData, team_placement: res.data.result});
                    customToast(
                        toast,
                        "success",
                        ":)",
                        "Tabelle erfolgreich aktualisiert.",
                        3000
                    );
                } else {
                    setErrorLogMessage(
                        setErrorMessageString(
                            'GameStationPage.saveTeamScores.getNewTeamPlacements',
                            res.data.result,
                            res.data.error
                        )
                    );
                    customToast(
                        toast,
                        "error",
                        ":(",
                        "Beim Updaten der Tabelle kam es zu einem Fehler. Weitere Infos im Fehlerprotokoll.",
                        4000
                    );
                }
            }
        };

        const updateEventScore = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/eventscore/gamestation/update`, {
                    data: {
                        eventId: gameStationData.event.event_id
                    }
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
                        "Aktualisieren des Eventscores war erfolgreich.",
                        3000
                    );
                } else {
                    setErrorLogMessage(
                        setErrorMessageString(
                            'GameStationPage.saveTeamScores.updateEventScore',
                            res.data.result,
                            res.data.error
                        )
                    );
                    customToast(
                        toast,
                        "error",
                        ":(",
                        "Beim Updaten des Eventscores kam es zu einem Fehler. Weitere Infos im Fehlerprotokoll.",
                        4000
                    );
                }
            }
        };

        if (!eventStarted()) {
            customToast(
                toast,
                'error',
                ':(',
                'Operation nicht möglich, da event noch nicht gestartet oder schon beendet.'
            );
            return null;
        }
        updateTeamScores();
        updateEventScore();
        getNewTeamPlacements();
    }

    const gameStationCommentHandler = async (ev, action) => {
        ev.preventDefault();
        if (!eventStarted()) {
            customToast(
                toast,
                'error',
                ':(',
                'Operation nicht möglich, da event noch nicht gestartet oder schon beendet.'
            );
            return null;
        }

        if (!action) {
            setChallengeComments(gameStationData.game_comment);
            setGameCommentVis(false);
            return;
        }

        try {
            const challengeCommentDataRes = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/eventgamecomment/update`,{
                data: {
                    eventId: gameStationData.event.event_id,
                    gameId: gameStationData.game.game_id,
                    comment: challengeComments
                }
            }, {
                withCredentials: true,
            });

            if (challengeCommentDataRes.data.success) {
                setGameStationData({...gameStationData, game_comment: challengeComments});
                setGameCommentVis(false);
                customToast(
                    toast,
                    'success',
                    ':)',
                    'Kommentar erfolgreich aktualisiert.',
                    3000
                );
            } else {
                setChallengeComments(gameStationData.game_comment);
                setErrorLogMessage(
                    setErrorMessageString(
                        'GameStationPage.gameStationCommentHandler',
                        challengeCommentDataRes.data.result,
                        challengeCommentDataRes.data.message
                    )
                );
                customToast(
                    toast,
                    'error',
                    ':(',
                    'Kommentar konnte nicht aktualisiert werden. Bitte ins Fehlerprotokoll schauen.',
                    3000
                );
            }
        } catch (err) {
            setErrorLogMessage(
                setErrorMessageString(
                    'GameStationPage.gameStationCommentHandler',
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
    }

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            { gameStationData &&
                <>
                    <div className="text-xl text-900 font-bold">
                        <Chip
                            image={
                                gameStationData.event.event_blob_name ?
                                    `../media/customer/${gameStationData.event.event_blob_name}` :
                                    dummyUserProfile
                            }
                            label={gameStationData.event.customer}
                        />
                    </div>
                    <Chip
                        image={
                            gameStationData.game_blob_name ?
                                `../media/challenge/${gameStationData.game_blob_name}` :
                                dummyGameProfile
                        }
                        label={gameStationData.game.name}
                    />
                </>
            }
        </div>
    );

    if (gameStationData) {
        const isMultiMode = parseInt(gameStationData.event.multi_mode);
        const groupDistribution = isMultiMode ? gameStationData.event.station_duplicates : null;

        const renderColumns = () => {
            if (isMultiMode) {
                return Array.from(Array(groupDistribution), (e, i) => (
                    <Column key={i} field={`tvt-${i}`} header={`Partie ${i + 1}`} />
                ));
            } else {
                return <Column field='tvt' header='Partie' />;
            }
        };

        const renderTeamNames = () => (
            Object.values(gameStationData.teams).map(({ name, number, team_id }) => (
                <li key={team_id} className="mb-2 text-400">
                    Team {number}:
                    <InputText
                        className="p-inputtext-sm ml-3"
                        value={name || ''}
                        onChange={(e) => teamNameChangeHandler(team_id, e.target.value)}
                    />
                </li>
            ))
        );

        return (
            <>
                <div className="card">
                    <div className="ml-5">
                        <Button
                            className="mr-2"
                            label="Challengebeschreibung"
                            icon="pi pi-pencil"
                            onClick={() => setGameDescVis(true)}
                        />
                        <Dialog
                            header="Challengebeschreibung"
                            visible={gameDescVis}
                                style={{ width: '35vw' }}
                                onHide={() => {
                                    if (!gameDescVis) return;
                                    setGameDescVis(false);
                                }}
                                dismissableMask={true}
                            >
                                <p className="m-0" dangerouslySetInnerHTML={{ __html: gameStationData.game.description }} />
                            </Dialog>

                        <Button
                            label="Kommentar hinzufügen"
                            icon="pi pi-list-check"
                            onClick={() => setGameCommentVis(true)}
                        />
                        <Dialog
                            header="Challenge kommentieren"
                            visible={gameCommentVis}
                            style={{ width: '35vw' }}
                            onHide={() => {
                                if (!gameCommentVis) return;
                                setGameCommentVis(false);
                            }}
                            draggable
                            resizable
                            closable={false}
                        >
                            <InputTextarea
                                value={challengeComments}
                                onChange={(e) => setChallengeComments(e.target.value)}
                                autoResize
                                style={{width: '100%'}}
                                variant='filled'
                            />
                            <div className="mt-2">
                                <Button
                                    className="mr-2"
                                    label="Speichern"
                                    icon="pi pi-save"
                                    onClick={(e) => gameStationCommentHandler(e, true)}
                                />
                                <Button
                                    className="mr-2"
                                    label="Abbrechen"
                                    icon="pi pi-times-circle"
                                    onClick={(e) => gameStationCommentHandler(e, false)}
                                />
                            </div>
                        </Dialog>


                        </div>
                        <div className="grid m-4">
                            <div className={isMultiMode ? "col-5" : "col-4"}>
                                <Fieldset legend="Challengeübersicht">
                                    <DataTable value={gameStationTableData} stripedRows header={header}>
                                        <Column field="timeSlot" header="Zeit" />
                                        {renderColumns()}
                                    </DataTable>
                                </Fieldset>
                            </div>
                            <div className="col-4">
                                <Fieldset legend="Teamnamen" toggleable>
                                    <ul className="list-none">
                                        {renderTeamNames()}
                                    </ul>
                                    <Button label="Speichern" onClick={saveTeamNames} />
                                </Fieldset>
                            </div>
                        </div>
                        <div className="grid m-4">
                            <div className="col-4">
                                <div className="card col-12">
                                    <Fieldset legend="Ergebnisse">
                                        <ScoreEditTable
                                            gsData={gameStationData}
                                            teamScores={teamScores}
                                            eventHandler={teamScoreHandler}
                                        />
                                        <Button label="Scores speichern" onClick={saveTeamScores} />
                                        <Divider />
                                        <ScoreResultTable
                                            teams={gameStationData.team_placement}
                                            gameName={gameStationData.game.name}
                                        />
                                    </Fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Toast ref={toast} />
                </>
        );
    } else {
        return (<ProgressSpinner/>);
    }

};

export default GameStationPage;