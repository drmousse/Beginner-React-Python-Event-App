// core imports
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Chip } from 'primereact/chip';
import { Tag } from 'primereact/tag';



// custom imports
import { TIO_BASE_URL } from "../../utils/constants.js";
import { setErrorMessageString } from "../../utils/tools.js";
import { AppInformationContext } from "../../context/appinformation.jsx";
import { GERMAN_DATE_REPR } from "../../utils/tools.js";

import dummyUserProfile from '../../assets/dummy-user-profile.png';

// component

const EventSchedule = () => {

    const { setErrorLogMessage, apiVersion} = useContext(AppInformationContext);
    const [ activeEvents, setActiveEvents ] = useState('');
    const [ upcomingEvents, setUpcomingEvents ] = useState('');

    useEffect(() => {

            const getUpcomingEvents = async () => {
                try {
                    const upcomingEventData = await axios.get(`${TIO_BASE_URL}/api/${apiVersion}/events/upcoming`,{
                        withCredentials: true,
                    });

                    if (upcomingEventData.data.success) {
                        setActiveEvents(upcomingEventData.data.result.activeEvents);
                        setUpcomingEvents(upcomingEventData.data.result.upcomingEvents);
                    } else {
                        setErrorLogMessage(
                            setErrorMessageString(
                                'EventSchedule.useEffect.getUpcomingEvents',
                                upcomingEventData.data.result,
                                upcomingEventData.data.message
                            )
                        );
                    }
                } catch (err) {
                    setErrorLogMessage(
                        setErrorMessageString(
                            'EventSchedule.useEffect.getUpcomingEvents',
                            'unknow_error',
                            err
                        )
                    )
                }
            };

            getUpcomingEvents();

    }, [apiVersion]);


    // todo: die beiden blöcke sind nahezu identisch. refactoren
    return (
        <div>
            <p className="font-bold text-lg">Eventkalender</p>
            <div className="card flex flex-column mb-6">
                <Tag className="mb-2 mr-8" severity="success" value="Aktive Events"/>
                {
                    activeEvents ?
                        activeEvents.map(({customer, event_format_name, event_date, event_id, event_blob_name}) => (
                            <Chip
                                className="mb-2 ml-8"
                                label={`${customer}-${event_format_name}-${GERMAN_DATE_REPR(event_date)}`}
                                image={event_blob_name ? `media/customer/${event_blob_name}` : dummyUserProfile}
                                key={event_id}
                            />
                        )) : <Chip label="Keine aktiven Events" className="mb-2 ml-8"/>
                }
            </div>
            <div className="card flex flex-column">
                <Tag value="Geplante Events" severity="info" className="mb-2 mr-8"/>
                {
                    upcomingEvents ?
                        upcomingEvents.map(({customer, event_format_name, event_date, event_id, event_blob_name}) => (
                            <Chip
                                className="mb-2 ml-8"
                                label={`${customer}-${event_format_name}-${GERMAN_DATE_REPR(event_date)}`}
                                image={event_blob_name ? `media/customer/${event_blob_name}` : dummyUserProfile}
                                key={event_id}
                            />
                        )) : <Chip label="Keine geplanten Events" className="mb-2 ml-8"/>
                }
            </div>
        </div>
    );
};

export default EventSchedule;