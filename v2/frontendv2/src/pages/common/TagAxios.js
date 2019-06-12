import axios from 'axios';
import {url} from '../../appConfig';    
import { authHeader } from '../../helpers/authHeader';

export function getAllTags() {
    return axios.get(url + 'tags',  authHeader());
}

