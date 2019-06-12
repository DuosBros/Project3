export function getTagEventTypeBoxplotEndedAction() {
    return {
        type: 'GET_TAGEVENTTYPE_BOXPLOT_ENDED'
    }
}

export function getTagEventTypeBoxplotStartedAction() {
    return {
        type: 'GET_TAGEVENTTYPE_BOXPLOT_STARTED'
    }
}

export function loadInitialGraphDataStartedAction() {
    return {
        type: 'LOAD_GRAPH_DATA_STARTED'
    }
}

export function loadInitialGraphDataEndedAction() {
    return {
        type: 'LOAD_GRAPH_DATA_ENDED'
    }
}

export function getTagEventTypeBoxplotAction(payload) {
    return {
        type: 'GET_TAGEVENTTYPE_BOXPLOT',
        payload
    }
}

export function getSpecifiedTagEventTypeBoxplotAction(payload) {
    return {
        type: 'GET_SPECIFIED_TAGEVENTTYPE_BOXPLOT',
        payload
    }
}

export function getSuitableDeletedPatientsForGraphsAction(payload) {
    return {
        type: 'GET_SUITABLE_DELETEDPATIENTS_FOR_GRAPHS',
        payload
    }
}

export function getPatientTimelineAction(payload) {
    return {
        type: 'GET_PATIENT_TIMELINE',
        payload
    }
}

export function getPatientLocationTimelineAction(payload) {
    return {
        type: 'GET_PATIENT_LOCATION_TIMELINE',
        payload
    }
}

export function getPatientHoursAndDaysAction(payload) {
    return {
        type: 'GET_PATIENT_HOURS_AND_DAYS',
        payload
    }
}