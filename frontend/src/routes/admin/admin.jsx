// core imports
import { useContext } from "react";

// custom imports
import { UserSessionContext } from "../../context/usersession";
import { AppInformationContext } from "../../context/appinformation";

const AdminPage = () => {
    const { userSessionAccessKey, setUserSessionAccessKey} = useContext(UserSessionContext);
    const { apiVersion } = useContext(AppInformationContext);
    return (
        <>
            <h4>Admin Page</h4>
            Access Key: {userSessionAccessKey} <br />
            API Version: {apiVersion}
        </>
    );
};

export default AdminPage;