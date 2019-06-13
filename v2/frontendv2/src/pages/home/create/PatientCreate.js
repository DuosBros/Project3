import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { Grid, Form, Segment, Header, Message, Button, Icon, Dropdown, Table, Image } from 'semantic-ui-react';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import '../../../../node_modules/flatpickr/dist/flatpickr.css';
// import '../../../../node_modules/flatpickr/dist/themes/dark.css';
import { Steps } from 'intro.js-react';
import '../../../../node_modules/intro.js/minified/introjs.min.css';

import { checkAuth } from '../../login/LoginAxios';
import { loginSuccessAction, loginFailedAction } from '../../login/LoginAction';
import { isEmpty, addSelectedProperty, validateCardId, validateSocialSecurityNumber } from '../../../helpers/helpers';
import EditTagEvent from '../../../modals/EditTagEvent'
import { addTagEventToPatientAction, removeTagEventFromPatientAction, fetchTagEventsByTagIdAction, cleanUpTagEventsAction } from '../../common/TagEventAction';
import { fetchTagRegistrationsAction } from '../../common/TagRegistrationAction';
import { getAllTagRegistrations } from '../../common/TagRegistrationAxios';
import { fetchTagsAction } from '../../common/TagAction';
import { getAllTags } from '../../common/TagAxios';
import { getTagEventsByTagId } from '../../common/TagEventAxios';
import { toggleEditTagEventModalAction } from '../edit/PatientEditAction';
import { createPatient } from './PatientCreateAxios';
import { putTagEvents } from '../../common/TagEventAxios';
import spinner from '../../../../src/Spinner.svg';


class PatientCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardId: '',
            firstName: '',
            middleName: '',
            lastName: '',
            socialSecurityNumber: '',
            birthDate: "",
            currentButtonSelected: false,
            pastButtonSelected: false,
            constructorOperationsDone: false,
            selectedTagChanged: false,
            selectedTag: '',
            startDate: moment().subtract(7, 'd').toDate(),
            endDate: moment().toDate(),
            filterByDate: false,
            areTagEventsFetching: false,
            stepsEnabled: false,
            steps: [
                {
                    element: '.container',
                    intro: 'Zde se nacházíme na stránce, kde můžete vytvořit nového pacienta a k němu příslušení měření. Hlášení nebo oblasti, které jsou červené musíte vyřešit pokud budete chtít uložit pacienta.'
                },
                {
                    element: '.form',
                    intro: 'Zde zadáváte typ měření a pacientovy údaje. Nezapomeňte, že povinné údaje je typ měření (Přítomnost nebo Retrospektivně) a číslo karty.'
                },
                {
                    element: '.current',
                    intro: 'Tento typ měření znamená, že měření probíhá právě teď nebo vytváříte pacienta s předstihem. Tento typ měření poté přiřadí všechny události zvoleného tagu automaticky pacientovi.'
                },
                {
                    element: '.past',
                    intro: 'Tento typ měření zvolíte, pokud vytváříte pacienta retrospektivně (již odešel z oddělení). Je nutno vyhledat dotyčné události daného tagu, který měl pacient přiřazen.',
                },
                {
                    element: '.socialSecurityNumber',
                    intro: 'Rodné číslo můžete zadat s nebo bez lomítka.',
                },
                {
                    element: '.dateForm',
                    intro: 'Datum narození se automaticky vygeneruje na základě rodného čísla ve správném tvaru.',
                },
                {
                    element: '.sav',
                    intro: 'Tímhle vytvoříte pacienta a jeho měření.',
                },
                {
                    element: '.dropd',
                    intro: 'Kliknutím vyberete daný tag, který má/měl pacient.',
                },
                {
                    element: '.assignedToPat',
                    intro: 'V této sekci najdete události, které přiřadíte pacientovi.',
                },
                {
                    element: '.tagEvents',
                    intro: 'Zde najdete veškeré události zvoleného tagu.',
                },
                {
                    element: '.filterDate',
                    intro: 'Události můžete filtrovat podle data, pokud víte, kdy se pohyboval pacient na oddělení.',
                }
            ],
        };

        this.fireIntroJs = this.fireIntroJs.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBirthdate = this.handleBirthdate.bind(this);
        this.handleAssignUnassignTagEvent = this.handleAssignUnassignTagEvent.bind(this);
        this.handleSavePatient = this.handleSavePatient.bind(this);
        this.changeDropdownItem = this.changeDropdownItem.bind(this);
        this.filterTagEvents = this.filterTagEvents.bind(this);
        this.handleSocialSecurityNumber = this.handleSocialSecurityNumber.bind(this);

    }

    onExit = () => {
        this.setState(() => ({ stepsEnabled: false }));

        this.setState({
            selectedTagChanged: false,
            currentButtonSelected: false,
        })
    };

    fireIntroJs() {

        this.setState(prevState => ({ stepsEnabled: !prevState.stepsEnabled }));

        this.setState({
            selectedTagChanged: true,
            currentButtonSelected: true,
        })
    }

    componentDidMount() {
        this.props.cleanUpTagEventsAction();

        if (this.props.tagStore.tags.length === 0) {
            getAllTags().then((res, err) => {
                this.props.fetchTagsAction(addSelectedProperty(res.data));

                getAllTagRegistrations().then((res, err) => {
                    this.props.fetchTagRegistrationsAction(res.data);
                    this.setState({ constructorOperationsDone: true });
                })
                    .catch(err => console.log(err))
            })
                .catch(err => console.log(err))
        }
    }

    changeDropdownItem = (value) => {
        this.setState({
            selectedTag: value, selectedTagChanged: true, areTagEventsFetching: true
        })

        var that = this;

        getTagEventsByTagId(value.id).then((res, err) => {
            that.props.fetchTagEventsByTagIdAction(res.data);
            that.setState({
                areTagEventsFetching: false
            })
        })
            .catch(err => console.log(err))
    }

    handleSavePatient() {
        var createdPatient = {};
        createdPatient.cardId = this.state.cardId
        createdPatient.firstName = this.state.firstName
        createdPatient.middleName = this.state.middleName
        createdPatient.lastName = this.state.lastName
        createdPatient.socialSecurityNumber = this.state.socialSecurityNumber
        // createdPatient.birthDate = this.state.birthDate ? moment(this.state.birthDate).format('DD.MM.YYYY').toString() : new Date()

        if (!!this.state.birthDate) {
            createdPatient.birthDate = moment(this.state.birthDate).format('DD.MM.YYYY');
        }

        if (this.state.currentButtonSelected) {
            createdPatient.tag = this.state.selectedTag
        }

        createPatient(createdPatient).then((res) => {
            var patientTagEvents = this.props.tagEventStore.deletedPatientTagEvents
            var tagTagEvents = this.props.tagEventStore.tagEventsByTagId

            var modifiedPatientTagEvents = patientTagEvents.reduce(function (filtered, patientTagEvent) {
                if (patientTagEvent.modified_temp === true) {
                    patientTagEvent.patient = res.data;
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

            var that = this.props;

            putTagEvents(modifiedTagEvents).then(() => {
                browserHistory.push('/patients')
                that.cleanUpTagEventsAction()
            })
                .catch(err => console.log(err))
        }).catch(err => console.log(err))

    }

    selectModeButton(mode) {
        this.setState({ selectedTagChanged: false, selectedTag: {} });
        if (mode === 'past') {
            this.setState({ pastButtonSelected: true, currentButtonSelected: false });
        }
        else {
            this.setState({ pastButtonSelected: false, currentButtonSelected: true });
        }
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

    filterTagEvents(date) {
        if (date.date.length === 2) {
            this.setState({
                startDate: date.date[0],
                endDate: date.date[1],
                filterByDate: true
            });
        }
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

        // if(isEmpty(this.props.patientEditStore.patientToEdit)) {
        //     browserHistory.push('/patients');
        // }

        // if(!this.props.loginPageStore.loggedIn) {
        //     browserHistory.push('/login');
        // }
    }

    toggleEditTagEvent(tagEvent) {
        if (!isEmpty(tagEvent)) {
            this.props.toggleEditTagEventModalAction(tagEvent)
        }
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

    render() {

        var mappedTags = [];

        mappedTags = this.props.tagStore.tags.map((tag, i) => {
            var result = <Dropdown.Item tag={tag} key={i} value={tag.name} onClick={() => this.changeDropdownItem(tag)}>{tag.name}</Dropdown.Item>
            return result;
        });

        if (this.state.currentButtonSelected) {
            var tagRegistrationTagNames = this.props.tagRegistrationStore.tagRegistrations.map(tagRegistration => tagRegistration.tag.name)

            mappedTags = mappedTags.filter(tag => !tagRegistrationTagNames.includes(tag.key))
        }

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
                                style={{ backgroundColor: '#efe1ba', color: 'black' }}
                                size='mini'
                                onClick={() => this.toggleEditTagEvent(tagEvent)}
                                content='Upravit' />
                            <Button onClick={() => this.handleAssignUnassignTagEvent(tagEvent, false)} style={{ marginRight: '0.5em', marginLeft: '0.5em', backgroundColor: '#9a3334', color: 'white' }} content='Odebrat' size='mini' />
                        </div>
                    </Table.Cell>
                </Table.Row>
            )
        })

        var filteredTagEvents = [];

        if (this.state.filterByDate) {

            var start = this.state.startDate;
            var end = this.state.endDate;

            filteredTagEvents = this.props.tagEventStore.tagEventsByTagId.filter(tagEvent => {
                var created = new Date(tagEvent.created);
                if (!tagEvent.patient && created > start && created < end) {
                    return tagEvent
                }
            })
        }
        else {
            filteredTagEvents = this.props.tagEventStore.tagEventsByTagId.filter(tagEvent => {
                return isEmpty(tagEvent.patient)
            })
        }

        const mappedTagTagEvents = filteredTagEvents
            .map(tagEvent => {
                return (
                    <Table.Row textAlign='center' key={tagEvent.id}>
                        <Table.Cell>
                            {
                                moment(tagEvent.created).local().format("DD.MM.YYYY HH:mm:ss").toString()
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
                <div>
                    <Steps
                        enabled={this.state.stepsEnabled}
                        steps={this.state.steps}
                        initialStep={0}
                        onExit={this.onExit}
                    />
                    <Grid columns={2} stackable container style={{ padding: '2em 0em' }}>
                        <Grid.Column width='5'>
                            <Header style={{ backgroundColor: '#80808036', color: 'black' }} attached='top' as='h2'>Karta pacienta
                                <Button
                                    circular
                                    floated='right'
                                    className='help'
                                    size='tiny'
                                    icon
                                    style={{ backgroundColor: '#006babcf' }}
                                    onClick={() => this.fireIntroJs()}>
                                    <Icon name="question circle" inverted />
                                </Button>
                            </Header>
                            <Segment attached='bottom'>
                                <Form className='form' size='large'>
                                    <Button.Group fluid size='medium' >
                                        <Button className='current' onClick={() => this.selectModeButton('current')} style={{
                                            backgroundColor: this.state.currentButtonSelected ? '#efe1ba' : '#fff6f6'
                                            // ,padding:'0.4em 1.5em 0.4em 0.4em'
                                        }}>Přítomnost</Button>
                                        <Button.Or text='||' />
                                        <Button className='past' onClick={() => this.selectModeButton('past')} style={{
                                            backgroundColor: this.state.pastButtonSelected ? '#efe1ba' : '#fff6f6'
                                            // ,padding:'0.4em 0.4em 0.4em 1.5em'
                                        }}>Retrospektivně</Button>
                                    </Button.Group>
                                    {
                                        !(this.state.currentButtonSelected || this.state.pastButtonSelected) ?
                                            (
                                                <div style={{ color: '#b33535', marginBottom: '1em', marginTop: '0.3em', fontSize: 'large' }} ><Icon name='warning circle' /><b>Vyberte akci</b></div>
                                            ) : (
                                                <div style={{ marginBottom: '1em' }}></div>
                                            )
                                    }
                                    <Form.Input error={!validateCardId(this.state.cardId)} label='Číslo karty' fluid value={this.state.cardId} name='cardId' onChange={this.handleChange} />

                                    <Form.Input style={{ paddingBottom: '1em' }} label='Křestní jméno' fluid value={this.state.firstName} name='firstName' onChange={this.handleChange} />
                                    <Form.Input style={{ paddingBottom: '1em' }} label='Prostřední jméno' fluid value={this.state.middleName} name='middleName' onChange={this.handleChange} />
                                    <Form.Input style={{ paddingBottom: '1em' }} label='Příjmení' fluid value={this.state.lastName} name='lastName' onChange={this.handleChange} />

                                    <Form.Input
                                        className='socialSecurityNumber'
                                        error={!validateSocialSecurityNumber(this.state.socialSecurityNumber) && this.state.socialSecurityNumber.length > 0}
                                        style={{ paddingBottom: '1em' }}
                                        label='Rodné číslo'
                                        fluid value={this.state.socialSecurityNumber}
                                        name='socialSecurityNumber'
                                        onChange={this.handleSocialSecurityNumber} />

                                    <Form.Field style={{ paddingBottom: '1em' }}>
                                        <label>Datum narození</label>
                                        <Flatpickr
                                            value={this.state.birthDate}
                                            onChange={date => { this.handleBirthdate({ date }) }}
                                            className="dateForm"
                                            options={{ locale: 'cs', dateFormat: 'd.m.Y' }}
                                        />
                                    </Form.Field>
                                    <Button className='sav' onClick={() => this.handleSavePatient()} fluid style={{ backgroundColor: '#efe1ba', color: 'black', marginBottom: '0.6em' }} content='Vytvořit'
                                        disabled={
                                            (!validateCardId(this.state.cardId) || !(this.state.currentButtonSelected || this.state.pastButtonSelected)
                                                || (this.state.pastButtonSelected && mappedPatientTagEvents.length < 1) || (this.state.currentButtonSelected && isEmpty(this.state.selectedTag)))
                                        } />
                                    <Button onClick={() => browserHistory.push('/patients')} fluid style={{ backgroundColor: '#9a3334', color: 'white' }} content='Zpět' />
                                </Form>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width='11'>
                            <Header style={{ backgroundColor: '#80808036', color: 'black' }} attached='top' as='h3'>Výběr tagu</Header>
                            <Segment className='dropd' attached='bottom'>
                                <Dropdown
                                    disabled={!(this.state.currentButtonSelected || this.state.pastButtonSelected) || mappedPatientTagEvents.length > 0}
                                    style={{ padding: '0.7em' }} button className='icon' icon='dropdown' floating labeled
                                    text={this.state.selectedTagChanged ? this.state.selectedTag.name : 'Vyberte...'}>
                                    <Dropdown.Menu>
                                        {mappedTags}
                                    </Dropdown.Menu>
                                </Dropdown>
                                {
                                    this.state.currentButtonSelected && isEmpty(this.state.selectedTag) ?
                                        (
                                            <div style={{ color: '#b33535', marginTop: '0.3em', fontSize: 'large' }} ><Icon name='warning circle' /><b>Zvolte tag</b></div>
                                        ) : (
                                            <div style={{ marginBottom: '1em' }}></div>
                                        )
                                }
                            </Segment>
                            <Header style={{ backgroundColor: '#80808036', color: 'black' }} attached='top' as='h3'>Přiřazené události pacientovi</Header>
                            <Segment className='assignedToPat' attached='bottom'>
                                {
                                    mappedPatientTagEvents.length > 0 ? (
                                        <Table key='grey' compact padded celled selectable striped fixed >
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell width={2}>Čas</Table.HeaderCell>
                                                    <Table.HeaderCell width={6}>Název</Table.HeaderCell>
                                                    <Table.HeaderCell width={1}>Tag</Table.HeaderCell>
                                                    <Table.HeaderCell width={3}>Akce</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {mappedPatientTagEvents}
                                            </Table.Body>
                                        </Table>
                                    ) : (
                                            <div>
                                                {
                                                    this.state.pastButtonSelected ?
                                                        (
                                                            <div style={{ color: '#b33535', marginBottom: '1em', marginTop: '0.3em', fontSize: 'large' }} ><Icon name='warning circle' /><b>Přiřaďte alespoň 1 událost pacientovi</b></div>
                                                        ) : (
                                                            <div style={{ marginBottom: '1em' }}></div>
                                                        )
                                                }
                                            </div>
                                        )
                                }
                            </Segment>
                            {
                                this.state.selectedTagChanged ? (

                                    <div>
                                        <Header style={{ backgroundColor: '#80808036', color: 'black' }} attached='top' as='h3'>Volné události tagu {this.state.selectedTag.name}</Header>
                                        <Segment className='tagEvents' attached='bottom'>
                                            {
                                                this.state.areTagEventsFetching ? (
                                                    <Image style={{ marginLeft: '10em', marginRight: '10em' }} size='medium' verticalAlign='middle' src={spinner} />
                                                ) : (<div></div>)
                                            }
                                            <Form size='large'>
                                                <Form.Field width='9' style={{ paddingBottom: '1em' }} >
                                                    <Flatpickr
                                                        onChange={date => { this.filterTagEvents({ date }) }}
                                                        options={{ locale: 'cs', mode: "range", dateFormat: 'd.m.Y', wrap: true }}>
                                                        <input type='text' data-input className="filterDate" placeholder="Filtrovat události.." />
                                                        <br />
                                                        <Button style={{ marginTop: '1em' }} data-clear >
                                                            Vymazat datum
                                                        </Button>
                                                    </Flatpickr>

                                                </Form.Field>
                                            </Form>
                                            {
                                                mappedTagTagEvents.length > 0 ? (
                                                    <Table key='grey' compact padded celled selectable striped fixed >
                                                        <Table.Header>
                                                            <Table.Row>
                                                                <Table.HeaderCell width={2}>Čas</Table.HeaderCell>
                                                                <Table.HeaderCell width={6}>Název</Table.HeaderCell>
                                                                <Table.HeaderCell width={3}>Akce</Table.HeaderCell>
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
                                                                Tento tag nemá žádné volné události.
                                                        </Message>
                                                        </div>
                                                    )
                                            }
                                        </Segment>
                                    </div>


                                ) : (
                                        <span></span>
                                    )
                            }
                            {
                                this.props.patientEditStore.showEditTagEventModal === true ? (
                                    <EditTagEvent />
                                ) : (
                                        <div></div>
                                    )
                            }
                        </Grid.Column>
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
        tagStore: state.TagReducer,
        loginPageStore: state.LoginReducer,
        tagEventStore: state.TagEventReducer,
        tagRegistrationStore: state.TagRegistrationReducer,
        patientEditStore: state.PatientEditReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleEditTagEventModalAction: toggleEditTagEventModalAction,
        loginSuccessAction: loginSuccessAction,
        loginFailedAction: loginFailedAction,
        addTagEventToPatientAction: addTagEventToPatientAction,
        removeTagEventFromPatientAction: removeTagEventFromPatientAction,
        fetchTagsAction: fetchTagsAction,
        fetchTagRegistrationsAction: fetchTagRegistrationsAction,
        fetchTagEventsByTagIdAction: fetchTagEventsByTagIdAction,
        cleanUpTagEventsAction: cleanUpTagEventsAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PatientCreate);