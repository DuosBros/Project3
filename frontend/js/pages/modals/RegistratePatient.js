import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, ControlLabel, FormControl, Form, 
    Table, DropdownButton, MenuItem, Checkbox, Panel, ListGroup, ListGroupItem, Glyphicon, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {browserHistory} from 'react-router';
import axios from 'axios';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import cs from'flatpickr/dist/l10n/cs.js';
import { Steps, Hints } from 'intro.js-react';
import { introJs } from 'intro.js';
import { ToastContainer, toast } from 'react-toastify';

import {url} from '../../appConfig'
import {setActiveTagAction, addPatientAction, 
    selectTagEventAction, saveTagEventsAction, mapPatientToTagEventsAction, selectTagEventToModifyAction,
    toggleCurrentCheckBoxAction, togglePastCheckBoxAction, deleteTagEventsAction  } from '../../actions/actions'
import {isEmpty, validateCardId, validateSocialSecurityNumber} from '../../helpers/helpers-operations'
import {map} from '../../mappers/mapper';
import ModifyTagEvent from './modifyTagEvent';
import { shortcut } from '../../helpers/shortcut';
import SpinnerModal from './../modals/spinner';

@connect((store) => {
    return {
        tags: store.TagsReducer.tags,
        tagEvents: store.TagEventsReducer.tagEvents,
        activeTag: store.TagsReducer.activeTag,
        patients: store.PatientsReducer.patients,
        patientToEdit: store.PatientsReducer.patientToEdit,
        toggleCurrentCheckbox: store.PatientsReducer.toggleCurrentCheckbox,
        togglePastCheckbox: store.PatientsReducer.togglePastCheckbox,
        working: store.TagEventsReducer.working,
        showModifyTagEvent: store.TagEventsReducer.modifyTagEventModal
    }
})
export default class RegistratePatient extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showTag: false,
            card_Id: "",
            firstName: "",
            middleName: "",
            lastName: "",
            socialSecurityNumber: "",
            birthDate: "",
            tag: {},
            startDate: moment().subtract(7,'d').toDate(),
            endDate: moment().toDate(),
            showFilter: false,
            tagEvents: [],
            showModifyTagEventModal: false,
            filterByDate: true,
            selectedTag: {},
            selectTagChanged: false,
            showSpinner: false,
            stepsEnabled: false,
            steps: [
                {
                  element: '.panel-body',
                  intro: 'Zde vyplňujete údaje o pacientovi. Nezapomeňte, že nebudete moc vytvořit pacienta dokud všechna červena místa nezmizí.',
                },
                {
                    element: '.cardId',
                    intro: 'Číslo karty je jedno z povinných míst. Vepište prosím jakékoliv číslo pro pokračování.',
                },
                {
                    element: '.checkBoxGroup',
                    intro: 'Zde si vyberete o jakou akci se jedná. Klikněte na některé políčko pro zobrazení dalších částí.',
                },
                {
                  element: '.currentCheckbox',
                  intro: 'Přítomnost znamená, že začínáme měřit společně s příchodem pacienta.',
                },
                {
                    element: '.pastCheckbox',
                    intro: 'Retrospektivně znamená, že měření je již reálně ukončeno a přejete si vytvořit zpětně pacienta a přiřadit mu události.',
                },
                {
                    element: '.tagDropDown',
                    intro: 'Kliknutím vyberete jaký tag chcete pacientovi přidat. Výběr tagů se liší v závislosti na tom jakou akci jste vybrali.',
                },
                {
                    element: '.filterDate',
                    intro: 'Zde můžete filtrovat události na základě data.',
                },
                {
                    element: '.TagEventsPanel',
                    intro: 'V tomto panelu můžete upravit tlačítkem Upravit či vybrat událost, kterou přiřadit novému pacientovi tlačítkem Vybrat.',
                },
              
              ]
          };
        
        this.mergeTagsAndPatients = this.mergeTagsAndPatients.bind(this);
        this.handleTagSelectionClick = this.handleTagSelectionClick.bind(this);
        this.toggleSpinnerModal = this.toggleSpinnerModal.bind(this); 
        this.handlecardIdChange = this.handlecardIdChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleMiddleNameChange = this.handleMiddleNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleSocialSecurityNumber = this.handleSocialSecurityNumber.bind(this);
        this.handleBirthdate = this.handleBirthdate.bind(this);
        this.handleAddPatientClick = this.handleAddPatientClick.bind(this);
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.handleSelectDropDownItem = this.handleSelectDropDownItem.bind(this);  
        this.checkRadio = this.checkRadio.bind(this);  
        this.selectPastRB = this.selectPastRB.bind(this);  
        this.selectCurrentRB = this.selectCurrentRB.bind(this);  
        this.checkTagEvents = this.checkTagEvents.bind(this);  
        this.fireIntroJs = this.fireIntroJs.bind(this);
        this.notify = this.notify.bind(this);
    }

    componentWillMount() {
        
        this.props.togglePastCheckbox ? this.props.dispatch(togglePastCheckBoxAction()) : <span></span>    
        this.props.toggleCurrentCheckbox ? this.props.dispatch(toggleCurrentCheckBoxAction()) : <span></span>
        this.props.dispatch(deleteTagEventsAction());
        shortcut.add("esc", () => browserHistory.goBack());
            
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

    componentWillUnmount() {
        shortcut.remove("esc");
    }

    fireIntroJs() {
        this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));
    };
      
    toggleSteps = () => {
        this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
    };

    toggleSpinnerModal() {
        this.setState({
            showSpinner: !this.state.showSpinner
        });
    }

    mergeTagsAndPatients() {
        const result =  this.props.tags.map(tag => {
            const pat =  this.props.patients.filter(patient => {
                if(!isEmpty(patient.tag)) 
                    return patient.tag.id === tag.id
            });

            if(pat[0]) {
                tag.patient = pat[0];
            }

            return tag;
        });

        return result;
    }

    handleChangeStart(date) {
        this.setState({
            startDate: date
        });
    }

    handleChangeEnd(date) {
        if(date.date.length === 2) {
            this.setState({
                startDate: date.date[0],
                endDate: date.date[1],
                filterByDate: true
            });
        }
    }
    
    handleTagSelectionClick(tagPica) {
        this.toggleSpinnerModal();

        var config = {
            headers: {
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        axios.get(url + 'tagevents?tagid=' + tagPica.id, config).then(res => 
        {                       
            this.props.dispatch(saveTagEventsAction(map(res.data)));
            this.props.dispatch(setActiveTagAction(tagPica));
            this.toggleSpinnerModal();
        })  
    }

    handleAddPatientClick(patient) {
        
        var config = {
            headers: {
                'Accept':'',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        if(!isEmpty(this.props.activeTag)) {
            patient.tag = this.props.activeTag;
        }
        else {
            delete patient.tag;
        }
        
        if(!!patient.birthDate) {
            patient.birthDate = moment(patient.birthDate).format('DD.MM.YYYY');
        }

        axios.post(url + (this.props.toggleCurrentCheckbox ? 'patients?action=current' : 'patients?action=past'), patient, config).then(res => 
        {   
            
            this.props.dispatch(addPatientAction(res.data));
            this.props.dispatch(mapPatientToTagEventsAction(this.props.tagEvents, res.data.id));

            const filteredTagEvents = this.props.tagEvents.filter(tagEvent => {
                return tagEvent.patient_Id === res.data.id;
            });

            if(filteredTagEvents.length > 0) {
                axios.put(url + 'tagevents', filteredTagEvents, config).then(res => {
                    browserHistory.push('/patients');
                    this.notify("Pacient vytvořen a události přiřazeny!", "success");
                });
            }
            else {
                //this.props.dispatch(triggerNotification(notification));
                browserHistory.push('/patients');
                this.notify("Pacient vytvořen!", "success");
            }
        })    
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

        if(event.target.value.length >= 6) {
            var day = parseInt(event.target.value.substr(4,2));
            var month = parseInt(event.target.value.substr(2,2));
            var year = parseInt(event.target.value.substr(0,2));
    
            if(month > 50) {
                month = month - 50;
            }
    
            month--;
    
            if(year >= 54) {
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

    handleBirthdate (event) {
        this.setState({
            birthDate: event.date[0]
        });
    }

    handleTagEventClick(tagEvent) {
        this.props.dispatch(selectTagEventAction(tagEvent));
    }

    toggleModifyTagEventModal(tagEvent) {
        if(tagEvent) {
            this.props.dispatch(selectTagEventToModifyAction(tagEvent));
        }
    }

    checkRadio() {
        if (this.props.toggleCurrentCheckbox || this.props.togglePastCheckbox) {
            // shortcut.add("enter", () => this.handleAddPatientClick(this.state));
            return 'success';
        }
        else {
            // shortcut.remove("enter");
            return 'error';
        }
        return null;
    }

    selectCurrentRB() {
        if(this.props.tagEvents.length > 0) {
            this.props.dispatch(deleteTagEventsAction());
        }

        if(this.state.selectedTag) {
            this.setState({
                selectedTag: "",
                selectTagChanged: false
            }); 
        }

        this.props.dispatch(toggleCurrentCheckBoxAction());
        this.props.togglePastCheckbox ? this.props.dispatch(togglePastCheckBoxAction()) : <span></span>
    }

    selectPastRB() {
        if(this.props.tagEvents.length > 0) {
            this.props.dispatch(deleteTagEventsAction());
        }

        if(this.state.selectedTag) {
            this.setState({
                selectedTag: "",
                selectTagChanged: false
            }); 
        }
        this.props.dispatch(togglePastCheckBoxAction());
        this.props.toggleCurrentCheckbox ? this.props.dispatch(toggleCurrentCheckBoxAction()) : <span></span>
    }

    handleSelectDropDownItem(event) {
        var tag = this.props.tags.filter(tag => {
            return tag.name === event
        });

        if(tag[0]) {
            this.handleTagSelectionClick(tag[0]);
        }
        
        this.setState({
            selectedTag: event,
            selectTagChanged: true
        });
    }

    checkTagEvents() {
        var tagEvents = this.props.tagEvents.filter(tagEvent => {
            return tagEvent.selected === true;
        })

        if (tagEvents.length > 0) {
            return true;
        }
        else {
            return false;
        }
        return null;
    }

    render() {

        var filteredTagEvents;

        if(this.state.filterByDate) {
            var start = this.state.startDate;
            var end = this.state.endDate;
            
            filteredTagEvents = this.props.tagEvents.filter(tagEvent => {
                var created = new Date(tagEvent.created_Modified);
                if(!tagEvent.patient && created > start && created < end) {
                   return tagEvent 
                }
            })
        }
        else {
            filteredTagEvents = this.props.tagEvents.filter(tagEvent => {
                return tagEvent.patient === null;
            })
        }

        

        const mappedTagEvents = filteredTagEvents.map(tagEvent => {
            if(tagEvent.selected === true) {
                return (
                    <tr key={tagEvent.id}>
                        <td style={{background: '#dff0d8'}}>{moment(tagEvent.created_Modified).format('HH:mm:ss DD.MM.YYYY').toString()}</td>
                        <td style={{background: '#dff0d8'}}>{tagEvent.tagEventType.note}</td>
                        <td>
                            <Button 
                                className="assignUnassignEvent"
                                bsSize="small"
                                onClick={() => this.handleTagEventClick(tagEvent)}
                                style={{minWidth: '2em', marginRight: '1em'}}>
                                <strong>Odebrat</strong>
                            </Button>
                            <Button 
                                className="editButton" 
                                bsSize="small"
                                onClick = {() => this.toggleModifyTagEventModal(tagEvent)}
                                style={{minWidth: '2em', marginRight: '1em'}}>
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
            }
            else {
                return (
                    <tr key={tagEvent.id}>
                        <td>{moment(tagEvent.created_Modified).format('HH:mm:ss DD.MM.YYYY').toString()}</td>
                        <td>{tagEvent.tagEventType.note}</td>
                        <td>
                            <Button 
                                className="assignUnassignEvent"
                                bsSize="small"
                                onClick={() => this.handleTagEventClick(tagEvent)}
                                style={{minWidth: '2em', marginRight: '1em'}}>
                                <strong>Vybrat</strong>
                            </Button>
                            <Button
                                className="editButton" 
                                bsSize="small"
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
            }
        })

        
        
        const mergedTagsAndPatients = this.mergeTagsAndPatients();

        const tooltip = (
            <Tooltip id="tooltip">
                Zkontrolujte <br/> nebo dobijte baterii!
            </Tooltip>
        );

        const mappedTagButtons = mergedTagsAndPatients.filter(object => {
            if(this.props.toggleCurrentCheckbox) {
                return object.patient == null;
            }
            else {
                return object;
            }
        }).map(tag => {
            if(this.props.toggleCurrentCheckbox) {
                if(tag.battery === 1) {
                    return (
                        <MenuItem key={tag.id} eventKey={tag.name}>{tag.name}</MenuItem>
                    )
                }
                else {
                    return (
                        <OverlayTrigger key={tag.id} placement="right" overlay={tooltip}>
                            <MenuItem key={tag.id} eventKey={tag.name} disabled>{tag.name}</MenuItem>
                        </OverlayTrigger>
                    )
                }
            }
            else {
                return (
                    <MenuItem key={tag.id} eventKey={tag.name}>{tag.name}</MenuItem>
                )
            }
        })

        let tagEvents = null;
        if (filteredTagEvents.length > 0) {
            tagEvents = (
                <Form inline>
                    <br/>
                    <br></br>
                 
                    <Flatpickr 
                        onChange={date => { this.handleChangeEnd({date})}}
                        options={{ locale: 'cs',mode: "range", dateFormat: 'd.m.Y', wrap: true}}>
                        <input type='text' data-input className="filterDate" style={{width: '50%'}}placeholder="Filtrovat události.."/>
                        <br/>
                    </Flatpickr>
                    {this.props.togglePastCheckbox ? (this.checkTagEvents() ? (<b><font color = "#fff">Vyberte minimálně 1 událost.</font></b>) : (<b><font color = "#a94442">Vyberte minimálně 1 událost.</font></b>)) : (<span></span>)}
                    <Table responsive striped condensed hover style={{marginTop: '2em'}}>
                        <thead>
                        <tr>
                            <th>Čas</th>
                            <th>Název</th>
                            <th>Akce</th>
                        </tr>
                        </thead>
                        <tbody>
                            {mappedTagEvents}
                        </tbody>
                    </Table>                 
                </Form>
            );
        } 
        else {
            if(this.state.filterByDate) {
                tagEvents = (
                    <Form inline>
                         <br/>
                         <br></br>
                         <Flatpickr 
                            onChange={date => { this.handleChangeEnd({date})}}
                            options={{ locale: 'cs',mode: "range", dateFormat: 'd.m.Y', wrap: true, defaultDate: [this.state.startDate, this.state.endDate] }}>

                            <input type='text' data-input className="dateForm"/>

                            <Button style={{marginTop:'1em'}} data-clear onClick={() =>  this.setState({filterByDate: false})}>
                                Vymazat datum
                            </Button>
                        </Flatpickr>
                     </Form>
                )
            }
            else {
                tagEvents = ( 
                    <ListGroup>
                        <ListGroupItem className = "warn" bsStyle="warning">Tento tag nemá volné události.</ListGroupItem>
                    </ListGroup>
                )
            }
        }

        return (
            <div className='row'>
                <Steps
                    enabled={this.state.stepsEnabled}
                    steps={this.state.steps}
                    initialStep={0}
                    onExit={this.onExit}/>

                <ToastContainer />
                <div className="col-sm-4">
                        <div className="panel panel-primary">
                            <div className="panel-heading clearfix" style={{paddingTop: '1em'}}> 
                                <h4 className="panel-title" >{<b>Registrace nového pacienta</b>}
                                <Button 
                                    onClick={()=>this.fireIntroJs()} 
                                    className="btn btn-primary" 
                                    style={{float: 'right', paddingTop: '1em'}}>
                                     <Glyphicon glyph="question-sign" style={{color:'white'}} />
                                </Button>
                               </h4>
                            </div>

                            <div className="panel-body">
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
                                    <FormGroup className="checkBoxGroup" validationState={this.checkRadio()} style={{marginTop: '15px'}}>
                                        <Checkbox className="currentCheckbox" name="radioGroup" checked={this.props.toggleCurrentCheckbox} inline onChange={this.selectCurrentRB}>
                                            <div style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px', fontWeight: '700'}}>Přítomnost</div>
                                        </Checkbox>
                                        <Checkbox className="pastCheckbox" name="radioGroup" checked={this.props.togglePastCheckbox} inline onChange={this.selectPastRB}>
                                            <div style={{display: 'inline-block', maxWidth: '100%', marginBottom: '5px', fontWeight: '700'}}>Retrospektivně</div>
                                        </Checkbox>
                                        <br/>
                                        {this.checkRadio()  === "success" ? (<span></span>) : (<b><font color = "#a94442">Vyberte akci.</font></b>)}
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
                                        <br/>
                                    </FormGroup>
                                    <FormGroup validationState={validateSocialSecurityNumber(this.state.socialSecurityNumber)}>
                                        <ControlLabel>Rodné číslo</ControlLabel>
                                        <FormControl
                                            id="socialSecurityNumber"
                                            type="text"
                                            value={this.state.socialSecurityNumber}
                                            onChange={this.handleSocialSecurityNumber}
                                        />
                                        {
                                        validateSocialSecurityNumber(this.state.socialSecurityNumber) === "success" || validateSocialSecurityNumber(this.state.socialSecurityNumber) === null ? (<span></span>) : (
                                            <b><font color = "#a94442">Rodné číslo musí být číslo s nebo bez lomítka.</font></b>)}
                                        <br/>
                                        <ControlLabel>Datum narození</ControlLabel>
                                        <Flatpickr 
                                            value={this.state.birthDate}
                                            onChange={date => { this.handleBirthdate({date})}}
                                            className="dateForm"
                                            options={{ locale: 'cs', dateFormat: 'd.m.Y', maxDate: 'today'}}/>
                                        <br/>
                                        {
                                            this.props.togglePastCheckbox ? (
                                                validateCardId(this.state.card_Id) === "success" 
                                                && this.state.selectTagChanged && 
                                                this.checkRadio() === "success" && this.checkTagEvents()  && 
                                                ( validateSocialSecurityNumber(this.state.socialSecurityNumber) === "success" || validateSocialSecurityNumber(this.state.socialSecurityNumber) === null) ? (
                                                    <Button bsStyle="primary" style={{marginRight: '1em'}} onClick = {() => this.handleAddPatientClick(this.state)}>Uložit pacienta</Button>
                                                ) : (
                                                    <Button disabled style={{marginRight: '1em'}} bsStyle="primary" onClick = {() => this.handleAddPatientClick(this.state)}>Uložit pacienta</Button>
                                                )
                                            ) : (
                                                validateCardId(this.state.card_Id)  === "success" 
                                                && this.state.selectTagChanged && 
                                                this.checkRadio() === "success" && 
                                                ( validateSocialSecurityNumber(this.state.socialSecurityNumber) === "success" || validateSocialSecurityNumber(this.state.socialSecurityNumber) === null) ? (
                                                    <Button bsStyle="primary" style={{marginRight: '1em'}} onClick = {() => this.handleAddPatientClick(this.state)}>Uložit pacienta</Button>
                                                ) : (
                                                    <Button disabled style={{marginRight: '1em'}} bsStyle="primary" onClick = {() => this.handleAddPatientClick(this.state)}>Uložit pacienta</Button>
                                                )
                                            )
                                        }
                                        <Button onClick = {() => browserHistory.goBack()}>Zpět</Button>
                                    </FormGroup>
                                </form>
                            </div>
                    </div>
                </div>
                <div className="col-sm-8">
                    {
                        this.state.showSpinner ? (
                            <SpinnerModal 
                                onShow={this.state.showSpinner} 
                                onToggle={this.toggleSpinnerModal} />
                        ) : (
                            <span></span>
                        )
                    }
                    {this.props.toggleCurrentCheckbox || this.props.togglePastCheckbox ? (
                        <Panel header={<b>Přiřadit tag</b>} bsStyle="primary">
                        {
                            this.props.tags.length > 0 ? 
                            (
                                <div>
                                    <div className="col-sm-12">
                                        <div>
                                            <DropdownButton 
                                                disabled = {this.checkRadio() === "success" ? false : true}
                                                title={this.state.selectTagChanged ? this.state.selectedTag : "Vybrat..."} 
                                                id="bg-nested-dropdown"
                                                className="tagDropDown"
                                                onSelect = {this.handleSelectDropDownItem}>
                                                {mappedTagButtons}
                                            </DropdownButton>
                                            {this.state.selectTagChanged ? (<span></span>) : (<div><b><font color = "#a94442">Přidejte tag.</font></b></div>)}
                                        </div>
                                    </div>
                                </div>
                            ) : (  
                                <span>No empty tags</span>
                            )

                            
                        }
                        </Panel>
                    ) : (
                        <span></span>
                    )}
                    {this.state.selectTagChanged ? (
                        <Panel className="TagEventsPanel" header={<b>Události tagu</b>} bsStyle="primary">
                            {this.props.working ? (
                                <img className = "image" src="src/img/Spinner.svg"></img>
                            ) : (
                                tagEvents
                            )}
                            
                        </Panel>
                    ) : (
                        <span></span>
                    )}
                   
                </div>
                
            </div>
        )
    }
}

