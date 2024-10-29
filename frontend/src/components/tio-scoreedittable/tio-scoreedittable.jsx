// core imports
// custom imports

// component
import {TabPanel, TabView} from "primereact/tabview";

import './tio-scoreedittable.scss';

const ScoreEditTable = ({gsData, teamScores, eventHandler}) => {
    return (
        <TabView>
        {
            gsData.game_stations.map(gs => {
                const t_one = gsData.teams[gs.team_a_id].number;
                const t_two = gsData.teams[gs.team_b_id].number;
                return (
                    <TabPanel
                        header={`${t_one} - ${t_two}`}
                        key={gs.game_station_id}
                    >
                    {
                        Array.from(
                            Array(gs.num_rounds),
                            (e, i) => {

                                let team_a_score = '';
                                let team_b_score = '';
                                if (teamScores &&
                                    teamScores[gs.game_station_id][gs.team_a_id] &&
                                    teamScores[gs.game_station_id][gs.team_a_id][i+1]
                                ) {
                                    team_a_score = teamScores[gs.game_station_id][gs.team_a_id][i+1]
                                }

                                if (teamScores &&
                                    teamScores[gs.game_station_id][gs.team_b_id] &&
                                    teamScores[gs.game_station_id][gs.team_b_id][i+1]
                                ) {
                                    team_b_score = teamScores[gs.game_station_id][gs.team_b_id][i+1]
                                }

                                return (
                                    <p className="ml-1 mb-3" key={i}>
                                        [{i + 1}. Runde {e}]
                                        Team {t_one}
                                        <span className="tio-score-editable-input">
                                            <input
                                                type="number"
                                                value={team_a_score}
                                                className="ml-1 mr-1 w-1 pl-2"
                                                onChange={(e) => {
                                                    eventHandler(gs.game_station_id, gs.team_a_id, i+1, e.target.value)
                                                }}
                                            /> -
                                            Team {t_two}
                                            <input
                                                type="number"
                                                value={team_b_score}
                                                className="ml-1 w-1 pl-2"
                                                onChange={(e) => {
                                                    eventHandler(gs.game_station_id, gs.team_b_id, i+1, e.target.value)
                                                }}
                                            />
                                        </span>
                                    </p>
                                );
                            }
                        )
                    }
                    </TabPanel>
                );
            })
        }
        </TabView>
    );
};

export default ScoreEditTable;