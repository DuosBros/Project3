const patientDetailInitialState = {
    showPatientDetail: false,
    patientToShowInPatientDetail: {},
    showEditTagEventModal: false,
    tagEventToModify: {}
}

const PatientDetailReducer = (state = patientDetailInitialState, action) => {
   switch(action.type) {
        case 'OPEN_PATIENT_DETAIL':
            return Object.assign({}, state, {
                patientToShowInPatientDetail: action.payload,
                showPatientDetail: !state.showPatientDetail
            })
        case 'TOGGLE_EDIT_TAGEVENT_MODAL':
            return Object.assign({}, state, {
                showEditTagEventModal: !state.showEditTagEventModal,
                tagEventToModify: action.payload
            });
        default:
            return state;
   }
}

export default PatientDetailReducer;