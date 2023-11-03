import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import Settings from '../../../Profile/Settings'
import ShopMainSettings from './Settings'
import Employees from './Employees'
import Employeer from './Employees/Employeer'
import Promocodes from '../Marketing/Promocodes'
import Bonuses from '../Marketing/Bonuses'
import PayMethods from './Paymethods'

import global from '../../../../Global/index'


class ShopSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    render() {
        return (
                <div class="row margin-15">
                                       <div className="col-lg-3">
                        <div class="xtabs xtabs_left animate__animated animate__fadeIn">
                            <div class="xtabs__body font-m">
                                <NavLink exact to={`${this.props.match.url}`} activeClassName="active" className="xtabs__item">{global.getLocales("Настройки")}</NavLink>
                                <NavLink to={`${this.props.match.url}/paymethods`} activeClassName="active" className="xtabs__item">{global.getLocales("Способы оплаты")}</NavLink>
                                <NavLink to={`${this.props.match.url}/employees`} activeClassName="active" className="xtabs__item">{global.getLocales("Сотрудники")}</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <Switch>
                        <Route exact path={`${this.props.match.path}`} component={ShopMainSettings} />
                        <Route exact path={`${this.props.match.path}/employees`} component={Employees} />
                        <Route exact path={`${this.props.match.path}/promocodes`} component={Promocodes} />
                        <Route exact path={`${this.props.match.path}/paymethods`} component={PayMethods} />
                        <Route exact path={`${this.props.match.path}/bonuses`} component={Bonuses} />
                        <Route path={`${this.props.match.path}/employees/new`} component={Employeer} />
                        <Route path={`${this.props.match.path}/employees/:id`} component={Employeer} />

                        <Route render={props =>
                            <Redirect to={"/dashboard/shops/" + this.props.match.params.shopId + "/settings"}/>
                        } />
                        </Switch>

                    </div>
                </div>
        )
    }
}

export default ShopSettings