import {notify} from '../helpers/notify';

export function logAndNotifyError(error, message) {
    console.log(error);
    notify(message, 'error');
}

export const findItemById = (array, itemId) => {
    var result = -1

    for(let i = 0; i < array.length; i++) {
        if(array[i].id === itemId) {
            result = i;
            break;
        }
    }

    return result;
}

export const isEmpty = (obj) => {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export const buildAuthorizationHeader = (type) => {

    var basicHash = localStorage.getItem('basicHash') || null

    let config = undefined;

    if (basicHash) {
        if(type == "get") {
            config = {
                headers: {
                    'Authorization': basicHash
                }
            };
        }

        if(type == "put") {
            config = {
                headers: {
                    'Accept':'',
                    'Content-Type': 'application/json',
                    'Authorization': basicHash
                }
            };
        }
    }

    return config;
}

export const validateCardId = (cardId) => {
    const cardIdString = cardId.toString();

    const length = cardIdString.length;
    var isNum = /^\d+$/.test(cardIdString);
    if (length > 0 && isNum) {
        return 'success';
    }
    else {
        return 'error';
    }
    return null;
}

export const validateSocialSecurityNumber = (socialSecurityNumber) => {
    const socialSecurityNumberString = socialSecurityNumber.toString();

    const length = socialSecurityNumberString.length;
    var isNumAndSpecialChar = /^[0-9//]+$/.test(socialSecurityNumberString);
    if(length === 0) {
        return null;
    }
    if (isNumAndSpecialChar) {
        return 'success';
    }
    else {
        return 'error';
    }
    return null;
    
}
