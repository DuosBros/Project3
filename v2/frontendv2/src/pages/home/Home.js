import React from 'react';
import { connect } from 'react-redux';
import { Header, Grid, Button, Icon, Table, Form, Divider, Popup, Image, Modal, Message } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import moment from 'moment';
import { Steps } from 'intro.js-react';

import '../../index.css';
import {
    toggleProductDetailModalAction, deletePatientAction,
    fetchActivePatientsAction, toggleDeletedPatientsAction, fetchDeletedPatientsAction, getPatientsLocationsAction
} from './HomeAction';
import { getAllPatients, deletePatient, getPatientsLocations } from './HomeAxios';
import { loginFailedAction, loginSuccessAction } from '../login/LoginAction';
import { addSelectedProperty, isNum, isEmpty, addModifiedProperty } from '../../helpers/helpers';
import { defaultLimitPatients } from '../../appConfig';
import { checkAuth } from '../login/LoginAxios';
import { getTagEventsByPatientId, getTagEventsByTagId } from '../common/TagEventAxios';
import { fetchDeletedPatientTagEventsAction, fetchTagEventsByTagIdAction } from '../common/TagEventAction';
import { openPatientDetailAction } from './detail/PatientDetailAction';
import { toggleSpinnerAction } from '../common/SpinnerAction';
import spinner from '../../../src/Spinner.svg';
import { openPatientEditAction } from './edit/PatientEditAction';
import '../../../node_modules/intro.js/minified/introjs.min.css'

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            stepsEnabled: false,
            steps: [
                {
                    element: '.container',
                    intro: 'Vítejte v nápovědě. Tento interaktivní tutoriál Vás provede touto aplikací. Navigovat se můžete tlačítky "Next (Dále)", "Back (Zpět)" nebo "Skip (Přeskočit)". V případě dotazů nebo problémů kontaktujte jaromir.konecny@vsb.cz nebo an.tran@volny.cz'
                },
                {
                    element: '.patients',
                    intro: 'Toto je hlavní záložka, kde najdete všechny úkony ohledně pacientů a měření.'
                },
                {
                    element: '.reports',
                    intro: 'Zde se nacházejí grafy vycházející z uložených měření.'
                },
                {
                    element: '.logout',
                    intro: 'Kliknutím na "Odhlášení" se můžete odhlásit z aplikace.',
                },
                {
                    element: '.createPatient',
                    intro: 'Zde můžete vytvořit nového pacienta.',
                },
                {
                    element: '.help',
                    intro: 'Kliknutím si můžete otevřít kdykoliv znova nápovědu.',
                },
                {
                    element: '.table',
                    intro: 'Zde je tabulka všech aktuálních měření. Všechny sloupce jsou až na sloupec "Číslo karty" nepovinná tzn., že mohou být prázdná. V pravé části tabulky ve sloupci "Akce" si můžeme vybrat jaký úkon chceme nad prováděným měřením udělat.',
                },
                {
                    element: '.edit',
                    intro: 'Tímhle upravíte zvoleného pacienta či jeho/její měření.',
                },
                {
                    element: '.deleteButton',
                    intro: 'Zde ukončíte měření pacienta. Tato akce je nevratná.',
                },
                {
                    element: '.showDeletedPatientButton',
                    intro: 'Tady si zobrazíte již ukončené měření, které můžete libovolně filtrovat.',
                },
                {
                    element: '.infoButt',
                    intro: 'Kliknutím si můžete otevřít detail ukončeného měření. V detailu nelze již nic měnit kromě jednotlivých událostí',
                },
                {
                    element: '.filterForm',
                    intro: 'Zde můžete filtrovat ukončená měření.',
                },
                {
                    element: '.maxRes',
                    intro: 'Pokud hledáte starší záznamy, navyšte toto číslo a zmáčkněte tlačítko pro obnovení.',
                },
                {
                    element: '.refresh',
                    intro: 'Obnovení záznamů (viz. předchozí krok).',
                }

            ],
            filterSocialSecurityNumber: '',
            filterCardId: '',
            maxResult: defaultLimitPatients,
            refreshTriggered: false,
            showDeleteModal: false

        };

        this.fireIntroJs = this.fireIntroJs.bind(this);
        this.showDeletedPatients = this.showDeletedPatients.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openDeletedPatientInfoPage = this.openDeletedPatientInfoPage.bind(this);
        this.refreshDeletedPatients = this.refreshDeletedPatients.bind(this);
        this.openEditPatientPage = this.openEditPatientPage.bind(this);
        this.handleCreatePatient = this.handleCreatePatient.bind(this);
        this.deletePatient = this.deletePatient.bind(this);
    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));

        this.props.toggleDeletedPatientsAction();
        // this.setState(() => ({ maxResult: defaultLimitPatients }));
        // this.props.toggleDeletedPatientsAction();
    };

    fireIntroJs() {
        this.setState(() => ({ maxResult: this.state.maxResult + 1 }));
        this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));

        this.showDeletedPatients();
    }

    handleCreatePatient() {
        browserHistory.push('/patients/create')
    }

    openEditPatientPage(patient) {
        var that = this.props;

        if (!isEmpty(patient.tag)) {
            getTagEventsByPatientId(patient.id).then(res => {
                that.fetchDeletedPatientTagEventsAction(addModifiedProperty(res.data));

                getTagEventsByTagId(patient.tag.id).then(res => {
                    that.fetchTagEventsByTagIdAction(addModifiedProperty(res.data));
                    // this.toggleSpinnerModal();
                    browserHistory.push('/patients/edit');
                })
                    .catch(err => console.log(err))
            }).catch(err => console.log(err))
        }
        else {
            getTagEventsByPatientId(patient.id).then(res => {
                that.fetchDeletedPatientTagEventsAction(addModifiedProperty(res.data));

                if (res.data.length > 0) {
                    getTagEventsByTagId(res.data[0].tag.id).then(res => {
                        that.fetchTagEventsByTagIdAction(addModifiedProperty(res.data));
                        browserHistory.push('/patients/edit');
                    })
                        .catch(err => console.log(err))
                }

                // this.toggleSpinnerModal();
            })
                .catch(err => console.log(err))
        }

        that.openPatientEditAction(patient);
    }

    componentWillUnmount() {
        clearInterval(this.refreshId);
    }

    componentDidMount() {
        // this.refreshId = setInterval(() => {
        //     getAllPatients(false, defaultLimitPatients)
        //         .then((res, err) => {
        //             const patients = addSelectedProperty(res.data);
        //             this.props.fetchActivePatientsAction({ success: true, data: patients });
        //             return ({ success: true, data: patients });
        //         })
        //         .then((res) => {
        //             if (res.data.length === 0) {
        //                 return false
        //             }

        //             if (res) {
        //                 var ids = res.data.map(x => x.id);
        //                 var string = ids.join(",")
        //                 return getPatientsLocations(string)
        //             }
        //         })
        //         .then((res) => {
        //             if (res !== false) {
        //                 this.props.getPatientsLocationsAction({ success: true, data: res.data })
        //                 return true
        //             }
        //             else {
        //                 return false
        //             }
        //         })
        //         .then(res => {
        //             if (res) {
        //                 this.lastUpdate = moment().local().format("HH:mm:ss")
        //             }
        //         })

        // }, 3000);
    }

    componentWillMount() {
        this.props.toggleSpinnerAction();
        var that = this.props;

        checkAuth().then((res) => {
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

        this.getAllPatientsAndLocationsAndHandleResult(true)
    }

    getAllPatientsAndLocationsAndHandleResult = (toggleSpinner) => {
        getAllPatients(false, defaultLimitPatients)
            .then((res, err) => {
                const patients = addSelectedProperty(res.data);
                this.props.fetchActivePatientsAction({ success: true, data: patients });
                if (toggleSpinner) {
                    this.props.toggleSpinnerAction();
                }
                return ({ success: true, data: patients });
            })
            .catch(err => {
                this.props.toggleSpinnerAction();
                this.props.fetchActivePatientsAction({ success: false, error: err });
                return false;
            })
            .then((res) => {
                if (res.data.length === 0) {
                    return false
                }

                if (res) {
                    var ids = res.data.map(x => x.id);
                    var string = ids.join(",")
                    return getPatientsLocations(string)
                }
            })
            .then((res) => {
                if (res !== false) {
                    this.props.getPatientsLocationsAction({ success: true, data: res.data })
                }
            })
            .catch(err => {
                this.props.getPatientsLocationsAction({ success: false, error: err })
            })
    }

    showDeletedPatients() {

        this.props.toggleDeletedPatientsAction();

        var that = this.props;

        getAllPatients(true, defaultLimitPatients).then((res, err) => {
            if (res.data.length !== 0) {
                that.fetchDeletedPatientsAction(res.data);
            }
        })
            .catch(err => {
                console.log(err);
            })
    }

    handleChange(e, { name, value }) {
        this.setState({ [name]: value })
    }

    openDeletedPatientInfoPage(patient) {

        var that = this.props;

        getTagEventsByPatientId(patient.id).then((res) => {
            that.openPatientDetailAction(patient);
            that.fetchDeletedPatientTagEventsAction(res.data);
            browserHistory.push('/patients/detail');
        })
            .catch(err => console.log(err));
    }

    refreshDeletedPatients() {
        this.setState({ refreshTriggered: true });

        var that = this;

        getAllPatients(true, this.state.maxResult).then((res, err) => {
            if (res.data.length !== 0) {
                that.props.fetchDeletedPatientsAction(res.data);
            }
        })
            .then(() => {
                setTimeout(function () { that.setState({ refreshTriggered: false }) }, 1000);

            })
            .catch(err => {
                console.log(err);
            })
    }

    preDeletePatient(id) {
        this.setState({ showDeleteModal: true, patientIdToDelete: id })
    }

    deletePatient = () => {

        deletePatient(this.state.patientIdToDelete).then(() => {
            this.props.deletePatientAction(this.state.patientIdToDelete);
        })
            .catch(err => console.log(err))
        this.setState({ showDeleteModal: false })
    }
    render() {

        // in case of error
        if (!this.props.homePageStore.activePatients.success) {
            return (
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as='h1'>
                                Měření pacienti
                            </Header>
                            <Message error>
                                <Message.Content>
                                    <Message.Header>Chyba</Message.Header>
                                    <Message.Body>{JSON.stringify(this.props.homePageStore.activePatients.error)}</Message.Body>
                                </Message.Content>
                            </Message>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            );
        }

        // in case it's still loading data
        if (!this.props.homePageStore.activePatients.hasOwnProperty('data')) {
            return (
                <div className="messageBox">
                    <Message info icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Načítání pacientů</Message.Header>
                        </Message.Content>
                    </Message>
                </div>
            )
        }

        const mappedActivePatients = this.props.homePageStore.activePatients.data.map(patient => {
            return (
                <Table.Row key={patient.id}>
                    <Table.Cell>{
                        patient.firstName.length > 10 ? (
                            patient.firstName.substring(0, 10) + '...'
                        ) : (
                                patient.firstName
                            )}
                    </Table.Cell>
                    <Table.Cell>{
                        patient.middleName.length > 10 ? (
                            patient.middleName.substring(0, 10) + '...'
                        ) : (
                                patient.middleName
                            )}
                    </Table.Cell>
                    <Table.Cell>{
                        patient.lastName.length > 10 ? (
                            patient.lastName.substring(0, 10) + '...'
                        ) : (
                                patient.lastName
                            )}
                    </Table.Cell>
                    <Table.Cell>{patient.cardId}</Table.Cell>
                    <Table.Cell>{patient.birthDate.substring(0, patient.birthDate.indexOf(' '))}</Table.Cell>
                    <Table.Cell>{patient.socialSecurityNumber}</Table.Cell>
                    <Table.Cell>{patient.room ? (patient.room.name !== "fetching"? patient.room.name  : <Icon loading name="spinner" />) : (<Popup trigger={<Icon name="ban" />} content="Nelze získat lokaci" />)}</Table.Cell>
                    <Table.Cell>{patient.tag ? patient.tag.name : ''}</Table.Cell>
                    <Table.Cell textAlign='left' >

                        <Button className='edit' onClick={() => this.openEditPatientPage(patient)} style={{ marginLeft: '0.5em', backgroundColor: '#efe1ba', color: 'black' }} size='mini' content='Upravit' />
                        <Modal open={this.state.showDeleteModal} trigger={
                            <Button className='deleteButton' onClick={() => this.preDeletePatient(patient.id)} style={{ padding: '0.7em', marginRight: '0.5em', marginLeft: '0.5em', backgroundColor: '#9a3334', color: 'white' }} content='Ukončit měření' size='tiny' />
                        } closeOnEscape={true} closeOnDimmerClick={true} closeIcon onClose={() => this.setState({ showDeleteModal: false })} size='mini'>
                            <Header icon='user delete' content='Ukončení měření' />
                            <Modal.Content>
                                <p>
                                    Opravdu si přejete ukončit měření?
                            </p>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={() => this.setState({ showDeleteModal: false })} style={{ backgroundColor: '#9a3334', color: 'white' }} inverted>
                                    <Icon name='remove' /> Zpět
                            </Button>
                                <Button onClick={() => this.deletePatient()} style={{ backgroundColor: '#efe1ba', color: 'black' }} inverted>
                                    <Icon name='checkmark' /> Ano
                            </Button>
                            </Modal.Actions>
                        </Modal>
                        {patient.tag ? (
                            patient.tag.battery === 0 ? (
                                <Popup
                                    position='right center'
                                    content='Prosím zkontrolujte nebo dobijte baterii!'
                                    trigger={<Icon inverted name="warning circle" size='large' />}>
                                </Popup>) : (<span></span>)
                        ) : (<span></span>)}
                    </Table.Cell>
                </Table.Row>
            )
        })

        var filteredDeletedPatients = JSON.parse(JSON.stringify(this.props.homePageStore.deletedPatients));

        if (this.state.filterCardId !== "" && this.state.filterSocialSecurityNumber !== "") {
            filteredDeletedPatients = filteredDeletedPatients.filter(patient => {
                if (patient.card_Id.toString().indexOf(this.state.filterCardId) >= 0 &&
                    patient.socialSecurityNumber.indexOf(this.state.filterSocialSecurityNumber) >= 0) {
                    return patient;
                }
            });
        }

        if (this.state.filterCardId !== "" && this.state.filterSocialSecurityNumber === "") {
            filteredDeletedPatients = filteredDeletedPatients.filter(patient => {
                if (patient.cardId.toString().indexOf(this.state.filterCardId) >= 0) {
                    return patient;
                }

            });
        }

        if (this.state.filterCardId === "" && this.state.filterSocialSecurityNumber !== "") {
            filteredDeletedPatients = filteredDeletedPatients.filter(patient => {
                if (patient.socialSecurityNumber.toString().indexOf(this.state.filterSocialSecurityNumber) >= 0) {
                    return patient;
                }
            });
        }

        const deletedPatients = filteredDeletedPatients.map(deletedPatient => {
            return (
                <Table.Row textAlign='center' key={deletedPatient.id}>
                    <Table.Cell>{
                        deletedPatient.firstName.length > 10 ? (
                            deletedPatient.firstName.substring(0, 10) + '...'
                        ) : (
                                deletedPatient.firstName
                            )}
                    </Table.Cell>
                    <Table.Cell>{
                        deletedPatient.middleName.length > 10 ? (
                            deletedPatient.middleName.substring(0, 10) + '...'
                        ) : (
                                deletedPatient.middleName
                            )}
                    </Table.Cell>
                    <Table.Cell>{
                        deletedPatient.lastName.length > 10 ? (
                            deletedPatient.lastName.substring(0, 10) + '...'
                        ) : (
                                deletedPatient.lastName
                            )}
                    </Table.Cell>
                    <Table.Cell>{deletedPatient.cardId}</Table.Cell>
                    <Table.Cell>{deletedPatient.birthDate.substring(0, deletedPatient.birthDate.indexOf(' '))}</Table.Cell>
                    <Table.Cell>{deletedPatient.socialSecurityNumber}</Table.Cell>
                    <Table.Cell>
                        {
                            moment(deletedPatient.deleted).local().format("DD.MM.YYYY HH:mm:ss").toString()
                        }</Table.Cell>
                    <Table.Cell>
                        <div>
                            <Button
                                style={{ backgroundColor: '#efe1ba' }}
                                size='tiny'
                                content='Detail'
                                onClick={() => this.openDeletedPatientInfoPage(deletedPatient)} />
                        </div>
                    </Table.Cell>
                </Table.Row>
            )
        })

        if (this.props.loginPageStore.loggedIn) {
            return (
                <div>
                    <Steps
                        enabled={this.state.stepsEnabled}
                        steps={this.state.steps}
                        initialStep={0}
                        onExit={this.onExit}
                    />
                    <Grid container style={{ padding: '2em 0em', marginBottom: '-3em' }}>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header as='h1'>
                                    Měření pacienti
                                </Header>
                            </Grid.Column>
                            <Grid.Column textAlign='right' width={8}>
                                {this.lastUpdate ? "Poslední aktualizace: " + this.lastUpdate : null}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column textAlign='right' floated='right' width={6}>
                                <Button
                                    className='createPatient'
                                    style={{ backgroundColor: '#006babcf', color: 'white' }}
                                    onClick={this.handleCreatePatient}
                                    size='huge'>
                                    Nové měření
                            </Button>
                                <Button
                                    className='help'
                                    size='huge'
                                    circular
                                    icon
                                    style={{ backgroundColor: '#006babcf' }}
                                    onClick={() => this.fireIntroJs()}>
                                    <Icon name="question circle" inverted />
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                        {
                            this.props.spinnerStore.showSpinner ? (
                                <Image fluid src={spinner} />
                            ) : (
                                    <Table className='table' textAlign='center' compact padded celled selectable striped fixed style={{ padding: '0 0 0 0' }}>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={1}>Jméno</Table.HeaderCell>
                                                <Table.HeaderCell style={{ fontSize: "0.75em", backgroundColor: '#80808036' }} width={1}>Prostřední<br />jméno</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Příjmení</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Číslo karty</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Datum narození</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Rodné číslo</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Lokace
                                                    <Popup trigger={<Icon style={{ marginLeft: '0.5em' }} circular name='question' />} content="Poslední známá lokace" />
                                                </Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Tag</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={4}>Akce</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {mappedActivePatients}
                                        </Table.Body>
                                    </Table>
                                )
                        }


                        <Grid.Row>
                            <Grid.Column textAlign='right' floated='right' width={16}>
                                <Button
                                    className='showDeletedPatientButton'
                                    style={{ backgroundColor: '#006babcf', color: 'white' }}
                                    size='huge'
                                    onClick={() => this.showDeletedPatients()}>
                                    {this.props.homePageStore.showDeletedPatients ? ('Skrýt ukončené měření') : ('Zobrazit ukončené měření')}
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                        {
                            this.props.homePageStore.showDeletedPatients ? (
                                <div style={{ marginBottom: '4em' }}>
                                    <Divider style={{ padding: '1em' }} />

                                    <Grid.Row style={{ paddingBottom: '2em' }}>
                                        <Header as='h1'>
                                            Ukončená měření
                                    </Header>
                                    </Grid.Row>

                                    <Grid columns={3} stackable>
                                        <Grid.Column width='3'></Grid.Column>
                                        <Grid.Column style={{ paddingRight: '0.5em' }} verticalAlign='middle' floated='right' width='3'>
                                            {
                                                this.state.maxResult !== defaultLimitPatients ? (
                                                    <Button
                                                        circular
                                                        className='refresh'
                                                        disabled={!isNum(this.state.maxResult)}
                                                        floated='right'
                                                        icon
                                                        style={{ backgroundColor: '#006babcf', color: 'white' }}
                                                        size='large'
                                                        onClick={() => this.refreshDeletedPatients()}>
                                                        <Icon loading={this.state.refreshTriggered} name='refresh' />
                                                    </Button>
                                                ) : (
                                                        <div></div>
                                                    )
                                            }
                                        </Grid.Column>
                                        <Grid.Column floated='right' width='10'>
                                            <Form className='filterForm' size='large' key='large'>
                                                <Form.Group widths='equal'>
                                                    <Form.Input className='maxRes' tabIndex={0} width={6} name='maxResult' onChange={this.handleChange} fluid label='Max záznamů' value={this.state.maxResult} error={!isNum(this.state.maxResult)} />
                                                    <Form.Input tabIndex={1} name='filterCardId' onChange={this.handleChange} fluid label='Číslo karty' />
                                                    <Form.Input tabIndex={2} name='filterSocialSecurityNumber' onChange={this.handleChange} fluid label='Rodné číslo' />
                                                </Form.Group>
                                            </Form>
                                        </Grid.Column>
                                    </Grid>

                                    <Table textAlign='center' compact sortable padded celled selectable striped fixed style={{ padding: '0 0 0 0' }}>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={1}>Jméno</Table.HeaderCell>
                                                <Table.HeaderCell style={{ fontSize: "1em", backgroundColor: '#80808036' }} width={2}>Prostřední<br />jméno</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={1}>Příjmení</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Číslo karty</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Datum narození</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Rodné číslo</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>čas ukončení</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} className='infoButt' width={2}>Akce</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {deletedPatients}
                                        </Table.Body>
                                    </Table>
                                </div>
                            ) : (<span></span>)
                        }
                    </Grid>
                </div>
            );
        }
        else {
            return null
        }
    }
}

function mapStateToProps(state) {
    return {
        homePageStore: state.HomeReducer,
        tagStore: state.TagReducer,
        tagEventTypeStore: state.TagEventTypeReducer,
        tagRegistrationStore: state.TagRegistrationReducer,
        loginPageStore: state.LoginReducer,
        spinnerStore: state.SpinnerReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleProductDetailModalAction: toggleProductDetailModalAction,
        fetchActivePatientsAction: fetchActivePatientsAction,
        loginFailedAction: loginFailedAction,
        loginSuccessAction: loginSuccessAction,
        toggleDeletedPatientsAction: toggleDeletedPatientsAction,
        fetchDeletedPatientsAction: fetchDeletedPatientsAction,
        fetchDeletedPatientTagEventsAction: fetchDeletedPatientTagEventsAction,
        openPatientDetailAction: openPatientDetailAction,
        toggleSpinnerAction: toggleSpinnerAction,
        fetchTagEventsByTagIdAction: fetchTagEventsByTagIdAction,
        openPatientEditAction: openPatientEditAction,
        deletePatientAction: deletePatientAction,
        getPatientsLocationsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);