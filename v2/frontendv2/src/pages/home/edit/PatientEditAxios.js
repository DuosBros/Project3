import axios from 'axios';
import {url} from '../../../appConfig';    

import { authHeader } from '../../../helpers/authHeader';

export function savePatient(patient) {
    return axios.put(url + 'patients', patient, authHeader());
}
