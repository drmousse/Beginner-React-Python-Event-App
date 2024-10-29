// core imports
import { useContext, useEffect, useState } from 'react';

// custom imports
import { UserSessionContext } from "../../context/usersession.jsx";
import { AppInformationContext } from "../../context/appinformation.jsx";
import MessageBoard from "../../components/tio-messageboard/tio-messageboard.jsx";
import EventSchedule from "../../components/tio-eventschedule/tio-eventschedule.jsx";
import PersonalNotes from "../../components/tio-notes/tio-notes.jsx";


const Home = () => {

    const { userSessionAccessKey, userFirstname } = useContext(UserSessionContext);
    const { apiVersion } = useContext(AppInformationContext);

    // todo: I-0018: Notizendashboard implmentieren

    return (
        <>
            <h4>Hej {userFirstname}, schön dich zu sehen :)</h4>

            <div className="grid mt-4 ml-3">
                <div className="col-12 md:col-4">
                    <MessageBoard boardType='general' />
                </div>
                <div className="col-12 md:col-4">
                    <EventSchedule />
                </div>
                <div className="col-12 md:col-4">
                    <PersonalNotes />
                </div>
            </div>
        </>
    );
};

export default Home;