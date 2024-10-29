// core imports
import { InputText } from 'primereact/inputtext';

// custom imports
import './tio-input.scss';

const TioInput = ({inputFieldID, value, onChangeHandler, placeholder, inputIcon, inputType='text', toggleVisibility=false}) => {

    if (inputType === 'password') {
        inputType = toggleVisibility ? 'text' : 'password';
    }

    return (
        <>
            <div className="p-inputgroup flex-1 tio-input">
                <span className="p-inputgroup-addon">
                    <i className={`pi ${inputIcon}`}></i>
                </span>
                <InputText
                    type={inputType}
                    id={inputFieldID}
                    value={value}
                    onChange={onChangeHandler}
                    placeholder={placeholder}
                    onKeyDown={onChangeHandler}
                />
                
            </div>
        </>
    );
};

export default TioInput;