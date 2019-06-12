import React from 'react';
import { connect } from 'react-redux';
import { Button, FormControl, Table, Alert, Glyphicon, ButtonGroup, FormGroup, ControlLabel, Form, ListGroup, ListGroupItem,
    OverlayTrigger, Tooltip } from 'react-bootstrap';
import {browserHistory} from 'react-router';
import axios from 'axios';
import moment from 'moment';
import IdleTimer from 'react-idle-timer';
import Confirm from 'react-confirm-bootstrap';
import { Steps, Hints } from 'intro.js-react';
import { introJs } from 'intro.js';
import { ToastContainer, toast } from 'react-toastify';

import { url, logoutTime, refreshPeriod, defaultLimitPatients } from '../appConfig';
import { deletePatientAction, openEditPatientModalAction, openTagInfoAction, closeTagInfoAction,
    saveTagEventsAction, savePatientTagEventsAction, toggleWorkingAction, saveObjectForTagInfoModalAction,
    getAllDeletedPatientsAction, showDeletedPatientsAction, getActivePatientsAction,
    getAllTagRegistrationsAction, getAllTagsAction, getTagEventTypesAction } from '../actions/actions';
import {map} from '../mappers/mapper';
import {isEmpty} from '../helpers/helpers-operations'
import SpinnerModal from './modals/spinner';
import {shortcut} from '../helpers/shortcut';


