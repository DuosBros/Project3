import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, ControlLabel, Modal, DropdownButton, MenuItem } from 'react-bootstrap';
import {browserHistory} from 'react-router';
import axios from 'axios';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import { ToastContainer, toast } from 'react-toastify';

import {url} from '../../appConfig'
import { editTagEventAction, selectTagEventToModifyAction} from '../../actions/actions'
import {isEmpty, buildAuthorizationHeader} from '../../helpers/helpers-operations'
import { shortcut } from '../../helpers/shortcut';

@connect((store) => {
    return {
        tagEventToModify: store.TagEventsReducer.modifyTagEventModal,
        tagEventTypes: store.TagEventTypesReducer.tagEventTypes
    }
})
export default class ModifyTagEvent extends React.Component {
    constructor(props) {
        super(props);

        this.handleChangeTagEvent = this.handleChangeTagEvent.bind(this);        
        this.toggleModal = this.toggleModal.bind(this);
        this.handleCreatedChange = this.handleCreatedChange.bind(this);
        this.handleSelectDropDownItem = this.handleSelectDropDownItem.bind(this);
        this.notify = this.notify.bind(this);

        this.state = {
            note: "",
            created_Modified: "",
            noteChanged: false,
            created_ModifiedChanged: false
        };
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

    handleCreatedChange(event) {
        this.setState({
            created_Modified: event.date[0],
            created_ModifiedChanged: true
        });
    }

    toggleModal() {
        this.props.dispatch(selectTagEventToModifyAction({}));
        this.props.onToggle();
    }

    handleChangeTagEvent() {
        
        var deepCloned = JSON.parse(JSON.stringify(this.props.tagEventToModify));
        var clonedTagEventTypes = JSON.parse(JSON.stringify(this.props.tagEventTypes));

        var noteToFind = this.state.noteChanged ? this.state.note : deepCloned.tagEventType.note;

        var foundTagEventType = clonedTagEventTypes.filter(tagEventType => {
            return tagEventType.note === noteToFind 
        });

        
        deepCloned.tagEventType = foundTagEventType[0];
        deepCloned.created_Modified = this.state.created_ModifiedChanged ? this.state.created_Modified : deepCloned.created_Modified;
        deepCloned.tagEventType_Id = foundTagEventType[0].id;
        
        var config = buildAuthorizationHeader("put");

        if(!config) {
            return;
        }

        var pica = [];
        pica.push(deepCloned);

        this.props.dispatch(editTagEventAction(deepCloned));    

        axios.put(url + 'tagevents', pica, config).then(res => 
        {     
            this.notify("Událost změněna!", "success");
        })
        .catch( function(error) {
            this.notify("Chyba!", "error");
        });
        
        this.props.dispatch(selectTagEventToModifyAction({}));
        this.props.onToggle();
    }

    handleSelectDropDownItem(event) {
        this.setState({
            noteChanged: true,
            note: event
        });
    }

    render() {
        Date.prototype.addHours= function(h){
            this.setHours(this.getHours()+h);
            return this;
        }

        var mappedTagEventTypes = this.props.tagEventTypes.map(tagEventType => {
            return (
                <MenuItem key={tagEventType.id} eventKey={tagEventType.note}>{tagEventType.note}</MenuItem>
            )
        });

        return (
            <Modal className="modal-container" 
                bsSize="small"
                show={this.props.onShow}
                onHide={this.toggleModal}
                backdrop= "static"
                keyboard={true}>

                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">Editace události</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {this.props.tagEventToModify ? (
                        <form>
                            <FormGroup>
                                <ControlLabel>Status</ControlLabel>
                                <br/>
                                <DropdownButton 
                                    title={this.state.noteChanged ? this.state.note : this.props.tagEventToModify.tagEventType.note} 
                                    id="bg-nested-dropdown"
                                    onSelect = {this.handleSelectDropDownItem}>
                                    {mappedTagEventTypes}
                                </DropdownButton>
                                <br/>
                                <ControlLabel>Čas události</ControlLabel>
                                <br/>
                                <div>
                                    <Flatpickr 
                                        data-enable-time
                                        value={this.state.created_ModifiedChanged ? 
                                            this.state.created_Modified : 
                                            new Date(moment(this.props.tagEventToModify.created_Modified).local())}
                                        onChange={date => { this.handleCreatedChange({date})}}
                                        options={{time_24hr: true, locale: 'cs', dateFormat: 'H:i:S d.m.Y'}}
                                        className="tagEventModifyDate"
                                    />
                                </div>
                            </FormGroup>
                        </form>
                    ) : (
                        <span></span>
                    )}
                    
                </Modal.Body>

                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.handleChangeTagEvent}>Změnit</Button>
                    <Button onClick={this.toggleModal}>Zavřít</Button>
                </Modal.Footer>         
            </Modal> 
        )
    }
}