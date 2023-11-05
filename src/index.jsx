import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

import 'assets/styles/bootstrap.css';
import 'assets/styles/fonts.css';
import 'assets/styles/style.default.css';
import 'assets/styles/index.css';

import moment from 'moment';
import localization from 'moment/locale/ru';

import Routes from 'Routes';

moment.updateLocale('ru', localization);

ReactDOM.render(<Routes />, document.getElementById('root'));
