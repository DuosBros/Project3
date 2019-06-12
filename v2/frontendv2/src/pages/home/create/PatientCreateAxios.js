import axios from 'axios';
import {url} from '../../../appConfig';    

import { authHeader } from '../../../helpers/authHeader';

export function createPatient(patient) {
    return axios.post(url + 'patients', patient, authHeader());
}