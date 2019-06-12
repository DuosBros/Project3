import React from 'react';
import { Button, FormControl, Table, Modal, ListGroup, ListGroupItem, 
    OverlayTrigger, Popover, FormGroup, ControlLabel, Form, DropdownButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Flatpickr from 'react-flatpickr';

import {saveTagEventsAction, savePatientTagEventsAction, 
    editTagEventAction, deleteTagEventsAction, toggleWorkingAction, selectTagEventToModifyAction } from '../../actions/actions';
import {map} from '../../mappers/mapper';
import { url } from '../../appConfig';
import ModifyTagEvent from './modifyTagEvent';
import {isEmpty} from '../../helpers/helpers-operations'

@connect((store) => {
    return {
        tags: store.TagsReducer.tags,
        tagEvents: store.TagEventsReducer.tagEvents,
        tagInfo: store.TagsReducer.tagInfoModal,
        patientTagEvents: store.TagEventsReducer.patientTagEvents,
        working: store.TagEventsReducer.working,
        tagInfoModal: store.TagEventsReducer.tagInfoObject,
        modifyTagEventModal: store.TagEventsReducer.modifyTagEventModal,
        tagEventToModify: store.TagEventsReducer.modifyTagEventModal,
        tagEventTypes: store.TagEventTypesReducer.tagEventTypes
    }
})
export default class TagInfo extends React.Component {
    constructor(props) {
        super(props);

        this.closeInfoModal = this.closeInfoModal.bind(this);
        this.removeTagEventFromPatient = this.removeTagEventFromPatient.bind(this);
        this.addTagEventToPatient = this.addTagEventToPatient.bind(this);
        this.toggleModifyTagEventModal = this.toggleModifyTagEventModal.bind(this);
        this.getTagEvents = this.getTagEvents.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCreatedChange = this.handleCreatedChange.bind(this);
        this.handleSelectDropDownItem = this.handleSelectDropDownItem.bind(this);
        this.handleChangeTagEvent = this.handleChangeTagEvent.bind(this);
        

        this.state = {
            showModifyTagEventModal: false,
            name: "",
            created: "",
            nameChanged: false,
            createdChanged: false
        };
    }

    handleSelectDropDownItem(event) {
        this.setState({
            nameChanged: true,
            name: event
        });
    }

    handleNameChange(newName) {
        this.setState({
            name: newName.target.value
        });
    }

    handleCreatedChange(event) {
        this.setState({
            created: event.date[0],
            createdChanged: true
        });
    }

    
    toggleModifyTagEventModal(tagEvent) {
        this.props.dispatch(selectTagEventToModifyAction(tagEvent));

        this.setState({
            showModifyTagEventModal: !this.state.showModifyTagEventModal
        }); 
    }

    closeInfoModal() {
        this.props.onToggle();
        this.props.dispatch(deleteTagEventsAction());
    }

    removeTagEventFromPatient(tagEvent) {
        
        var config = {
            headers: {
                'Accept':'',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        var newArray = [];
        var newObject = JSON.parse(JSON.stringify(tagEvent));

        newObject.patient_Id = null;
        newArray.push(newObject);
        axios.put(url + 'tagEvents', newArray, config).then(res => 
        {    
            this.props.dispatch(editTagEventAction(newObject));
            
            res.data[0].patient_Id = this.props.tagInfo.patient.id;
            res.data[0].patient = this.props.tagInfo.patient;
            this.getTagEvents();

            this.props.dispatch(toggleWorkingAction());

            NotificationManager.success('', 'Událost odebrána.', 5000);
        })
    }

    addTagEventToPatient(tagEvent) {
        var config = {
            headers: {
                'Accept':'',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        var newArray = [];
        var newObject = JSON.parse(JSON.stringify(tagEvent));

        newObject.patient_Id = this.props.tagInfo.id;

        newArray.push(newObject);
        axios.put(url + 'tagEvents', newArray, config).then(res => 
        {    
            
            this.props.dispatch(editTagEventAction(newObject));
            this.getTagEvents();

            this.setState({
                working: false
            });

            NotificationManager.success('', 'Událost přiřazena.', 5000);
        })
    }

    getTagEvents() {
        var config = {
            headers: {
                'Accept':'',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        axios.get(url + 'tagEvents', config).then(res => 
        {    
            this.props.dispatch(saveTagEventsAction(res.data));  
        })    
    }

    handleChangeTagEvent() {
        
        var deepCloned = JSON.parse(JSON.stringify(this.props.tagEventToModify));
        var clonedTagEventTypes = JSON.parse(JSON.stringify(this.props.tagEventTypes));

        var nameToFind = this.state.nameChanged ? this.state.name : deepCloned.tagEventType.name;

        var foundTagEventType = clonedTagEventTypes.filter(tagEventType => {
            return tagEventType.name === nameToFind 
        });

        
        deepCloned.tagEventType = foundTagEventType[0];
        deepCloned.created = this.state.createdChanged ? this.state.created : deepCloned.created;
        deepCloned.tagEventType_Id = foundTagEventType[0].id;
        
        var config = {
            headers: {
                'Accept':'',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        var pica = [];
        pica.push(deepCloned);

        this.props.dispatch(editTagEventAction(deepCloned));    

        axios.put(url + 'tagevents', pica, config).then(res => 
        {     
            NotificationManager.success('', 'Událost změněna.', 5000);
        })
        .catch( function(error) {
            NotificationManager.error(JSON.stringify(error),'Chyba!', 5000);
        });
    }

    render() {   
        
        <NotificationContainer/>

        this.props.tagEvents.length === 0 ? this.getTagEvents() : <span></span>

        const filteredTagEvents = this.props.tagEvents.filter(tagEvent => {
            if(this.props.tagInfoModal.id === tagEvent.tag.id && !tagEvent.patient) {
                return tagEvent
            }
        });

        Date.prototype.addHours= function(h){
            this.setHours(this.getHours()+h);
            return this;
        }

        var mappedTagEventTypes = this.props.tagEventTypes.map(tagEventType => {
            return (
                <MenuItem key={tagEventType.id} eventKey={tagEventType.name}>{tagEventType.name}</MenuItem>
            )
        });

        var popoverLeft;
        !isEmpty(this.props.tagEventToModify) ? (
            popoverLeft = (
                <Popover id="popover-positioned-right" title="Změnit událost">
                <div className="largeModal">
                    <form>
                        <FormGroup>
                            <ControlLabel>Status</ControlLabel>
                            <br/>
                            <DropdownButton 
                                title={this.state.nameChanged ? this.state.name : this.props.tagEventToModify.tagEventType.name} 
                                id="bg-nested-dropdown"
                                onSelect = {this.handleSelectDropDownItem}>
                                {mappedTagEventTypes}
                            </DropdownButton>
                            <br/>
                            <ControlLabel>Čas události</ControlLabel>
                            <br/>
                            <div className="tagEventModifyDate">
                                <Flatpickr 
                                    data-enable-time
                                    value={this.state.createdChanged ? 
                                        this.state.created : 
                                        moment(this.props.tagEventToModify.created).isDST() ? new Date(this.props.tagEventToModify.created).addHours(-1) : new Date(this.props.tagEventToModify.created)}
                                    onChange={date => { this.handleCreatedChange({date})}}
                                    options={{time_24hr: true, locale: 'cs', dateFormat: 'H:i:S d.m.Y'}}
                                    className="form-control"
                                />
                            </div>
                            <br></br>
                            <Button bsStyle="primary" onClick={this.handleChangeTagEvent}>Změnit</Button>
                        </FormGroup>
                    </form>
                    </div>
                </Popover>
              )
        ) : (
            popoverLeft= (<Popover id="popover-positioned-right" title="Změnit událost"></Popover>)
        )
       

        const filteredMappedTagEvents = filteredTagEvents.map(tagEvent => {
            return (
                <div className="row" key={tagEvent.id}>
                    <div className="col-sm-1 divTableColumn">{tagEvent.id}</div>
                    <div className="col-sm-4 divTableColumn">{moment(tagEvent.created).isDST() ? moment(new Date(tagEvent.created).addHours(-1)).format("HH:mm DD.MM.YYYY") : moment(new Date(tagEvent.created)).format("HH:mm DD.MM.YYYY")}</div>
                    <div className="col-sm-2 divTableColumn">{tagEvent.tagEventType.name}</div>
                    <div className="col-sm-5 divTableColumn">
                    {
                        this.props.tagInfoModal.patient ?
                        (
                            <Button
                                bsSize="small"
                                onClick={() => this.addTagEventToPatient(tagEvent)}>
                                <strong>Přiřadit pacientovi</strong>
                            </Button>
                        ) : (
                            <Button
                                disabled
                                bsSize="small"
                                onClick={() => this.addTagEventToPatient(tagEvent)}>
                                <strong>Přiřadit pacientovi</strong>
                            </Button>
                        )
                        
                    }
                        {/* <OverlayTrigger trigger="click" rootClose placement="right" overlay={popoverLeft} onEnter={() => this.toggleModifyTagEventModal(tagEvent)}>
                            <Button bsSize="small"
                                onClick = {() => this.toggleModifyTagEventModal(tagEvent)}>
                                <strong>Upravit</strong>
                            </Button>
                        </OverlayTrigger> */}
                        <Button bsSize="small"
                            onClick = {() => this.toggleModifyTagEventModal(tagEvent)}>
                            <strong>Upravit</strong>
                        </Button>
                            {this.state.showModifyTagEventModal ? (
                                <ModifyTagEvent 
                                    onToggle = {this.toggleModifyTagEventModal}
                                    onShow = {this.state.showModifyTagEventModal}
                                /> ) : (
                                    <span></span>
                                )
                            } 
                            
                    </div>
                </div>
            )
        })

        const filteredPatientTagEvents =  this.props.tagEvents.filter(tagEvent => {
            if(tagEvent.patient && this.props.tagInfoModal.patient) {
                if(this.props.tagInfoModal.patient.id === tagEvent.patient.id) {
                    return tagEvent;
                }
            }
        });

        
        const mappedPatientTagEvents = filteredPatientTagEvents.map(tagEvent => {
            return (
                <div className="row" key={tagEvent.id}>
                    <div className="col-sm-1 divTableColumn" >{tagEvent.id}</div>
                    <div className="col-sm-3 divTableColumn">{moment(tagEvent.created).format('hh:mm:ss DD.MM.YYYY').toString()}</div>
                    <div className="col-sm-2 divTableColumn">{tagEvent.tagEventType.name}</div>
                    <div className="col-sm-2 divTableColumn">{tagEvent.tag.name}</div>
                    <div className="col-sm-4 divTableColumn">
                        <Button 
                            bsSize="small"
                            onClick={() => this.removeTagEventFromPatient(tagEvent)}>
                            <strong>Odebrat od pacienta</strong>
                        </Button>
                        {/* <OverlayTrigger trigger="click" rootClose placement="right" overlay={popoverLeft} onEnter={() => this.toggleModifyTagEventModal(tagEvent)}>
                            <Button 
                                bsSize="small"
                                onClick = {() => this.toggleModifyTagEventModal(tagEvent)}>
                                <strong>Upravit</strong>
                            </Button>
                        </OverlayTrigger> */}
                        <Button 
                            bsSize="small"
                            onClick = {() => this.toggleModifyTagEventModal(tagEvent)}>
                            <strong>Upravit</strong>
                        </Button>
                    </div>
                </div>
            )
        })

        return(
            <Modal className="modal-container" 
                            bsSize="large"
                            show={this.props.onShow}
                            onHide={this.closeInfoModal}>

                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Události tagu {this.props.tagInfoModal.name} </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <FormGroup>
                {
                    !this.props.working ? (
                        <div>
                            <b>Události pacienta</b>
                            <br/>
                            <br/>
                            <div className="row">
                                <div>
                                    {mappedPatientTagEvents.length > 0 ? (
                                        <div>
                                        <div className="col-sm-1 divTableHeader">#</div>
                                        <div className="col-sm-3 divTableHeader">Čas</div>                  
                                        <div className="col-sm-2 divTableHeader">Název</div>
                                        <div className="col-sm-2 divTableHeader">Tag</div>
                                        <div className="col-sm-4 divTableHeader">Akce</div>
                                        <hr></hr>
                                        <div>{mappedPatientTagEvents}</div>
                                    </div>
                                        
                                    ) : (
                                        <ListGroup>
                                            <ListGroupItem className = "warn" bsStyle="warning">Tento tag není přiřazen k pacientovi.</ListGroupItem>
                                        </ListGroup>
                                    )}
                                </div>
                            </div>
                            <br/> 
                        </div>
                    ) : (
                        <img className = "image" src="src/img/Spinner.svg"></img>
                    )
                    
                }
                {
                    !this.props.working ? (             
                            <div>
                                <b>Volne události</b>
                                <br/>
                                <br/>
                                <div className="row">
                                {
                                    filteredMappedTagEvents.length > 0 ? (
                                        <div>
                                            <div className="col-sm-1 divTableHeader">#</div>
                                            <div className="col-sm-4 divTableHeader">Start</div>                  
                                            <div className="col-sm-2 divTableHeader">Status</div>
                                            <div className="col-sm-5 divTableHeader">Akce</div>
                                            <hr></hr>
                                            <div>{filteredMappedTagEvents}</div>
                                        </div>
                                    ) : (
                                        <ListGroup>
                                            <ListGroupItem className = "warn" bsStyle="warning">Tento tag nema volne udalosti.</ListGroupItem>
                                        </ListGroup>
                                    )
                                }
                                </div>
                            </div>
                    ) : (
                        <img className = "image" src="src/img/Spinner.svg"></img>
                    )
                }
                </FormGroup>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.closeInfoModal}>Zavřít</Button>
                </Modal.Footer>         
            </Modal> 
        )
    }
}