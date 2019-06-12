import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import axios from 'axios';

import routes from '../routes';
import CommonReducer from './CommonReducer';

export default class AppRoutes extends React.Component {
    constructor() {
        super();
        this.store = createStore(CommonReducer);

        axios.defaults.headers.post['Content-Type'] = 'application/json';
    }
    
    componentWillMount() {
        var current = window.location.href

        if(current.includes('patients') || current.includes('graphs')) {

        }
        else {
            browserHistory.push('/login')
        }
        
    }

    render() {
        return (
            <Provider store={this.store}>
                <Router history={browserHistory} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>
            </Provider>
        );
    }
}