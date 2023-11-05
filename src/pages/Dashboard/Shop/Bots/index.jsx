/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';
import { getLocales } from 'utils';
import Btemplates from './Btemplates';
import Mtemplates from './Mtemplates';
import BotPages from './Pages';
import BotsSettings from './Settings';
import TelegramBots from './Telegram';
import Dispensers from './Dispensers';

class ShopBots extends Component {
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
                to={`${this.props.match.url}/settings`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Настройки')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/telegram`}
                activeClassName="active"
                className="xtabs__item"
              >
                {'Telegram '}
                {getLocales('Боты')}
              </NavLink>

              <NavLink
                t
                o={`${this.props.match.url}/dispensers`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Боты распределители')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/pages`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Страницы')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/messages`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Шаблоны сообщений')}
              </NavLink>

              <NavLink
                to={`${this.props.match.url}/buttons`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Шаблоны кнопок')}
              </NavLink>
            </div>
          </div>
        </div>

        <div className="col-lg-9 zindex999999">
          <Switch>
            <Route exact path={`${this.props.match.path}/settings`} component={BotsSettings} />
            <Route exact path={`${this.props.match.path}/telegram`} component={TelegramBots} />
            <Route exact path={`${this.props.match.path}/pages`} component={BotPages} />
            <Route exact path={`${this.props.match.path}/dispensers`} component={Dispensers} />
            <Route exact path={`${this.props.match.path}/messages`} component={Mtemplates} />
            <Route exact path={`${this.props.match.path}/buttons`} component={Btemplates} />

            <Route render={() => <Redirect to={`/dashboard/shops/${this.props.match.params.shopId}/bots/settings`} />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default ShopBots;
