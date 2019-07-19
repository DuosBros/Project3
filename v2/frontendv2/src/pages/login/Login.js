import React from 'react';
import { Button, Form, Grid, Image, Message, Segment } from 'semantic-ui-react';
import {Transition} from 'semantic-ui-react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router';

import logo from '../../../src/logo.jpg';
import {loginStartedAction, loginEndedAction,
     loadInitialDataStartedAction, loadInitialDataEndedAction,
    loginSuccessAction, loginFailedAction} from './LoginAction';
import {fetchActivePatientsAction} from '../home/HomeAction';
import {addSelectedProperty} from '../../helpers/helpers';
import {defaultLimitPatients} from '../../appConfig';
import {getAllPatients} from '../home/HomeAxios';
import {sendAuth, checkAuth} from './LoginAxios';
import {fetchTagRegistrationsAction} from '../common/TagRegistrationAction';
import {getAllTagRegistrations} from '../common/TagRegistrationAxios';
import {getAllTagEventTypes} from '../common/TagEventTypeAxios';
import {fetchTagEventTypesAction} from '../common/TagEventTypeAction';
import {fetchTagsAction} from '../common/TagAction';
import {getAllTags} from '../common/TagAxios';
import spinner from '../../../src/Spinner.svg';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          username: "",
          password: "",
          isLoading: false,
          showEmail: false,
          isLoginPageLoading: true
        };

        this.handleChange = this.handleChange.bind(this);
        // this.validateForm = this.validateForm.bind(this);
        this.auth = this.auth.bind(this);
    }

    componentWillMount(){
        var that = this.props;

        checkAuth().then((res) => {
            that.loginSuccessAction();
            this.setState({ isLoginPageLoading: false })
            browserHistory.push('/patients');
        })
        .catch(() => {
            this.setState({ isLoginPageLoading: false })
        })
    }

    handleChange (e, { name, value }) {
        this.setState({ [name]: value })
    }

    auth() {
        this.props.loginStartedAction();

        var user = {
            name : this.state.username,
            password : this.state.password,
            showEmail: false
        }
        var that = this.props;

        sendAuth(user).then(function(response) {
            localStorage.setItem('UrgentAppAPI', response.data)
            that.loginSuccessAction();
            that.loginEndedAction();

        })
        .then(() => {
            that.loadInitialDataStartedAction();

            getAllPatients(false, defaultLimitPatients).then((res, err) => {
                if(res.data.length !== 0) {
                    const patients = addSelectedProperty(res.data);
                    that.fetchActivePatientsAction({ success: true, data: patients });
                }

                getAllTagRegistrations().then((res, err) => {
                    that.fetchTagRegistrationsAction(res.data);

                    getAllTags().then((res, err) => {
                        that.fetchTagsAction(addSelectedProperty(res.data));

                        getAllTagEventTypes().then((res, err) => {
                            that.fetchTagEventTypesAction(res.data);

                            that.loadInitialDataEndedAction();

                            browserHistory.push('/patients');

                        })
                    })
                })
            })
        })
        .catch(function(err) {

            if(!!err.response) {
                if(err.response.status === 401) {
                    that.loginFailedAction();
                }
            }

            that.loginEndedAction();
            that.loadInitialDataEndedAction();
            // notify("Jméno nebo heslo je nesprávné!", "error");
            console.log(err);
        })

    }

    render() {
        if(this.state.isLoginPageLoading) {
            return (
                <div style={{textAlign:'center'}} >
                    <Image verticalAlign='middle' size='large' src={spinner}/>
                </div>
            )
        }
        else {
            return (
                <div className='login-form'>
                    {/* <style>{`
                    body > div,
                    body > div > div,
                    body > div > div > div.login-form {
                        height: 100%;
                    }
                    `}</style> */}
                    <Grid columns={3} stackable>
                        <Grid.Column width='4'></Grid.Column>
                        <Grid.Column width='8'>
                            <Image fluid src={logo}/>
                            <Form loading={!(this.props.loginPageStore.loginDone || this.props.loginPageStore.loginInitialDataDone)} size='large'>
                                <Segment raised stacked>
                                    <Form.Input fluid icon='user' iconPosition='left' placeholder='Jméno' name='username' onChange={this.handleChange}/>
                                    <Form.Input
                                        fluid
                                        icon='lock'
                                        iconPosition='left'
                                        placeholder='Heslo'
                                        type='password'
                                        name='password'
                                        onChange={this.handleChange}/>
                                    <Button
                                        onClick={() => this.auth()}
                                        style={{backgroundColor: '#006bab'}}
                                        primary
                                        fluid
                                        size='large'
                                        >
                                        Login
                                    </Button>
                                </Segment>
                            </Form>
                            <Message floating>
                                Potíže s přihlášením? Kontaktujte
                                <a href="mailto:jaromir.konecny@vsb.cz" onClick={() => this.setState({ showEmail: !this.state.showEmail })}> administrátora </a>
                                {
                                    this.state.showEmail ? (
                                        <Transition
                                            visible={this.state.showEmail}
                                            animation='drop'
                                            duration={1000}>
                                            <div><i>jaromir.konecny@vsb.cz</i></div>
                                        </Transition>) : ''}
                            </Message>

                        </Grid.Column>
                        <Grid.Column width='4'></Grid.Column>
                    </Grid>

                </div>
            )
        }

    }
}

function mapStateToProps(state) {
    return {
        loginPageStore: state.LoginReducer
    };
  }

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loginStartedAction: loginStartedAction,
        loginEndedAction : loginEndedAction,
        loadInitialDataStartedAction : loadInitialDataStartedAction,
        loadInitialDataEndedAction : loadInitialDataEndedAction,
        fetchActivePatientsAction : fetchActivePatientsAction,
        fetchTagRegistrationsAction : fetchTagRegistrationsAction,
        fetchTagEventTypesAction : fetchTagEventTypesAction,
        fetchTagsAction : fetchTagsAction,
        loginFailedAction : loginFailedAction,
        loginSuccessAction : loginSuccessAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);