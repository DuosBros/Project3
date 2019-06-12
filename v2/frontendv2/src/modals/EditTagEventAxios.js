import axios from 'axios';
import {url} from '../appConfig';    
import { authHeader } from '../helpers/authHeader';

export function saveTagEvent(tagEvent) {
    return axios.put(url + 'tagevents',tagEvent, authHeader());
}

