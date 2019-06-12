export function toggleProductDetailModalAction() {
    return {
        type: 'TOGGLE_PRODUCT_DETAIL'
    }
}

export function fetchActivePatientsAction(payload) {
    return {
        payload,
        type: 'FETCH_ACTIVE_PATIENTS'
    }
}

export function toggleDeletedPatientsAction() {
    return {
        type: 'TOGGLE_DELETED_PATIENTS'
    }
}

export function fetchDeletedPatientsAction(payload) {
    return {
        payload,
        type: 'FETCH_DELETED_PATIENTS'
    }
}

export function deletePatientAction(payload) {
    return {
        payload,
        type: 'DELETE_PATIENT'
    }
}

export function getPatientsLocationsAction(payload) {
    return {
        payload,
        type: 'GET_PATIENTS_LOCATIONS'
    }
}