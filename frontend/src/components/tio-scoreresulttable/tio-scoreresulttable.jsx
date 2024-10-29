// core import
import { useContext } from "react";

// custom imports
import { UserSessionContext } from "../../context/usersession.jsx";

// component
const ScoreResultTable = ({ teams, gameName, showTeamScoreLabel = true }) => {
    const { darkMode } = useContext(UserSessionContext);

    const tableClassNames = darkMode ? "w-full text-sm text-left rtl:text-right text-gray-400" :
        "w-full text-sm text-left rtl:text-right text-gray-500";
    const captionClassNames = darkMode ? "p-5 text-lg font-semibold text-left rtl:text-right text-white bg-gray-800" :
        "p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white";
    const theadClassNames = darkMode ? "text-xs text-gray-400 uppercase bg-gray-700" :
        "text-xs text-gray-700 uppercase bg-gray-50";
    const rowClassNames = darkMode ? "bg-gray-800 border-b border-gray-700" :
        "bg-white border-b";
    const cellClassNames = darkMode ? "px-4 py-2 font-medium text-white whitespace-nowrap" :
        "px-4 py-2 font-medium text-gray-900 whitespace-nowrap";
    const teamCellClassNames = darkMode ? "px-8 py-2 text-white" :
        "px-8 py-2 text-gray-900";
    const scoreCellClassNames = darkMode ? "px-6 py-2 text-white" :
        "px-6 py-2 text-gray-900";

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className={tableClassNames}>
                <caption className={captionClassNames}>
                    Tabelle: {gameName}
                </caption>
                <thead className={theadClassNames}>
                    <tr>
                        <th scope="col" className="px-4 py-3">Platzierung</th>
                        <th scope="col" className="px-8 py-3">Team</th>
                        <th scope="col" className="px-6 py-3">Punkte</th>
                        {showTeamScoreLabel && <th scope="col" className="px-6 py-3">Siegpunkts</th>}
                    </tr>
                </thead>
                <tbody>
                    {teams && teams.map(tp => (
                        <tr className={rowClassNames} key={tp.team_id}>
                            <th scope="row" className={cellClassNames}>{tp.placement}</th>
                            <td className={teamCellClassNames}>
                                {tp.team_name ? `${tp.team_name} (${tp.team_number})` : tp.team_number}
                            </td>
                            {showTeamScoreLabel && <td className={scoreCellClassNames}>{tp.team_score}</td>}
                            <td className={scoreCellClassNames}>{tp.score_points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreResultTable;
