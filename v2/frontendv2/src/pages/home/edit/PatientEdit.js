import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Grid, Form, Segment, Header, Table, Button, Icon, Message } from 'semantic-ui-react';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import '../../../../node_modules/flatpickr/dist/flatpickr.css';

import { checkAuth } from '../../login/LoginAxios';
import { loginSuccessAction, loginFailedAction } from '../../login/LoginAction';
import { isEmpty, validateCardId, validateSocialSecurityNumber } from '../../../helpers/helpers';
import { toggleEditTagEventModalAction } from './PatientEditAction';
import EditTagEvent from '../../../modals/EditTagEvent'
import { addTagEventToPatientAction, removeTagEventFromPatientAction } from '../../common/TagEventAction';
import { putTagEvents } from '../../common/TagEventAxios';
import { savePatient } from './PatientEditAxios';
import { openPatientEditAction } from './PatientEditAction';

class PatientEdit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            patientToEdit: this.props.patientEditStore.patientToEdit,
            cardId: this.props.patientEditStore.patientToEdit.cardId,
            firstName: this.props.patientEditStore.patientToEdit.firstName,
            middleName: this.props.patientEditStore.patientToEdit.middleName,
            lastName: this.props.patientEditStore.patientToEdit.lastName,
            socialSecurityNumber: this.props.patientEditStore.patientToEdit.socialSecurityNumber,
            birthDate: this.props.patientEditStore.patientToEdit.birthDate,


        };

        this.handleChange = this.handleChange.bind(this);
        this.handleBirthdate = this.handleBirthdate.bind(this);
        this.handleAssignUnassignTagEvent = this.handleAssignUnassignTagEvent.bind(this);
        this.handleSavePatient = this.handleSavePatient.bind(this);
        this.handleSocialSecurityNumber = this.handleSocialSecurityNumber.bind(this);

    }

    handleSocialSecurityNumber(event) {

        this.setState({ socialSecurityNumber: event.target.value });

        if (event.target.value.length >= 6) {
            var day = parseInt(event.target.value.substr(4, 2), 10);
            var month = parseInt(event.target.value.substr(2, 2), 10);
            var year = parseInt(event.target.value.substr(0, 2), 10);

            if (month > 50) {
                month = month - 50;
            }

            month--;

            if (year >= 54) {
                year = year + 1900;
            }
            else {
                year = year + 2000;
            }

            this.setState({
                birthDate: new Date(year, month, day, 0, 0, 0)
            });
        }
    }

    handleSavePatient() {


        var modifiedPatient = this.props.patientEditStore.patientToEdit;
        modifiedPatient.cardId = this.state.cardId
        modifiedPatient.firstName = this.state.firstName
        modifiedPatient.middleName = this.state.middleName
        modifiedPatient.lastName = this.state.lastName
        modifiedPatient.socialSecurityNumber = this.state.socialSecurityNumber
        modifiedPatient.birthDate = moment(this.state.birthDate).format('DD.MM.YYYY').toString()



        var patientTagEvents = this.props.tagEventStore.deletedPatientTagEvents
        var tagTagEvents = this.props.tagEventStore.tagEventsByTagId

        var modifiedPatientTagEvents = patientTagEvents.reduce(function (filtered, patientTagEvent) {
            if (patientTagEvent.modified_temp === true) {
                patientTagEvent.patient = modifiedPatient;
                filtered.push(patientTagEvent);
            }
            return filtered;
        }, []);

        var modifiedTagTagEvents = tagTagEvents.reduce(function (filtered, tagTagEvent) {
            if (tagTagEvent.modified_temp === true) {
                tagTagEvent.patient = null;
                filtered.push(tagTagEvent);
            }
            return filtered;
        }, []);

        var modifiedTagEvents = modifiedPatientTagEvents
        modifiedTagEvents = modifiedTagEvents.concat(modifiedTagTagEvents)

        putTagEvents(modifiedTagEvents).then(() => {
            savePatient(modifiedPatient).then(() => {
                // that.openPatientEditAction();
                browserHistory.push('/patients')
            })
        })
            .catch(err => console.log(err))
    }

    handleAssignUnassignTagEvent(tagEvent, isAssign) {
        tagEvent.modified_temp = true;

        if (isAssign === true) {
            tagEvent.patient = this.state.patientToEdit
            this.props.addTagEventToPatientAction(tagEvent);
        }
        else {
            tagEvent.patient = null
            this.props.removeTagEventFromPatientAction(tagEvent);
        }
    }

    handleChange(e, { name, value }) {
        this.setState({ [name]: value })
    }

    handleBirthdate(event) {
        this.setState({ birthDate: event.date[0] });
    }

    componentWillMount() {
        var that = this.props;

        checkAuth().then(() => {
            that.loginSuccessAction();
        })
            .catch(err => {
                if (!!err.response) {
                    if (err.response.status === 401) {
                        that.loginFailedAction();
                        browserHistory.push('/logout');
                    }
                }

                console.log(err);
            })

        if (isEmpty(this.props.patientEditStore.patientToEdit)) {
            browserHistory.push('/patients');
        }

        // if(!this.props.loginPageStore.loggedIn) {
        //     browserHistory.push('/login');
        // }
    }

    toggleEditTagEvent(tagEvent) {
        if (!isEmpty(tagEvent)) {
            this.props.toggleEditTagEventModalAction(tagEvent)
        }
    }

    render() {
        const mappedPatientTagEvents = this.props.tagEventStore.deletedPatientTagEvents.map(tagEvent => {
            return (
                <Table.Row textAlign='center' key={tagEvent.id}>
                    <Table.Cell>
                        {
                            moment(tagEvent.modified).local().format("DD.MM.YYYY HH:mm:ss").toString()
                        }</Table.Cell>
                    <Table.Cell>{tagEvent.tagEventType.note}</Table.Cell>
                    <Table.Cell>{tagEvent.tag.name}</Table.Cell>
                    <Table.Cell>
                        <div>
                            <Button
                                style={{ backgroundColor: '#efe1ba', color: 'black' }}
                                size='mini'
                                onClick={() => this.toggleEditTagEvent(tagEvent)}
                                content='Upravit' />
                            <Button onClick={() => this.handleAssignUnassignTagEvent(tagEvent, false)} style={{ marginRight: '0.5em', marginLeft: '0.5em', backgroundColor: '#9a3334', color: 'white' }} content='Odebrat' size='mini' />
                            {

                                this.props.patientEditStore.showEditTagEventModal === true ? (
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

        const mappedTagTagEvents = this.props.tagEventStore.tagEventsByTagId
            .filter(tagEvent => {
                return isEmpty(tagEvent.patient)
            })
            .map(tagEvent => {
                return (
                    <Table.Row textAlign='center' key={tagEvent.id}>
                        <Table.Cell>
                            {
                                moment(tagEvent.modified).local().format("DD.MM.YYYY HH:mm:ss").toString()
                            }</Table.Cell>
                        <Table.Cell>{tagEvent.tagEventType.note}</Table.Cell>
                        <Table.Cell>
                            <div>
                                <Button
                                    style={{ backgroundColor: '#efe1ba', color: 'black' }}
                                    size='mini'
                                    onClick={() => this.toggleEditTagEvent(tagEvent)}
                                    content='Upravit' />
                                <Button onClick={() => this.handleAssignUnassignTagEvent(tagEvent, true)} style={{ marginRight: '0.5em', marginLeft: '0.5em', backgroundColor: '#9a3334', color: 'white' }} content='Přidat' size='mini' />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                )
            })

        if (this.props.loginPageStore.loggedIn) {
            return (
                <Grid columns={2} stackable container style={{ padding: '2em 0em' }}>
                    <Grid.Column width='4'>
                        <Header attached='top' as='h2'>Karta pacienta</Header>
                        <Segment attached='bottom'>
                            <Form size='large'>
                                <Form.Input error={!validateCardId(this.state.cardId)} style={{ paddingBottom: '1em' }} label='Číslo karty' fluid value={this.state.cardId} name='cardId' onChange={this.handleChange} />
                                <Form.Input style={{ paddingBottom: '1em' }} label='Křestní jméno' fluid value={this.state.firstName} name='firstName' onChange={this.handleChange} />
                                <Form.Input style={{ paddingBottom: '1em' }} label='Prostřední jméno' fluid value={this.state.middleName} name='middleName' onChange={this.handleChange} />
                                <Form.Input style={{ paddingBottom: '1em' }} label='Příjmení' fluid value={this.state.lastName} name='lastName' onChange={this.handleChange} />
                                <Form.Input error={!validateSocialSecurityNumber(this.state.socialSecurityNumber) && this.state.socialSecurityNumber.length > 0}
                                    style={{ paddingBottom: '1em' }}
                                    label='Rodné číslo' fluid value={this.props.patientEditStore.patientToEdit.socialSecurityNumber} name='socialSecurityNumber' onChange={this.handleChange} />
                                <Form.Field style={{ paddingBottom: '1em' }}>
                                    <label>Datum narození</label>
                                    <Flatpickr
                                        value={this.state.birthDate}
                                        onChange={date => { this.handleBirthdate({ date }) }}
                                        className="dateForm"
                                        options={{ locale: 'cs', dateFormat: 'd.m.Y' }}
                                    />
                                </Form.Field>
                                <Button disabled={!validateCardId(this.state.cardId)} onClick={() => this.handleSavePatient()} fluid style={{ backgroundColor: '#efe1ba', color: 'black', marginBottom: '0.6em' }} content='Uložit' />
                                <Button onClick={() => browserHistory.push('/patients')} fluid style={{ backgroundColor: '#9a3334', color: 'white' }} content='Zpět' />
                            </Form>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width='12'>
                        <Header attached='top' as='h2'>Události pacienta</Header>
                        <Segment attached='bottom'>
                            {
                                mappedPatientTagEvents.length > 0 ? (
                                    <Table compact padded celled selectable striped fixed >
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Čas</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={6}>Název</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={1}>Tag</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={3}>Akce</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {mappedPatientTagEvents}
                                        </Table.Body>
                                    </Table>
                                ) : (
                                        <div>
                                            <Message warning>
                                                <Icon name="warning circle" size='large' />
                                                Tento pacient nemá žádné události.
                                    </Message>
                                        </div>
                                    )}
                        </Segment>
                        <Header attached='top' as='h2'>Volné události tagu {this.props.patientEditStore.patientToEdit.tag && this.props.patientEditStore.patientToEdit.tag.name}</Header>
                        <Segment attached='bottom'>
                            {
                                mappedTagTagEvents.length > 0 ? (
                                    <Table key='grey' compact padded celled selectable striped fixed >
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Čas</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={6}>Název</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={3}>Akce</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {mappedTagTagEvents}
                                        </Table.Body>
                                    </Table>
                                ) : (
                                        <div>
                                            <Message warning>
                                                <Icon name="warning circle" size='large' />
                                                Tento tag nemá žádné události.
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
        patientEditStore: state.PatientEditReducer,
        loginPageStore: state.LoginReducer,
        tagEventStore: state.TagEventReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loginSuccessAction: loginSuccessAction,
        loginFailedAction: loginFailedAction,
        toggleEditTagEventModalAction: toggleEditTagEventModalAction,
        addTagEventToPatientAction: addTagEventToPatientAction,
        removeTagEventFromPatientAction: removeTagEventFromPatientAction,
        openPatientEditAction: openPatientEditAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientEdit);