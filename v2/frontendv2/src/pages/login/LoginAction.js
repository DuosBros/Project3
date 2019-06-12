export function loginStartedAction() {
    return {
        type: 'LOGIN_STARTED'
    }
}

export function loginEndedAction() {
    return {
        type: 'LOGIN_ENDED'
    }
}

export function loadInitialDataStartedAction() {
    return {
        type: 'LOAD_INITIAL_DATA_STARTED'
    }
}

export function loadInitialDataEndedAction() {
    return {
        type: 'LOAD_INITIAL_DATA_ENDED'
    }
}

export function loginSuccessAction() {
    return {
        type: 'LOGIN_SUCCESS'
    }
}

export function loginFailedAction() {
    localStorage.setItem('UrgentAppAPI', '');
    
    return {
        type: 'LOGIN_FAIL'
    }
}