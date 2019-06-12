import axios from 'axios';
import {url} from '../../appConfig';    
import { authHeader } from '../../helpers/authHeader';

export function getAllTagEventTypes() {
    return axios.get(url + 'tageventtypes',  authHeader());
}

