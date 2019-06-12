import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, FormControl, ControlLabel, Alert, Image } from "react-bootstrap";
import base64 from 'base-64';
import axios from 'axios';
import {browserHistory} from 'react-router';
import { url } from '../appConfig';

import {logoutAction} from '../actions/actions';

@connect((store) => {
    return {
        domu: store.DomuReducer
    }
})

export default class Logout extends React.Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
        localStorage.clear();
    }

    render() {
      return (
        <div className="Login">
            <Alert bsStyle="danger"> 
                <p>Byli jste odhlášeni!</p>
            </Alert>
            <div className="row">
                <div className="col-sm-2">
                </div>
                <div className="col-sm-8">
                <Image src="src/img/logo.jpg" responsive className="logoImage" />
                    <Button
                        onClick = {() => browserHistory.push('/login')}
                        block
                        bsSize="large"
                        type="submit">
                        Login
                    </Button>
                </div>
                <div className="col-sm-2">
                </div>
            </div>
        </div>
      );
    }
  }