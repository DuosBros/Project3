import React from 'react';
import { Header, Grid, Form, Button, Modal, Table, Dropdown, Image, Message } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import IEcharts from 'react-echarts-v3'
import 'echarts/lib/chart/boxplot';

import { loginFailedAction, loginSuccessAction } from '../login/LoginAction';
import { checkAuth } from '../login/LoginAxios';
import {
    getPatientTimelineAction, getPatientLocationTimelineAction, getSuitableDeletedPatientsForGraphsAction, getSpecifiedTagEventTypeBoxplotAction, loadInitialGraphDataStartedAction, getTagEventTypeBoxplotAction,
    loadInitialGraphDataEndedAction, getTagEventTypeBoxplotEndedAction, getTagEventTypeBoxplotStartedAction
} from './GraphAction';
import { getAllTagEventTypes } from '../common/TagEventTypeAxios';
import { fetchTagEventTypesAction } from '../common/TagEventTypeAction';
import { getTagEventTypeBoxplot, getSpecifiedTagEventTypeBoxplot, getSuitablePatients, getPatientLocationTimeline, getPatientTimeline } from './GraphAxios';
import spinner from '../../../src/Spinner.svg';
import { GetTagEventBoxplotOption } from './options/TagEventBoxplot';
import { SelectedTagEventBoxplot } from './options/SelectedTagEventBoxplot';
import { GetPatientTimeLine } from './options/PatientTimeLine';
import { GetPatientTimeLinePie } from './options/PatientTimePie';
import { GetLocationTimeLine } from './options/LocationTimeLine';


class Graph3 extends React.Component {

    constructor(props) {
        super(props);



        this.state = {
            showDeletedPatientsModal: false
        }
    }

    componentDidMount() {
        this.props.loadInitialGraphDataStartedAction();

        checkAuth()
            .then(() => {
                this.props.loginSuccessAction();
            })
            .then(() => {
                return getSuitablePatients()
            })
            .catch(err => {
                if (!!err.response) {
                    if (err.response.status === 401) {
                        this.props.loginFailedAction();
                        this.props.history.push('/logout');
                    }
                }
            })
            .finally(() => {
                this.props.loadInitialGraphDataEndedAction();
                this.props.getTagEventTypeBoxplotEndedAction();
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

    render() {

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
                    <Table.Cell>{deletedPatient.cardId}</Table.Cell>
                    <Table.Cell>{deletedPatient.socialSecurityNumber}</Table.Cell>
                </Table.Row>
            )
        })

        if (this.props.loginStore.loggedIn) {
            return (this.props.graphStore.loadGraphDataDone ? (
                <Grid stackable container style={{ padding: '5em 0em' }}>
                    <Grid.Row>
                        <Header as='h2' dividing>
                            Krabicový graf intervalu mezi jednotlivými událostí
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
                        <Dropdown inline text={this.state.selectedFromTagEventType.note}>
                            <Dropdown.Menu>
                                {mappedTagEventsFrom}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown inline text={this.state.selectedToTagEventType.note}>
                            <Dropdown.Menu>
                                {mappedTagEventsTo}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Grid.Row>
                    <Grid.Row style={{ minHeight: '20em' }}>
                        <div style={tagEventTimeGraphStyle}>
                            <IEcharts
                                resizable
                                option={SelectedTagEventBoxplot(this.props.graphStore.specifiedTagEventTypeBoxplotData)} />
                        </div>
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
        getPatientLocationTimelineAction: getPatientLocationTimelineAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph2);
