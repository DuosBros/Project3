const tagRegistrationInitialState = {
    tagRegistrations: []
}

const TagRegistrationReducer = (state = tagRegistrationInitialState, action) => {
   switch(action.type) {
        case 'FETCH_TAGREGISTRATIONS': 
            return Object.assign({}, state, {tagRegistrations: action.payload})
        default:
            return state;
   }
}

export default TagRegistrationReducer;