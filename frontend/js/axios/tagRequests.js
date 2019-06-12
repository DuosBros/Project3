import axios from 'axios';
import {url} from '../appConfig';    

import { buildAuthorizationHeader } from '../helpers/helpers-operations';

export function getAllTags() {
    var config = buildAuthorizationHeader("get");
    if(config) {
        return axios.get(url + 'tags', config);
    }
}

