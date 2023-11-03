import React, { Component } from 'react';
import {
  NavLink,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { getLocales } from 'utils';
import Answers from './Answers';
import Terms from './Terms';
import Guide from './Guide';

class Faq extends Component {
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
                to={`${props.match.path}/answers`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Вопрос-Ответ')}
              </NavLink>

              <NavLink
                to={`${props.match.path}/guide`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Полное руководство')}
              </NavLink>

              <NavLink
                to={`${props.match.path}/terms`}
                activeClassName="active"
                className="xtabs__item"
              >
                {getLocales('Пользовательское соглашение')}
              </NavLink>

            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <Switch>
            <Route path={`${props.match.path}/answers`} component={Answers} />
            <Route path={`${props.match.path}/guide`} component={Guide} />
            <Route path={`${props.match.path}/terms`} component={Terms} />

            <Route render={() => <Redirect to={`${props.match.path}/answers`} />} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Faq;
