import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, ControlLabel, FormControl, Form, Table, MenuItem, ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import {browserHistory} from 'react-router';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import { ToastContainer, toast } from 'react-toastify';

import {selectTagEventToModifyAction} from '../actions/actions'
import {isEmpty} from '../helpers/helpers-operations';
import ModifyTagEvent from './modals/modifyTagEvent';
import { shortcut } from '../helpers/shortcut';

@connect((store) => {
    return {
        tagEvents: store.TagEventsReducer.tagEvents,
        patientToEdit: store.PatientsReducer.patientToEdit,
        showModifyTagEvent: store.TagEventsReducer.modifyTagEventModal
    }
})
export default class PatientInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            card_Id: props.patientToEdit.card_Id,
            firstName: props.patientToEdit.firstName,
            middleName: props.patientToEdit.middleName,
            lastName: props.patientToEdit.lastName,
            socialSecurityNumber: props.patientToEdit.socialSecurityNumber,
            birthdate: props.patientToEdit.birthDate ? moment(props.patientToEdit.birthDate, 'DD.MM.YYYY h:mm:ss').toDate() : '',
            startDate: moment(new Date(-8640000000000000)),
            endDate: moment(new Date(8640000000000000))
        };
    }

    componentWillMount() {
        shortcut.add("esc", () => browserHistory.goBack());  
    }

    componentWillUnmount() {
        shortcut.remove("esc");
    }

    toggleModifyTagEventModal(tagEvent) {
        if(tagEvent) {
            this.props.dispatch(selectTagEventToModifyAction(tagEvent));
        }
    }

    render() {

        Date.prototype.addHours= function(h){
            this.setHours(this.getHours()+h);
            return this;
        }

        const filteredPatientTagEvents =  this.props.tagEvents.filter(tagEvent => {
            if(tagEvent.patient && this.props.patientToEdit) {
                if(this.props.patientToEdit.id === tagEvent.patient.id) {
                    return tagEvent;
                }
            }
        });

        
        const mappedPatientTagEvents = filteredPatientTagEvents.map(tagEvent => {
            return (
                <tr key={tagEvent.id}>
                    <td>{moment(tagEvent.created_Modified).local().format('DD.MM.YYYY HH:mm:ss').toString()}</td>
                    <td>{tagEvent.tagEventType.note}</td>
                    <td>{tagEvent.tag.name}</td>
                    <td>
                        <Button 
                            bsSize="small"
                            className="editButton"
                            onClick = {() => this.toggleModifyTagEventModal(tagEvent)}>
                            <strong>Upravit</strong>
                        </Button>
                        {!isEmpty(this.props.showModifyTagEvent) ? (
                            <ModifyTagEvent 
                                onToggle = {this.toggleModifyTagEventModal}
                                onShow = {true}
                            /> ) : (
                                <span></span>
                            )
                        }
                    </td>
                </tr>
            )
        })

        return (
            <div className='row'>
                <ToastContainer />
                <div className="col-sm-3">
                    <Panel header={<b>Upravit pacienta</b>} bsStyle="primary">
                        <form>
                            <FormGroup>
                                <ControlLabel>Číslo karty</ControlLabel>
                                <FormControl
                                    id="card_Id"
                                    type="text"
                                    value={this.state.card_Id}
                                    disabled
                                />
                                <br/>
                                <ControlLabel>Křestní jméno</ControlLabel>
                                <FormControl
                                    id="firstName"
                                    type="text"
                                    value={this.state.firstName}
                                    disabled
                                />
                                <br/>
                                <ControlLabel>Prostřední jméno</ControlLabel>
                                <FormControl
                                    id="middleName"
                                    type="text"
                                    value={this.state.middleName}
                                    disabled
                                />
                                <br/>
                                <ControlLabel>Příjmení</ControlLabel>
                                <FormControl
                                    id="lastName"
                                    type="text"
                                    value={this.state.lastName}
                                    disabled
                                />
                                <ControlLabel>Rodné číslo</ControlLabel>
                                <FormControl
                                    id="socialSecurityNumber"
                                    type="text"
                                    value={this.state.socialSecurityNumber}
                                    disabled
                                />
                                <br/>
                                <ControlLabel>Datum narození</ControlLabel>
                                <Flatpickr 
                                    value={this.state.birthdate ? this.state.birthdate : ''}
                                    disabled
                                    className="dateForm"
                                    options={{ locale: 'cs', dateFormat: 'd.m.Y'}}
                                />
                            </FormGroup>
                        </form>

                        <Button onClick = {() => browserHistory.push('/patients')}>Zpět</Button>
                    </Panel>
                </div>
                <div className="col-sm-9">
                    <Panel header={<b>Události pacienta</b>} bsStyle="primary">
                        <FormGroup>
                            <div>
                                {mappedPatientTagEvents.length > 0 ? (
                                    <Table responsive striped condensed hover style={{marginTop: '2em'}}>
                                        <thead>
                                        <tr>
                                            <th>Čas</th>
                                            <th>Název</th>
                                            <th>Tag</th>
                                            <th>Akce</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {mappedPatientTagEvents}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <ListGroup>
                                        <ListGroupItem className = "warn" bsStyle="warning">Tento pacient neměl žádné události.</ListGroupItem>
                                    </ListGroup>
                                )}
                            </div>
                            <br/> 
                        </FormGroup>
                    </Panel>
                </div>
            </div>
        )
    }
}

