const tagEventTypeInitialState = {
    tagEventTypes: []
}

const TagEventTypeReducer = (state = tagEventTypeInitialState, action) => {
   switch(action.type) {
        case 'FETCH_TAGEVENTTYPES': 
            return Object.assign({}, state, {tagEventTypes: action.payload})
        default:
            return state;
   }
}

export default TagEventTypeReducer;