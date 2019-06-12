import axios from 'axios';
import {url} from '../../appConfig';    

import { authHeader } from '../../helpers/authHeader';

export function getAllPatients(showDeleted, maxPatients) {
    return axios.get(url + 'patients?showdeleted=' + showDeleted + '&maxPatients=' + maxPatients, authHeader());
}
