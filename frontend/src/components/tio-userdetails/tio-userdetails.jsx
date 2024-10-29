// core imports
import {useContext, useState, useRef, useEffect} from "react";
import { InputText } from "primereact/inputtext";
import { Fieldset } from "primereact/fieldset";
import { FloatLabel } from "primereact/floatlabel";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from 'primereact/tag';

// custom imports
import { UserInformationContext } from "../../context/userinformation.jsx";
import { AppInformationContext } from "../../context/appinformation.jsx";


// component
const UserDetails = () => {
    // todo: konsistenz-checks einbauen: email adresse sollte noch nicht vergeben sein. und prüfung auf pflichtfelder

    const toast = useRef(null);
    const { userInformation, setUserInformation } = useContext(UserInformationContext);
    const { commonRoles } = useContext(AppInformationContext);
    const [ selectedRoles, setSelectedRoles ] = useState('');

    // todo: durch backend-call ersetzen

    useEffect(() => {
        setSelectedRoles(userInformation.roles);
    }, [userInformation]);

    const handleSelectedRoles = (value) => {
        setSelectedRoles(value);
        setUserInformation({...userInformation, roles: value});
    }


    return (
        <div className="grid">
            <div className="col-6">
                <Fieldset legend="Userdetails" className="m-3">
                    <div className="justify-content-center w-full p-4 m-2">
                    <div className="justify-content-start w-full pl-0 pb-4 m-2">
                        <div className="text-500 font-medium">Kontostatus: {userInformation && parseInt(userInformation.active) ? <Tag severity='success' value='Aktiviert' /> :  <Tag severity='danger' value='Deaktiviert' />}</div>
                    </div>
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                            <div className="text-500 w-6 md:w-4 font-medium">Anrede</div>
                            <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                <InputText
                                    type="text"
                                    className="p-inputtext-sm"
                                    placeholder="Anrede"
                                    value={userInformation ? userInformation.title : ''}
                                    onChange={
                                        (e) => setUserInformation({
                                            ...userInformation, title: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 flex-wrap">
                            <div className="text-500 w-6 md:w-4 font-medium">Vorname</div>
                            <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                <InputText
                                    type="text"
                                    className="p-inputtext-sm"
                                    placeholder="Vorname"
                                    value={userInformation ? userInformation.firstname : ''}
                                    onChange={
                                        (e) => setUserInformation({
                                            ...userInformation, firstname: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 flex-wrap">
                            <div className="text-500 w-6 md:w-4 font-medium">Nachname</div>
                            <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                <InputText
                                    type="text"
                                    className="p-inputtext-sm"
                                    placeholder="Nachname"
                                    value={userInformation ? userInformation.lastname : ''}
                                    onChange={
                                        (e) => setUserInformation({
                                            ...userInformation, lastname: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 flex-wrap">
                            <div className="text-500 w-6 md:w-4 font-medium">Geschlecht</div>
                            <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                <InputText
                                    type="text"
                                    className="p-inputtext-sm"
                                    placeholder="Geschlecht"
                                    value={userInformation ? userInformation.gender : ''}
                                    onChange={
                                        (e) => setUserInformation({
                                            ...userInformation, gender: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 flex-wrap">
                            <div className="text-500 w-6 md:w-4 font-medium">Funktion</div>
                            <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                <InputText
                                    type="text"
                                    className="p-inputtext-sm"
                                    placeholder="Funktion"
                                    value={userInformation ? userInformation.function : ''}
                                    onChange={
                                        (e) => setUserInformation({
                                            ...userInformation, function: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                            <div className="text-500 w-6 md:w-4 font-medium">
                                <i className="pi pi-at" style={{fontSize: '1.5rem'}}></i>
                            </div>
                            <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                <InputText
                                    type="text"
                                    className="p-inputtext-sm"
                                    placeholder="Email"
                                    value={userInformation ? userInformation.email: ''}
                                    onChange={
                                        (e) => setUserInformation({
                                            ...userInformation, email: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 flex-wrap">
                            <div className="text-500 w-6 md:w-4 font-medium">
                                <i className="pi pi-mobile" style={{fontSize: '1.5rem'}}></i>
                            </div>
                            <div className="w-full md:w-8 md:flex-order-0 flex-order-1">
                                <InputText
                                    type="text"
                                    className="p-inputtext-sm"
                                    placeholder="Rufnummer"
                                    value={userInformation ? userInformation.phone : ''}
                                    onChange={
                                        (e) => setUserInformation({
                                            ...userInformation, phone: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </li>
                    </ul>
                </div>
                </Fieldset>
            </div>
            <div className="col-6">
                <Fieldset legend="Userrollen" className="m-3">
                    <div className="card flex justify-content-start flex-wrap">
                    <div className="m-4">
                        <FloatLabel className="w-full">
                            <MultiSelect
                                value={selectedRoles}
                                onChange={(e) => handleSelectedRoles(e.value)}
                                options={commonRoles}
                                optionLabel="name"
                                className="w-full "
                                display="chip"
                            />
                        </FloatLabel>
                    </div>
                </div>
            </Fieldset>
            </div>
        </div>
    );
};

export default UserDetails;
