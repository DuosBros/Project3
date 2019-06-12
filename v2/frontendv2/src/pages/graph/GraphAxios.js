import axios from 'axios';
import { url } from '../../appConfig';
import { authHeader } from '../../helpers/authHeader';

export function getTagEventTypeBoxplot() {
    return axios.get(url + 'graphs/tagevent?startTagEventTypeId=null&endTagEventTypeId=null', authHeader());
}

export function getSpecifiedTagEventTypeBoxplot(startTagEventTypeId, endTagEventTypeId) {
    return axios.get(url + 'graphs/tagevent?startTagEventTypeId=' + startTagEventTypeId + '&endTagEventTypeId=' + endTagEventTypeId, authHeader());
}

export function getPatientTimeline(cardId) {
    return axios.get(url + 'graphs/timeline?cardId=' + cardId, authHeader());
}

export function getSuitablePatients() {
    return axios.get(url + 'graphs/patients', authHeader());
}

export function getPatientLocationTimeline(cardId) {
    return axios.get(url + 'graphs/location?cardId=' + cardId, authHeader());
}


export function getPatientHoursAndDays() {
    return axios.get(url + 'graphs/patientsTime', authHeader());
}