import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { NavLink, Switch, Route, Redirect } from 'react-router-dom'
import Categories from './Categories'
import Products from './Products'
import Sellers from './Sellers/Current'
import ProductsAdd from './Products/Add'
import DeletedSellers from './DeletedSellers'
import Presellers from './Presellers'
import SellersAdd from './Sellers/Add'
import SellersNavi from './Sellers'

let interval = ''

class Shipment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                currency: "",
                sellers: 0,
                moderSellers: 0,
                admin: false
            }
        }
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()
        interval = setInterval(this.getData, 5000)
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "shipment",
                    subtype: "get",
                    shop: this.props.match.params.shopId

                },
                action: "shops"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.setState({
                        data: response.data.data,
                        loading: false
                    })
                }
                else {
                    this.setState({
                        loading: false
                    })
                    toast.error(response.data.message)
                }
            }
            else {
                toast.error("Сервер недоступен")
            }
        })
    }

    render() {
        return (
            <div className="row margin-15">
                <div className="col-lg-12">
                    <div class="xtabs xtabs_bottom"
                    ><div class="xtabs__body">
                            <NavLink to={`${this.props.match.url}/categories`} className="xtabs__item font-m" activeClassName="active">
                                <span> {global.getLocales('Города')}</span>
                            </NavLink>
                            <NavLink to={`${this.props.match.url}/products`} className="xtabs__item font-m" activeClassName="active">
                                <span> {global.getLocales('Товары')}</span>
                            </NavLink>
                            <NavLink to={`${this.props.match.url}/sellers`} className="xtabs__item font-m" activeClassName="active">
                                <span> {global.getLocales('Адреса')} {this.state.data.sellers > 0 ? <span className='badge badge-secondary'>{this.state.data.sellers}</span> : ''}</span>
                            </NavLink>
                            <NavLink to={`${this.props.match.url}/presellers`} className="xtabs__item font-m" activeClassName="active">
                                <span> {global.getLocales('Предзаказы')}</span>
                            </NavLink>
                        </div>
                    </div>
                    <div className="margin-15">
                    <Switch>
                    <Route path={`${this.props.match.path}/categories`} component={Categories} />
                    <Route exact path={`${this.props.match.path}/products`} component={Products} />
                    <Route path={`${this.props.match.path}/products/add`} render={props => <ProductsAdd {...props} currency={this.state.data.currency}/>} />
                    <Route path={`${this.props.match.path}/products/:id`} render={props => <ProductsAdd {...props} currency={this.state.data.currency}/>}  />
                    <Route path={`${this.props.match.path}/sellers`} render={props => <SellersNavi {...props} admin={this.state.data.admin} sellers={this.state.data.sellers} sellersModer={this.state.data.moderSellers} />} />
                    <Route path={`${this.props.match.path}/deleted`} component={DeletedSellers} />
                    <Route path={`${this.props.match.path}/presellers`} component={Presellers} />

                    <Route render={props =>
                            <Redirect to={"/dashboard/shops/" + this.props.match.params.shopId + "/shipment/categories"}/>
                        } />
                    </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default Shipment