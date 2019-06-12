import React from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import {browserHistory} from 'react-router';
import {Grid, Form, Segment, Header, Table, Button, Icon, Message} from 'semantic-ui-react';
import moment from 'moment';

import {checkAuth} from '../../login/LoginAxios';
import {loginSuccessAction, loginFailedAction} from '../../login/LoginAction';
import {isEmpty} from '../../../helpers/helpers';
import {toggleEditTagEventModalAction} from './PatientDetailAction';
import EditTagEvent from '../../../modals/EditTagEvent'


class PatientDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filterCardId: ''

        };

    
    }

    // componentWillReceiveProps(nextProps) {
    //     
    // }

    componentWillMount() {
        var that = this.props;

        checkAuth().then(() => {
            that.loginSuccessAction();
        })
        .catch(err => {
            if(!!err.response) {
                if(err.response.status === 401) {
                    that.loginFailedAction();
                    browserHistory.push('/logout');
                }
            }

            console.log(err);
        })

        if(isEmpty(this.props.patientDetailStore.patientToShowInPatientDetail)) {
            browserHistory.push('/patients');
        }
        
        // if(!this.props.loginPageStore.loggedIn) {
        //     browserHistory.push('/login');
        // }
    }

    toggleEditTagEvent(tagEvent) {
        if(!isEmpty(tagEvent)) {
            this.props.toggleEditTagEventModalAction(tagEvent)
        }
    }

    render() {
        const mappedPatientTagEvents = this.props.tagEventStore.deletedPatientTagEvents.map(tagEvent => {
            return (
                <Table.Row textAlign='center' key={tagEvent.id}>
                    <Table.Cell>
                    {
                        moment(tagEvent.created).local().format("DD.MM.YYYY HH:mm:ss").toString()
                    }</Table.Cell>
                    <Table.Cell>{tagEvent.tagEventType.note}</Table.Cell>
                    <Table.Cell>{tagEvent.tag.name}</Table.Cell>
                    <Table.Cell>
                        <div>
                            <Button
                                style={{backgroundColor: '#efe1ba', color:'black'}}
                                size='tiny' 
                                onClick={() => this.toggleEditTagEvent(tagEvent)}
                                content='Upravit'/>
                            {
                                
                                this.props.patientDetailStore.showEditTagEventModal === true ? (
                                    <EditTagEvent />
                                ) : (
                                    <span></span>
                                )
                            }
                        </div>
                    </Table.Cell>
                </Table.Row>
            )     
        })

        if(this.props.loginPageStore.loggedIn) {
            return(
                <Grid columns={2} stackable container style={{ padding: '2em 0em' }}>
                    <Grid.Column width='5'>
                        <Header style={{backgroundColor: '#80808036', color:'black'}} attached='top' as='h2'>Karta pacienta</Header>
                        <Segment attached='bottom'>
                            <Form size='large'>
                                <Form.Field style={{paddingBottom: '1em'}} >
                                    <label>Číslo karty</label>
                                    <input disabled value={this.props.patientDetailStore.patientToShowInPatientDetail.cardId} />
                                </Form.Field>
                                <Form.Field style={{paddingBottom: '1em'}}>
                                    <label>Křestní jméno</label>
                                    <input disabled value={this.props.patientDetailStore.patientToShowInPatientDetail.firstName}/>
                                </Form.Field>
                                {
                                    isEmpty(this.props.patientDetailStore.patientToShowInPatientDetail.middleName) || this.props.patientDetailStore.patientToShowInPatientDetail.middleName.length === 0 ? (
                                        <span></span>
                                    ) : (
                                        <Form.Field style={{paddingBottom: '1em'}}>
                                            <label>Prostřední jméno</label>
                                            <input disabled value={this.props.patientDetailStore.patientToShowInPatientDetail.middleName}/>
                                        </Form.Field>
                                    )
                                }
                                
                                <Form.Field style={{paddingBottom: '1em'}}>
                                    <label>Příjmení</label>
                                    <input disabled value={this.props.patientDetailStore.patientToShowInPatientDetail.lastName}/>
                                </Form.Field>
                                <Form.Field style={{paddingBottom: '1em'}}>
                                    <label>Rodné číslo</label>
                                    <input disabled value={this.props.patientDetailStore.patientToShowInPatientDetail.socialSecurityNumber}/>
                                </Form.Field>
                                <Form.Field style={{paddingBottom: '1em'}}>
                                    <label>Datum narození</label>
                                    <input disabled value={this.props.patientDetailStore.patientToShowInPatientDetail.birthDate.substring(
                                        0, this.props.patientDetailStore.patientToShowInPatientDetail.birthDate.indexOf(' '))}/>
                                </Form.Field>
                                <Button onClick={() => browserHistory.push('/patients')} fluid style={{backgroundColor: '#9a3334', color:'white'}} content='Zpět'/>
                            </Form>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width='11'>
                        <Header style={{backgroundColor: '#80808036', color:'black'}} attached='top' as='h2'>Události pacienta</Header>
                        <Segment attached='bottom'>
                            {
                                mappedPatientTagEvents.length > 0 ? (
                            <Table compact padded celled selectable striped fixed >
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell style={{backgroundColor: '#80808036'}} width={3}>Čas</Table.HeaderCell>
                                        <Table.HeaderCell style={{backgroundColor: '#80808036'}} width={5}>Název</Table.HeaderCell>
                                        <Table.HeaderCell style={{backgroundColor: '#80808036'}} width={2}>Tag</Table.HeaderCell>
                                        <Table.HeaderCell style={{backgroundColor: '#80808036'}} width={2}>Akce</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {mappedPatientTagEvents}
                                </Table.Body>
                            </Table>
                            ) : (
                                <div>
                                    <Message warning>
                                        <Icon name="warning circle" size='large'/>
                                        Tento pacient neměl žádné události.
                                    </Message>
                                </div>
                            )}
                        </Segment>
                    </Grid.Column>
                </Grid>
            );
        }
        else {
            return null
        }
    }
}

function mapStateToProps(state) {
    return {
        patientDetailStore: state.PatientDetailReducer,
        loginPageStore: state.LoginReducer,
        tagEventStore: state.TagEventReducer
    };
  }
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loginSuccessAction : loginSuccessAction,
        loginFailedAction : loginFailedAction,
        toggleEditTagEventModalAction : toggleEditTagEventModalAction
    }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(PatientDetail);