import React from 'react'
import { Route, IndexRoute, Redirect, IndexRedirect, hashHistory } from 'react-router'


import Layout from './components/utils/layout';
import Patients from './pages/patients';
import Login from './pages/login';
import Logout from './pages/logout';
import RegistratePatient from './pages/modals/registratePatient';
import ModifyPatient from './pages/modals/modifyPatient';
import PatientInfo from './pages/patientInfo';

const routes = (
    <Route path="/" component={Layout}>
        <IndexRoute component={Login}/>
        <IndexRedirect to="login" />
        {/* <Route path="domu" component={Domu}/> */}
        <Route path="login" component={Login}/>
        <Route path="logout" component={Logout} />
        <Route path="patients" component={Patients}/>
        <Route path="patients/new" component={RegistratePatient}/>
        <Route path="patients/edit" component={ModifyPatient}/>
        <Route path="patients/info" component={PatientInfo}/>
        <Redirect from="*" to="login" />
    </Route>
);

export default routes;