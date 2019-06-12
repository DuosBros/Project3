import axios from 'axios';
import {url} from '../appConfig';    

import { buildAuthorizationHeader } from '../helpers/helpers-operations';

export function getAllPatients(showDeleted, maxPatients) {
    var config = buildAuthorizationHeader("get");
    if(config) {
        return axios.get(url + 'patients?showdeleted=' + showDeleted + '&maxPatients=' + maxPatients, config);
    }
}

