import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, ControlLabel, FormControl, Table, MenuItem, 
    ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import axios from 'axios';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import { ToastContainer, toast } from 'react-toastify';
import Confirm from 'react-confirm-bootstrap';

import { url } from '../../appConfig';
import { setActiveTagAction, editPatientAction, selectTagEventToModifyAction, 
    editTagEventAction, saveTagEventsAction, savePatientTagEventsAction } from '../../actions/actions';
    import { isEmpty, buildAuthorizationHeader, validateCardId, validateSocialSecurityNumber } from '../../helpers/helpers-operations';
import ModifyTagEvent from './modifyTagEvent';
import { shortcut } from '../../helpers/shortcut';
import { map } from '../../mappers/mapper';
import SpinnerModal from './spinner';

@connect((store) => {
    return {
        tags: store.TagsReducer.tags,
        tagEvents: store.TagEventsReducer.tagEvents,
        activeTag: store.TagsReducer.activeTag,
        patients: store.PatientsReducer.patients,
        patientToEdit: store.PatientsReducer.patientToEdit,
        showModifyTagEvent: store.TagEventsReducer.modifyTagEventModal,
        patientTagEvents: store.TagEventsReducer.patientTagEvents
    }
})
export default class ModifyPatient extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.patientToEdit.id,
            card_Id: props.patientToEdit.card_Id,
            firstName: props.patientToEdit.firstName,
            middleName: props.patientToEdit.middleName,
            lastName: props.patientToEdit.lastName,
            socialSecurityNumber: props.patientToEdit.socialSecurityNumber,
            birthDate: props.patientToEdit.birthDate ? moment(props.patientToEdit.birthDate, 'DD.MM.YYYY h:mm:ss').toDate() : '',
            tag: props.patientToEdit.tag,
            startDate: moment(new Date(-8640000000000000)),
            endDate: moment(new Date(8640000000000000)),
            showFilter: false,
            showSpinner: false
        };

        this.handlecardIdChange = this.handlecardIdChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleMiddleNameChange = this.handleMiddleNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleSocialSecurityNumber = this.handleSocialSecurityNumber.bind(this);
        this.handleBirthdate = this.handleBirthdate.bind(this);
        this.addTagEventToPatient = this.addTagEventToPatient.bind(this);
        this.handleEditPatientClick = this.handleEditPatientClick.bind(this);
        this.removeTagEventFromPatient = this.removeTagEventFromPatient.bind(this);
        this.notify = this.notify.bind(this);
        this.toggleSpinnerModal = this.toggleSpinnerModal.bind(this);
    }

    componentWillMount() {
        shortcut.add("esc", () => browserHistory.goBack());  
    }

    componentWillUnmount() {
        shortcut.remove("esc");
    }

    notify(text, type) {
        if(type === 'success') {
          toast.success(text, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 8000
          });
        }
        else {
          toast.error(text, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 8000
          });
        }
    }

    toggleSpinnerModal() {
        this.setState({
            showSpinner: !this.state.showSpinner
        });
    }

    addTagEventToPatient(tagEvent) {
        this.toggleSpinnerModal();
        var config = buildAuthorizationHeader("put");

        if(!config) {
            return;
        }

        var newArray = [];
        var newObject = JSON.parse(JSON.stringify(tagEvent));

        newObject.patient_Id = this.props.patientToEdit.id;

        newArray.push(newObject);
        axios.put(url + 'tagEvents', newArray, config).then(res => 
        {    
            this.props.dispatch(editTagEventAction(newObject));

            axios.get(url + 'tagevents?patientid=' + this.props.patientToEdit.id, config).then(res => 
            {    
                // let patientsTagEvents = res.data.filter(tagEvent => {
                //     return tagEvent.tag_Id === this.props.patientToEdit.tag.id
                // })
                // this.props.dispatch(savePatientTagEventsAction(map(patientsTagEvents)));
                // if(patientsTagEvents.length > 0) {
                //     axios.get(url + 'tagevents?tagid=' + patientsTagEvents[0].tag_Id, config).then(res => {
                //         this.props.dispatch(saveTagEventsAction(map(res.data)));
                //     })
                // }

                this.props.dispatch(savePatientTagEventsAction(map(res.data)));
                if(res.data.length > 0) {
                    axios.get(url + 'tagevents?tagid=' + res.data[0].tag.id, config).then(res => {
                        this.props.dispatch(saveTagEventsAction(map(res.data)));
                    })
                }

                this.toggleSpinnerModal();
                this.notify("Událost přiřazena!", "success");
            })

            this.setState({
                working: false
            });
        })
    }

    removeTagEventFromPatient(tagEvent) {
        this.toggleSpinnerModal();
        var config = buildAuthorizationHeader("put");

        if(!config) {
            return;
        }

        var newArray = [];
        var newObject = JSON.parse(JSON.stringify(tagEvent));

        newObject.patient_Id = null;
        newArray.push(newObject);
        axios.put(url + 'tagEvents', newArray, config).then(res => 
        {    
            this.props.dispatch(editTagEventAction(newObject));
            
            res.data[0].patient_Id = this.props.patientToEdit.id;
            res.data[0].patient = this.props.patientToEdit;

            axios.get(url + 'tagevents?patientid=' + this.props.patientToEdit.id, config).then(res => 
            {    
                this.props.dispatch(savePatientTagEventsAction(map(res.data)));
                if(res.data.length > 0) {
                    axios.get(url + 'tagevents?tagid=' + res.data[0].tag.id, config).then(res => {
                        this.props.dispatch(saveTagEventsAction(map(res.data)));
                    })
                }

                this.toggleSpinnerModal();
                this.notify("Událost odebrána!", "success");
            })
        })
    }

    handleEditPatientClick(patient) {     

        var config = buildAuthorizationHeader("put");

        if(!config) {
            return;
        }

        
        if(!isEmpty(this.props.activeTag)) {
            patient.tag = this.props.activeTag;
        }
        else {
            if(isEmpty(patient.tag)) {
                delete patient.tag;
            }
        }

        if(!!patient.birthDate) {
            patient.birthDate = moment(patient.birthDate).format('DD.MM.YYYY');
        }
        

        axios.put(url + 'patients', patient, config).then(res => 
        {    
            this.props.dispatch(editPatientAction(patient));
            
            browserHistory.push('/patients');
            this.notify("Pacient změněn!", "success");
        })
        .catch( function(error) {
            console.log(JSON.stringify(error, null, 2));
        });
    }

    handlecardIdChange (event) {
        this.setState({ card_Id: event.target.value });
    }

    handleMiddleNameChange (event) {
        this.setState({ middleName: event.target.value });
    }

    handleFirstNameChange (event) {
        this.setState({ firstName: event.target.value });
    }

    handleLastNameChange (event) {
        this.setState({ lastName: event.target.value });
    }

    handleSocialSecurityNumber (event) {
        this.setState({ socialSecurityNumber: event.target.value });
    }

    handleBirthdate (event) {
        this.setState({ birthDate: event.date[0] });
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

        var filteredMappedTagEvents = [];

        if(this.props.tagEvents.length > 0) {
            const filteredTagEvents = this.props.tagEvents.filter(tagEvent => {
                if(!tagEvent.patient) {
                    return tagEvent
                }
            });
    
            filteredMappedTagEvents = filteredTagEvents.map(tagEvent => {
                return (
                    <tr key={tagEvent.id}>
                        <td style={{wordBreak:'break-word'}}>{moment(tagEvent.created).isDST() ? moment(new Date(tagEvent.created)).local().format("HH:mm:ss DD.MM.YYYY") : moment(new Date(tagEvent.created)).local().format("HH:mm:ss DD.MM.YYYY")}</td>
                        <td style={{wordBreak:'break-word'}}>{tagEvent.tagEventType.note}</td>
                        <td style={{wordBreak:'break-word'}}>
                        <Button 
                            bsSize="small"
                            className="editButton"
                            onClick = {() => this.toggleModifyTagEventModal(tagEvent)}>
                            <strong>Upravit</strong>
                        </Button>
                        {
                            !isEmpty(this.props.showModifyTagEvent) ? (
                                <ModifyTagEvent 
                                    onToggle = {this.toggleModifyTagEventModal}
                                    onShow = {true}
                                /> 
                            ) : (
                                <span></span>
                            )
                        }
    
                        <Button
                            className="assignUnassignEvent"
                            bsSize="small"
                            onClick={() => this.addTagEventToPatient(tagEvent)}>
                            <strong>Přiřadit pacientovi</strong>
                        </Button>
                        </td>
                    </tr>
                )
            })
        }
        
        const filtered = this.props.patients.filter(pat => {
            return pat.id !== this.state.id
        }).filter(pat => {
            return pat.card_Id == this.state.card_Id
        });

        const filteredPatientTagEvents = this.props.patientToEdit.tag ? (
             this.props.tagEvents.filter(tagEvent => {
                if(tagEvent.patient && this.props.patientToEdit) {
                    if(this.props.patientToEdit.id === tagEvent.patient.id) {
                        return tagEvent;
                    }
                }
            })
        ) : (
            this.props.patientTagEvents
        )
        
        const isButtonEnabled = filteredPatientTagEvents.length > 1 ? true : false;

        let tagName = '';

        if(filteredPatientTagEvents.length > 0) {
            tagName = filteredPatientTagEvents[0].tag.name;
        }
            
        const mappedPatientTagEvents = filteredPatientTagEvents.map(tagEvent => {
            return (
                <tr key={tagEvent.id}>
                    <td>{moment(tagEvent.created).local().format('hh:mm:ss DD.MM.YYYY').toString()}</td>
                    <td>{tagEvent.tagEventType.note}</td>
                    <td>
                        <Button 
                            bsSize="small"
                            className="editButton"
                            onClick = {() => this.toggleModifyTagEventModal(tagEvent)}>
                            <strong>Upravit</strong>
                        </Button>
                        {
                            !isEmpty(this.props.showModifyTagEvent) ? (
                                <ModifyTagEvent 
                                    onToggle = {this.toggleModifyTagEventModal}
                                    onShow = {true} /> 
                            ) : (
                                <span></span>
                            )
                        }
                        {
                            isButtonEnabled ? (
                                <Button 
                                    bsSize="small"
                                    className="assignUnassignEvent"
                                    onClick={() => this.removeTagEventFromPatient(tagEvent)}>
                                    <strong>Odebrat od pacienta</strong>
                                </Button>
                            ) : (
                                <Button 
                                    disabled
                                    bsSize="small"
                                    className="assignUnassignEvent"
                                    onClick={() => this.removeTagEventFromPatient(tagEvent)}>
                                    <strong>Odebrat od pacienta</strong>
                                </Button>
                            )
                        }     
                    </td>
                </tr>
            )
        })

        return (
            <div className='row'>
            <ToastContainer />
                <div className="col-sm-4">
                    <Panel header={<b>Upravit pacienta</b>} bsStyle="primary">
                    
                     <form>
                        <FormGroup className="cardId" validationState={validateCardId(this.state.card_Id)}>
                            <ControlLabel>Číslo karty</ControlLabel>
                            <FormControl
                                id="card_Id"
                                type="text"
                                value={this.state.card_Id}
                                onChange={this.handlecardIdChange}
                            />
                            {validateCardId(this.state.card_Id) === "success" ? (<span></span>) : (<b><font color = "#a94442">Číslo karty musí být číslo.</font></b>)}
                            <br/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Křestní jméno</ControlLabel>
                            <FormControl
                                id="firstName"
                                type="text"
                                value={this.state.firstName}
                                onChange={this.handleFirstNameChange}
                            />
                            <br/>
                            <ControlLabel>Prostřední jméno</ControlLabel>
                            <FormControl
                                id="middleName"
                                type="text"
                                value={this.state.middleName}
                                onChange={this.handleMiddleNameChange}
                            />
                            <br/>
                            <ControlLabel>Příjmení</ControlLabel>
                            <FormControl
                                id="lastName"
                                type="text"
                                value={this.state.lastName}
                                onChange={this.handleLastNameChange}
                            />
                            </FormGroup>
                            <FormGroup validationState={validateSocialSecurityNumber(this.state.socialSecurityNumber)}>
                                <ControlLabel>Rodné číslo</ControlLabel>
                                <FormControl
                                    id="socialSecurityNumber"
                                    type="text"
                                    value={this.state.socialSecurityNumber}
                                    onChange={this.handleSocialSecurityNumber}
                                />
                                {validateSocialSecurityNumber(this.state.socialSecurityNumber) === "success" || validateSocialSecurityNumber(this.state.socialSecurityNumber) === null ? (<span></span>) : (
                                    <b><font color = "#a94442">Rodné číslo musí být číslo s nebo bez lomítka.</font></b>)}
                                <br/>
                            <ControlLabel>Datum narození</ControlLabel>
                            <Flatpickr 
                                value={this.state.birthDate}
                                onChange={date => { this.handleBirthdate({date})}}
                                className="dateForm"
                                options={{ locale: 'cs', dateFormat: 'd.m.Y'}}
                            />
                        </FormGroup>
                    </form>
                    {   
                        filtered.length > 0 ? (
                            <Confirm
                                onConfirm={() => this.handleEditPatientClick(this.state)} 
                                body={"Pacient s číslem karty " + this.state.card_Id + " již existuje. Chcete pokračovat?"}
                                confirmText="Ano"
                                cancelText="Ne"
                                title="Kolize čísel karet">
                                <Button bsStyle="primary" style={{marginRight: '1em'}}>Změnit</Button>
                            </Confirm>
                        ) : (
                            validateCardId(this.state.card_Id) === "success" && 
                            ( validateSocialSecurityNumber(this.state.socialSecurityNumber) === "success" || validateSocialSecurityNumber(this.state.socialSecurityNumber) === null) ? (
                                <Button bsStyle="primary" style={{marginRight: '1em'}} onClick={() => this.handleEditPatientClick(this.state)}>Změnit</Button>
                            ) : (
                                <Button disabled bsStyle="primary" style={{marginRight: '1em'}} onClick={() => this.handleEditPatientClick(this.state)}>Změnit</Button>
                            )
                            
                        )
                    }
                    
                    <Button onClick = {() => browserHistory.push('/patients')}>Zpět</Button>
                    </Panel>
                </div>
                <div className="col-sm-8">
                    {
                        this.state.tag !== null ? (
                            <div>
                                <Panel header={<b>Přiřazený tag</b>} bsStyle="primary">
                                    <div key={ this.state.tag.id }>
                                        <Button disabled>
                                            { this.state.tag.name }
                                        </Button>    
                                    </div>
                                </Panel>
                                
                                
                            </div>
                        ) : (
                            <div>
                            </div>
                        )
                    }
                    <FormGroup>
                    {
                        this.state.showSpinner ? (
                            <SpinnerModal 
                                onShow={this.state.showSpinner} 
                                onToggle={this.toggleSpinnerModal} />
                        ) : (
                            <span></span>
                        )
                    }
                    {
                        <div>
                            <Panel header={<b>Události pacienta</b>} bsStyle="primary">
                                <div>
                                    {mappedPatientTagEvents.length > 0 ? (
                                    <Table responsive striped condensed hover style={{marginTop: '2em'}}>
                                        <thead>
                                        <tr>
                                            <th>Čas</th>
                                            <th>Název</th>
                                            <th>Akce</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {mappedPatientTagEvents}
                                        </tbody>
                                    </Table>
                                    ) : (
                                        <ListGroup>
                                            <ListGroupItem className = "warn" bsStyle="warning">Tento pacient nemá žádné události.</ListGroupItem>
                                        </ListGroup>
                                    )}
                                </div>
                            </Panel>

                            <Panel header={<b>Volné události tagu {tagName ? (tagName) : ('')}</b>} bsStyle="primary">
                                <div>
                                {
                                    filteredMappedTagEvents.length > 0 ? (
                                        <Table responsive striped condensed hover style={{marginTop: '2em', tableLayout: 'fixed'}}>
                                            <thead>
                                            <tr>
                                                <th>Čas</th>
                                                <th>Název</th>
                                                <th>Akce</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                {filteredMappedTagEvents}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <ListGroup>
                                            <ListGroupItem className = "warn" bsStyle="warning">Tento tag nemá volné události.</ListGroupItem>
                                        </ListGroup>
                                    )
                                }
                                </div>
                            </Panel>
                        </div>
                    }
                    </FormGroup>
                </div>
            </div>
        )
    }
}

