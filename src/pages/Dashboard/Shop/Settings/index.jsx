/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';
import { getLocales } from 'utils';
import Settings from './Settings';
import Employees from './Employees';
import Employeer from './Employeer';
import Paymethods from './Paymethods';

class ShopSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="row margin-15">
        <div className="col-lg-3">
          <div className="xtabs xtabs_left animate__animated animate__fadeIn">
            <div className="xtabs__body font-m">
              <NavLink
                exact
                to={`${this.props.match.url}`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Настройки')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/paymethods`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Способы оплаты')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/employees`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Сотрудники')}
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <Switch>
            <Route exact path={`${this.props.match.path}`} component={Settings} />
            <Route exact path={`${this.props.match.path}/employees`} component={Employees} />
            <Route exact path={`${this.props.match.path}/paymethods`} component={Paymethods} />
            <Route path={`${this.props.match.path}/employees/new`} component={Employeer} />
            <Route path={`${this.props.match.path}/employees/:id`} component={Employeer} />

            <Route render={() => <Redirect to={`/dashboard/shops/${this.props.match.params.shopId}/settings`} />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default ShopSettings;
