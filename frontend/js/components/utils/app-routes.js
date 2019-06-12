import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import axios from 'axios';
import { style } from "react-toastify";

import routes from '../../routes';
import urgentApp from '../../reducers/index';
import {getActivePatientsAction, getAllTagRegistrationsAction,
    getAllTagsAction, getTagEventTypesAction } from '../../actions/actions'
import {url, defaultLimitPatients} from '../../appConfig';
import {map} from '../../mappers/mapper';
import { buildAuthorizationHeader, logAndNotifyError } from '../../helpers/helpers-operations';
import {getAllPatients} from '../../axios/patientRequests';
import {getAllTagRegistrations} from '../../axios/tagRegistrationRequests';
import {getAllTags} from '../../axios/tagRequests';
import {getAllTagEventTypes} from '../../axios/tagEventTypeRequests';
import {notify} from '../../helpers/notify';

export default class AppRoutes extends React.Component {
    constructor() {
        super();
        this.store = createStore(urgentApp);

        style({
            colorSuccess: "#51a351",
        });
    }

    componentWillMount() {

        var basicHash = localStorage.getItem('basicHash') || null

        if(basicHash) {
            getAllPatients(false, defaultLimitPatients)
                .then((res, err) => {      
                    const patients = map(res.data);

                    if (patients) {
                        this.store.dispatch(getActivePatientsAction(patients));
                    } else {
                        logAndNotifyError(err, 'Chyba!')
                    }

                    return getAllTagRegistrations()
                })
                .then((res, err) => {
                    if (res.data) {
                        this.store.dispatch(getAllTagRegistrationsAction(res.data));
                    } else {
                        logAndNotifyError(err, 'Chyba!')
                    }
                })
                .catch(err => {
                    if(err !== "NotAuthenticated")
                    {
                        logAndNotifyError(err, 'Chyba!')
                    }
                });
            
            // getAllTagRegistrations()
            //     .then((res, err) => {
            //         if (res.data) {
            //             this.store.dispatch(getAllTagRegistrationsAction(res.data));
            //         } else {
            //             logAndNotifyError(err, 'Chyba!')
            //         }
            //     })
            //     .catch(err => logAndNotifyError(err, 'Chyba!'));

            getAllTags()
                .then((res, err) => {
                    if (res.data) {
                        this.store.dispatch(getAllTagsAction(map(res.data)));
                    } else {
                        logAndNotifyError(err, 'Chyba!')
                    }
                })
                .catch(err => {
                    if(err !== "NotAuthenticated")
                    {
                        logAndNotifyError(err, 'Chyba!')
                    }
                });

            getAllTagEventTypes()
                .then((res, err) => {
                    if (res.data) {
                        this.store.dispatch(getTagEventTypesAction(res.data));
                    } else {
                        logAndNotifyError(err, 'Chyba!')
                    }
                })
                .catch(err => {
                    if(err !== "NotAuthenticated")
                    {
                        logAndNotifyError(err, 'Chyba!')
                    }
                });
        }
    
            // axios.get(url + 'tageventtypes', config).then(res => 
            // {      
            //     this.store.dispatch(getTagEventTypesAction(res.data));  
            // })
        
    }

    render() {
        return (
            <Provider store={this.store}>
                <Router history={browserHistory} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>
            </Provider>
        );
    }
}