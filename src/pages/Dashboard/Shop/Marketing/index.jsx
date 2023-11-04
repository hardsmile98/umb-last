/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';
import { getLocales } from 'utils';
import Bonuses from './Bonuses';
import Promocodes from './Promocodes';

class Marketing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="row margin-15">
        <div className="col-lg-12">
          <div className="xtabs xtabs_bottom">
            <div className="xtabs__body">
              <NavLink
                to={`${this.props.match.url}/promocodes`}
                className="xtabs__item font-m"
                activeClassName="active"
              >
                <span>
                  {' '}
                  {getLocales('Промокоды')}
                </span>
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/bonuses`}
                className="xtabs__item font-m"
                activeClassName="active"
              >
                <span>
                  {' '}
                  {getLocales('Бонусная программа')}
                </span>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-lg-12 margin-15">
          <Switch>
            <Route exact path={`${this.props.match.path}/promocodes`} component={Promocodes} />
            <Route exact path={`${this.props.match.path}/bonuses`} component={Bonuses} />

            <Route render={() => <Redirect to={`/dashboard/shops/${this.props.match.params.shopId}/marketing/promocodes`} />} />
          </Switch>

        </div>
      </div>
    );
  }
}

export default Marketing;
