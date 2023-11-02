import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { faHome, faLink, faArrowDown, faCoins, faShoppingBasket, faUserShield, faUserCircle, faLifeRing, faUsers, faArrowLeft, faChevronLeft, faWallet, faDoorOpen, faSignOutAlt, faPlus, faStore, faCartPlus, faUserNurse, faArrowsAlt, faMoon, faSun, faCloudSun, faHamburger, faEllipsisH, faBars, faEnvelope } from "@fortawesome/free-solid-svg-icons/index"
import { faUser } from "@fortawesome/free-regular-svg-icons/index"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import logoblack from './logotypeblack.png'
import logo from './logotypewhite.png'
import logoblackpremium from './logoblackpremium.png'
import logowhitepremium from './logowhitepremium.png'
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
import Shops from './Shops'
import ManageAdmin from './Manage'

let interval;

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shopCollapse: false,
            data: {
                user: {
                    login: "Test",
                    debt: 0,
                    balance: 0,
                    theme: "default",
                    type: "user",
                    block: 0,
                    premium: 0
                },
                unreaded: 0,
                withdrawals: 0,
                unreadAdmin: 0
            },
            menu: false
        }
        this.changeCollapse = this.changeCollapse.bind(this)
        this.getData = this.getData.bind(this)
        this.exit = this.exit.bind(this)
        this.changeTheme = this.changeTheme.bind(this)
        this.toggleMenu = this.toggleMenu.bind(this)
    }

    toggleMenu() {
        this.setState({
            menu: !this.state.menu
        })
    }

    changeCollapse(e) {
        this.setState({
            shopCollapse: !this.state.shopCollapse
        })
    }

    componentDidMount() {
        global.getLocalesFile(res => {
            this.forceUpdate()
            this.getData()
            interval = setInterval(this.getData, 10000)
        })
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

    changeTheme() {
        let data = {
            api: "user",
            body: {
                data: {},
                action: "themeChange"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.getData()
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
                    if (this.state.data.user.theme !== response.data.data.user.theme) {
                        localStorage.setItem('theme', response.data.data.user.theme)
                    }
                    if(localStorage.getItem('lang') !== response.data.data.user.lang) {
                        localStorage.setItem('lang', response.data.data.user.lang)
                        this.forceUpdate()

                    }
                    this.setState({
                        data: response.data.data
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
                <link rel="stylesheet" type="text/css" href={localStorage.getItem('theme') == "dark" ? (window.location.protocol + "//" + window.location.hostname + "/dark.css?v=4") : "./index.css"} />
                <header class="header">
                    <nav class="navbar navbar-expand-lg">
                        <div class="container-fluid d-flex align-items-center justify-content-between">
                            {
                                window.innerWidth <= 800
                                    ?
                                    <>
                                        <div class="navbar-header">
                                            <a class="navbar-brand">
                                                <div class="brand-text brand-big visible text-uppercase"><img className="logotype-dash" src={localStorage.getItem('theme') == "dark" ? (this.state.data.user.premium == 1 ? logoblackpremium : logoblack) : (this.state.data.user.premium == 1 ? logowhitepremium : logo)} /></div>
                                                <div class="brand-text brand-sm"><img className="logotype-dash" src={localStorage.getItem('theme') == "dark" ? (this.state.data.user.premium == 1 ? logoblackpremium : logoblack) : (this.state.data.user.premium == 1 ? logowhitepremium : logo)} /></div></a>
                                            <div className='burger' onClick={this.toggleMenu}>
                                                <FontAwesomeIcon icon={faBars} />
                                            </div>
                                        </div>
                                        {
                                            this.state.menu
                                                ?
                                                <>
                                                    <div className='container-fluid'>
                                                        <div className='row'>
                                                            <div className='col-lg-12 course-block'>
                                                                <NavLink className="header-link" to={"/dashboard/finance"} activeClassName="active">
                                                                    <li>
                                                                        <span><FontAwesomeIcon icon={faWallet} /> {this.state.data.user.balance.toFixed(6)} BTC</span>
                                                                    </li>
                                                                </NavLink>
                                                            </div>
                                                            <div className='col-lg-12 course-block'>
                                                                <NavLink className="header-link" to={"/dashboard/home"} activeClassName="active">
                                                                    <li>
                                                                        <span>Главная</span>
                                                                    </li>
                                                                </NavLink>
                                                            </div>
                                                            <div className='col-lg-12 course-block'>
                                                                <NavLink className="header-link" to={"/dashboard/shops"} activeClassName="active">
                                                                    <li>
                                                                        <span>Магазины</span>
                                                                    </li>
                                                                </NavLink>
                                                            </div>
                                                            <div className='col-lg-12 course-block'>
                                                                <NavLink className="header-link" to={"/dashboard/support"} activeClassName="active">
                                                                    <li>
                                                                        <span>Поддержка {this.state.data.unreaded > 0 ? <span>{this.state.data.unreaded}</span> : ""}</span>
                                                                    </li>
                                                                </NavLink>
                                                            </div>
                                                            {
                                                                this.state.data.user.type !== "user"
                                                                    ?
                                                                    <div className='col-lg-12 course-block'>
                                                                        <NavLink className="header-link" to={"/dashboard/manage"} activeClassName="active">
                                                                            <li>
                                                                                <span>Управление</span>
                                                                            </li>
                                                                        </NavLink>
                                                                    </div>
                                                                    :
                                                                    ''
                                                            }
                                                            <div className='col-lg-12 course-block'>
                                                                <NavLink className="header-link" to={"/dashboard/profile"} activeClassName="active">
                                                                    <li>
                                                                        <span>Профиль</span>
                                                                    </li>
                                                                </NavLink>
                                                            </div>
                                                            <div className='col-lg-12 course-block'>
                                                                <a onClick={this.exit}>
                                                                    <li>
                                                                        <span>Выход</span>
                                                                    </li>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                ''
                                        }
                                    </>
                                    :
                                    <>
                                        <div class="navbar-header">
                                            <NavLink className="header-link" to={"/dashboard/home"} activeClassName="active">
                                                {
                                                    this.state.data.user.type == "user"
                                                    ?
                                                    <>
                                                             <a class="navbar-brand">
                                                    <div class="brand-text brand-big visible text-uppercase"><img className="logotype-dash" src={localStorage.getItem('theme') == "dark" ? (this.state.data.user.premium == 1 ? logoblackpremium : logoblack) : (this.state.data.user.premium == 1 ? logowhitepremium : logo)} /></div>
                                                    <div class="brand-text brand-sm"><img className="logotype-dash" src={localStorage.getItem('theme') == "dark" ? (this.state.data.user.premium == 1 ? logoblackpremium : logoblack) : (this.state.data.user.premium == 1 ? logowhitepremium : logo)} /></div></a>
                                           
                                                    </>
                                                    :
                                                    ''
                                                }
                                        </NavLink>
                                        </div>
                                        <div className="courses menu">
                                            <div className="course-block">
                                                <NavLink className="header-link" to={"/dashboard/home"} activeClassName="active">
                                                    <li>
                                                        <span>{global.getLocales('Главная')}</span>
                                                    </li>
                                                </NavLink>
                                            </div>
                                            <div className="course-block">
                                                <NavLink className="header-link" to={"/dashboard/shops"} activeClassName="active">
                                                    <li>
                                                        <span>{global.getLocales('Магазины')}</span>
                                                    </li>
                                                </NavLink>
                                            </div>
                                            <div className="course-block">
                                                <NavLink className="header-link" to={this.state.data.unreaded > 0 ? "/dashboard/support/chat" : "/dashboard/support"} activeClassName="active">
                                                    <li>
                                                        <span className='flex'>{global.getLocales('Поддержка')} {this.state.data.unreaded > 0 ? <span class="unread-icon">{this.state.data.unreaded}</span> : ""}</span>
                                                    </li>
                                                </NavLink>
                                            </div>
                                            {
                                                this.state.data.user.type !== "user"
                                                    ?
                                                    <div className="course-block">
                                                        <NavLink className="header-link" to={"/dashboard/manage"} activeClassName="active">
                                                            <li>
                                                                <span>Управление</span>
                                                            </li>
                                                        </NavLink>
                                                    </div>
                                                    :
                                                    ''
                                            }
                                            <div className="menu right">
                                                <div className="course-block finance-block">
                                                    <NavLink className="header-link" to={"/dashboard/finance"} activeClassName="active">
                                                        <li>
                                                            <FontAwesomeIcon icon={faWallet} /> <span>{this.state.data.user.balance.toFixed(6)} BTC</span>
                                                        </li>
                                                    </NavLink>
                                                </div>
                                                <div className="course-block">
                                                    <NavLink className="header-link" to={"/dashboard/profile"} activeClassName="active">
                                                        <li>
                                                            <span>{global.getLocales('Профиль')}</span>
                                                        </li>
                                                    </NavLink>
                                                </div>
                                                <div className="course-block">
                                                    <a onClick={this.exit}>
                                                        <li>
                                                            <span>{global.getLocales('Выход')}</span>
                                                        </li>
                                                    </a>
                                                </div>
                                                <div className="course-block">
                                                    <button className='btn btn-theme btn-secondary' onClick={this.changeTheme}>
                                                        {
                                                            this.state.data.user.theme == "dark"
                                                                ?
                                                                <FontAwesomeIcon icon={faMoon} />
                                                                :
                                                                <FontAwesomeIcon icon={faSun} />
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    </>
                            }
                        </div>
                    </nav>
                </header>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            {
                                this.state.data.withdrawals > 0
                                ?
                                <div className='block animate__animated animate__fadeIn  margin text-center'>
                                <h3 className="font-m">Нужно вывести средства. Сейчас {this.state.data.withdrawals} заявки(-а)</h3>
                                <p className='font-m'><NavLink to="/dashboard/manage/settings/withdrawals">Перейти в раздел выводов</NavLink></p>
                                <br />

                            </div>
                            :
                            ''   
                            }
                            {
                                this.state.data.user.block == 0
                                    ?
                                    ""
                                    :
                                    <div className='block animate__animated animate__fadeIn  margin text-center'>
                                        <h3 className="font-m">Ваш аккаунт заблокирован, средства заморожены. Нейросеть <span className='text-danger'>RED QUEEN</span> определила Ваш магазин как фейк.</h3>
                                        <p className='font-m'><NavLink to="/dashboard/chat">Обратитесь в поддержку</NavLink></p>
                                        <br />

                                    </div>
                            }
                            <div className="margin-15">
                                <Switch>
                                    {
                                        this.state.data.user.block == 1
                                            ?
                                            <Route component={Support} />
                                            :
                                            ''
                                    }
                                    <Route path={`${this.props.match.path}/home`} component={HomePage} />
                                    <Route path={`${this.props.match.path}/manage`} render={props => <ManageAdmin {...props} unreadAdmin={this.state.data.unreadAdmin} user={this.state.data.user} />} />
                                    <Route path={`${this.props.match.path}/profile`} component={Profile} />
                                    <Route path={`${this.props.match.path}/support`} component={Support} />
                                    <Route path={`${this.props.match.path}/wallets`} component={Wallets} />
                                    <Route exact path={`${this.props.match.path}/finance`} component={Finance} />
                                    <Route path={`${this.props.match.path}/finance/:operationId`} component={Finance} />
                                    <Route exact path={`${this.props.match.path}/shops`} component={Shops} />
                                    <Route exact path={`${this.props.match.path}/shops/new`} component={ShopNew} />
                                    <Route path={`${this.props.match.path}/shops/:shopId`} component={Shop} />

                                    <Route render={props =>
                                        <Redirect to={`/dashboard/home`} />
                                    } />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Dashboard