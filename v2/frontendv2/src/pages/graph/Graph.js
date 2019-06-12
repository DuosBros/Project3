

import React from 'react';
import {Header, Grid, Form, Button, Modal, Table, Dropdown} from 'semantic-ui-react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import IEcharts from 'react-echarts-v3'
import 'echarts/lib/chart/boxplot';
import {browserHistory} from 'react-router';


import {fetchAllTagEventsAction} from '../common/TagEventAction';

import {getTagEvents} from '../common/TagEventAxios';
import {loadInitialDataEndedAction, loadInitialDataStartedAction} from '../login/LoginAction';
import {getTagEventTimes, getPatientTimeline, getSuitablePatients, getPatientLocationTimeline, getSpecifiedTagEventTimes} from './GraphAxios';
import { isEmpty } from '../../helpers/helpers';
import {toggleTagEventTimeDoneAction} from './GraphAction'
import {checkAuth} from '../login/LoginAxios';
import {loginFailedAction, loginSuccessAction} from '../login/LoginAction';
import {getAllTagEventTypes} from '../common/TagEventTypeAxios';
import {fetchTagEventTypesAction} from '../common/TagEventTypeAction';
import {GetTagEventBoxplotOption} from './options/TagEventBoxplot';
import {GetPatientTimeLine} from './options/PatientTimeLine';
import {GetPatientTimeLinePie} from './options/PatientTimePie';
import {GetLocationTimeLine} from './options/LocationTimeLine';
import {SelectedTagEventBoxplot} from './options/SelectedTagEventBoxplot';

// TODO: THIS NEEDS TO BE REWRITTEN
class Graph extends React.Component {
    
    constructor(props) {
        
        super(props);

        checkAuth().then((res) => {
            props.loginSuccessAction();
        })
        .catch(err => {
            if(!!err.response) {
                if(err.response.status === 401) {
                    props.loginFailedAction();
                    browserHistory.push('/logout');
                }
            }
        })
        
        if(props.tagEventTypeStore.tagEventTypes.length < 1) {
            props.loadInitialDataStartedAction();

            var that = this.props;
            getAllTagEventTypes().then((res, err) => {
                that.fetchTagEventTypesAction(res.data);

                debugger;
                if(res.data > 0) {
                    this.setState({ startTagEventType: res.data[0] })
                    this.setState({ endTagEventType: res.data[res.data.length - 1] })
                }

                that.loadInitialDataEndedAction();
            })
        }
    
      
        this.state = {
            tagEventTimes : [],
            timelineData: [],
            cardId: '',
            drawTimeLine: false,
            drawLocationTimeLine: false,
            suitableDeletedPatients: [],
            showDeletedPatientsModal: false,
            startTagEventType: {},
            endTagEventType: {},
            specifiedTagEventTypeTimes: []
        }

        this.prepareTagEventTimeData = this.prepareTagEventTimeData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.drawPatientTimeline = this.drawPatientTimeline.bind(this);
        this.selectPatient = this.selectPatient.bind(this);
    }

    getSuitableDeletedPatients() {
        this.setState({showDeletedPatientsModal: true});

        getSuitablePatients().then(res => {
            this.setState({ suitableDeletedPatients: res.data })
        })
    }

    drawPatientTimeline(cardId) {
        getPatientTimeline(cardId).then(res => {
            this.setState({ timelineData: res.data })
            this.setState({ drawTimeLine: true })

            getPatientLocationTimeline(cardId).then(res => {
                if(res.data.length != 0) {
                    this.setState({locationTimelineData: res.data})
                    this.setState({ drawLocationTimeLine: true })
                }
            })
        })
    }

    handleChange (e, { name, value }) {
        this.setState({ [name]: value })
    }

