import { findItemById } from '../helpers/helpers-operations';

const tagEventsInitialState = {
    tagEvents : [],
    patientTagEvents: [],
    working: false,
    tagInfoObject: {},
    modifyTagEventModal: {}
}

const TagEventsReducer = (state = tagEventsInitialState, action) => {
    switch(action.type) {
        case 'TOGGLE_MODIFYTAGEVENTMODAL':
        return Object.assign({}, state, {modifyTagEventModal: action.payload});
        case 'SAVE_OBJECT_TAGINFO':
        
            state.tagInfoObject = action.payload;
            return Object.assign({}, state);
        case 'TOGGLE_WORKING':
        
            return Object.assign({}, state, {working: !state.working});
        case 'REFRESH_TAGEVENTS':
            state.tagEvents = [];
            state.patientTagEvents = [];

            return Object.assign({}, state);
        case 'MODIFY_TAGEVENT':
            const tagEventIndex = findItemById(state.tagEvents, action.payload.id);
        
            state.tagEvents[tagEventIndex] = {
                ...state.tagEvents[tagEventIndex],
                ...action.payload
            }
            return {
                ...state
            }
        case 'MAP_PATIENTTOTAGEVENTS':
            const newT = action.tagEvents.map(tagEvent => {
                if(tagEvent.selected === true) {
                    tagEvent.patient_Id = action.patient;
                    return tagEvent;
                }
                else {
                    return tagEvent;
                }
                
            });

            return Object.assign( {}, state, { tagEvents: newT });
        case 'SELECT_TAGEVENT':         
            const index = findItemById(state.tagEvents, action.payload.id);
            const newTagEvents = state.tagEvents.slice(0);
            if(index >= 0)
            {
                newTagEvents[index] = Object.assign(
                    {}, 
                    state.tagEvents[index],
                    { selected: !state.tagEvents[index].selected }
                );
                
                return Object.assign( {}, state, { tagEvents: newTagEvents });
            }

            return state;
        case 'FETCH_TAGEVENTS':
        
            state.tagEvents = action.payload;
            return Object.assign({}, state);
        case 'FETCH_PATIENTTAGEVENTS':
            return Object.assign( {}, state, { patientTagEvents: action.payload });
        default:
            return state;
    }
}

export default TagEventsReducer;