import axios from 'axios';
import {url} from '../../appConfig';

import { authHeader } from '../../helpers/authHeader';

export function getAllPatients(showDeleted, maxPatients) {
    return axios.get(url + 'patients?showdeleted=' + showDeleted + '&maxPatients=' + maxPatients, authHeader());
}

export function deletePatient(id) {
    return axios.delete(url + 'patients/' + id, authHeader());
}

export function getPatientsLocations(ids) {
    return axios.get(url + 'taglocations?patientIds=' + ids, authHeader())
}