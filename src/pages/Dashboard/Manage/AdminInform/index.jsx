import React, { Component } from 'react';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';

import Information from './Information';
import News from './News';
import Faq from './Faq';
import Guide from './Guide';
import Terms from './Terms';
import Locales from './Locales';
import LocalesShop from './LocalesShop';

class AdminInform extends Component {
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
                to={`${props.match.url}`}
                activeClassName="active"
                className="xtabs__item"
              >
                Общие
              </NavLink>

              <NavLink
                exact
                to={`${props.match.url}/news`}
                activeClassName="active"
                className="xtabs__item"
              >
                Новости
              </NavLink>

              <NavLink
                to={`${props.match.url}/faq`}
                activeClassName="active"
                className="xtabs__item"
              >
                FAQ
              </NavLink>

              <NavLink
                to={`${props.match.url}/guide`}
                activeClassName="active"
                className="xtabs__item"
              >
                Гайд
              </NavLink>

              <NavLink
                to={`${props.match.url}/terms`}
                activeClassName="active"
                className="xtabs__item"
              >
                Польз. Соглашение
              </NavLink>
              <NavLink
                to={`${props.match.url}/locales`}
                activeClassName="active"
                className="xtabs__item"
              >
                Локализация
              </NavLink>

              <NavLink
                to={`${props.match.url}/localesshop`}
                activeClassName="active"
                className="xtabs__item"
              >
                Локализация Магазинов
              </NavLink>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <Switch>
            <Route exact path={`${props.match.path}`} component={Information} />
            <Route exact path={`${props.match.path}/news`} component={News} />
            <Route exact path={`${props.match.path}/faq`} component={Faq} />
            <Route exact path={`${props.match.path}/guide`} component={Guide} />
            <Route exact path={`${props.match.path}/terms`} component={Terms} />
            <Route exact path={`${props.match.path}/locales`} component={Locales} />
            <Route exact path={`${props.match.path}/localesshop`} component={LocalesShop} />

            <Route render={() => <Redirect to={`${props.match.path}`} />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default AdminInform;
