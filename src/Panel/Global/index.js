const { default: axios } = require('axios');

const api = window.location.hostname.indexOf('.onion') > -1 ? 'http://o5thcbe4ud7agx3mdhuis7u5hdjmbmc7ekbz2kyrrnrb6fenictzl7yd.onion' : 'https://apis.umbrella.day';

let locales = {};

const getLocalesFile = (callback) => {
  axios.get(`${api}/getLocales.json`)
    .then((response) => {
      locales = response.data;
      callback();
    });
};

module.exports.getLocalesFile = getLocalesFile;

const createRequest = (data, callback) => {
  axios.post(`${api}/${data.api}`, data.body, { headers: data.headers })
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

module.exports.createRequest = createRequest;

const getLocales = (text) => {
  switch (localStorage.getItem('lang')) {
    case 'RU':
      return text;
    default:
      if (locales[localStorage.getItem('lang')]) {
        if (locales[localStorage.getItem('lang')][text]) {
          return locales[localStorage.getItem('lang')][text];
        }

        return text;
      }

      return text;
  }
};

module.exports.getLocales = getLocales;

const getTitle = (path) => path.slice(1, path.lenght).split('/').join(' / ')
  .replace(/dashboard/g, 'Панель управления')
  .replace(/home/g, 'Главная')
  .replace(/profile/g, 'Профиль')
  .replace(/settings/g, 'Настройки')
  .replace(/security/g, 'Безопасность')
  .replace(/activities/g, 'Активность')
  .replace(/partner/g, 'Партнерская программа')
  .replace(/support/g, 'Поддержка')
  .replace(/tickets/g, 'Запросы в поддержку')
  .replace(/ticket/g, 'Запросы в поддержку')
  .replace(/new/g, 'Новый')
  .replace(/finance/g, 'Финансы')
  .replace(/faq/g, 'База знаний')
  .replace(/cryptowallets/g, 'Криптокошельки')
  .replace(/wallets/g, 'Кошельки')
  .replace(/qiwi/g, 'Qiwi')
  .replace(/shops/g, 'Магазины')
  .replace(/statistics/g, 'Статистика')
  .replace(/shipment/g, 'Продукция')
  .replace(/datas/g, 'Данные')
  .replace(/bots/g, 'Боты')
  .replace(/site/g, 'Сайт')
  .replace(/settings/g, 'Настройки')
  .replace(/feedback/g, 'Обратная связь');

module.exports.getTitle = getTitle;
