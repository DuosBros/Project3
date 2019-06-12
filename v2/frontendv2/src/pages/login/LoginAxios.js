import axios from 'axios';
import {url} from '../../appConfig';    
import {authHeader} from '../../helpers/authHeader';

export function sendAuth(user) {
    return axios.post(url + 'users', user);    
}

export function checkAuth(user) {
    return axios.get(url + 'users', authHeader());    
}

