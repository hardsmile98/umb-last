import axios from 'axios'
import moment from 'moment'
import React, { Component } from 'react'
import { toast } from 'react-toastify'
import global from './../../../../Global/index'


class AdminWalletLTC extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                balances: 0,
                transactions: [],
                settings: {},
                sum: 0,
                cryptokassa: 0
            },
            fees: {
                fastestFee: 0,
                halfHourFee: 0,
                hourFee: 0
            },
            wallet: "",
            sum: 0,
            satoshi: 3
        }
        this.getData = this.getData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.sendData = this.sendData.bind(this)
    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    componentDidMount() {
        this.getData()
    }

    sendData() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "settings",
                    type: "sendLTC",
                    address: this.state.wallet,
                    amount: this.state.sum,
                    satoshi: this.state.satoshi
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
                    toast.success(response.data.message)
                    this.getData()

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

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "settings",
                    type: "getWalletLTC"
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
            <>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div class={"income font-m income-orange animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <h5><span>Баланс</span></h5><h2><span>{this.state.data.balances} LTC</span></h2>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <h3 className="font-m">Кошелек</h3>
                                        <div className='row'>
                                            <div className='col-lg-8'>
                                                <div class="form-group">
                                                    <label class="form-control-label font-m">Адрес для перевода</label>
                                                    <input type="text" autoComplete="off" class="form-control" placeholder="Вставьте адрес" name="wallet" value={this.state.wallet} onChange={this.handleChange} />
                                                </div>
                                            </div>
                                            <div className='col-lg-4'>
                                                <div className="form-group">
                                                    <label class="form-control-label font-m">Сумма перевода</label>
                                                    <div class="input-group">
                                                        <input type="number" autoComplete="off" class="form-control" placeholder="Введите сумму" name="sum" value={this.state.sum} onChange={this.handleChange} />
                                                        <span class="input-group-text">BTC</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-lg-8'>
                                                <div className="form-group">
                                                    <label class="form-control-label font-m">Комиссия {this.state.satoshi} sat/vByte</label>
                                                    <input type="range" name="satoshi" onChange={this.handleChange} min="1" max="200" step="1" value={this.state.satoshi} className="form-control-range" />
                                                </div>
                                            </div>
                                            <div className='col-lg-4 center-flex'>
                                                <button className='btn btn-primary font-m auth-btn' onClick={this.sendData}>Отправить</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                        <h3 className="font-m">Последние 100 транзакций</h3>
                                            <div className='avatar-block font-m'>
                                                <div className='row no-margin'>
                                                    <div className='col-lg-1'>
                                                        Тип
                                                    </div>
                                                    <div className='col-lg-3'>
                                                        Кошелек
                                                    </div>
                                                    <div className='col-lg-2'>
                                                        Сумма
                                                    </div>
                                                    <div className='col-lg-2'>
                                                        Дата
                                                    </div>
                                                    <div className='col-lg-4'>
                                                        TXID
                                                    </div>
                                                </div>
                                            </div>
                                        {
                                            this.state.data.transactions.map(item =>
                                                    <div className='avatar-block font-m'>
                                                        <div className='row'>
                                                            <div className='col-lg-1'>
                                                                {item.category.replace(/send/g, "Отправка").replace(/receive/g, "Получение")}
                                                            </div>
                                                            <div className='col-lg-3'>
                                                                {item.address}
                                                            </div>
                                                            <div className='col-lg-2'>
                                                                {item.amount}
                                                            </div>
                                                            <div className='col-lg-2'>
                                                                {moment.unix(item.time).format("LLL")}
                                                            </div>
                                                            <div className='col-lg-4'>
                                                                {item.txid}
                                                            </div>
                                                        </div>
                                                    </div>
                                            )
                                        }
                                    </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default AdminWalletLTC