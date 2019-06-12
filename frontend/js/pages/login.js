import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, FormControl, ControlLabel, Image } from "react-bootstrap";
import base64 from 'base-64';
import axios from 'axios';
import {browserHistory} from 'react-router';
import { url, defaultLimitPatients } from '../appConfig';
import { ToastContainer, toast } from 'react-toastify';

import {authAction, getActivePatientsAction,
    getAllTagRegistrationsAction, getAllTagsAction, getTagEventTypesAction} from '../actions/actions';
import {map} from '../mappers/mapper';
import SpinnerModal from './modals/spinner';
import {notify} from '../helpers/notify';
import {getAllPatients} from '../axios/patientRequests';
import {getAllTagRegistrations} from '../axios/tagRegistrationRequests';
import {getAllTags} from '../axios/tagRequests';
import {getAllTagEventTypes} from '../axios/tagEventTypeRequests';
import {logAndNotifyError} from '../helpers/helpers-operations';

@connect((store) => {
    return {
        domu: store.DomuReducer
    }
})

export default class Login extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        email: "",
        password: "",
        showSpinner: false
      };

      this.handleEmailChange = this.handleEmailChange.bind(this); 
      this.handlePasswordChange = this.handlePasswordChange.bind(this); 
      this.toggleSpinnerModal = this.toggleSpinnerModal.bind(this);
    }

    componentWillMount(){
      var basicHash = localStorage.getItem('basicHash') || null
      if(basicHash) {
        browserHistory.push('/patients');
      }
    }

    validateForm() {
      return this.state.email.length > 0 && this.state.password.length > 0;
    }
  
    handleEmailChange(event){
      this.setState({
        email: event.target.value
      });
    }
  
    handlePasswordChange(event){
      this.setState({
        password: event.target.value
      });
    }

    toggleSpinnerModal(){
      this.setState({
        showSpinner: !this.state.showSpinner
      });
    }

    handleSubmit(event){
      event.preventDefault();
    }

    auth() {

      this.toggleSpinnerModal()
      this.state.showHelp ? (
        <SpinnerModal 
            onShow={this.state.showSpinner} 
            onToggle={this.toggleHelpModal} />
      ) : (
          <span></span>
      )

      var a = "Basic " + base64.encode(this.state.email + ":" + this.state.password);

      var config = {
        headers: {
          'Authorization': a
        }
      };
      
      axios.get(url + 'users', config).then(res => 
      {
        localStorage.setItem('basicHash', a);

        var basicHash = localStorage.getItem('basicHash') || null

        if(basicHash) {
            debugger;
            getAllPatients(false, defaultLimitPatients)
                .then((res, err) => {      
                    const patients = map(res.data);

                    if (patients) {
                        this.props.dispatch(getActivePatientsAction(patients));
                    } else {
                        logAndNotifyError(err, 'Chyba!')
                    }}
                )
                .catch(err => logAndNotifyError(err, 'Chyba!'));
            
            getAllTagRegistrations()
                .then((res, err) => {
                    if (res.data) {
                        this.props.dispatch(getAllTagRegistrationsAction(res.data));
                    } else {
                        logAndNotifyError(err, 'Chyba!')
                    }
                })
                .catch(err => logAndNotifyError(err, 'Chyba!'));

            getAllTags()
                .then((res, err) => {
                    if (res.data) {
                        this.props.dispatch(getAllTagsAction(map(res.data)));
                    } else {
                        logAndNotifyError(err, 'Chyba!')
                    }
                })
                .catch(err => logAndNotifyError(err, 'Chyba!'));

            getAllTagEventTypes()
                .then((res, err) => {
                    if (res.data) {
                        this.props.dispatch(getTagEventTypesAction(res.data));
                    } else {
                        logAndNotifyError(err, 'Chyba!')
                    }
                })
                .catch(err => logAndNotifyError(err, 'Chyba!'));
        }

        browserHistory.push('/patients');
        // NotificationManager.success('', 'Přihlášení úspěšné.', 5000);
        notify("Přihlášení úspěšné!", "success");
        this.props.dispatch(authAction());
      })
      .catch( function(error) {
        notify("Jméno nebo heslo je nesprávné!", "error");
        console.log(error);
      })
    }
  
    render() {
      return (
        <div className="Login">
          <ToastContainer/>
            <div className="row">
              <div className="col-sm-2"></div>
              <div className="col-sm-8">
                <Image src="src/img/logo.jpg" responsive className="logoImage"/>
                <form onSubmit={this.handleSubmit}>
                  <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Login</ControlLabel>
                    <FormControl
                      autoFocus
                      type="text"
                      value={this.state.email}
                      onChange={this.handleEmailChange}
                    />
                  </FormGroup>
                  <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                      type="password"
                    />
                  </FormGroup>
                  <Button
                    onClick = {() => this.auth()}
                    block
                    bsSize="large"
                    type="submit">
                      Login
                  </Button>
                </form>
              </div>
              <div className="col-sm-2"></div>
            </div>
        </div>
      );
    }
  }