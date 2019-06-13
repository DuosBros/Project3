import React from 'react';
import { Header, Grid, Button, Modal, Table, Dropdown, Image, Message, Icon, Popup } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import IEcharts from 'react-echarts-v3'
import 'echarts/lib/chart/boxplot';

import { loginFailedAction, loginSuccessAction } from '../login/LoginAction';
import { checkAuth } from '../login/LoginAxios';
import {
    getPatientTimelineAction, getPatientLocationTimelineAction, getSuitableDeletedPatientsForGraphsAction, getSpecifiedTagEventTypeBoxplotAction, loadInitialGraphDataStartedAction, getTagEventTypeBoxplotAction,
    loadInitialGraphDataEndedAction, getTagEventTypeBoxplotEndedAction, getTagEventTypeBoxplotStartedAction, getPatientHoursAndDaysAction
} from './GraphAction';
import { getAllTagEventTypes } from '../common/TagEventTypeAxios';
import { fetchTagEventTypesAction } from '../common/TagEventTypeAction';
import { getTagEventTypeBoxplot, getSpecifiedTagEventTypeBoxplot, getSuitablePatients, getPatientLocationTimeline, getPatientTimeline, getPatientHoursAndDays } from './GraphAxios';
import spinner from '../../../src/Spinner.svg';
import { GetTagEventBoxplotOption } from './options/TagEventBoxplot';
import { SelectedTagEventBoxplot } from './options/SelectedTagEventBoxplot';
import { GetPatientTimeLine } from './options/PatientTimeLine';
import { GetPatientTimeLinePie } from './options/PatientTimePie';
import { GetLocationTimeLine } from './options/LocationTimeLine';
import { GetPatientHoursAndDaysLine } from './options/PatientHoursAndDays';
import echarts from 'echarts'


class Graph2 extends React.Component {

    constructor(props) {
        super(props);

        props.loadInitialGraphDataStartedAction();
        props.getTagEventTypeBoxplotStartedAction();

        checkAuth()
            .then(() => {
                props.loginSuccessAction();
            })
            .then(() => {
                return getSuitablePatients()
            })
            .then(res => {
                props.getSuitableDeletedPatientsForGraphsAction(res.data);

                return getTagEventTypeBoxplot()
            })
            .then((res) => {
                props.getTagEventTypeBoxplotAction(res.data)

                if (props.tagEventTypeStore.tagEventTypes.length < 1) {
                    return getAllTagEventTypes()
                }
            })
            .then((res) => {
                props.fetchTagEventTypesAction(res.data);
                var tagEventTypes = res.data;
                this.setState({
                    selectedToTagEventType: tagEventTypes[tagEventTypes.length - 1], selectedTagEventTypeToChanged: false,
                    selectedFromTagEventType: tagEventTypes[0]
                })
                return getSpecifiedTagEventTypeBoxplot(tagEventTypes[0].id, tagEventTypes[tagEventTypes.length - 1].id)
            })
            .then(res => {
                if (res.data.length > 0) {
                    props.getSpecifiedTagEventTypeBoxplotAction(res.data);
                }
            })
            .catch(err => {
                if (!!err.response) {
                    if (err.response.status === 401) {
                        props.loginFailedAction();
                        browserHistory.push('/logout');
                    }
                }
            })
            .finally(() => {
                props.loadInitialGraphDataEndedAction();
                props.getTagEventTypeBoxplotEndedAction();
            })

        this.state = {
            selectedFromTagEventType: {},
            selectedToTagEventType: {},
            selectedTagEventTypeFromChanged: false,
            selectedTagEventTypeToChanged: false,
            selectedPatient: {},
            drawLocationTimeLine: false,
            drawPatientTimeLine: false,
            showDeletedPatientsModal: false

        }

        this.changeFirstDropdownItem = this.changeFirstDropdownItem.bind(this);
        this.changeSecondDropdownItem = this.changeSecondDropdownItem.bind(this);
        this.selectPatient = this.selectPatient.bind(this);
    }

    componentDidMount() {
        getPatientHoursAndDays()
            .then(res => {
                this.props.getPatientHoursAndDaysAction(res.data)
            })
    }
    changeFirstDropdownItem = (value) => {
        this.setState({
            selectedFromTagEventType: value, selectedTagEventTypeFromChanged: true
        })
        var that = this.props;

        getSpecifiedTagEventTypeBoxplot(value.id, this.state.selectedToTagEventType.id)
            .then(res => {
                if (res.data.length > 0) {
                    that.getSpecifiedTagEventTypeBoxplotAction(res.data);
                }
            })
    }