@connect((store) => {
    return {
        patients: store.PatientsReducer.patients,
        notification: store.PatientsReducer.notification,
        tagInfo: store.TagsReducer.tagInfoModal,
        deletedPatients: store.PatientsReducer.deletedPatients,
        showDeletedPatients: store.PatientsReducer.showDeletedPatients,
        isAuthenticated: store.LoginReducer.isAuthenticated,
        working: store.TagEventsReducer.working,
        fetchPatientsSuccess: store.PatientsReducer.fetchPatientsSuccess,
        fetchDeletedPatientsSuccess: store.PatientsReducer.fetchDeletedPatientsSuccess
    }
})
export default class Patients extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showDeletedPatientsModal: false,
            timeout: logoutTime,
            showHelp: false,
            limitPatients: defaultLimitPatients,
            filterCardId: '',
            filterSocialSecurityNumber: '',
            stepsEnabled: false,
            steps: [
                {
                  element: '.buttonMargin',
                  intro: 'Zde můžete vytvořit nového pacienta.',
                },
                {
                  element: '.editButton',
                  intro: 'Kliknutím můžete upravit pacienta.',
                },
                {
                    element: '.table',
                    intro: 'Zde je tabulka všech aktuálních měření. Všechny sloupce jsou až na sloupec "Číslo karty" nepovinná tzn., že mohou být prázdná. V pravé části tabulky ve sloupci "Akce" si můžeme vybrat jaký úkon chceme nad prováděným měřením udělat.',
                },
                {
                    element: '.deleteButton',
                    intro: 'Zde ukončíte měření pacienta. Tato akce je nevratná.',
                },
                {
                    element: '.showDeletedPatientButton',
                    intro: 'Tady si zobrazíte již ukončené měření.',
                },
                {
                    element: '.customNavBar',
                    intro: 'Kliknutím na FNO - Urgent můžete zaktualizovat obsah pokud je třeba. Kliknutím na Odhlásit se můžete odhlásit z aplikace.',
                },
              ]
        };
        
        this.handleRegistratePatientClick = this.handleRegistratePatientClick.bind(this);
        this.deletePatient = this.deletePatient.bind(this);
        this.toggleInfoModal = this.toggleInfoModal.bind(this);
        this.closeInfoModal = this.closeInfoModal.bind(this);    
        this.getTagEvents = this.getTagEvents.bind(this); 
        this.toggleHelpModal = this.toggleSpinnerModal.bind(this); 
        this.handleLimitPatients = this.handleLimitPatients.bind(this); 
        this.handleFilterCardId = this.handleFilterCardId.bind(this); 
        this.handleFilterSocialSecurityNumber = this.handleFilterSocialSecurityNumber.bind(this); 
        this.showDeletedPatients = this.showDeletedPatients.bind(this); 
        this.openDeletedPatientInfoPage = this.openDeletedPatientInfoPage.bind(this); 
        this.fireIntroJs = this.fireIntroJs.bind(this);
        this.notify = this.notify.bind(this);
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

    componentDidMount() {
        let basicHash = localStorage.getItem('basicHash') || null

        if(basicHash) {
            var config = {
                headers: {
                    'Authorization': localStorage.getItem('basicHash') || null
                }
            };
    
            setInterval(() => {
                axios.get(url + 'patients?showdeleted=false&maxPatients=100', config).then(res => 
                {      
                    this.props.dispatch(getActivePatientsAction(map(res.data)));
                })
                
                axios.get(url + 'tagregistrations', config).then(res => 
                {      
                    this.props.dispatch(getAllTagRegistrationsAction(res.data));  
                })
                
                axios.get(url + 'tags', config).then(res => 
                {      
                    this.props.dispatch(getAllTagsAction(map(res.data)));  
                })
        
                axios.get(url + 'tageventtypes', config).then(res => 
                {      
                    this.props.dispatch(getTagEventTypesAction(res.data));  
                })
            }, refreshPeriod);
        }
    }
   
    componentDidUpdate() {
        if(this.props.working === true) 
            this.props.dispatch(toggleWorkingAction());
    }

    componentWillMount() {
        shortcut.add("F1", () => this.handleRegistratePatientClick());
    }

    componentWillUnmount() {
        shortcut.remove("F1");
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));
      };

    fireIntroJs() {
        this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));
    }

    handleFilterCardId (event) {
        this.setState({ filterCardId: event.target.value });
    }

    handleFilterSocialSecurityNumber(event) {
        this.setState({ filterSocialSecurityNumber: event.target.value });
    }

    _onActive = () => {
        this.setState({ isIdle: false });
      }
    
    _onIdle = () => {
        console.log("Iddle - logout");
        localStorage.setItem('basicHash', null);
        console.log("Iddle - basicHash" + localStorage.getItem("basicHash"));
        this.setState({ isIdle: true });
        
        browserHistory.push('/logout');
    }

    toggleSpinnerModal() {
        this.setState({
            showHelp: !this.state.showHelp
        });
    }

    openDeletedPatientInfoPage(patient) {
        var config = {
            headers: {
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        axios.get(url + 'tagevents?patientid=' + patient.id, config).then(res => 
        {    
            this.props.dispatch(openEditPatientModalAction(patient));
            this.props.dispatch(saveTagEventsAction(map(res.data)));
            this.props.dispatch(toggleWorkingAction());  
            browserHistory.push('/patients/info');
        })
    }

    handleRegistratePatientClick() {
        browserHistory.push('/patients/new');
    };

    showDeletedPatients() {
        var config = {
            headers: {
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        this.props.dispatch(showDeletedPatientsAction());

        this.setState({
            showDeletedPatientsModal: !this.state.showDeletedPatientsModal
        });

        axios.get(url + 'patients' + '?showdeleted=true&maxPatients=' + this.state.limitPatients, config).then(res => 
        {      
            this.props.dispatch(getAllDeletedPatientsAction(map(res.data)));
        })
    }

    handleLimitPatients (event) {
        this.setState({ limitPatients: event.target.value });
    }

    deletePatient(patient) {
        
        var config = {
            headers: {
                'Accept':'',
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        axios.delete(url + 'patients/' + patient.id, config).then((res) => 
        {      
            this.props.dispatch(toggleWorkingAction());
            this.props.dispatch(deletePatientAction(patient));
            this.notify("Měření ukončeno!", "success");
        })
        .catch( error => {
            this.notify("Chyba!", "error")
        });    

    }

    getTagEvents(tag) {
        var config = {
            headers: {
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        axios.get(url + 'tagEvents', config).then(res => 
        {    
            this.props.dispatch(saveObjectForTagInfoModalAction(tag));     
            this.props.dispatch(saveTagEventsAction(map(res.data)));
            // this.props.dispatch(toggleWorkingAction());  
        })
    }

    openEditPatientPage(patient) {
        this.toggleSpinnerModal();
        var config = {
            headers: {
                'Authorization': localStorage.getItem('basicHash') || null
            }
        };

        if(patient.tag) {
            axios.get(url + 'tagevents?tagid=' + patient.tag.id, config).then(res => 
            {    
                this.props.dispatch(openEditPatientModalAction(patient));
                this.props.dispatch(saveTagEventsAction(map(res.data)));
                this.toggleSpinnerModal();
                browserHistory.push('/patients/edit');
            })
        }
        else 
        {
            axios.get(url + 'tagevents?patientid=' + patient.id, config).then(res => 
            {    
                this.props.dispatch(openEditPatientModalAction(patient));
                this.props.dispatch(savePatientTagEventsAction(map(res.data)));
                
                if(res.data.length > 0) {
                    axios.get(url + 'tagevents?tagid=' + res.data[0].tag.id, config).then(res => {
                        this.props.dispatch(saveTagEventsAction(map(res.data)));
                    })
                }
                this.toggleSpinnerModal();
                
                browserHistory.push('/patients/edit');
            })
        }
    }

    toggleInfoModal(patient) {
        if(patient) {
            this.getTagEvents(patient);
            this.props.dispatch(openTagInfoAction(patient));
        }
    }

    closeInfoModal() {
        
        this.props.dispatch(closeTagInfoAction());
    }

    render() {

        var filteredDeletedPatients = JSON.parse(JSON.stringify(this.props.deletedPatients));

        if(this.state.filterCardId !== "" && this.state.filterSocialSecurityNumber !== "") {
            filteredDeletedPatients = filteredDeletedPatients.filter(patient => {
                if(patient.card_Id.toString().indexOf(this.state.filterCardId) >= 0 &&
                patient.socialSecurityNumber.indexOf(this.state.filterSocialSecurityNumber) >= 0) {
                    return patient;
                }
            });
        }

        if(this.state.filterCardId !== "" && this.state.filterSocialSecurityNumber === "") {
            filteredDeletedPatients = filteredDeletedPatients.filter(patient => {
                if(patient.card_Id.toString().indexOf(this.state.filterCardId) >= 0) {
                    return patient;
                }

            });
        }

        if(this.state.filterCardId === "" && this.state.filterSocialSecurityNumber !== "") {
            filteredDeletedPatients = filteredDeletedPatients.filter(patient => {
                if(patient.socialSecurityNumber.toString().indexOf(this.state.filterSocialSecurityNumber) >= 0) {
                    return patient;
                }
            });
        }

        const mappedDeletedPatients = filteredDeletedPatients.map(patient => {
            return (
                <tr key={patient.id}>
                    <td className="tableDeletedPatients"> {
                        patient.firstName.length > 10 ? (
                            patient.firstName.substring(0,10)  + '...' 
                        ) : (
                            patient.firstName
                        )}
                    </td>
                    <td> {
                        patient.middleName.length > 10 ? (
                            patient.middleName.substring(0,10)  + '...' 
                        ) : (
                            patient.middleName
                        )}
                    </td>
                    <td> {
                        patient.lastName.length > 10 ? (
                            patient.lastName.substring(0,10)  + '...' 
                        ) : (
                            patient.lastName
                        )}
                    </td>
                    <td>{patient.card_Id}</td>
                    <td>{patient.birthDate ? patient.birthDate.substring(0, patient.birthDate.indexOf(" ")) : ''}</td>
                    <td>{patient.socialSecurityNumber}</td>
                    <td>{moment(patient.deleted).format("DD.MM.YYYY HH:mm:ss")}</td>
                    <td>
                        <Button 
                            bsSize="small"   
                            className="assignUnassignEvent"
                            onClick = {() => this.openDeletedPatientInfoPage(patient)}>
                            <strong>Info</strong>
                        </Button>
                    </td>
                </tr>
            )});

        
        const mappedPatients = this.props.patients.filter(patient => {
            if(patient.deleted === null) 
                return patient;
        }).map(patient => {
            return (
                <tr key={patient.id}>
                    <td> {
                        patient.firstName.length > 10 ? (
                            patient.firstName.substring(0,10)  + '...' 
                        ) : (
                            patient.firstName
                        )}
                    </td>
                    <td> {
                        patient.middleName.length > 10 ? (
                            patient.middleName.substring(0,10)  + '...' 
                        ) : (
                            patient.middleName
                        )}
                    </td>
                    <td> {
                        patient.lastName.length > 10 ? (
                            patient.lastName.substring(0,10)  + '...' 
                        ) : (
                            patient.lastName
                        )}
                    </td>
                    <td>{patient.card_Id}</td>
                    <td>{patient.birthDate ? (
                            patient.birthDate.indexOf(" ") > 0 ? (
                                patient.birthDate.substring(0, patient.birthDate.indexOf(" "))
                            ) : patient.birthDate
                        ) : ("")
                    }</td>
                    <td>{patient.socialSecurityNumber}</td>
                    <td>{patient.tag ? patient.tag.name : ''}</td>
                    <td>
                    
                        <Button 
                            bsSize="small"   
                            className="editButton"
                            onClick = {() => this.openEditPatientPage(patient)}>
                            <strong>Upravit</strong>
                        </Button>
                        <Confirm
                            onConfirm={() => this.deletePatient(patient)}
                            body="Opravdu chcete ukončit měření?"
                            confirmText="Ano"
                            cancelText="Zpět"
                            title="Ukončit">
                             <Button 
                                bsSize="small"
                                className="deleteButton">
                                <strong>Ukončit měření</strong>
                            </Button>
                        </Confirm>
                        {patient.tag ? (
                            patient.tag.battery === 0 ? ( 
                            <OverlayTrigger 
                                placement="right" 
                                overlay={<Tooltip id="tooltip">Prosím zkontrolujte <br/> nebo dobijte baterii!</Tooltip>}>
                                    <Glyphicon glyph="warning-sign" style={{fontSize: "20px"}}/>
                            </OverlayTrigger>) : (<span></span>)
                        ) : (<span></span>)}
                    </td>
                </tr>
            )
        })

        return (
            <div>
                <Steps
                    enabled={this.state.stepsEnabled}
                    steps={this.state.steps}
                    initialStep={0}
                    onExit={this.onExit}
                    />
                <IdleTimer
                        ref="idleTimer"
                        activeAction={this._onActive}
                        idleAction={this._onIdle}
                        timeout={this.state.timeout}
                        startOnLoad={true}
                        format="MM-DD-YYYY HH:MM:ss.SSS" />

                <ToastContainer/>
                {
                    localStorage.getItem("basicHash") ? (
                        <div>
                            <div className="row">
                                <h2>Měření pacienti</h2>
                                    <div className="col-sm-3">
                                        
                                    </div>
                                    <div className="col-sm-6">
                                    </div>
                                    <div className="col-sm-3">
                                        <ButtonGroup>
            
                                            <Button 
                                                className="buttonMargin"
                                                bsStyle="primary"
                                                onClick={this.handleRegistratePatientClick}>
                                                Nové měření
                                            </Button> 
                                            <Button className="buttonMargin" onClick={()=>this.fireIntroJs()}>
                                                <Glyphicon glyph="question-sign" style={{color:'white'}} />
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                    {
                                        this.state.showHelp ? (
                                            <SpinnerModal 
                                                onShow={this.state.showHelp} 
                                                onToggle={this.toggleSpinnerModal} />
                                        ) : (
                                            <span></span>
                                        )
                                    }

                            </div>
                        
                            <div className="table"> {
                                this.props.fetchPatientsSuccess ? (
                                    <Table responsive striped condensed hover style={{marginTop: '2em', verticalAlign: 'middle'}}>
                                        <thead>
                                            <tr>
                                                <th>Jméno</th>
                                                <th>Druhé jméno</th>
                                                <th>Příjmení</th>
                                                <th>Číslo karty</th>
                                                <th>Datum narození</th>
                                                <th>Rodné číslo</th>
                                                <th>Tag</th>
                                                <th>Akce</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mappedPatients}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <img className = "image" src="src/img/Spinner.svg"></img>
                                )}
                            </div>

                            <div className="row">
                                <h2>Ukončení pacienti</h2>
                                <Form inline>
                                    <FormGroup controlId="filter">
                                        <ControlLabel>Maximum záznamů</ControlLabel>
                                            <FormControl
                                                id="filter"
                                                type="text"
                                                value={this.state.limitPatients}
                                                onChange={this.handleLimitPatients}
                                                style={{width: '4em', marginRight: '2em', marginLeft: '1em'}}
                                            />
                                    </FormGroup>
        
                                    {
                                        this.props.showDeletedPatients ? (
                                            this.state.limitPatients !== defaultLimitPatients ? (
                                                <Button
                                                    bsStyle = "primary"
                                                    className = "customNavBar"
                                                    onClick = {() => {
                                                        var config = {
                                                            headers: {
                                                                'Authorization': localStorage.getItem('basicHash') || null
                                                            }
                                                        };

                                                        axios.get(url + 'patients' + '?showdeleted=true&maxPatients=' + this.state.limitPatients, config).then(res => 
                                                        {      
                                                            this.props.dispatch(getAllDeletedPatientsAction(map(res.data)));
                                                        })
                                                    }}>
                                                    Obnovit
                                                </Button>
                                            ) : (
                                                <span></span>
                                            )
                                        ) : (<span></span>)
                                    }
                                    {
                                        this.props.showDeletedPatients ? (
                                            <div>
                                                <br/>
                                                <FormGroup controlId="filter">
                                                    <ControlLabel>Číslo karty</ControlLabel>
                                                        <FormControl
                                                            id="filter"
                                                            type="text"
                                                            value={this.state.filterCardId}
                                                            onChange={this.handleFilterCardId}
                                                            style={{width: '7em', marginRight: '2em', marginLeft: '1em'}}
                                                        />
                                                </FormGroup>
                                                <FormGroup controlId="filter">
                                                    <ControlLabel>Rodné číslo</ControlLabel>
                                                        <FormControl
                                                            id="filter"
                                                            type="text"
                                                            value={this.state.filterSocialSecurityNumber}
                                                            onChange={this.handleFilterSocialSecurityNumber}
                                                            style={{width: '7em', marginRight: '2em', marginLeft: '1em'}}
                                                        />
                                                </FormGroup>
                                            </div>
                                        ) : (
                                            <span></span>
                                        )
                                    }
                                </Form>
                                <Button 
                                    className="showDeletedPatientButton"
                                    bsStyle="primary"
                                    onClick={()=>this.showDeletedPatients()}
                                    style={{marginTop:'1em'}}>
                                        {this.props.showDeletedPatients ? ('Skrýt ukončené měření') : ('Zobrazit ukončené měření')}
                                </Button>
                                {
                                    this.props.showDeletedPatients ? (
                                        <div> {
                                            this.props.fetchDeletedPatientsSuccess ? (
                                                <Table striped condensed hover style={{marginTop: '2em'}}>
                                                    <thead>
                                                    <tr>
                                                        <th>Jméno</th>
                                                        <th>Druhé jméno</th>
                                                        <th>Příjmení</th>
                                                        <th>Číslo karty</th>
                                                        <th>Datum narození</th>
                                                        <th>Rodné číslo</th>
                                                        <th>Datum smazání</th>
                                                        <th>Akce</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {mappedDeletedPatients}
                                                    </tbody>
                                                </Table>
                                            ) : (
                                                <img className = "image" src="src/img/Spinner.svg"></img>
                                            )}
                                        </div>
                                    ) : (<span></span>)
                                }
                            </div>
                        </div>
                    ) : (
                        <div>
                            <ListGroup>
                                <ListGroupItem className = "warn" bsStyle="warning">Nejste přihlášen.</ListGroupItem>
                                
                            </ListGroup>
                            <Button bsStyle="primary" onClick={() => {browserHistory.push('/login')}}>Login</Button>
                        </div>
                    )
                }
            </div>
        )
    }
}