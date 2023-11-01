import React from 'react';
import ReactDOM from 'react-dom';
import {
  Switch, Route, Redirect, BrowserRouter,
} from 'react-router-dom';
import { Zoom, ToastContainer } from 'react-toastify';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import './bootstrap.css';
import './style.default.css';
import './index.css';

import moment from 'moment';
import localization from 'moment/locale/ru';
import Dashboard from './Panel/Dashboard/index';
import AuthModule from './Panel/AuthModule';

moment.updateLocale('ru', localization);

ReactDOM.render(
  <BrowserRouter>

    <ToastContainer autoClose={1500} transition={Zoom} closeButton={false} hideProgressBar />

    <Switch>
      <Route
        path="/security"
        render={(props) => (localStorage.getItem('token')
          ? <Redirect to="/dashboard" />
          : <AuthModule {...props} />)}
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
