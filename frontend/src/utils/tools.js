// core imports
// custom imports

export const isDateObject = (obj) => {
    return obj instanceof Date && !isNaN(obj);
}
export const GERMAN_DATETIME_REPR = (_dt, withDate=true) => {
    // überprüfung einbauen
    let dt;

    if (_dt instanceof String || typeof _dt === 'string') {
        dt = new Date(_dt);
    } else {
        dt = _dt;
    }

    let options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    if (withDate) {
        options = { ...options, day: '2-digit', month: '2-digit', year: 'numeric',}
    }


    // todo: das haut bei der zeit 2 stunden drauf, weil die zeit hier und da mit berücksichtigung der deutschen zeit
    //  gespeichert wird, jedoch geht diese methode davon aus, dass es utc. daher sollte dies vereinheitlicht werden.
    return dt.toLocaleString('de-DE', options).replace(',', '');

}

export const GERMAN_DATE_REPR = (_dt) => {
    // überprüfung einbauen
    let dt;

    if (_dt instanceof String || typeof _dt === 'string') {
        dt = new Date(_dt);
    } else {
        dt = _dt
    }

    const options = {day: '2-digit', month: '2-digit', year: 'numeric'}

    return dt.toLocaleString('de-DE', options).replace(',', '')
}

export const ERROR_PROT_MSG = (msg) => {

    const date = new Date();


    return `${GERMAN_DATETIME_REPR(date)}: ${msg}`;
}

export const GET_COOKIE = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();

  return null;
}


export  const customToast = (toastObject, severity, summary, detail, life) => {
    toastObject.current.show({severity, summary, detail, life});
}

export const olderThan24Hours = (oldDate) => {
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate - oldDate;
    const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
    return differenceInMilliseconds > millisecondsIn24Hours;
};

export const checkFileExists = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
};

export const getHourMinutes = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Add leading zeros if necessary
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes}`;
};

export const setErrorMessageString = (fn, code, msg) => {
  return `${fn}:: error_code:${code}:: error_msg: ${msg}`;
};