    changeSecondDropdownItem = (value) => {
        this.setState({
            selectedToTagEventType: value, selectedTagEventTypeToChanged: true
        })

        var that = this.props;

        getSpecifiedTagEventTypeBoxplot(this.state.selectedFromTagEventType.id, value.id)
            .then(res => {
                if (res.data.length > 0) {
                    that.getSpecifiedTagEventTypeBoxplotAction(res.data);
                }
            })
    }

    selectPatient(deletedPatient) {
        this.setState({
            drawLocationTimeLine: false,
            drawPatientTimeLine: false,
            selectedPatient: deletedPatient,
            showDeletedPatientsModal: false
        })

        var that = this.props;

        getPatientTimeline(deletedPatient.cardId)
            .then(res => {
                that.getPatientTimelineAction(res.data)
                this.setState({ drawPatientTimeLine: true })
            })
            .then(() => {
                return getPatientLocationTimeline(deletedPatient.cardId)
            })
            .then(res => {
                that.getPatientLocationTimelineAction(res.data)
                this.setState({ drawLocationTimeLine: true })
            })
    }

    handleExport = () => {
        debugger
        var chart = document.getElementById('1');
        var myChart = echarts.init(chart);

        var pica = myChart.getConnectedDataURL({
            type: 'png',
            pixelRatio: 1,
            backgroundColor: '#fff'
        });

        var download = document.createElement('a');
        download.target = '_blank';
        download.href = pica;
        download.download = "pica.png";

        var evt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: false
        });
        download.dispatchEvent(evt);
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

        const deletedPatients = this.props.graphStore.suitableDeletedPatients.map(deletedPatient => {
            return (
                <Table.Row textAlign='center' key={deletedPatient.id}>
                    <Table.Cell>{
                        deletedPatient.lastName.length > 10 ? (
                            deletedPatient.lastName.substring(0, 10) + '...'
                        ) : (
                                deletedPatient.lastName
                            )}
                    </Table.Cell>
                    <Table.Cell>{deletedPatient.firstName}</Table.Cell>
                    <Table.Cell>{deletedPatient.cardId}</Table.Cell>
                    <Table.Cell>{deletedPatient.socialSecurityNumber}</Table.Cell>
                    <Table.Cell>
                        <div>
                            <Button
                                style={{ backgroundColor: '#efe1ba' }}
                                size='tiny'
                                content='Vybrat'
                                onClick={() => this.selectPatient(deletedPatient)} />
                        </div>
                    </Table.Cell>
                </Table.Row>
            )
        })



        if (this.props.loginStore.loggedIn) {
            return (
                this.props.graphStore.getTagEventTypeBoxplotDone && this.props.graphStore.loadGraphDataDone ? (
                    <Grid stackable container style={{ padding: '5em 0em' }}>
                        <Grid.Row>
                            <Header as='h2' dividing>
                                Krabicový graf jednotlivých událostí
                                <Header.Subheader>
                                    Data byla vykreslena z [{this.props.graphStore.suitableDeletedPatients ? this.props.graphStore.suitableDeletedPatients.length : ''}] pacientů.
                                </Header.Subheader>
                            </Header>
                        </Grid.Row>
                        <Grid.Row style={{ minHeight: '20em' }}>
                            <div style={tagEventTimeGraphStyle}>
                                <IEcharts
                                    resizable
                                    option={GetTagEventBoxplotOption(this.props.graphStore.tagEventTypeBoxplotData)} />
                            </div>
                        </Grid.Row>
                        <Grid.Row>
                            <Header as='h2' dividing>
                                Četnost výskytu pacienta
                            </Header>
                        </Grid.Row>
                        {this.props.graphStore.patientHoursAndDays && (
                            <Grid.Row style={{ minHeight: '20em' }}>
                                <div style={tagEventTimeGraphStyle}>
                                    <IEcharts
                                        resizable
                                        option={GetPatientHoursAndDaysLine(this.props.graphStore.patientHoursAndDays.hours, "hour")} />
                                </div>
                            </Grid.Row>
                        )}
                        {this.props.graphStore.patientHoursAndDays && (
                            <Grid.Row style={{ minHeight: '20em' }}>
                                <div style={tagEventTimeGraphStyle}>
                                    <IEcharts
                                        resizable
                                        option={GetPatientHoursAndDaysLine(this.props.graphStore.patientHoursAndDays.days, "day")} />
                                </div>
                            </Grid.Row>
                        )}
                        <Grid.Row>
                            <Header as='h2' dividing>
                                Statistická analýza specifického pacienta
                                {this.state.deletedPatient ? (<Header.Subheader>Vykreslován pacient s číslem karty [{this.state.deletedPatient.cardId}]</Header.Subheader>) : (<span></span>)}
                            </Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Button style={{ backgroundColor: '#006bab', color: 'white' }} onClick={() => this.setState({ showDeletedPatientsModal: true })}>Vybrat pacienta</Button>
                            <Modal
                                open={this.state.showDeletedPatientsModal}
                                onClose={() => this.setState({ showDeletedPatientsModal: false })}>
                                <Modal.Header>Ukončená měření</Modal.Header>
                                <Modal.Content image scrolling>
                                    <Table textAlign='center' compact sortable padded celled selectable striped fixed style={{ padding: '0 0 0 0' }}>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={1}>Příjmení</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={1}>Jméno</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Číslo karty</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} width={2}>Rodné číslo</Table.HeaderCell>
                                                <Table.HeaderCell style={{ backgroundColor: '#80808036' }} className='infoButt' width={2}>Akce</Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {deletedPatients}
                                        </Table.Body>
                                    </Table>
                                </Modal.Content>
                            </Modal>
                        </Grid.Row>
                        <Grid.Row style={{ minHeight: this.props.graphStore.patientLocationTimelineData.length > 0 ? '20em' : '0em' }}>
                            {
                                this.props.graphStore.patientLocationTimelineData.length > 0 ? (
                                    <div style={timelineGraphStyle}>
                                        <IEcharts
                                            resizable
                                            option={GetLocationTimeLine(this.props.graphStore.patientLocationTimelineData)} />
                                    </div>
                                ) : (
                                        <div>
                                            {
                                                this.state.drawLocationTimeLine ? (
                                                    <Header as='h3'>
                                                        <Message warning>
                                                            Nejsou dostupná data pro vykreslení lokace
                                            </Message>
                                                    </Header>
                                                ) : (
                                                        <div></div>
                                                    )
                                            }

                                        </div>
                                    )
                            }
                        </Grid.Row>
                        <Grid.Row style={{ minHeight: this.props.graphStore.patientTimelineData.length > 0 ? '20em' : '0em' }}>
                            {
                                this.state.drawPatientTimeLine ? (
                                    <div style={timelineGraphStyle}>
                                        <IEcharts
                                            resizable
                                            option={GetPatientTimeLine(this.props.graphStore.patientTimelineData)} />
                                    </div>
                                ) : (
                                        <div></div>
                                    )
                            }
                        </Grid.Row>
                        <Grid.Row style={{ minHeight: this.props.graphStore.patientTimelineData.length > 0 ? '30em' : '0em' }} textAlign='center' floated='center'>
                            {
                                this.state.drawPatientTimeLine ? (
                                    <div style={PieGraphStyle}>
                                        <IEcharts
                                            resizable
                                            option={GetPatientTimeLinePie(this.props.graphStore.patientTimelineData)} />
                                    </div>
                                ) : (
                                        <div></div>
                                    )
                            }
                        </Grid.Row>
                    </Grid>
                ) : (
                        <div style={{ textAlign: 'center' }} >
                            <Image verticalAlign='middle' size='large' src={spinner} />
                        </div>
                    )
            )
        }
        else {
            return null
        }
    }
}


function mapStateToProps(state) {
    return {
        tagEventTypeStore: state.TagEventTypeReducer,
        loginStore: state.LoginReducer,
        graphStore: state.GraphReducer
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loginSuccessAction: loginSuccessAction,
        loginFailedAction: loginFailedAction,
        loadInitialGraphDataStartedAction: loadInitialGraphDataStartedAction,
        fetchTagEventTypesAction: fetchTagEventTypesAction,
        loadInitialGraphDataEndedAction: loadInitialGraphDataEndedAction,
        getTagEventTypeBoxplotStartedAction: getTagEventTypeBoxplotStartedAction,
        getTagEventTypeBoxplotEndedAction: getTagEventTypeBoxplotEndedAction,
        getTagEventTypeBoxplotAction: getTagEventTypeBoxplotAction,
        getSpecifiedTagEventTypeBoxplotAction: getSpecifiedTagEventTypeBoxplotAction,
        getSuitableDeletedPatientsForGraphsAction: getSuitableDeletedPatientsForGraphsAction,
        getPatientTimelineAction: getPatientTimelineAction,
        getPatientLocationTimelineAction: getPatientLocationTimelineAction,
        getPatientHoursAndDaysAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph2);
