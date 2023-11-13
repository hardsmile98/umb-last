/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';
import { getLocales } from 'utils';
import Userspam from './Userspam';
import ActivePresellers from './ActivePresellers';
import ActivePurchases from './ActivePurchases';
import PurchaseItem from './Purchase';
import Purchases from './Purchases';
import Reviews from './Reviews';
import UserProfile from './UserProfile';
import DataUsers from './Users';
import Topups from './Topups';

class Datas extends Component {
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
                to={`${this.props.match.url}/users`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Покупатели')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/purchases`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Покупки')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/activeorders`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Активные заказы')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/presellers`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Предзаказы')}
                {' '}
                {this.props.presellers
                  ? <span className="badge badge-danger">{this.props.presellers}</span>
                  : ''}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/topups`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Пополнения')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/massspam`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Массовая рассылка TG')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/reviews`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Отзывы')}
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <Switch>
            <Route exact path={`${this.props.match.path}/users`} component={DataUsers} />
            <Route path={`${this.props.match.path}/users/:userId`} component={UserProfile} />
            <Route exact path={`${this.props.match.path}/purchases`} component={Purchases} />
            <Route exact path={`${this.props.match.path}/activeorders`} component={ActivePurchases} />
            <Route exact path={`${this.props.match.path}/massspam`} component={Userspam} />
            <Route exact path={`${this.props.match.path}/topups`} component={Topups} />
            <Route path={`${this.props.match.path}/purchases/:purchaseId`} component={PurchaseItem} />
            <Route exact path={`${this.props.match.path}/presellers`} component={ActivePresellers} />
            <Route exact path={`${this.props.match.path}/reviews`} component={Reviews} />

            <Route render={() => <Redirect to={`/dashboard/shops/${this.props.match.params.shopId}/datas/users`} />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Datas;
