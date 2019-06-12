const tagInitialState = {
    tags: []
}

const TagReducer = (state = tagInitialState, action) => {
   switch(action.type) {
        case 'FETCH_TAGS': 
            return Object.assign({}, state, {tags: action.payload})
        default:
            return state;
   }
}

export default TagReducer;