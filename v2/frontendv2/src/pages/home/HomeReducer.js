const homePageInitialState = {
    showDeletedPatients: false,
    deletedPatients: [],
    activePatients: { success: true }
}

const HomeReducer = (state = homePageInitialState, action) => {
    switch (action.type) {
        case 'GET_PATIENTS_LOCATIONS':
            var temp = Object.assign({}, state.activePatients)
            if (action.payload.success) {
                action.payload.data.forEach(x => {
                    let found = temp.data.find(y => y.id === x.patient.id)
                    if (found) {
                        found.room = x.room
                    }
                    else {
                        found.room = null
                    }
                })
            }
            return Object.assign({}, state, { activePatients: temp })
        case 'FETCH_ACTIVE_PATIENTS':
            if (action.payload.success) {

                action.payload.data.forEach(x => {
                    x.room = {}
                    x.room.name = "fetching"
                })
            }
            return Object.assign({}, state, { activePatients: action.payload })
        case 'TOGGLE_DELETED_PATIENTS':
            return Object.assign({}, state, { showDeletedPatients: !state.showDeletedPatients });
        case 'FETCH_DELETED_PATIENTS':

            action.payload.sort(function (a, b) {
                return (a.deleted > b.deleted) ? -1 : ((a.deleted < b.deleted) ? 1 : 0);
            });

            return Object.assign({}, state, { deletedPatients: action.payload })
        case 'DELETE_PATIENT':

            state.activePatients.data.forEach(patient => {
                if (patient.id === action.payload) {
                    patient.deleted = new Date();
                    delete patient.tag
                    state.deletedPatients.push(patient);
                }
            });

            return Object.assign({}, state, { activePatients: { success: true, data: state.activePatients.data.filter(item => item.id !== action.payload) } });
        default:
            return state;
    }
}

export default HomeReducer;