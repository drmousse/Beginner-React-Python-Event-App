// core imports
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';


// custom imports
import { setErrorMessageString, GERMAN_DATE_REPR } from "../../utils/tools.js";
import { AppInformationContext} from "../../context/appinformation.jsx";
import { TIO_BASE_URL } from "../../utils/constants.js";
import dummyUserProfile from "../../assets/dummy-user-profile.png";

const EventsPage = () => {

    const { setErrorLogMessage, apiVersion} = useContext(AppInformationContext);
    const { eventStatus } = useParams();
    const [ events, setEvents ] = useState('');
    const [ eventStatusName, setEventStatusName ] = useState('');
    const navigate = useNavigate();

    const handlerEventButton = (eventId) => {
        navigate(`/event/${eventId}`);
    }

    const handlerGamestationButton = (eventId) => {
        navigate(`/gamestation/${eventId}`);
    }

    useEffect(() => {
        if (eventStatus) {
            const get_events = async () => {
                try {
                    const eventsRes = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/events`,{
                        eventStatus
                    }, {
                        withCredentials: true,
                    });

                    if (eventsRes.data.success) {
                        switch (eventStatus) {
                            case 'new':
                                setEventStatusName('geplanten');
                                break;
                            case 'active':
                                setEventStatusName('aktiven');
                                break;
                            case 'closed':
                                setEventStatusName('abgeschlossenen');
                                break;
                        }
                        setEvents(eventsRes.data.result);
                    } else {
                        setEvents(null);
                        setErrorLogMessage(
                            setErrorMessageString(
                                'EventsPage.useEffect.get_event_status_page',
                                eventsRes.data.result,
                                eventsRes.data.message
                            )
                        );
                    }
                } catch (err) {
                    setErrorLogMessage(
                        setErrorMessageString(
                            'EventsPage.useEffect.get_event_status_page',
                            'unknow_error',
                            err
                        )
                    )
                }
            };

            get_events();
        }
    }, [apiVersion, eventStatus]);

    return (
        <div>
            {
                events &&
                <div className="grid">
                    <div className="col-6">
                        <div className="card">
                            <Card>
                                <div className="font-medium text-3xl text-900 mb-3">Events</div>
                                <div className="text-500 mb-5">Hier findest du alle {eventStatusName} Events</div>
                                <ul className="list-none p-0 m-0">
                                    {
                                        events.manage.map(ev => (
                                                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap" key={ev.event_id}>
                                                    <div className="text-500 w-6 md:w-2 font-medium">
                                                        <Avatar image={ev.blob_file_name ? `../media/customer/${ev.blob_file_name}` : dummyUserProfile} size="xlarge" shape="circle" />
                                                    </div>
                                                    <div className="text-900 w-full md:w-6 md:flex-order-0 flex-order-1">
                                                        {`${ev.customer} - ${ev.event_format_name}`}<br />{`${GERMAN_DATE_REPR(ev.event_date)}`}
                                                    </div>
                                                    <div className="w-4 md:w-4 flex justify-content-end">
                                                        <Button
                                                            label="Eventdetails"
                                                            icon="pi pi-arrow-right"
                                                            className="p-button-text"
                                                            onClick={() => handlerEventButton(ev.event_id)}
                                                        />
                                                    </div>
                                                </li>
                                            )
                                        )
                                    }
                                    {
                                        events.mix.map(ev => (
                                                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap" key={ev.event_id}>
                                                    <div className="text-500 w-6 md:w-2 font-medium">
                                                        <Avatar image={ev.blob_file_name ? `../media/customer/${ev.blob_file_name}` : dummyUserProfile} size="xlarge" shape="circle" />
                                                    </div>
                                                    <div className="text-900 w-full md:w-5 md:flex-order-0 flex-order-1">
                                                        {`${ev.customer} - ${ev.event_format_name}`}<br />{`${GERMAN_DATE_REPR(ev.event_date)}`}
                                                    </div>
                                                    <div className="w-5 md:w-5 flex justify-content-end">
                                                        <Button
                                                            label="Eventdetails"
                                                            icon="pi pi-arrow-right"
                                                            className="p-button-text"
                                                            onClick={() => handlerEventButton(ev.event_id)}
                                                        />
                                                        <Button
                                                            label="Zu meiner Station"
                                                            icon="pi pi-arrow-right"
                                                            className="p-button-text"
                                                            onClick={() => handlerGamestationButton(ev.event_id)}
                                                        />
                                                    </div>
                                                </li>
                                            )
                                        )
                                    }
                                    {
                                        events.user.map(ev => (
                                                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap" key={ev.event_id}>
                                                    <div className="text-500 w-6 md:w-2 font-medium">
                                                        <Avatar image={ev.blob_file_name ? `../media/customer/${ev.blob_file_name}` : dummyUserProfile} size="xlarge" shape="circle" />
                                                    </div>
                                                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                        {`${ev.customer} - ${ev.event_format_name}`}<br />{`${GERMAN_DATE_REPR(ev.event_date)}`}
                                                    </div>
                                                    <div className="w-2 md:w-2 flex justify-content-end">
                                                        <Button
                                                            label="Zu meiner Station"
                                                            icon="pi pi-arrow-right"
                                                            className="p-button-text"
                                                            onClick={() => handlerGamestationButton(ev.event_id)}
                                                        />
                                                    </div>
                                                </li>
                                            )
                                        )
                                    }
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            }
            {!events &&
                <div className="grid">
                    <div className="col-4">
                        <div className="card">
                            <Card title="(Noch) keine Events :(">
                                <p className="m-0">
                                    Es existieren keine Events in dem von dir ausgewählten Status. Kommt sicherlich
                                    noch.
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default EventsPage;