import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'

import Settings from './Settings'
import Security from './Security'
import Activities from './Activities'
import Referral from './Referral'

import global from '../../Global/index'

class Profile extends Component {
    render() {
        return (
            <>
                <div class="row">
                <div className="col-lg-3">
                        <div class="xtabs xtabs_left animate__animated animate__fadeIn">
                            <div class="xtabs__body font-m">
                                <NavLink to={`${this.props.match.path}/settings`} activeClassName="active" className="xtabs__item">{global.getLocales("Настройки аккаунта")}</NavLink>
                                <NavLink to={`${this.props.match.path}/security`} activeClassName="active" className="xtabs__item">{global.getLocales("Безопасность")}</NavLink>
                                <NavLink to={`${this.props.match.path}/activities`} activeClassName="active" className="xtabs__item">{global.getLocales("Активность")}</NavLink>
                                <NavLink to={`${this.props.match.path}/partner`} activeClassName="active" className="xtabs__item">{global.getLocales("Партнерская программа")}</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">

                        <Switch>
                        <Route path={`${this.props.match.path}/settings`} component={Settings} />
                        <Route path={`${this.props.match.path}/security`} component={Security} />
                        <Route path={`${this.props.match.path}/activities`} component={Activities} />
                        <Route path={`${this.props.match.path}/partner`} component={Referral} />

                        <Route render={props =>
                            <Redirect to="/dashboard/profile/settings" />
                        } />
                        </Switch>
                    </div>
                </div>
            </>
        )
    }
}

export default Profile