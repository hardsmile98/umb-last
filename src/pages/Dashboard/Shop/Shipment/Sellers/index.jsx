/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  NavLink, Switch, Route, Redirect,
} from 'react-router-dom';
import { getLocales } from 'utils';
import SellersList from './List';
import SellersAdd from './Add';
import ModerSellers from './Moder';
import DeletedSellers from '../DeletedSellers';

class SellersNavi extends Component {
  render() {
    return (
      <div className="row margin-15">
        <div className="col-lg-3">
          <div className="xtabs xtabs_left animate__animated animate__fadeIn">
            <div className="xtabs__body font-m">
              <NavLink
                exact
                to={`${this.props.match.url}/actual`}
                activeClassName="active"
                className="xtabs__item"
              >
                {this.props.admin
                  ? getLocales('Адреса в продаже')
                  : getLocales('Адреса')}
                {' '}
                {this.props.sellers
                  ? (
                    <span className="badge badge-secondary">
                      {+this.props.sellers - +this.props.sellersModer}
                    </span>
                  )
                  : ''}
              </NavLink>

              <NavLink
                exact
                to={`${this.props.match.url}/add`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Добавление адресов')}

              </NavLink>

              {this.props.admin
                ? (
                  <>
                    <NavLink
                      exact
                      to={`${this.props.match.url}/moderation`}
                      activeClassName="active"
                      className="xtabs__item"
                    >
                      {getLocales('Адреса для проверки')}
                      {' '}
                      {this.props.sellersModer
                        ? <span className="badge badge-danger">{this.props.sellersModer}</span>
                        : ''}
                    </NavLink>

                    <NavLink
                      exact
                      to={`${this.props.match.url}/deleted`}
                      activeClassName="active"
                      className="xtabs__item"
                    >
                      {getLocales('Удаленные адреса')}
                    </NavLink>
                  </>
                )
                : ''}
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <Switch>
            <Route exact path={`${this.props.match.path}/actual`} render={(props) => <SellersList {...props} admin={this.props.admin} />} />
            <Route exact path={`${this.props.match.path}/add`} render={(props) => <SellersAdd {...props} admin={this.props.admin} />} />
            <Route exact path={`${this.props.match.path}/deleted`} component={DeletedSellers} />
            <Route exact path={`${this.props.match.path}/moderation`} component={ModerSellers} />

            <Route render={() => <Redirect to={`/dashboard/shops/${this.props.match.params.shopId}/shipment/sellers/actual`} />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default SellersNavi;
