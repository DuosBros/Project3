
const tagEventInitialState = {
    deletedPatientTagEvents: [],
    tagEventsByTagId: [],
    tagEvents: []
}

const TagEventReducer = (state = tagEventInitialState, action) => {
   switch(action.type) {
        case 'FETCH_TAGEVENTS':
            return Object.assign({}, state, {tagEvents: action.payload})
        case 'FETCH_DELETED_PATIENT_TAGEVENTS': 
            action.payload.sort(function(a, b) {
                return (a.created > b.created) ? -1 : ((a.created < b.created) ? 1 : 0);
            });
            
            return Object.assign({}, state, {deletedPatientTagEvents: action.payload})
        case 'FETCH_TAGEVENTS_BY_TAGID': 
            action.payload.sort(function(a, b) {
                return (a.created > b.created) ? -1 : ((a.created < b.created) ? 1 : 0);
            });

            return Object.assign({}, state, {tagEventsByTagId: action.payload})
        case 'ADD_TAGEVENT_TO_PATIENT' :

            state.tagEventsByTagId = state.tagEventsByTagId.filter(tagEvent => tagEvent.id !== action.payload.id);
            state.deletedPatientTagEvents = state.deletedPatientTagEvents.filter(tagEvent => tagEvent.id !== action.payload.id);

            state.deletedPatientTagEvents.push(action.payload)
            return Object.assign({}, state, {deletedPatientTagEvents: state.deletedPatientTagEvents})
        case 'REMOVE_TAGEVENT_FROM_PATIENT' :

            state.tagEventsByTagId = state.tagEventsByTagId.filter(tagEvent => tagEvent.id !== action.payload.id);
            state.deletedPatientTagEvents = state.deletedPatientTagEvents.filter(tagEvent => tagEvent.id !== action.payload.id);

            state.tagEventsByTagId.push(action.payload);
            return Object.assign({}, state, {tagEventsByTagId: state.tagEventsByTagId})
        case 'TAGEVENT_CLEANUP':
            return Object.assign({}, state, {
                tagEventsByTagId:[],
                deletedPatientTagEvents: []
            })
        default:
            return state;
   }
}

export default TagEventReducer;