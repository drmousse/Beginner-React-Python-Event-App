// core imports
import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { Message } from 'primereact/message';
import { Avatar } from 'primereact/avatar';
import { ListBox } from 'primereact/listbox';

// custom imports
import GameDetailsContainer from "../../components/tio-gamedetails/tio-gamedetail-container.jsx";
import { AppInformationContext } from "../../context/appinformation.jsx";
import dummyGamePicture from '../../assets/dummy-game-profile.png';
import { TIO_BASE_URL } from "../../utils/constants.js";


// todo: für langsame verbindungen ist der code sehr ineffizient. sollte dies der fall sein, dann
//  muss hier verbessert werden

// component
const GamePage = () => {

    const {
        setErrorLogMessage,
        apiVersion,
        allGames,
        setAllGames,
        setGameInformation,
        setOldGameInformation,
    } = useContext(AppInformationContext);
    const [ selectedGame, setSelectedGame] = useState('');
    const [ gameDetailVisibility, setGameDetailVisibility ] = useState(false);

    useEffect(() => {
        const getAllGames = async () => {
            try {
                const gameDataRes = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/games`, {
                        options: ['withProfilePhoto']
                },{
                    withCredentials: true,
                });

                if (gameDataRes.data.success) {
                    setAllGames(gameDataRes.data.result);
                } else {
                    setErrorLogMessage(`GamePage.useEffect.getAllGames:: error_code:${gameDataRes.data.result}:: error_msg: ${gameDataRes.data.message}`);
                }
            } catch (err) {
                setErrorLogMessage(`GamePage.useEffect.getAllGames:: error_code:unknow_error:: error_msg: ${err}`);
            }
        };

        getAllGames();
    }, [apiVersion]);

    // todo: ggf. den namen verallgemeinern (weils in user genutzt wird)
    const onGameSelectHandler = (ev) => {
        setSelectedGame(ev.value);
        setGameInformation(ev.value);
        setOldGameInformation(ev.value);
        setGameDetailVisibility(!!ev.value);
    }

    const gameTemplate = (game) => (
        <div className='p-menuitem-content'>
            <div className="flex align-items-center">
                <Avatar image={game.profilePhoto ? `media/challenge/${game.profilePhoto}` : dummyGamePicture} className="mr-2" shape="circle" />
                <div className="flex flex-column align">
                    <span className="font-bold text-sm">{game.name}</span>
                </div>
            </div>
        </div>
    );


    return (
        <div className="grid">
            <div className="col-2">
                <div className="mt-4">
                    <div className="card flex justify-content-center">
                        <ListBox
                            value={selectedGame}
                            onChange={onGameSelectHandler}
                            options={allGames}
                            optionLabel="name"
                            itemTemplate={gameTemplate}
                            className="w-full md:w-14rem"
                            listStyle={{ maxHeight: '5000px' }}
                        />
                    </div>
                </div>
            </div>
            <div className="col-7">
                <div className="m-4">
                    { !gameDetailVisibility && <Message severity="info" text="Challenge auswählen zum Bearbeiten." />}
                    { gameDetailVisibility && <GameDetailsContainer /> }
                </div>
            </div>
        </div>
    );
};

export default GamePage;
