import axios from 'axios';
import {url} from '../../appConfig';    
import { authHeader } from '../../helpers/authHeader';

export function getAllTagRegistrations() {
    return axios.get(url + 'tagregistrations',  authHeader());
}

