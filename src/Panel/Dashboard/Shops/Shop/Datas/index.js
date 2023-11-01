import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import Userspam from '../Bots/Userspam'
import ActivePresellers from './ActivePresellers'
import ActivePurchases from './ActivePurchases'
import PurchaseItem from './Purchase'
import Purchases from './Purchases'
import Reviews from './Reviews'
import UserProfile from './Userid'
import DataUsers from './Users'

import global from '../../../../Global/index'


class Datas extends Component {
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
                                <NavLink to={`${this.props.match.url}/users`} activeClassName="active" className="xtabs__item">{global.getLocales('Покупатели')}</NavLink>
                                <NavLink to={`${this.props.match.url}/purchases`} activeClassName="active" className="xtabs__item">{global.getLocales('Покупки')}</NavLink>
                                <NavLink to={`${this.props.match.url}/activeorders`} activeClassName="active" className="xtabs__item">{global.getLocales('Активные заказы')}</NavLink>

                                <NavLink to={`${this.props.match.url}/presellers`} activeClassName="active" className="xtabs__item">{global.getLocales('Предзаказы')} {this.props.presellers ? <span className='badge badge-danger'>{this.props.presellers}</span> : ''}</NavLink>
                                <NavLink to={`${this.props.match.url}/massspam`} activeClassName="active" className="xtabs__item">{global.getLocales('Массовая рассылка TG')}</NavLink>
                                <NavLink to={`${this.props.match.url}/reviews`} activeClassName="active" className="xtabs__item">{global.getLocales('Отзывы')}</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <Switch>
                        <Route exact path={`${this.props.match.path}/users`} component={DataUsers} />
                        <Route path={`${this.props.match.path}/users/:userId`} component={UserProfile} />
                        <Route exact path={`${this.props.match.path}/purchases`} component={Purchases} />
                        <Route exact path={`${this.props.match.path}/activeorders`} component={ActivePurchases} />
                        <Route exact path={`${this.props.match.path}/massspam`} component={Userspam} />
                        <Route path={`${this.props.match.path}/purchases/:purchaseId`} component={PurchaseItem} />
                        <Route exact path={`${this.props.match.path}/presellers`} component={ActivePresellers} />
                        <Route exact path={`${this.props.match.path}/reviews`} component={Reviews} />

                        <Route render={props =>
                            <Redirect to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/users"}/>
                        } />
                        </Switch>

                    </div>
                </div>
        )
    }
}

export default Datas