/* eslint-disable global-require */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import {
  faWallet, faMoon, faSun, faBars,
} from '@fortawesome/free-solid-svg-icons/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';
import { toast } from 'react-toastify';

import { request, getLocales, getLocalesFile } from 'utils';

import logoblack from 'assets/images/logotypeblack.png';
import logo from 'assets/images/logotypewhite.png';
import logoblackpremium from 'assets/images/logoblackpremium.png';
import logowhitepremium from 'assets/images/logowhitepremium.png';

import HomePage from './Home';
import Profile from './Profile';
import Support from './Support';
import Wallets from './Wallets';
import Finance from './Finance';
import ShopNew from './ShopNew';
import Shop from './Shop';
import Shops from './Shops';
import ManageAdmin from './Manage';

let interval;

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shopCollapse: false,
      data: {
        user: {
          login: 'Test',
          debt: 0,
          balance: 0,
          theme: 'default',
          type: 'user',
          block: 0,
          premium: 0,
        },
        unreaded: 0,
        withdrawals: 0,
        unreadAdmin: 0,
      },
      menu: false,
    };
    this.changeCollapse = this.changeCollapse.bind(this);
    this.getData = this.getData.bind(this);
    this.exit = this.exit.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    getLocalesFile(() => {
      this.forceUpdate();
      this.getData();

      interval = setInterval(this.getData, 10000);
    });
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  getData() {
    const { props, state } = this;

    const data = {
      api: 'user',
      body: {
        data: {},
        action: 'getUser',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          if (state.data.user.theme !== response.data.data.user.theme) {
            localStorage.setItem('theme', response.data.data.user.theme);
          }

          if (localStorage.getItem('lang') !== response.data.data.user.lang) {
            localStorage.setItem('lang', response.data.data.user.lang);
            this.forceUpdate();
          }

          this.setState({
            data: response.data.data,
          });
        } else {
          toast.error(response.data.message);

          props.history.push('/security/authorization');
        }
      } else {
        toast.error(response.data.message);
      }
    });
  }

  changeTheme() {
    const { props } = this;

    const data = {
      api: 'user',
      body: {
        data: {},
        action: 'themeChange',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.getData();
        } else {
          toast.error(response.data.message);

          props.history.push('/security/authorization');
        }
      } else {
        toast.error(response.data.message);
      }
    });
  }

  exit() {
    const { props } = this;

    clearInterval(interval);

    const data = {
      api: 'user',
      body: {
        data: {},
        action: 'exit',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          localStorage.removeItem('token');
          toast.success(response.data.message);

          props.history.push('/security/authorization');
        } else {
          toast.error(response.data.message);

          props.history.push('/security/authorization');
        }
      } else {
        toast.error(response.data.message);
      }
    });
  }

  changeCollapse() {
    this.setState((prev) => ({
      shopCollapse: !prev.shopCollapse,
    }));
  }

  toggleMenu() {
    this.setState((prev) => ({
      menu: !prev.menu,
    }));
  }

  // TODO REFACTOR HEADER AND IMPORT DARK CSS
  render() {
    const { props, state } = this;

    return (
      <>
        <link
          rel="stylesheet"
          type="text/css"
          href={localStorage.getItem('theme') === 'dark' ? '/dark.css?v=4' : ''}
        />

        <header className="header">
          <nav className="navbar navbar-expand-lg">
            <div className="container-fluid d-flex align-items-center justify-content-between">
              {window.innerWidth <= 800
                ? (
                  <>
                    <div className="navbar-header">
                      <a className="navbar-brand">
                        <div
                          className="brand-text brand-big visible text-uppercase"
                        >
                          <img
                            alt="umbrella"
                            className="logotype-dash"
                            src={localStorage.getItem('theme') === 'dark'
                              ? (state.data.user.premium === 1
                                ? logoblackpremium : logoblack)
                              : (state.data.user.premium === 1
                                ? logowhitepremium : logo)}
                          />
                        </div>

                        <div className="brand-text brand-sm">
                          <img
                            alt="umbrella"
                            className="logotype-dash"
                            src={localStorage.getItem('theme') === 'dark'
                              ? (state.data.user.premium === 1
                                ? logoblackpremium : logoblack)
                              : (state.data.user.premium === 1
                                ? logowhitepremium
                                : logo)}
                          />
                        </div>
                      </a>

                      <div
                        className="burger"
                        onClick={this.toggleMenu}
                        aria-hidden="true"
                      >
                        <FontAwesomeIcon icon={faBars} />
                      </div>
                    </div>

                    {state.menu && (
                      <div className="container-fluid">
                        <div className="row">
                          <div className="col-lg-12 course-block">
                            <NavLink
                              className="header-link"
                              to="/dashboard/finance"
                              activeClassName="active"
                            >
                              <li>
                                <span>
                                  <FontAwesomeIcon icon={faWallet} />
                                  {' '}
                                  {state.data.user.balance.toFixed(6)}
                                  {' '}
                                  BTC
                                </span>
                              </li>
                            </NavLink>
                          </div>

                          <div className="col-lg-12 course-block">
                            <NavLink
                              className="header-link"
                              to="/dashboard/home"
                              activeClassName="active"
                            >
                              <li>
                                <span>{getLocales('Главная')}</span>
                              </li>
                            </NavLink>
                          </div>

                          <div className="col-lg-12 course-block">
                            <NavLink
                              className="header-link"
                              to="/dashboard/shops"
                              activeClassName="active"
                            >
                              <li>
                                <span>{getLocales('Магазины')}</span>
                              </li>
                            </NavLink>
                          </div>

                          <div className="col-lg-12 course-block">
                            <NavLink
                              className="header-link"
                              to="/dashboard/support"
                              activeClassName="active"
                            >
                              <li>
                                <span>
                                  {getLocales('Поддержка')}
                                  {state.data.unreaded > 0 && (
                                  <span>
                                    {state.data.unreaded}
                                  </span>
                                  )}
                                </span>
                              </li>
                            </NavLink>
                          </div>

                          {state.data.user.type !== 'user' && (
                          <div className="col-lg-12 course-block">
                            <NavLink className="header-link" to="/dashboard/manage" activeClassName="active">
                              <li>
                                <span>{getLocales('Управление')}</span>
                              </li>
                            </NavLink>
                          </div>
                          )}

                          <div className="col-lg-12 course-block">
                            <NavLink className="header-link" to="/dashboard/profile" activeClassName="active">
                              <li>
                                <span>{getLocales('Профиль')}</span>
                              </li>
                            </NavLink>
                          </div>

                          <div className="col-lg-12 course-block">
                            <a onClick={this.exit}>
                              <li>
                                <span>{getLocales('Выход')}</span>
                              </li>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )
                : (
                  <>
                    <div className="navbar-header">
                      <NavLink
                        className="header-link"
                        to="/dashboard/home"
                        activeClassName="active"
                      >
                        {state.data.user.type === 'user' && (
                          <a className="navbar-brand">
                            <div
                              className="brand-text brand-big visible text-uppercase"
                            >
                              <img
                                alt="umbrella"
                                className="logotype-dash"
                                src={localStorage.getItem('theme') === 'dark'
                                  ? (state.data.user.premium === 1
                                    ? logoblackpremium
                                    : logoblack)
                                  : (state.data.user.premium === 1
                                    ? logowhitepremium
                                    : logo)}
                              />
                            </div>

                            <div className="brand-text brand-sm">
                              <img
                                alt="umbrella"
                                className="logotype-dash"
                                src={localStorage.getItem('theme') === 'dark'
                                  ? (state.data.user.premium === 1
                                    ? logoblackpremium : logoblack)
                                  : (state.data.user.premium === 1
                                    ? logowhitepremium : logo)}
                              />
                            </div>
                          </a>
                        )}
                      </NavLink>
                    </div>

                    <div className="courses menu">
                      <div className="course-block">
                        <NavLink className="header-link" to="/dashboard/home" activeClassName="active">
                          <li>
                            <span>{getLocales('Главная')}</span>
                          </li>
                        </NavLink>
                      </div>

                      <div className="course-block">
                        <NavLink className="header-link" to="/dashboard/shops" activeClassName="active">
                          <li>
                            <span>{getLocales('Магазины')}</span>
                          </li>
                        </NavLink>
                      </div>

                      <div className="course-block">
                        <NavLink
                          className="header-link"
                          to={state.data.unreaded > 0
                            ? '/dashboard/support/chat'
                            : '/dashboard/support'}
                          activeClassName="active"
                        >
                          <li>
                            <span className="flex">
                              {getLocales('Поддержка')}
                              {' '}
                              {state.data.unreaded > 0 && (
                                <span className="unread-icon">
                                  {state.data.unreaded}
                                </span>
                              )}
                            </span>
                          </li>
                        </NavLink>
                      </div>

                      {state.data.user.type !== 'user' && (
                        <div className="course-block">
                          <NavLink
                            className="header-link"
                            to="/dashboard/manage"
                            activeClassName="active"
                          >
                            <li>
                              <span>{getLocales('Управление')}</span>
                            </li>
                          </NavLink>
                        </div>
                      )}

                      <div className="menu right">
                        <div className="course-block finance-block">
                          <NavLink
                            className="header-link"
                            to="/dashboard/finance"
                            activeClassName="active"
                          >
                            <li>
                              <FontAwesomeIcon icon={faWallet} />
                              {' '}
                              <span>
                                {state.data.user.balance.toFixed(6)}
                                {' BTC'}
                              </span>
                            </li>
                          </NavLink>
                        </div>

                        <div className="course-block">
                          <NavLink
                            className="header-link"
                            to="/dashboard/profile"
                            activeClassName="active"
                          >
                            <li>
                              <span>{getLocales('Профиль')}</span>
                            </li>
                          </NavLink>
                        </div>

                        <div className="course-block">
                          <a onClick={this.exit}>
                            <li>
                              <span>{getLocales('Выход')}</span>
                            </li>
                          </a>
                        </div>

                        <div className="course-block">
                          <button
                            type="button"
                            className="btn btn-theme btn-secondary"
                            onClick={this.changeTheme}
                          >
                            {state.data.user.theme === 'dark'
                              ? <FontAwesomeIcon icon={faMoon} />
                              : <FontAwesomeIcon icon={faSun} />}
                          </button>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </>
                )}
            </div>
          </nav>
        </header>

        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              {state.data.withdrawals > 0 && (
                <div className="block animate__animated animate__fadeIn  margin text-center">
                  <h3 className="font-m">
                    {getLocales('Нужно вывести средства. Сейчас')}
                    {' '}
                    {state.data.withdrawals}
                    {' '}
                    {getLocales('заявки(-а)')}
                  </h3>

                  <p className="font-m">
                    <NavLink to="/dashboard/manage/settings/withdrawals">
                      {getLocales('Перейти в раздел выводов')}
                    </NavLink>
                  </p>
                  <br />
                </div>
              )}

              {state.data.user.block !== 0 && (
                <div className="block animate__animated animate__fadeIn  margin text-center">
                  <h3 className="font-m">
                    {getLocales('Ваш аккаунт заблокирован, средства заморожены. Нейросеть')}
                    {' '}
                    <span className="text-danger">
                      RED QUEEN
                    </span>
                    {' '}
                    {getLocales('определила Ваш магазин как фейк.')}
                  </h3>

                  <p className="font-m">
                    <NavLink to="/dashboard/chat">
                      {getLocales('Обратитесь в поддержку')}
                    </NavLink>
                  </p>
                  <br />
                </div>
              )}

              <div className="margin-15">
                <Switch>
                  {state.data.user.block === 1 && <Route component={Support} />}
                  <Route path={`${props.match.path}/home`} component={HomePage} />
                  <Route
                    path={`${props.match.path}/manage`}
                    render={(routerProps) => (
                      <ManageAdmin
                        {...routerProps}
                        unreadAdmin={state.data.unreadAdmin}
                        user={state.data.user}
                      />
                    )}
                  />
                  <Route path={`${props.match.path}/profile`} component={Profile} />
                  <Route path={`${props.match.path}/support`} component={Support} />
                  <Route path={`${props.match.path}/wallets`} component={Wallets} />
                  <Route exact path={`${props.match.path}/finance`} component={Finance} />
                  <Route path={`${props.match.path}/finance/:operationId`} component={Finance} />
                  <Route exact path={`${props.match.path}/shops`} component={Shops} />
                  <Route exact path={`${props.match.path}/shops/new`} component={ShopNew} />
                  <Route path={`${props.match.path}/shops/:shopId`} component={Shop} />

                  <Route render={() => <Redirect to="/dashboard/home" />} />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
