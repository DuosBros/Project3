export function fetchDeletedPatientTagEventsAction(payload) {
    return {
        type: 'FETCH_DELETED_PATIENT_TAGEVENTS',
        payload
    }
}

export function fetchTagEventsByTagIdAction(payload) {
    return {
        type: 'FETCH_TAGEVENTS_BY_TAGID',
        payload
    }
}

export function addTagEventToPatientAction(payload) {
    return {
        type: 'ADD_TAGEVENT_TO_PATIENT',
        payload
    }
}

export function fetchAllTagEventsAction(payload) {
    return {
        type: 'FETCH_TAGEVENTS',
        payload
    }
}

export function removeTagEventFromPatientAction(payload) {
    return {
        type: 'REMOVE_TAGEVENT_FROM_PATIENT',
        payload
    }
}

export function cleanUpTagEventsAction() {
    return {
        type: 'TAGEVENT_CLEANUP'
    }
}