    componentDidMount() {
        if(this.props.graphStore.getTagEventTimesDone === true) {
            this.props.toggleTagEventTimeDoneAction();
        }
        
        var data = [];

        var that = this.props;
        var thatState = this.state;

        getTagEventTimes().then(res => {
            // too lazy to write this whole component properly
            res.data.map(tagEventTime => {
                var obj = {}
                obj.label = tagEventTime.tagEventName
                obj.y = tagEventTime.times
                obj.tagEventTypeId = tagEventTime.tagEventTypeId
                data.push(obj)
            })
        })
        .then(() => {
            this.setState({ 
                tagEventTimes: data
            })
            
            getSpecifiedTagEventTimes(thatState.startTagEventType.id, thatState.endTagEventType.id).then(res => {
                debugger;
                this.setState({ 
                    specifiedTagEventTypeTimes: res.data
                })
            })

            if(that.tagEventTypeStore.tagEventTypes.length === 0) {
                if(this.props.graphStore.getTagEventTimesDone === false) {
                    this.props.toggleTagEventTimeDoneAction();
                }
            }
        })
    }
    
    prepareTagEventTimeData(data) {
        return data.map(x => x.y)
    }

    selectPatient(deletedPatient) {
        this.setState({ 
            drawLocationTimeLine: false,
            drawTimeLine: false,
            cardId: deletedPatient.cardId, 
            selectedPatient: deletedPatient,
            showDeletedPatientsModal: false })

        this.drawPatientTimeline(deletedPatient.cardId)
    }

