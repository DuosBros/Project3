const loginInitialState = {
    isAuthenticated: false
}

const LoginReducer = (state = loginInitialState, action) => {
   switch(action.type) {
        case 'AUTH':
            return Object.assign({}, state, {isAuthenticated: true});
        case 'NOT_AUTH':
            return Object.assign({}, state, {isAuthenticated: false});
        default:
           return state;
   }
}

export default LoginReducer;