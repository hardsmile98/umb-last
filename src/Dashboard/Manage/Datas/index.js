import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import UsersAdmin from './Users'
import ShopsAdmin from './Shops'
import PaymentsAdmin from './Payments'
import UserProfileAdmin from './Users/User'
import Statka from './Statka'

let interval = ''

class DatasAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                users: 0,
                shops: 0,
                balanceSum: 0,
                turnovers: {},
                allSum: 0,
                withs: 0,
                shopCount: 0,
                earn: 0
            },
            cripta: [],
            withs: 0,
            card: [],
            today: 0,
            all: 0,
            today: 0,
            todayFee: 0,
            all: 0,
            allFee: 0,
            todayCARDRUB: 0,
            todayCARDKZT: 0,
			shops: [],
            exchanges: [],
            withs: []
        }
        this.getData = this.getData.bind(this)
        this.compileExchange = this.compileExchange.bind(this)
    }

    getDataCripta() {
        let newData = []
        this.state.exchanges.map(item => {
            if(item.type !== "CARDRUB") {
                if (newData.length > 0) {
                    let check = false
                    newData.map(data => {
                        if (+data.date == +new Date(+item.closed).setHours(0, 0, 0, 0)) {
                            data.value += +item.sum
                            check = true
                        }
                    })
                    if (!check) {
                        newData.push({
                            value: +item.sum,
                            date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0))
                        })
                    }
                }
                else {
                    newData.push({
                        value: +item.sum,
                        date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0))
                    })
                }
            }
        })
        this.setState({
            cripta: newData
        })
    }

    getDataCard() {
        let newData = []
        this.state.exchanges.map(item => {
            if(item.type == "CARDRUB") {
                if (newData.length > 0) {
                    let check = false
                    newData.map(data => {
                        if (+data.date == +new Date(+item.closed).setHours(0, 0, 0, 0)) {
                            data.value += +item.sumPay
                            check = true
                        }
                    })
                    if (!check) {
                        newData.push({
                            value: +item.sumPay,
                            date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0))
                        })
                    }
                }
                else {
                    newData.push({
                        value: +item.sumPay,
                        date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0))
                    })
                }
            }
        })
        this.setState({
            card: newData
        })
    }

    compileExchange() {
        let today = +new Date().setHours(0, 0, 0, 0),
            todaySum = 0,
            all = 0,
            allFee = 0,
            todayFee = 0,
            todayCARDRUB = 0,
            todayCARDKZT = 0,
			shops = []

        this.state.exchanges.map(item => {
            all += +item.sum
            allFee += +item.fee
            if (+item.closed >= today) {
							if(!shops.includes(item.shop)) {
			shops.push(item.shop)	
			}
                todaySum += +item.sum
                todayFee += +item.fee
                if(item.type == "CARDRUB") {
                    todayCARDRUB += +item.sumPay
                }
                if(item.type == "CARDKZT") {
                    todayCARDKZT += +item.sumPay
                }
            }
        })
        
        let withs = 0
        
        if(this.state.withs.length > 0) {
            this.state.withs.map(item => {
                withs += +item.sum
            })
        }

        this.setState({
            today: todaySum,
            todayFee: todayFee,
            all: all,
            allFee: allFee,
            todayCARDRUB: todayCARDRUB,
            todayCARDKZT: todayCARDKZT,
            withs: withs.toFixed(8),
			shops: shops
        })

    }

    componentDidMount() {
        this.getData()
        interval = setInterval(this.getData, 10000)
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "datas",
                    type: "getv2",
                    today: +new Date().setHours(0, 0, 0, 0)
                },
                action: "admin"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.setState({
                        data: response.data.data
                    }, () => {
                        this.setState({
                            loading: false
                        })
                    
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
            <div className="row">
                <div class="col-lg-2">
                    <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <h5><span>Пользователей / Магазинов</span></h5><h2><span>{this.state.data.users} / {this.state.data.shops}</span></h2>
                    </div>
                </div>
                {
                    this.props.user.type == "superadmin"
                        ?
                        <>
                            <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Сумма балансов</span></h5><h2><span>{this.state.data.balanceSum.toFixed(8)} BTC</span></h2>
                                </div>
                            </div>
                                  <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Массовый вывод</span></h5><h2><span className={this.state.data.withs > 0 ? "text-danger" : ""}>{this.state.data.withs.toFixed(8)} BTC</span></h2>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Оборот за 30 дней</span></h5><h2><span>{this.state.data.allSum.toFixed(8)} BTC</span></h2>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Магазинов с продажами сегодня</span></h5><h2><span>{this.state.data.shopCount}</span></h2>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Доход за сегодня</span></h5><h2><span>{this.state.data.earn ? this.state.data.earn.toFixed(8) : 0} BTC</span></h2>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Общий оборот за сегодня</span></h5><h2><span>
                                     {this.state.data.turnovers['ALL'] ? this.state.data.turnovers['ALL'].toFixed(8) : 0} BTC
                                     </span></h2>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Оборот за сегодня</span></h5><h2><span>
                                     {this.state.data.turnovers['CARDRUB'] ? Math.round(this.state.data.turnovers['CARDRUB']) : 0} CARDRUB
                                     </span></h2>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Оборот за сегодня</span></h5><h2><span>{this.state.data.turnovers['BTC'] ? this.state.data.turnovers['BTC'].toFixed(6) : 0} BTC</span></h2>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Оборот за сегодня</span></h5><h2><span>{this.state.data.turnovers['LTC'] ? this.state.data.turnovers['LTC'].toFixed(4) : 0} LTC</span></h2>
                                </div>
                            </div>
                            <div class="col-lg-2">
                                <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                    <h5><span>Оборот за сегодня</span></h5><h2><span>{this.state.data.turnovers['CARDKZT'] ? Math.round(this.state.data.turnovers['CARDKZT']) : 0} CARDKZT</span></h2>
                                </div>
                            </div>
                        </>
                        :
                        ''
                }
                <div className="col-lg-12">
                    <div class="xtabs xtabs_bottom"
                    ><div class="xtabs__body">
                            <NavLink to={`${this.props.match.url}/users`} className="xtabs__item font-m" activeClassName="active">
                                <span> Пользователи</span>
                            </NavLink>
                            <NavLink to={`${this.props.match.url}/shops`} className="xtabs__item font-m" activeClassName="active">
                                <span> Магазины</span>
                            </NavLink>
                            <NavLink to={`${this.props.match.url}/payments`} className="xtabs__item font-m" activeClassName="active">
                                <span> Платежи</span>
                            </NavLink>
                            <NavLink to={`${this.props.match.url}/statka`} className="xtabs__item font-m" activeClassName="active">
                                <span> Статистика</span>
                            </NavLink>
                        </div>
                    </div>
                    <Switch>
                        <Route exact path={`${this.props.match.path}/users`} component={UsersAdmin} />
                        <Route path={`${this.props.match.path}/users/:id`} component={UserProfileAdmin} />
                        <Route exact path={`${this.props.match.path}/shops`} component={ShopsAdmin} />
                        <Route exact path={`${this.props.match.path}/payments`} component={PaymentsAdmin} />
                        <Route exact path={`${this.props.match.path}/statka`} component={Statka}/>


                        <Route render={props =>
                            <Redirect to={`${this.props.match.path}/users`} />
                        } />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default DatasAdmin