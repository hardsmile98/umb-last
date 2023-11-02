import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import ReactFlagsSelect from 'react-flags-select';
import bg from '../../assets/images/background.png';

import Login from './Login';
import Regisration from './Registration';
import RecoveryPage from './Recovery';

import { getLocalesFile } from '../../utils';

class AuthPage extends Component {
  componentDidMount() {
    getLocalesFile(() => {
      if (!localStorage.getItem('lang')) {
        localStorage.setItem('lang', 'RU');

        this.forceUpdate();
      } else {
        this.forceUpdate();
      }
    });
  }

  render() {
    return (
      <div className="auth-module">

        <ReactFlagsSelect
          className="form-control lang-pick"
          selected={localStorage.getItem('lang') ? localStorage.getItem('lang').replace('EN', 'GB') : ''}
          countries={['RU', 'UA', 'GB', 'ES']}
          customLabels={{
            GB: 'English',
            RU: 'Русский',
            UA: 'Український',
            ES: 'Español',
          }}
          onSelect={(code) => {
            const newCode = code.replace('GB', 'EN');
            localStorage.setItem('lang', newCode);
            this.forceUpdate();
          }}
        />

        <div className="container">
          <div className="row">

            <img className="bg" alt="background" src={bg} />

            <div className="col-lg-2" />

            <div className="col-lg-8">
              <Switch>
                <Route path={`${this.props.match.path}/authorization`} component={Login} />
                <Route path={`${this.props.match.path}/registration`} component={Regisration} />
                <Route path={`${this.props.match.path}/recovery`} component={RecoveryPage} />
                <Route render={(_props) => (
                  <Redirect to={{ pathname: `${this.props.match.path}/authorization` }} />
                )}
                />
              </Switch>

              <div className="footer">
                {'Umbrella Corp. '}
                {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthPage;
