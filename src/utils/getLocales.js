import axios from 'axios';
import { apiUrl } from 'variables';

let locales = {};

const getLocalesFile = (callback) => {
  axios.get(`${apiUrl}/getLocales.json`)
    .then((response) => {
      locales = response.data;
      callback();
    });
};

const getLocales = (text) => {
  const lang = localStorage.getItem('lang');

  switch (lang) {
    case 'RU':
      return text;
    default:
      if (locales[lang]) {
        if (locales[lang][text]) {
          return locales[lang][text];
        }

        return text;
      }

      return text;
  }
};

export { getLocalesFile, getLocales };
