// core imports
import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { Message } from 'primereact/message';
import { Avatar } from 'primereact/avatar';
import { ListBox } from 'primereact/listbox';

// custom imports
import UserDetailsContainer from "../../components/tio-userdetails/tio-userdetail-container.jsx";
import { AppInformationContext } from "../../context/appinformation.jsx";
import { UserInformationContext } from "../../context/userinformation.jsx";
import { TIO_BASE_URL } from "../../utils/constants.js";
import dummyUserProfile from '../../assets/dummy-user-profile.png';
import api from "../../api/api.js";


// todo: für langsame verbindungen ist der code sehr ineffizient. sollte dies der fall sein, dann
//  muss hier verbessert werden

// component
const UserPage = () => {

    const { setErrorLogMessage, apiVersion, setCommonRoles } = useContext(AppInformationContext);
    const { userInformation, setUserInformation, setOldUserInformation } = useContext(UserInformationContext);
    const [ allUsers, setAllUsers ] = useState([]);
    const [ selectedUser, setSelectedUser] = useState('');
    const [ userDetailVisibility, setUserDetailVisibility ] = useState(false);
    const [ myId, setMyId ] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataRes = await axios.get(`${TIO_BASE_URL}/api/${apiVersion}/user/mydata`, {
                    withCredentials: true,
                });

                if (userDataRes.data.success) {
                    const _myId = userDataRes.data.result.user_data.userId;
                    setMyId(_myId);

                    const allUsersRes = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/users`, {
                        options: ['withProfilePhoto', 'fullname', 'withRoles']
                    }, {
                        withCredentials: true,
                    });

                    if (allUsersRes.data.success) {
                        const users = allUsersRes.data.result.filter(user => user.userId !== _myId).map(user => {
                            const profilePhotoUrl = `/media/profile/${user.profilePhoto}`;
                            if (!user.profilePhoto) {
                                return {...user, profilePhoto: dummyUserProfile};
                            }

                            return {...user, profilePhoto: profilePhotoUrl};
                        });
                        setAllUsers(users);
                    } else {
                        setErrorLogMessage(`UserPage.useEffect.fetchData:: error_code:${allUsersRes.data.result}:: error_msg: ${allUsersRes.data.message}`);
                    }
                }
            } catch (err) {
                console.error("Error in UserSessionProvider:", err);
                // TODO: Improve error handling
            }
        };

        fetchData();
    }, [apiVersion]);

    useEffect(() => {
        const getCommonRoles = async () => {
            try {

                const resp = await axios.post(`${TIO_BASE_URL}/api/${apiVersion}/roles`, {
                    roleType: 'CommonRole'
                }, {
                        withCredentials: true,
                });

                if (resp.data.success) {
                    setCommonRoles(resp.data.result);
                } else {
                    setErrorLogMessage(`UserPage.useEffect.getCommonRoles:: error_code:${resp.data.result}:: error_msg: ${resp.data.message}`);
                }
            } catch (err) {
                // todo: some error handling
            }
        }

        getCommonRoles();
    }, [apiVersion]);


    // todo: ggf. den namen verallgemeinern (weils in challenges wieder genutzt wird)
    const onUserSelectHandler = (ev) => {
        // todo: nach auswählen des users, die editiermaske für den user aufmachen
        //  hierfür komponente bauen. und ggf. mit dieser komponente die seite
        //  für die eigenen einstellungen ersetzen
        //  weiterhin: eine toolbar einbauen. operationen: löschen, speichern, aktivieren, deaktivieren
        //      => status mit einbauen und in die attribute aus dem backend


        setSelectedUser(ev.value);
        setOldUserInformation(ev.value);
        setUserInformation(ev.value);
        setUserDetailVisibility(!!ev.value);
    }

    const userTemplate = (user) => (
        <div className='p-menuitem-content'>
            <div className="flex align-items-center">
                <Avatar image={user.profilePhoto} className="mr-2" shape="circle" />
                <div className="flex flex-column align">
                    <span className="font-bold text-sm">{user.fullname}</span>
                    <span className="text-sm">{user.function}</span>
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
                            value={selectedUser}
                            onChange={onUserSelectHandler}
                            options={allUsers}
                            optionLabel="name"
                            itemTemplate={userTemplate}
                            className="w-full md:w-14rem"
                            listStyle={{ maxHeight: '5000px' }}
                        />
                    </div>
                </div>
            </div>
            <div className="col-7">
                <div className="m-4">
                    { !userDetailVisibility && <Message severity="info" text="User auswählen zum Bearbeiten." />}
                    { userDetailVisibility && <UserDetailsContainer /> }
                </div>
            </div>
        </div>
    );
};

export default UserPage;
