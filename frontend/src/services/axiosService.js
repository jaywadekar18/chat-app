import  axios from 'axios'
import {getValueFromLocalStorage} from './localStorageService'
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    'Authorization': `Bearer ${getValueFromLocalStorage('authToken')}`
  }
});


export default axiosClient