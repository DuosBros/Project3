import axios from 'axios';
import {url} from '../appConfig';    

import { buildAuthorizationHeader } from '../helpers/helpers-operations';

export function getAllTagEvents() {
    var config = buildAuthorizationHeader("get");
    if(config) {
        return axios.get(url + 'tagevents', config);
    }
}

