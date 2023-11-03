import React from 'react';
import {
  NavLink,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { getLocales } from 'utils';
import Tickets from './Tickets';
import TicketNew from './TicketNew';
import Ticket from './Ticket';
import Chat from './Chat';
import Faq from './Faq';

function Support() {
  const { props } = this;

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="xtabs xtabs_bottom animate__animated animate__fadeIn">
            <div className="xtabs__body">
              <NavLink
                to={`${props.match.path}/faq`}
                className="xtabs__item font-m"
                activeClassName="active"
              >
                <span>
                  {' '}
                  {getLocales('База знаний')}
                </span>
                <br />
                <small>
                  {getLocales('Инструкции по пользованию системой')}
                </small>
              </NavLink>

              <NavLink
                to={`${props.match.path}/chat`}
                className="xtabs__item font-m"
                activeClassName="active"
              >
                <span>
                  {' '}
                  {getLocales('Поддержка')}
                </span>
                <br />
                <small>
                  {getLocales('Онлайн-чат с командой поддержки')}
                </small>
              </NavLink>

              <NavLink
                to={`${props.match.path}/tickets`}
                className="xtabs__item font-m"
                activeClassName="active"
              >
                <span>
                  {' '}
                  {getLocales('Обращения')}
                </span>
                <br />
                <small>
                  {getLocales('Обращения, которые не удалось решить сразу')}
                </small>
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      <div className="row margin-15">
        <div className="col-lg-12">
          <Switch>
            <Route exact path={`${props.match.path}/tickets`} component={Tickets} />
            <Route path={`${props.match.path}/tickets/new`} component={TicketNew} />
            <Route path={`${props.match.path}/ticket/:id`} component={Ticket} />
            <Route exact path={`${props.match.path}/chat`} component={Chat} />
            <Route path={`${props.match.path}/faq`} component={Faq} />

            <Route render={() => <Redirect to="/dashboard/support/faq" />} />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default Support;
