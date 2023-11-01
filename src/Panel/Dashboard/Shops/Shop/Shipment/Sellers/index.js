import React, { Component } from 'react'

import moment from 'moment'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faGlasses } from '@fortawesome/free-solid-svg-icons'
import { NavLink, Switch, Route, Redirect } from 'react-router-dom'
import Sellers from './Current'
import SellersAdd from './Add'
import DeletedSellers from '../DeletedSellers'
import ModerSellers from './Moder'

import global from '../../../../../Global/index'
class SellersNavi extends Component {

    render() {
        return (
            <div class="row margin-15">
                <div className="col-lg-3">
                    <div class="xtabs xtabs_left animate__animated animate__fadeIn">
                        <div class="xtabs__body font-m">
                            <NavLink exact to={`${this.props.match.url}/actual`} activeClassName="active" className="xtabs__item">{this.props.admin ? global.getLocales('Адреса в продаже') : global.getLocales('Адреса')} {this.props.sellers ? <span className='badge badge-secondary'>{+this.props.sellers - +this.props.sellersModer}</span> : ''}</NavLink>
                            <NavLink exact to={`${this.props.match.url}/add`} activeClassName="active" className="xtabs__item">{global.getLocales('Добавление адресов')}</NavLink>
                            {
                                this.props.admin
                                    ?
                                    <>
                                        <NavLink exact to={`${this.props.match.url}/moderation`} activeClassName="active" className="xtabs__item">{global.getLocales('Адреса для проверки')} {this.props.sellersModer ? <span className='badge badge-danger'>{this.props.sellersModer}</span> : ''}</NavLink>
                                        <NavLink exact to={`${this.props.match.url}/deleted`} activeClassName="active" className="xtabs__item">{global.getLocales('Удаленные адреса')}</NavLink>

                                    </>
                                    :
                                    ''
                            }
                        </div>
                    </div>
                </div>
                <div className="col-lg-9">
                    <Switch>
                        <Route exact path={`${this.props.match.path}/actual`} render={props => <Sellers {...props} admin={this.props.admin} />} />
                        <Route exact path={`${this.props.match.path}/add`} render={props => <SellersAdd {...props} admin={this.props.admin} />} />
                        <Route exact path={`${this.props.match.path}/deleted`} component={DeletedSellers} />
                        <Route exact path={`${this.props.match.path}/moderation`} component={ModerSellers} />

                        <Route render={props =>
                            <Redirect to={"/dashboard/shops/" + this.props.match.params.shopId + "/shipment/sellers/actual"} />
                        } />
                    </Switch>

                </div>
            </div>
        )
    }
}

export default SellersNavi