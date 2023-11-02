import axios from 'axios';
import { apiUrl } from '../constants';
import { getLocales } from './getLocales';

const request = (data, callback) => {
  axios.post(`${apiUrl}/${data.api}`, data.body, { headers: data.headers })
    .then((response) => {
      if (response.data.exit) {
        localStorage.removeItem('token');

        callback(response);
      } else {
        if (response.data.message) {
          response.data.message = getLocales(response.data.message);
        }

        callback(response);
      }
    });
};

export { request };
