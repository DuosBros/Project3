import { combineReducers } from 'redux';

import TagsReducer from './tags-reducer';
import PatientsReducer from './patients-reducer';
import TagRegistrationsReducer from './tagRegistrationsReducer';
import TagEventsReducer from './tagEvents-reducer';
import TagEventTypesReducer from './tagEventTypes-reducer';
import LoginReducer from './login-reducer';


const urgentApp = combineReducers({
    TagsReducer, PatientsReducer, TagRegistrationsReducer, TagEventsReducer, TagEventTypesReducer, LoginReducer
});

export default urgentApp;