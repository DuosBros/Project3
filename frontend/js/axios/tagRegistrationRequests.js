import axios from 'axios';
import {url} from '../appConfig';    

import { buildAuthorizationHeader } from '../helpers/helpers-operations';

export function getAllTagRegistrations() {
    var config = buildAuthorizationHeader("get");
    
    if(config) {
        return axios.get(url + 'tagregistrations', config);
    }
    else{
        throw 'NotAuthenticated';  
    }
}

