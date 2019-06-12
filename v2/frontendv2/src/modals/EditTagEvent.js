import React from 'react';
import { Button, Modal, Dropdown } from 'semantic-ui-react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import '../../node_modules/flatpickr/dist/flatpickr.css';
import './EditTagEvent.css'
// eslint-disable-next-line
import cs from '../../node_modules/flatpickr/dist/l10n/cs';


import {toggleEditTagEventModalAction} from '../pages/home/detail/PatientDetailAction';
import {getAllTagEventTypes} from '../pages/common/TagEventTypeAxios';
import {fetchTagEventTypesAction} from '../pages/common/TagEventTypeAction';
import {saveTagEvent} from './EditTagEventAxios';
import {isEmpty} from '../helpers/helpers';

class EditTagEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tagEventToModify : props.patientDetailStore.tagEventToModify,
            created : '',
            createdChanged: false,
            noteChanged: false,
            note : '',
            date: new Date()
        }

        if(props.tagEventTypeStore.tagEventTypes.length === 0) {
            getAllTagEventTypes().then((res, err) => {
                props.fetchTagEventTypesAction(res.data);
            })
        }

        this.changeDate = this.changeDate.bind(this);
        this.changeDropdownItem = this.changeDropdownItem.bind(this);
        this.handleSaveTagEvent = this.handleSaveTagEvent.bind(this);
    }

    handleSaveTagEvent() {
        var result = [];

        var tagEventToModify = this.state.tagEventToModify;

        if(this.state.createdChanged === true) {
            tagEventToModify.created = moment(this.state.created).toISOString();
            tagEventToModify.modified = moment().utc().toISOString();
        }

        if(this.state.noteChanged === true) {
            var foundTagEventType = this.props.tagEventTypeStore.tagEventTypes.filter(tagEventType => {
                return tagEventType.note === this.state.note
            });

            if(isEmpty(foundTagEventType)) {
                throw new Error("Could not find TagEventType")
            }

            tagEventToModify.tagEventType = foundTagEventType[0]
        }

        result.push(tagEventToModify);

        saveTagEvent(result)
            .then(() => this.props.toggleEditTagEventModalAction())
            .catch(err => console.log(err));
    }

    changeDate(event) {
        this.setState({
            created: event.date[0],
            createdChanged: true
        });
    }

    changeDropdownItem = (e, { name, value }) => this.setState({ note: value, noteChanged: true })

    render() {
        const mappedTagEventTypes = this.props.tagEventTypeStore.tagEventTypes.map(tagEventType => {
            var mappedtagEventType = {key:tagEventType.id, text:tagEventType.note, value:tagEventType.note}
            return mappedtagEventType
        });

        return (
            <Modal
                size='mini'
                open={this.props.patientDetailStore.showEditTagEventModal}
                closeOnEscape={true}
                closeOnDimmerClick={false}
                closeIcon={true}
                onClose={() => this.props.toggleEditTagEventModalAction()}
            >
            <Modal.Header>Úprava události tagu</Modal.Header>
            <Modal.Content>
                <Dropdown search selection options={mappedTagEventTypes}
                    value={
                        this.state.noteChanged ? this.state.note :
                        this.state.tagEventToModify.tagEventType.note}
                    onChange={this.changeDropdownItem}/>
                <br></br>
                <Flatpickr
                    data-enable-time
                    value={
                        this.state.createdChanged ?
                        this.state.created : new Date(moment(this.state.tagEventToModify.created).local())}
                        onChange={date => { this.changeDate({date}) }}
                    options={{time_24hr: true, locale: 'cs', dateFormat: 'H:i:S d.m.Y'}}
                    className="tagEventModifyDate"
                />
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={() => this.props.toggleEditTagEventModalAction()} style=
              {{backgroundColor: '#9a3334', color:'white'}} >
                Zpět
              </Button>
              <Button
                onClick={() => this.handleSaveTagEvent()}
                positive
                labelPosition='right'
                icon='checkmark'
                content='Uložit'
                style={{backgroundColor: '#efe1ba',color:'black'}}
                disabled = {this.state.noteChanged || this.state.createdChanged ? false : true}
              />
            </Modal.Actions>
          </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        patientDetailStore: state.PatientDetailReducer,
        tagEventTypeStore: state.TagEventTypeReducer
    };
  }

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleEditTagEventModalAction : toggleEditTagEventModalAction,
        fetchTagEventTypesAction : fetchTagEventTypesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTagEvent);