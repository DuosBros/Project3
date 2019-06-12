const tagEventTypesInitialState = {
    tagEventTypes : []
}

const TagEventTypesReducer = (state = tagEventTypesInitialState, action) => {
    switch(action.type) {
        case 'FETCH_TAGEVETTYPES':
            state.tagEventTypes = action.payload;
            return Object.assign({}, state);
        default:
            return state;
    }
}

export default TagEventTypesReducer;