import React, { Component } from 'react';
import {
  NavLink, Route, Redirect, Switch,
} from 'react-router-dom';
import AdminChats from './AdminChats';
import DatasAdmin from './DatasAdmin';
import AdminInform from './AdminInform';
import AdminSettings from './AdminSettings';

class Manage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { props } = this;

    return (
      <>
        <div className="row">
          <div className="col-lg-12">
            <div className="xtabs xtabs_bottom animate__animated animate__fadeIn">
              <div className="xtabs__body">
                {props.user.type !== 'user' && (
                  <NavLink
                    to={`${props.match.path}/chats`}
                    className="xtabs__item font-m"
                    activeClassName="active"
                  >
                    <span>
                      {' Чаты'}
                      {!!props.unreadAdmin > 0 && (
                        <span className="badge badge-danger">
                          {props.unreadAdmin}
                        </span>
                      )}
                    </span>
                  </NavLink>
                )}

                {(props.user.type === 'admin' || props.user.type === 'superadmin') && (
                  <>
                    <NavLink
                      to={`${props.match.path}/inform`}
                      className="xtabs__item font-m"
                      activeClassName="active"
                    >
                      <span> Информационные</span>
                    </NavLink>

                    <NavLink
                      to={`${props.match.path}/datas`}
                      className="xtabs__item font-m"
                      activeClassName="active"
                    >
                      <span> Данные</span>
                    </NavLink>
                  </>
                )}

                {props.user.type === 'superadmin' && (
                  <NavLink
                    to={`${props.match.path}/settings`}
                    className="xtabs__item font-m"
                    activeClassName="active"
                  >
                    <span> Настройки</span>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row margin-15">
          <div className="col-lg-12">
            <Switch>
              <Route path={`${props.match.path}/chats`} component={AdminChats} />
              <Route
                path={`${props.match.path}/datas`}
                render={(routerProps) => (
                  <DatasAdmin
                    {...routerProps}
                    user={props.user}
                  />
                )}
              />
              <Route path={`${props.match.path}/inform`} component={AdminInform} />
              <Route path={`${props.match.path}/settings`} component={AdminSettings} />

              <Route render={() => <Redirect to="/dashboard/manage/chats" />} />
            </Switch>
          </div>
        </div>
      </>
    );
  }
}

export default Manage;
