// core imports
import axios from "axios";
import { useContext, useRef } from "react";
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";

// custom imports
import { AppInformationContext } from "../../context/appinformation.jsx";
import GameDetails from "./tio-gamedetails.jsx";
import { customToast } from "../../utils/tools.js";
import { TIO_BASE_URL } from "../../utils/constants.js";

const GameDetailsContainer = () => {

    const toast = useRef(null);
    const {
        setErrorLogMessage,
        apiVersion,
        gameInformation,
        setGameInformation,
        oldGameProfileBlobId,
        setOldGameProfileBlobId,
        oldGameInformation,
        setOldGameInformation,
        allGames,
        setAllGames
    } = useContext(AppInformationContext);
    const handleSaveEvent = (ev) => {
        ev.preventDefault();

        const updateEventCall = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/games/update`, {
                    ...gameInformation
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // This ensures cookies are included
                }
            );

            if (res) {
                if (res.data.success) {
                    setOldGameInformation({...gameInformation});
                    setOldGameProfileBlobId(gameInformation.gameBlobId);

                    const updateAllGames = allGames.map(game => {
                        if (game.gameID !== gameInformation.gameID) {
                            return {...game};
                        }

                        return {...gameInformation};
                    });
                    setAllGames(updateAllGames);

                    customToast(
                        toast,
                        "success",
                        ":)",
                        "Aktualisieren der Userdaten war erfolgreich.",
                        3000
                    );
                } else {
                    setErrorLogMessage(`GameDetailsContainer.handleSaveEvent.updateEventCall:: error_code:${res.data.result}:: error_msg:${res.data.error}`)
                    setGameInformation({...oldGameInformation, gameBlobId: oldGameProfileBlobId});
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
    };

    const handleGameActiveFlag = (gameStatus) => {
        const update_game_status = async () => {
            const res = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/games/status`, {
                    gameName: gameInformation.name,
                    gameStatus: gameStatus
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true // This ensures cookies are included
                }
            );

            if (res) {
                if (res.data.success) {
                    const account_status_txt = gameStatus  ? 'aktiviert' : 'deaktiviert';
                    setGameInformation({...gameInformation, active: gameStatus });
                    customToast(
                        toast,
                        "success",
                        ":)",
                        `Challenge wurde erfolgreich ${account_status_txt}`,
                        5000
                    );
                } else {
                    setErrorLogMessage(`GameDetailsContainer.handleGameActiveFlag.update_game_status:: error_code:${res.data.result}:: error_msg:${res.data.error}`)
                    customToast(
                        toast,
                        "error",
                        "Fehler beim Challengestatusänderung",
                        "Beim Setzen des Challengestatus kam es zu einem Fehler. Bitte schau ins Fehlerprotokoll.",
                        5000
                    );
                }
            }
        }
        update_game_status();
    }

    const startContent = () => {

        if (!gameInformation) return;

        return  (
            <>
                <Button
                    icon="pi pi-play-circle"
                    className="mr-2"
                    tooltip="Challenge aktivieren"
                    disabled={gameInformation ? gameInformation.active : 0}
                    onClick={() => {handleGameActiveFlag(1)} }
                />
                <Button
                    icon="pi pi-ban"
                    className="mr-2"
                    tooltip="Challenge deaktieren"
                    disabled={gameInformation ? !gameInformation.active : 0}
                    onClick={() => {handleGameActiveFlag(0)} }
                />
            </>
        );
    }

    const endContent = (
        <>
            <Button label="Challenge löschen" className="m-3" disabled />
            <Button label="Speichern" className="m-3" onClick={handleSaveEvent} />
        </>
    );

    return (
        <div>
            <div className="card">
                <Toolbar start={startContent} end={endContent}/>
            </div>
            <GameDetails />
            <Toast ref={toast} />
        </div>
    );
};

export default GameDetailsContainer;
