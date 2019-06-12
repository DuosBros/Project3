const spinnerInitialState = {
    showSpinner: false
}

const SpinnerReducer = (state = spinnerInitialState, action) => {
   switch(action.type) {
        case 'TOGGLE_SPINNER': 
            return Object.assign({}, state, {showSpinner: !state.showSpinner})
        default:
            return state;
   }
}

export default SpinnerReducer;