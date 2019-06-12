import React from 'react';
import { Route, Router, hashHistory } from 'react-router'

import NotFound from './pages/notFound/NotFound';
import Home from './pages/home/Home';
import Layout from './utils/Layout';
import Login from './pages/login/Login';
import Logout from './pages/logout/Logout';
import PatientDetail from './pages/home/detail/PatientDetail';
import PatientEdit from './pages/home/edit/PatientEdit';
import PatientCreate from './pages/home/create/PatientCreate';
import Graph2 from './pages/graph/Graph2';

const routes = (
    <Router history = {hashHistory}>
        <Route path="/" component={Layout}>
            <Route path="login" component={Login}/>
            <Route path="patients" component={Home}/>
            <Route path="logout" component={Logout}/>
            <Route path="patients/detail" component={PatientDetail}/>
            <Route path="patients/edit" component={PatientEdit}/>
            <Route path="patients/create" component={PatientCreate}/>
            <Route path="graphs" component={Graph2}/>
        </Route>
        {/* <Route path="/login" component={Login}/> */}
        <Route path='*' exact={true} component={NotFound} />
    </Router>
);

export default routes;