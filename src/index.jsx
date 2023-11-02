import React from 'react';
import ReactDOM from 'react-dom';
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter,
} from 'react-router-dom';
import { Zoom, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

import 'assets/styles/bootstrap.css';
import 'assets/styles/fonts.css';
import 'assets/styles/style.default.css';
import 'assets/styles/index.css';

import moment from 'moment';
import localization from 'moment/locale/ru';

import Dashboard from 'pages/Dashboard';
import Auth from 'pages/Auth';

moment.updateLocale('ru', localization);

ReactDOM.render(
  <BrowserRouter>
    <ToastContainer
      autoClose={1500}
      transition={Zoom}
      closeButton={false}
      hideProgressBar
    />

    <Switch>
      <Route
        path="/security"
        render={(props) => (localStorage.getItem('token')
          ? <Redirect to="/dashboard" />
          : <Auth {...props} />)}
      />

      <Route
        path="/dashboard"
        render={(props) => (localStorage.getItem('token')
          ? <Dashboard {...props} />
          : <Redirect to="/security" />)}
      />

      <Route render={(props) => (localStorage.getItem('token')
        ? <Redirect to="/dashboard" {...props} />
        : <Redirect to="/security" {...props} />)}
      />

    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);
