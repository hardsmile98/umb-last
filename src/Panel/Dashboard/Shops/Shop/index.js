import React, { Component } from 'react'
import { toast } from 'react-toastify'

import global from '../../../Global/index'
import { NavLink, Route, Switch, Redirect } from 'react-router-dom'
import Statistics from './Statistics'
import Shipment from './Shipment'
import ShopSettings from './Settings'
import ShopBots from './Bots'
import Feedback from './Feedback'
import Datas from './Datas'
import SiteParser from './Site'
import Marketing from './Marketing'
let interval = "",
    first = true

class Shop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                currency: "",
                purchases: [],
                unread: 0,
                presellers: 0
            },
            today: 0,
            threedays: 0,
            monthSum: 0,
            allSum: 0
        }
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()
        interval = setInterval(this.getData, 10000)
    }


    componentWillUnmount() {
        clearInterval(interval)
    }
     
    prepareData() {
        let today = +new Date().setHours(0, 0, 0, 0),
            todaySum = 0

        this.state.data.purchases.map(item => {
            if (+item.closed >= today) {
                todaySum += +item.sum
            }
        })

        let todays = new Date();
        let priorDate = +new Date(new Date().setDate(todays.getDate() - 30)),
            days30sum = 0

        this.state.data.purchases.map(item => {
            if (+item.closed >= priorDate) {
                days30sum += +item.sum
            }
        })

        let date = new Date();
        let firstDay = +new Date(date.getFullYear(), date.getMonth(), 1),
            monthSum = 0

        this.state.data.purchases.map(item => {
            if (+item.closed >= firstDay) {
                monthSum += +item.sum
            }
        })

        let allSum = 0

        this.state.data.purchases.map(item => {
            allSum += +item.sum
        })

        this.setState({
            today: todaySum,
            threedays: days30sum,
            monthSum: monthSum,
            allSum: allSum
        })


    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "get",
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
                    }, () => {
                        if(response.data.data.courier && first) {
                            this.props.history.push('/dashboard/shops/' + this.props.match.params.shopId + '/shipment/sellers')
                        }
                        this.prepareData()

                        first = false
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
                    <div class="col-lg-3">
                        <div class={"income font-m income-orange animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <h5><span>{global.getLocales('За сегодня')}</span></h5><h2><span>{Math.round(this.state.today)} {this.state.data.currency}</span></h2>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <h5><span>{global.getLocales('За последние 30 дней')}</span></h5><h2><span>{Math.round(this.state.threedays)} {this.state.data.currency}</span></h2>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <h5><span>{global.getLocales('За текущий месяц')}</span></h5><h2><span>{Math.round(this.state.monthSum)} {this.state.data.currency}</span></h2>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <h5><span>{global.getLocales('За все время')}</span></h5><h2><span>{Math.round(this.state.allSum)} {this.state.data.currency}</span></h2>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div class="xtabs xtabs_bottom"
                        ><div class="xtabs__body">
                                <NavLink to={`${this.props.match.url}/statistics`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Статистика')}</span>
                                </NavLink>
                                <NavLink to={`${this.props.match.url}/shipment`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Продукция')}</span>
                                </NavLink>
                                <NavLink to={`${this.props.match.url}/datas`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Покупатели')}</span>
                                </NavLink>
                                <NavLink to={`${this.props.match.url}/bots`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Боты')}</span>
                                </NavLink>
                                <NavLink to={`${this.props.match.url}/site`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Сайт')}</span>
                                </NavLink>
                                                                <NavLink to={`${this.props.match.url}/marketing`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Маркетинг')}</span>
                                </NavLink>
                                <NavLink to={`${this.props.match.url}/settings`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Настройки')}</span>
                                </NavLink>
                                <NavLink to={`${this.props.match.url}/feedback`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Обратная связь')} {this.state.data.unread > 0 ? <span className='badge badge-danger'>{this.state.data.unread}</span> : ''}</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <Switch>
                            <Route path={`${this.props.match.path}/statistics`} component={Statistics} />
                            <Route path={`${this.props.match.path}/shipment`} component={Shipment} />
                            <Route path={`${this.props.match.path}/bots`} component={ShopBots} />
                            <Route path={`${this.props.match.path}/settings`} component={ShopSettings} />
                            <Route path={`${this.props.match.path}/feedback`} component={Feedback} />
                            <Route path={`${this.props.match.path}/site`} component={SiteParser} />
                            <Route path={`${this.props.match.path}/marketing`} component={Marketing} />

                            <Route path={`${this.props.match.path}/datas`} render={props => <Datas {...props} presellers={this.state.data.presellers}/>}/>


                            <Route render={props =>
                            <Redirect to={"/dashboard/shops/" + this.props.match.params.shopId + "/statistics"}/>
                        } />

                        </Switch>
                    </div>
                </div>
        )
    }
}

export default Shop