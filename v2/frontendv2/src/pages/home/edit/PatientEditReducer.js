const patientEditInitialState = {
    showPatientEdit: false,
    patientToEdit: {},
    showEditTagEventModal: false,
    tagEventToModify: {}
}

const PatientEditReducer = (state = patientEditInitialState, action) => {
   switch(action.type) {
        case 'OPEN_PATIENT_EDIT':
            return Object.assign({}, state, {
                patientToEdit: action.payload,
                showPatientEdit: !state.showPatientEdit
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

export default PatientEditReducer;