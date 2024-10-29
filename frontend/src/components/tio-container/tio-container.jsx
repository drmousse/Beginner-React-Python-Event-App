// core imports
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';

// custom imports

// component
import './tio-container.scss';

const TioContainer = ({content='', tioContainerVisible=false, whereTo='/home'}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (tioContainerVisible) {
            setTimeout(() => {
                navigate(whereTo);
            }, 4000)
        }
    }, [tioContainerVisible]);

    return (
        <div className="card flex justify-content-center">
            <Dialog
                header="Benachrichtigung"
                closable={false}
                visible={tioContainerVisible}
                style={{width: '50vw'}}
                onHide={() => null}
            >
                {
                    content ? (
                            <p className="m-0 tio-container-message">
                                {content}
                                <br/>
                                <br/>
                            </p>
                        ) : null
                }
                <p className="m-0">Du wirst in Kürze weitergeleitet.</p>
            </Dialog>
        </div>
    );
}

export default TioContainer;