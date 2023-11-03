import React, { Component } from 'react';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';

import Prices from './Prices';
import Settings from './Settings';
import Wallet from './Wallet';
import WalletLTC from './WalletLTC';
import Withdrawals from './Withdrawals';
import MassWithdrawals from './MassWithdrawals';
import Coworkers from './Coworkers';
import Dispansers from './Dispansers';

class AdminSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { props } = this;

    return (
      <div className="row">
        <div className="col-lg-3">
          <div className="xtabs xtabs_left animate__animated animate__fadeIn">
            <div className="xtabs__body font-m">
              <NavLink
                exact
                to={`${props.match.url}/settings`}
                activeClassName="active"
                className="xtabs__item"
              >
                Общие
              </NavLink>

              <NavLink
                exact
                to={`${props.match.url}/wallet/btc`}
                activeClassName="active"
                className="xtabs__item"
              >
                Кошелек BTC
              </NavLink>

              <NavLink
                exact
                to={`${props.match.url}/wallet/ltc`}
                activeClassName="active"
                className="xtabs__item"
              >
                Кошелек LTC
              </NavLink>

              <NavLink
                exact
                to={`${props.match.url}/prices`}
                activeClassName="active"
                className="xtabs__item"
              >
                Платные услуги
              </NavLink>

              <NavLink
                exact
                to={`${props.match.url}/withdrawals`}
                activeClassName="active"
                className="xtabs__item"
              >
                Выводы
              </NavLink>

              <NavLink
                exact
                to={`${props.match.url}/masswith`}
                activeClassName="active"
                className="xtabs__item"
              >
                Массовый выводы

              </NavLink>

              <NavLink
                exact
                to={`${props.match.url}/coworkers`}
                activeClassName="active"
                className="xtabs__item"
              >
                Сотрудники
              </NavLink>

              <NavLink
                exact
                to={`${props.match.url}/dispansers`}
                activeClassName="active"
                className="xtabs__item"
              >
                Профили ТГ
              </NavLink>
            </div>
          </div>
        </div>
        <div className="col-lg-9">

          <Switch>
            <Route exact path={`${props.match.path}/settings`} component={Settings} />
            <Route exact path={`${props.match.path}/wallet/btc`} component={Wallet} />
            <Route exact path={`${props.match.path}/wallet/ltc`} component={WalletLTC} />
            <Route exact path={`${props.match.path}/prices`} component={Prices} />
            <Route exact path={`${props.match.path}/withdrawals`} component={Withdrawals} />
            <Route exact path={`${props.match.path}/masswith`} component={MassWithdrawals} />
            <Route exact path={`${props.match.path}/coworkers`} component={Coworkers} />
            <Route exact path={`${props.match.path}/dispansers`} component={Dispansers} />

            <Route render={() => <Redirect to={`${props.match.path}/settings`} />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default AdminSettings;
