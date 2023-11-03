import React, { Component } from 'react';
import { toast } from 'react-toastify';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';

import { request } from 'utils';
import Users from './Users';
import Shops from './Shops';
import Payments from './Payments';
import UserProfile from './UserProfile';
import Statistics from './Statistics';

let interval = '';

class DatasAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: {
        users: 0,
        shops: 0,
        balanceSum: 0,
        turnovers: {},
        allSum: 0,
        withs: 0,
        shopCount: 0,
        earn: 0,
      },
      withs: 0,
    };

    this.getData = this.getData.bind(this);
    this.compileExchange = this.compileExchange.bind(this);
  }

  componentDidMount() {
    this.getData();
    interval = setInterval(this.getData, 10000);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  getData() {
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'datas',
          type: 'getv2',
          today: +new Date().setHours(0, 0, 0, 0),
        },
        action: 'admin',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            data: response.data.data,
          }, () => {
            this.setState({
              loading: false,
            });
          });
        } else {
          this.setState({
            loading: false,
          });
          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  compileExchange() {
    const { state } = this;

    const today = +new Date().setHours(0, 0, 0, 0);
    const shops = [];

    state.exchanges.forEach((item) => {
      if (+item.closed >= today) {
        if (!shops.includes(item.shop)) {
          shops.push(item.shop);
        }
      }
    });

    let withs = 0;

    if (state.withs.length > 0) {
      state.withs.forEach((item) => {
        withs += +item.sum;
      });
    }

    this.setState({
      withs: withs.toFixed(8),
    });
  }

  render() {
    const { state, props } = this;

    return (
      <div className="row">
        <div className="col-lg-2">
          <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
            <h5>
              <span>Пользователей / Магазинов</span>
            </h5>

            <h2>
              <span>
                {state.data.users}
                {' / '}
                {state.data.shops}
              </span>
            </h2>
          </div>
        </div>

        {props.user.type === 'superadmin' && (
        <>
          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5>
                <span>Сумма балансов</span>
              </h5>

              <h2>
                <span>
                  {state.data.balanceSum.toFixed(8)}
                  {' BTC'}
                </span>
              </h2>
            </div>
          </div>

          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5>
                <span>Массовый вывод</span>
              </h5>

              <h2>
                <span className={state.data.withs > 0 ? 'text-danger' : ''}>
                  {state.data.withs.toFixed(8)}
                  {' BTC'}
                </span>
              </h2>
            </div>
          </div>

          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5>
                <span>Оборот за 30 дней</span>
              </h5>

              <h2>
                <span>
                  {state.data.allSum.toFixed(8)}
                  {' BTC'}
                </span>
              </h2>
            </div>
          </div>

          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5>
                <span>
                  Магазинов с продажами сегодня
                </span>
              </h5>

              <h2>
                <span>
                  {state.data.shopCount}
                </span>
              </h2>
            </div>
          </div>

          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5>
                <span>Доход за сегодня</span>
              </h5>

              <h2>
                <span>
                  {state.data.earn
                    ? state.data.earn.toFixed(8)
                    : 0}
                  {' BTC'}
                </span>
              </h2>
            </div>
          </div>

          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5><span>Общий оборот за сегодня</span></h5>
              <h2>
                <span>
                  {state.data.turnovers.ALL
                    ? state.data.turnovers.ALL.toFixed(8)
                    : 0}
                  {' BTC'}
                </span>
              </h2>
            </div>
          </div>

          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5>
                <span>Оборот за сегодня</span>
              </h5>
              <h2>
                <span>
                  {state.data.turnovers.CARDRUB
                    ? Math.round(state.data.turnovers.CARDRUB)
                    : 0}
                  {' CARDRUB'}
                </span>
              </h2>
            </div>
          </div>

          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5>
                <span>Оборот за сегодня</span>
              </h5>

              <h2>
                <span>
                  {state.data.turnovers.BTC
                    ? state.data.turnovers.BTC.toFixed(6)
                    : 0}
                  {' BTC'}
                </span>
              </h2>
            </div>
          </div>

          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5>
                <span>Оборот за сегодня</span>
              </h5>

              <h2>
                <span>
                  {state.data.turnovers.LTC
                    ? state.data.turnovers.LTC.toFixed(4)
                    : 0}
                  {' LTC'}
                </span>
              </h2>
            </div>
          </div>

          <div className="col-lg-2">
            <div className={`income font-m animate__animated animate__fadeIn ${state.loading ? 'blur' : ''}`}>
              <h5>
                <span>Оборот за сегодня</span>
              </h5>

              <h2>
                <span>
                  {state.data.turnovers.CARDKZT
                    ? Math.round(state.data.turnovers.CARDKZT)
                    : 0}
                  {' CARDKZT'}
                </span>
              </h2>
            </div>
          </div>
        </>
        )}

        <div className="col-lg-12">
          <div className="xtabs xtabs_bottom">
            <div className="xtabs__body">
              <NavLink
                to={`${props.match.url}/users`}
                className="xtabs__item font-m"
                activeClassName="active"
              >
                <span> Пользователи</span>
              </NavLink>

              <NavLink
                to={`${props.match.url}/shops`}
                className="xtabs__item font-m"
                activeClassName="active"
              >
                <span> Магазины</span>
              </NavLink>

              <NavLink
                to={`${props.match.url}/payments`}
                className="xtabs__item font-m"
                activeClassName="active"
              >
                <span> Платежи</span>
              </NavLink>

              <NavLink
                to={`${props.match.url}/statistics`}
                className="xtabs__item font-m"
                activeClassName="active"
              >
                <span> Статистика</span>
              </NavLink>
            </div>
          </div>

          <Switch>
            <Route exact path={`${props.match.path}/users`} component={Users} />
            <Route path={`${props.match.path}/users/:id`} component={UserProfile} />
            <Route exact path={`${props.match.path}/shops`} component={Shops} />
            <Route exact path={`${props.match.path}/payments`} component={Payments} />
            <Route exact path={`${props.match.path}/statistics`} component={Statistics} />

            <Route render={() => <Redirect to={`${props.match.path}/users`} />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default DatasAdmin;
