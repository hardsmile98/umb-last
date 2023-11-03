import React, { Component } from 'react';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';
import CryptoWallets from './Cryptowallets';

class Wallets extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { props } = this;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-9">
            <Switch>
              <Route exact path={`${props.match.path}/cryptowallets`} component={CryptoWallets} />

              <Route render={() => <Redirect to="/dashboard/wallets/cryptowallets" />} />
            </Switch>

          </div>

          <div className="col-lg-3">
            <div className="xtabs xtabs_left animate__animated animate__fadeIn">
              <div className="xtabs__body font-m">
                <NavLink
                  to={`${props.match.path}/cryptowallets`}
                  activeClassName="active"
                  className="xtabs__item"
                >
                  Криптокошельки
                </NavLink>

                <NavLink
                  to={`${props.match.path}/qiwi`}
                  activeClassName="active"
                  className="xtabs__item"
                >
                  Qiwi
                </NavLink>

                <NavLink
                  to={`${props.match.path}/globalmoney`}
                  activeClassName="active"
                  className="xtabs__item"
                >
                  GlobalMoney
                </NavLink>

                <NavLink
                  to={`${props.match.path}/kunaio`}
                  activeClassName="active"
                  className="xtabs__item"
                >
                  Kuna.IO
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Wallets;
