const patientCreateInitialState = {
    showPatientDetail: false,
    patientToShowInPatientDetail: {}
}

const PatientCreateReducer = (state = patientCreateInitialState, action) => {
   switch(action.type) {
        case 'OPEN_PATIENT_DETAIL':
            return Object.assign({}, state, {
                
            })
        default:
            return state;
   }
}

export default PatientCreateReducer;