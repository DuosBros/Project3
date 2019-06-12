import { combineReducers } from 'redux';
import HomeReducer from '../pages/home/HomeReducer';
import LoginReducer from '../pages/login/LoginReducer';
import TagRegistrationReducer from '../pages/common/TagRegistrationReducer';
import TagEventTypeReducer from '../pages/common/TagEventTypeReducer';
import TagReducer from '../pages/common/TagReducer';
import TagEventReducer from '../pages/common/TagEventReducer';
import PatientDetailReducer from '../pages/home/detail/PatientDetailReducer';
import SpinnerReducer from '../pages/common/SpinnerReducer';
import PatientEditReducer from '../pages/home/edit/PatientEditReducer'
import GraphReducer from '../../src/pages/graph/GraphReducer'

const CommonReducer = combineReducers({
    HomeReducer, LoginReducer, TagRegistrationReducer, TagEventTypeReducer, TagReducer, TagEventReducer, PatientDetailReducer, SpinnerReducer,
    PatientEditReducer, GraphReducer
});

export default CommonReducer;