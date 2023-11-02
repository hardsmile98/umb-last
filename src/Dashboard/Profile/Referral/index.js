import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../Global/index'
import { toast } from 'react-toastify'

import Table from './../../../Table/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

class Referral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                ref: "",
                referrals: 0,
                shops: [],
                withdrawals: []
            }
        }
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "referall",
                    type: "get"
                },
                action: "profile"
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
                <div class="row">
                    <div class="col-lg-4">
                        <div class="income font-m income-orange animate__animated animate__fadeIn">
                            <h5><span>{global.getLocales('Регистрации')}</span></h5><h2><span>{this.state.data.referrals}</span></h2>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="income font-m animate__animated animate__fadeIn">
                            <h5><span>{global.getLocales('Продажи')}</span></h5><h2><span>0</span></h2>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="income font-m animate__animated animate__fadeIn">
                            <h5><span>{global.getLocales('Доход')}</span></h5><h2><span>0 BTC</span></h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div class="col-lg-6">
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <div class="form-group">
                                    <label className="font-m"><span>{global.getLocales('Партнерская ссылка')}</span></label>
                                    <div class="input-group">
                                        <input id="partnerUrl" class="form-control" name="partnerUrl" placeholder="p" value={"https://umb.market/security/registration/" + this.state.data.ref} readonly="" />
                                        <div class="input-group-append">
                                            <button onClick={() => { navigator.clipboard.writeText("https://umb.market/security/registration/" + this.state.data.ref); toast.success('Скопировано') }} class="btn btn-secondary" id="copyReferral">
                                                <FontAwesomeIcon icon={faCopy} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="partnerUrl" className="font-m"><span>{global.getLocales('Пригласительный код')}</span></label>
                                <div class="input-group">
                                    <input id="partnerUrl" class="form-control" name="partnerUrl" placeholder="p" value={this.state.data.ref} readonly="" />
                                    <div class="input-group-append">
                                        <button onClick={() => { navigator.clipboard.writeText(this.state.data.ref); toast.success(global.getLocales('Скопировано')) }} class="btn btn-secondary" id="copyReferral">
                                            <FontAwesomeIcon icon={faCopy} />
                                        </button>
                                    </div>
                                </div>
                                <small>{global.getLocales('Используется при регистрации новых пользователей.')}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body font-m">
                                <div class="text-center">{global.getLocales('Зарабатывайте 15% от прибыли сервиса, приглашая новых клиентов к нам с помощью партнерской ссылки или пригласительного кода.')}</div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6'>
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <h4 className="font-m">{global.getLocales('Магазины')}</h4>
                                {
                                    this.state.data.shops.length > 0
                                        ?
                                        <>
                                            {
                                                this.state.data.shops.map(item =>
                                                    <div className='avatar-block notice-chat'>
                                                        <div className='row'>
                                                            <div className='col-lg-6'>
                                                                {
                                                                    item.domains.length > 0
                                                                        ?
                                                                        <>
                                                                            {
                                                                                item.domains.map(domain =>
                                                                                    <a href={"http://" + domain.value}>{domain.value}</a>
                                                                                )
                                                                            }
                                                                        </>
                                                                        :
                                                                        ''
                                                                }
                                                            </div>
                                                            <div className='col-lg-6'>
                                                                {
                                                                    item.bots.length > 0
                                                                        ?
                                                                        <>
                                                                            {
                                                                                item.bots.map(bot =>
                                                                                    <a href={"https://t.me/" + bot.username}>@{bot.username}</a>
                                                                                )
                                                                            }
                                                                        </>
                                                                        :
                                                                        ''
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </>
                                        :
                                        <div className="text-center font-m">{global.getLocales('Магазины отсутствуют')}</div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6'>
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <h4 className="font-m">{global.getLocales('Начисления')}</h4>
                                <div className="text-center font-m">{global.getLocales('Начисления отсутствуют')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Referral