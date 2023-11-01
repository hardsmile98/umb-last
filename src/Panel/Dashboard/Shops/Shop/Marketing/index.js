import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import Bonuses from '../Settings/Bonuses'
import Promocodes from '../Settings/Promocodes'

import global from '../../../../Global/index'



class Marketing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    render() {
        return (
            <div class="row margin-15">
                <div className="col-lg-12">
                    <div class="xtabs xtabs_bottom"
                    ><div class="xtabs__body">
                            <NavLink to={`${this.props.match.url}/promocodes`} className="xtabs__item font-m" activeClassName="active">
                                <span> {global.getLocales("Промокоды")}</span>
                            </NavLink>
                            <NavLink to={`${this.props.match.url}/bonuses`} className="xtabs__item font-m" activeClassName="active">
                                <span> {global.getLocales("Бонусная программа")}</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 margin-15">
                    <Switch>
                        <Route exact path={`${this.props.match.path}/promocodes`} component={Promocodes} />
                        <Route exact path={`${this.props.match.path}/bonuses`} component={Bonuses} />

                        <Route render={props =>
                            <Redirect to={"/dashboard/shops/" + this.props.match.params.shopId + "/marketing/promocodes"} />
                        } />
                    </Switch>

                </div>
            </div>
        )
    }
}

export default Marketing