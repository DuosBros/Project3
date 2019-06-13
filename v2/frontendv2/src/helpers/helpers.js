export function saveAsJSON(data) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    let json = JSON.stringify(data)
    let fileName = new Date().toISOString();
    let blob = new Blob([json], { type: "octet/stream" })
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName + ".json";
    a.click();
    window.URL.revokeObjectURL(url);
}

export function addSelectedProperty(input) {
    return input.map(element => {
        element.selected = false;
        return element;
    });
}

export function addModifiedProperty(input) {
    return input.map(element => {
        element.modified_temp = false;
        element.selected = false;
        return element;
    });
}

export const isNum = (cardId) => {
    const cardIdString = cardId.toString();

    const length = cardIdString.length;
    var isNum = /^\d+$/.test(cardIdString);

    if (length > 0 && isNum) {
        return true;
    }
    else {
        return false;
    }
}

export const isEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export const findItemById = (array, itemId) => {
    var result = -1

    for (let i = 0; i < array.length; i++) {
        if (array[i].id === itemId) {
            result = i;
            break;
        }
    }

    return result;
}

export const validateCardId = (cardId) => {
    const cardIdString = cardId.toString();

    const length = cardIdString.length;
    var isNum = /^\d+$/.test(cardIdString);
    if (length > 0 && isNum) {
        return true;
    }
    else {
        return false;
    }
}


export const validateSocialSecurityNumber = (socialSecurityNumber) => {
    const socialSecurityNumberString = socialSecurityNumber.toString();

    // const length = socialSecurityNumberString.length;
    var isNumAndSpecialChar = /^[0-9//]+$/.test(socialSecurityNumberString);
    // if(length === 0) {
    //     return null;
    // }
    if (isNumAndSpecialChar) {
        return true;
    }
    else {
        return false;
    }
}
