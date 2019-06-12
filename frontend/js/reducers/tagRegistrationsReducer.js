const tagRegistrationsInitialState = {
    tagRegistrations : []
}

const TagRegistrationsReducer = (state = tagRegistrationsInitialState, action) => {
    switch(action.type) {
        case 'GET_TAGREGISTRATIONS':
            state.tagRegistrations = action.payload
            return Object.assign({}, state);
        default:
            return state;
    }
}

export default TagRegistrationsReducer;