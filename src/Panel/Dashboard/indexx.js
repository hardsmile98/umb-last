import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { faHome, faArrowDown, faUser, faCoins, faShoppingBasket, faUserShield, faUserCircle, faLifeRing, faUsers, faArrowLeft, faChevronLeft, faWallet, faDoorOpen, faSignOutAlt, faPlus, faStore, faCartPlus } from "@fortawesome/free-solid-svg-icons/index"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import logo from '../Images/logotype.svg'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import HomePage from './Home'
import Profile from './Profile'

import global from '../Global/index'
import { toast } from 'react-toastify'
import Support from './Support/index'
import Ticket from './Support/Tickets/Ticket'
import Wallets from './Wallets'
import Finance from './Finance'
import ShopNew from './Shops/New'
import Shop from './Shops/Shop'

let interval;

class Dashboardd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shopCollapse: false,
            walletCollapse: false,
            user: {
                login: "GhostLab",
                debt: 0,
                balance: 0
            }
        }
        this.changeCollapse = this.changeCollapse.bind(this)
        this.getData = this.getData.bind(this)
        this.exit = this.exit.bind(this)
    }

    changeCollapse(e) {
        this.setState({
            [e.target.name]: !this.state[e.target.name]
        })
    }

    componentDidMount() {
        this.getData()
        interval = setInterval(this.getData, 1000)
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    exit() {
        clearInterval(interval)
        let data = {
            api: "user",
            body: {
                data: {},
                action: "exit"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    localStorage.removeItem('token')
                    toast.success(response.data.message)
                    this.props.history.push('/security/authorization')
                }
                else {
                    toast.error(response.data.message)
                    this.props.history.push('/security/authorization')
                }
            }
            else {
                toast.error(response.data.message)
            }
        })
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {},
                action: "getUser"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.setState({
                        user: response.data.data
                    })
                }
                else {
                    toast.error(response.data.message)
                    this.props.history.push('/security/authorization')
                }
            }
            else {
                toast.error(response.data.message)
            }
        })
    }

    getPath(item) {
        return global.getTitle(item)
    }


    render() {
        return (
            <>
                <header class="header">
                    <nav class="navbar navbar-expand-lg">
                        <div class="container-fluid d-flex align-items-center justify-content-between">
                            <div class="navbar-header">
                                <a class="navbar-brand">
                                    <div class="brand-text brand-big visible text-uppercase"><img className="logotype-dash" src={logo} /></div>
                                    <div class="brand-text brand-sm"><img className="logotype-dash" src={logo} /></div></a>
                            </div>
                            <ul class="nav navbar-nav"><li data-tip="<b>Выход</b>" data-place="left" class="nav-item uppercase-link" currentitem="false"><a class="nav-link" onClick={this.exit}><FontAwesomeIcon icon={faSignOutAlt} /></a></li></ul>
                        </div>
                    </nav>
                </header>
                <div className="d-flex align-items-stretch">
                    <nav id="sidebar">
                        <div class="sidebar-header d-flex align-items-center">
                            <div class="title">
                                <h1 class="h5">{this.state.user.login}</h1>
                                <br />
                                <p>Баланс: {this.state.user.balance.toFixed(6)} BTC</p>
                                <p>Долг: {this.state.user.debt.toFixed(6)} BTC</p>
                            </div>
                        </div>
                        <span class="heading">Навигация</span>
                        <ul class="list-unstyled">
                            <li><NavLink to={"/dashboard/home"} activeClassName="active"> <FontAwesomeIcon icon={faHome} /><span>Главная</span> </NavLink></li>
                            <li><a onClick={this.changeCollapse} name="shopCollapse"> <FontAwesomeIcon icon={faShoppingBasket} /><span>Магазины</span> <span className="collapseOn"><FontAwesomeIcon icon={faChevronLeft} /></span></a>
                                <ul class={(this.state.shopCollapse ? "" : "collapse") + " list-unstyled "}>
                                <li><NavLink to={"/dashboard/shops/new"} activeClassName="active"> <FontAwesomeIcon icon={faPlus} /><span>Создать магазин</span> </NavLink></li>
                                <li><NavLink to={"/dashboard/shops/1"} activeClassName="active"> <FontAwesomeIcon icon={faShoppingBasket} /><span>Магазин #1</span> </NavLink></li>
                                </ul>
                            </li>
                            <li><NavLink to={"/dashboard/wallets"} activeClassName="active"> <FontAwesomeIcon icon={faWallet} /><span>Кошельки</span> </NavLink></li>
                            <li><NavLink to={"/dashboard/profile"} activeClassName="active"> <FontAwesomeIcon icon={faUserCircle} /><span>Профиль</span> </NavLink></li>
                            <li><NavLink to={"/dashboard/finance"} activeClassName="active"> <FontAwesomeIcon icon={faCoins} /><span>Финансы</span> </NavLink></li>
                            <li><NavLink to={"/dashboard/support"} activeClassName="active"> <FontAwesomeIcon icon={faLifeRing} /><span>Поддержка</span> </NavLink></li>
                        </ul><span class="heading">Ссылки</span>
                        <ul class="list-unstyled">
                            <li><a href="https://legiooon.cc" target="_blank"> <FontAwesomeIcon icon={faUsers} /><span>Форум</span> </a></li>
                        </ul>
                    </nav>
                    <div class="page-content" style={{ paddingBottom: "70px" }}>
                        <div class="page-header">
                            <div class="container-fluid">
                                <h2 class="h5 no-margin-bottom">
                                    {
                                        this.getPath(this.props.location.pathname)
                                    }
                                </h2>
                            </div>
                        </div>
                        <Switch>
                            <Route path={`${this.props.match.path}/home`} component={HomePage} />
                            <Route path={`${this.props.match.path}/profile`} component={Profile} />
                            <Route path={`${this.props.match.path}/support`} component={Support} />
                            <Route path={`${this.props.match.path}/wallets`} component={Wallets} />
                            <Route exact path={`${this.props.match.path}/finance`} component={Finance} />
                            <Route path={`${this.props.match.path}/finance/:operationId`} component={Finance} />
                            <Route exact path={`${this.props.match.path}/shops/new`} component={ShopNew} />
                            <Route path={`${this.props.match.path}/shops/:shopId`} component={Shop} />

                            <Route render={props =>
                                <Redirect to={`/dashboard/home`} />
                            } />
                        </Switch>

                        <footer class="footer">
                            <div class="footer__block block no-margin-bottom">
                                <div class="container-fluid text-center">
                                    <p class="no-margin-bottom">GhostLab © {new Date().getUTCFullYear()} </p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </>
        )
    }
}

export default Dashboardd