    render() {
        const tagEventTimeGraphStyle = {
            width: '100%',
            // height: '100%',
            // height: Math.floor(Math.random() * (768 + 1 - 200) + 200) + 'px'
            minHeight: '30em'
          };

        const timelineGraphStyle = {
            width: '90%',
            height: '90%',
            // minHeight: '25em'
        };

        const PieGraphStyle = {
            width: '100%',
            height: '100%',
            minHeight: '30em'
        };

        var filteredDeletedPatients = JSON.parse(JSON.stringify(this.state.suitableDeletedPatients));

        const deletedPatients = filteredDeletedPatients.map(deletedPatient => {
            return (
                <Table.Row textAlign='center' key={deletedPatient.id}>
                    <Table.Cell>{ 
                        deletedPatient.lastName.length > 10 ? (
                            deletedPatient.lastName.substring(0,10)  + '...' 
                        ) : (
                            deletedPatient.lastName
                        )}
                    </Table.Cell>
                    <Table.Cell>{deletedPatient.cardId}</Table.Cell>
                    <Table.Cell>{deletedPatient.socialSecurityNumber}</Table.Cell>
                    <Table.Cell>
                        <div>
                            <Button 
                                style={{backgroundColor: '#efe1ba'}}
                                size='tiny' 
                                content='Vybrat'
                                onClick={() => this.selectPatient(deletedPatient)} />
                        </div>
                    </Table.Cell>
                </Table.Row>
            )
        })

        return(
            <Grid stackable container style={{ padding: '5em 0em' }}>
                 {
                    this.props.graphStore.getTagEventTimesDone ? (
                        <Grid.Row>
                            <Header as='h2' dividing>
                                Krabicový graf jednotlivých událostí
                                <Header.Subheader>
                                    Data byla vykreslena z [{this.state.tagEventTimes[0].y.length}] pacientů.
                                </Header.Subheader>
                            </Header>
                        </Grid.Row>
                    ) : (
                        <div></div>
                    )
                }
                {
                    this.props.graphStore.getTagEventTimesDone ? (
                        <Grid.Row style={{minHeight: '20em'}}>
                            <div style={tagEventTimeGraphStyle}>
                                <IEcharts 
                                    resizable
                                    option={GetTagEventBoxplotOption(this.state.tagEventTimes)}/>
                            </div>
                        </Grid.Row> 
                    ) : (
                        <div></div>
                    )
                }
                <Dropdown value={this.state.startTagEventType ? this.state.startTagEventType.note : ''}></Dropdown>
                <Dropdown value={this.state.endTagEventType ? this.state.endTagEventType.note : ''}></Dropdown>
                <Grid.Row style={{minHeight: '20em'}}>
                    <div style={tagEventTimeGraphStyle}>
                        <IEcharts 
                            resizable
                            option={SelectedTagEventBoxplot(this.state.specifiedTagEventTypeTimes)}/>
                    </div>  
                </Grid.Row>
                <Grid.Row>
                    <Header as='h2' dividing>
                        Statistická analýza specifického pacienta
                        {this.state.cardId ? (<Header.Subheader>Vykreslován pacient s číslem karty [{this.state.cardId}]</Header.Subheader>) : (<span></span>)}
                    </Header>
                </Grid.Row>
                <Grid.Row>
                    
  {/* <Form>
                        <Form.Input inline tabIndex={0} name='cardId' onChange = {this.handleChange} label='Číslo karty'/>
                    </Form> */}
                        <Button style={{backgroundColor: '#006bab', color: 'white'}} onClick={() => this.getSuitableDeletedPatients()}>Vybrat pacienta</Button>
                        <Modal
                            open={this.state.showDeletedPatientsModal}
                            onClose={() => this.setState({ showDeletedPatientsModal: false })}>
                            <Modal.Header>Ukončená měření</Modal.Header>
                            <Modal.Content image scrolling>
                                <Table textAlign='center' compact sortable padded celled selectable striped fixed style={{padding:'0 0 0 0'}}>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell style={{backgroundColor: '#80808036'}} width={1}>Příjmení</Table.HeaderCell>
                                                <Table.HeaderCell style={{backgroundColor: '#80808036'}} width={2}>Číslo karty</Table.HeaderCell>
                                                <Table.HeaderCell style={{backgroundColor: '#80808036'}} width={2}>Rodné číslo</Table.HeaderCell>
                                                <Table.HeaderCell style={{backgroundColor: '#80808036'}} className='infoButt' width={2}>Akce</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {deletedPatients}
                                        </Table.Body>
                                    </Table>
                            </Modal.Content>
                        </Modal>
                        {/* <Button onClick={() => this.drawPatientTimeline(this.state.cardId)} style={{marginLeft: '1em', backgroundColor: '#006babcf', color: 'white'}}>Go!</Button> */}
                    
                </Grid.Row>
                <Grid.Row style={{minHeight: this.state.drawLocationTimeLine ? '20em' : '0em'}}>
                {
                    this.state.drawLocationTimeLine ? (
                        <div style={timelineGraphStyle}>
                            <IEcharts 
                                resizable
                                option={GetLocationTimeLine(this.state.locationTimelineData)}/>
                        </div>
                    ) : (
                        <div>
                            <Header as='h3'>
                                Data nenalezena
                            </Header>
                        </div>
                    )
                }
                </Grid.Row>
                <Grid.Row style={{minHeight: this.state.drawTimeLine ? '20em' : '0em'}}>
                {
                    this.state.drawTimeLine ? (
                        <div style={timelineGraphStyle}>
                            <IEcharts 
                                resizable
                                option={GetPatientTimeLine(this.state.timelineData)}/>
                        </div>
                    ) : (
                        <div></div>
                    )
                }
                </Grid.Row>
                <Grid.Row style={{minHeight: this.state.drawTimeLine ? '30em' : '0em'}} textAlign='center' floated='center'>
                {
                    this.state.drawTimeLine ? (
                        <div style={PieGraphStyle}>
                            <IEcharts 
                                resizable
                                option={GetPatientTimeLinePie(this.state.timelineData)}/>
                        </div>
                    ) : (
                        <div></div>
                    )
                }
                </Grid.Row>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        tagEventStore: state.TagEventReducer,
        homePageStore: state.HomeReducer,
        tagStore: state.TagReducer,
        tagEventTypeStore: state.TagEventTypeReducer,
        tagRegistrationStore: state.TagRegistrationReducer,
        loginPageStore: state.LoginReducer,
        spinnerStore: state.SpinnerReducer,
        graphStore: state.GraphReducer
    };
  }
  
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchAllTagEventsAction: fetchAllTagEventsAction,
        loadInitialDataStartedAction: loadInitialDataStartedAction,
        loadInitialDataEndedAction: loadInitialDataEndedAction,
        toggleTagEventTimeDoneAction: toggleTagEventTimeDoneAction,
        loginFailedAction: loginFailedAction,
        loginSuccessAction: loginSuccessAction,
        fetchTagEventTypesAction: fetchTagEventTypesAction
    }, dispatch);
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Graph);
