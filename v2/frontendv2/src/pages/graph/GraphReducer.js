const graphPageInitialState = {
    getTagEventTypeBoxplotDone: false,
    loadGraphDataDone: false,
    tagEventTypeBoxplotData: [],
    specifiedTagEventTypeBoxplotData: [],
    suitableDeletedPatients: [],
    patientTimelineData: [],
    patientLocationTimelineData: [],
    patientHoursAndDays: []
}

const GraphReducer = (state = graphPageInitialState, action) => {
    switch (action.type) {
        case 'GET_TAGEVENTTYPE_BOXPLOT_STARTED':
            return Object.assign({}, state, { getTagEventTypeBoxplotDone: false });
        case 'GET_TAGEVENTTYPE_BOXPLOT_ENDED':
            return Object.assign({}, state, { getTagEventTypeBoxplotDone: true });
        case 'LOAD_GRAPH_DATA_STARTED':
            return Object.assign({}, state, { loadGraphDataDone: false })
        case 'LOAD_GRAPH_DATA_ENDED':
            return Object.assign({}, state, { loadGraphDataDone: true })
        case 'GET_TAGEVENTTYPE_BOXPLOT':
            return Object.assign({}, state, { tagEventTypeBoxplotData: action.payload })
        case 'GET_SPECIFIED_TAGEVENTTYPE_BOXPLOT':
            return Object.assign({}, state, { specifiedTagEventTypeBoxplotData: action.payload })
        case 'GET_SUITABLE_DELETEDPATIENTS_FOR_GRAPHS':
            return Object.assign({}, state, { suitableDeletedPatients: action.payload })
        case 'GET_PATIENT_TIMELINE':
            return Object.assign({}, state, { patientTimelineData: action.payload })
        case 'GET_PATIENT_LOCATION_TIMELINE':
            return Object.assign({}, state, { patientLocationTimelineData: action.payload })
        case 'GET_PATIENT_HOURS_AND_DAYS':
            return Object.assign({}, state, { patientHoursAndDays: action.payload })

        default:
            return state;
    }
}

export default GraphReducer;