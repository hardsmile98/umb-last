import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter,
} from 'react-router-dom';
import { Zoom, ToastContainer } from 'react-toastify';
import Dashboard from 'pages/Dashboard';
import Auth from 'pages/Auth';

function Routes() {
  const isAuth = localStorage.getItem('token');

  return (
    <>
      <ToastContainer
        autoClose={1500}
        transition={Zoom}
        closeButton={false}
        hideProgressBar
      />

      <BrowserRouter>
        <Switch>
          <Route
            path="/security"
            render={(props) => (isAuth
              ? <Redirect to="/dashboard" />
              : <Auth {...props} />)}
          />

          <Route
            path="/dashboard"
            render={(props) => (isAuth
              ? <Dashboard {...props} />
              : <Redirect to="/security" />)}
          />

          <Route render={(props) => (isAuth
            ? <Redirect to="/dashboard" {...props} />
            : <Redirect to="/security" {...props} />)}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default Routes;
