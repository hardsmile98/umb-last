import React from 'react';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';

import Settings from './Settings';
import Security from './Security';
import Activities from './Activities';
import Referral from './Referral';

function Profile() {
  const { props } = this;

  return (
    <div className="row">
      <div className="col-lg-3">
        <div className="xtabs xtabs_left animate__animated animate__fadeIn">
          <div className="xtabs__body font-m">
            <NavLink
              to={`${props.match.path}/settings`}
              activeClassName="active"
              className="xtabs__item"
            >
              {global.getLocales('Настройки аккаунта')}
            </NavLink>

            <NavLink
              to={`${props.match.path}/security`}
              activeClassName="active"
              className="xtabs__item"
            >
              {global.getLocales('Безопасность')}
            </NavLink>

            <NavLink
              to={`${props.match.path}/activities`}
              activeClassName="active"
              className="xtabs__item"
            >
              {global.getLocales('Активность')}
            </NavLink>

            <NavLink
              to={`${props.match.path}/partner`}
              activeClassName="active"
              className="xtabs__item"
            >
              {global.getLocales('Партнерская программа')}
            </NavLink>
          </div>
        </div>
      </div>

      <div className="col-lg-9">
        <Switch>
          <Route path={`${props.match.path}/settings`} component={Settings} />
          <Route path={`${props.match.path}/security`} component={Security} />
          <Route path={`${props.match.path}/activities`} component={Activities} />
          <Route path={`${props.match.path}/partner`} component={Referral} />

          <Route render={() => <Redirect to="/dashboard/profile/settings" />} />
        </Switch>
      </div>
    </div>
  );
}

export default Profile;
