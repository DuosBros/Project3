import { findItemById } from '../helpers/helpers-operations';

const patientsInitialState = {
     patients : [],
     selectedPatient: {},
     patientToEdit: {},
     notification: {},
     toggleCurrentCheckbox: false,
     togglePastCheckbox: false,
     deletedPatients: [],
     showDeletedPatients: false,
     fetchPatientsSuccess: false,
     fetchDeletedPatientsSuccess: false
}

const PatientsReducer = (state = patientsInitialState, action) => {
    switch(action.type) {
        case 'SHOW_DELETEDPATIENTS': 
            return Object.assign({}, state, {showDeletedPatients: !state.showDeletedPatients});
        case 'REMOVE_DELETED_PATIENT':
        
            const patientToUndeleteIndex = findItemById(state.deletedPatients, action.payload.id);
            if(patientToUndeleteIndex >= 0)
            {
                state.deletedPatients.splice(patientToUndeleteIndex, 1)
                return Object.assign({}, state);
            }
        case 'FETCH_DELETED_PATIENTS': 
            state.deletedPatients = action.payload
            state.fetchDeletedPatientsSuccess = true
            return Object.assign({}, state);
        case 'TOGGLE_CURRENT_CHECKBOX':
            return Object.assign({}, state, {toggleCurrentCheckbox: !state.toggleCurrentCheckbox});
        case 'TOGGLE_PAST_CHECKBOX':
            return Object.assign({}, state, {togglePastCheckbox: !state.togglePastCheckbox});
        case 'TOGGLE_OFF_SELECTED_PATIENT':
            let rha = state.patients.map(element => {
                element.selected = false;
                return element;
            });

            return Object.assign({}, state, {patients: rha});
        case 'TRIGGER_NOTIFICATION':
            return Object.assign({}, state, {notification: action.payload});
        case 'REMOVE_NOTIFICATION':
            return Object.assign({}, state, {notification: {}});
        case 'TOGGLE_SELECTED_PATIENT':
        
            const toggledPatientId = action.payload;
            
            const index = findItemById(state.patients, toggledPatientId);
            const newPatients = state.patients.slice(0);
            if(index >= 0)
            {
                newPatients[index] = Object.assign(
                    {}, 
                    state.patients[index],
                    { selected: !state.patients[index].selected }
                );
                
                return Object.assign( {}, state, { patients: newPatients });
            }

            return patientsInitialState;
        case 'ADD_PATIENT':    
        
            return { 
                ...state,
                patients: [...state.patients, action.payload]
            }

        case 'FETCH_ACTIVE_PATIENTS':
            state.patients = action.payload
            state.fetchPatientsSuccess = true;
            return Object.assign({}, state);
        case 'ASSIGN_TAG':

        
            var patientToEditIndex = findItemById(state.patients, action.payload.id);

            return {
                ...state,
                patients: state.patients.map(patient => patient.id === action.payload.id ?
                    action.payload : patient
                ) 
            };
            
           
            // state.patients[patientToEditIndex] = {
            //     ...state.patients[patientToEditIndex],
            //     ...action.payload
            // }
            // return {
            //     ...state
            // }
        case 'EDIT_PATIENT':
            var patientToEditIndex = findItemById(state.patients, action.payload.id);

            state.patients[patientToEditIndex] = {
                ...state.patients[patientToEditIndex],
                ...action.payload
            }
            return {
                ...state
            }
            
        case 'OPEN_PATIENT_EDIT':
            return Object.assign({}, state, {patientToEdit: action.payload});
        case 'REMOVE_PATIENT':
            const pica = state.patients.map(patient => {
                if(patient.id === action.payload.id) {
                    patient.deleted = new Date();
                    delete patient.tag
                    state.deletedPatients.push(patient);
                }

                return patient;
            });

            // let a = state.patients.slice(0);
            // a.splice(patientIndex, 1);

            return Object.assign({}, state, {patients: pica});
        default:
            return state;
    }
}

export default PatientsReducer;