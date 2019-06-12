import axios from 'axios';
import {url} from '../../appConfig';    
import { authHeader } from '../../helpers/authHeader';

export function getTagEventsByPatientId(id) {
    return axios.get(url + 'tagevents?patientid=' + id,  authHeader());
}

export function getTagEventsByTagId(id) {
    return axios.get(url + 'tagevents?tagid=' + id,  authHeader());
}

export function getTagEvents() {
    return axios.get(url + 'tagevents',  authHeader());
}

export function putTagEvents(tagEvents) {
    return axios.put(url + 'tagEvents', tagEvents, authHeader());
}