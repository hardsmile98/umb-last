import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faSearchPlus, faStar } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../../Table'


class UserProfileAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                user: {
                    shops: [],
                    finance: []
                }
            },
            domain: "",
            items: [],
            adder: 0,
            password: ""
        }
        this.getData = this.getData.bind(this)
        this.blockAction = this.blockAction.bind(this)
        this.sendData = this.sendData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.giveOnion = this.giveOnion.bind(this)
        this.giveNormalDomain = this.giveNormalDomain.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
        this.addition = this.addition.bind(this)

    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    prepareTableData() {
        let items = [];

        this.state.data.user.finance.map((item) => {
            let itemModified = {
                id: item.id,
                type: item.type.replace(/shopPlus/g, "Доход от шопа").replace(/createWithdrawal/g, "Вывод").replace(/createPayment/g, "Пополнение").replace(/purchase/g, "Покупка услуги"),
                sum: item.sum + " BTC",
                created: moment.unix(item.created / 1000).format("LLL"),
                wallet: item.wallet
            }
            items.push(itemModified)
        })


        this.setState({
            items: items.reverse()
        })
    }

    updateItems(items) {
        this.setState({
            items: items
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
                    section: "datas",
                    type: "updateUser",
                    name: this.state.name,
                    balance: this.state.balance,
                    usertype: this.state.type,
                    comission: this.state.comission,
                    id: this.props.match.params.id,
                    notice: this.state.notice,
                    shopLimit: this.state.shopLimit,
                    premium: this.state.premium
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

    giveNormalDomain(id) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "datas",
                    type: "giveDomain",
                    shop: id,
                    domain: this.state.domain.toLowerCase()
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
                    this.setState({
                        domain: ""
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

    giveOnion(id) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "datas",
                    type: "giveDomainOnion",
                    shop: id
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
                    section: "datas",
                    type: "getUserProfile",
                    id: this.props.match.params.id
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
                        loading: false,
                        name: response.data.data.user.name,
                        balance: response.data.data.user.balance,
                        comission: response.data.data.user.comission,
                        shopLimit: response.data.data.user.shopLimit,
                        notice: response.data.data.user.notice,
                        type: response.data.data.user.type,
                        premium: response.data.data.user.premium,
                    }, () => {
                        this.prepareTableData()
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

    addition() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "datas",
                    type: "addition",
                    id: this.props.match.params.id,
                    password: this.state.password,
                    sum: this.state.adder
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
                    this.setState({
                        adder: 0,
                        password: ""
                    }, () => {
                        this.getData()
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

    blockAction(id) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "datas",
                    type: "blockAction",
                    user: id
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

    render() {
        const tableColumns = [
            {
                title: 'ID', dataIndex: 'id', key: 'id', sort: true
            },
            {
                title: 'Тип операции', dataIndex: 'type', key: 'type', sort: true
            },
            {
                title: 'Кошелек', dataIndex: 'wallet', key: 'wallet', sort: true
            },
            {
                title: 'Сумма', dataIndex: 'sum', key: 'sum', sort: true
            },
            {
                title: 'Дата', dataIndex: 'created', key: 'created', sort: true
            }
        ]
        return (
            <div className="row margin-15">
                <div className="col-lg-8">
                    <div class={"block animate__animated animate__fadeIn margin-15 " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h3 className="font-m">Пользователь #{this.props.match.params.id} {this.state.data.user.premium == 1 ? <FontAwesomeIcon className='text-danger' icon={faStar} /> : ''}</h3>
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Логин</label>
                                        <input className='form-control' value={this.state.data.user.login} disabled name="login" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Имя в ТП</label>
                                        <input className='form-control' value={this.state.name} onChange={this.handleChange} name="name" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Заметка</label>
                                        <input className='form-control' value={this.state.notice} onChange={this.handleChange} name="notice" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Тип юзера</label>
                                        <select className='form-control' value={this.state.type} onChange={this.handleChange} name="type">
                                            <option value="user">Пользователь</option>
                                            <option value="support">Агент поддержки</option>
                                            <option value="admin">Администратор</option>
                                            <option value="superadmin">Супер-админ</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Лимит шопов</label>
                                        <input className='form-control' value={this.state.shopLimit} onChange={this.handleChange} name="shopLimit" />
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Баланс</label>
                                        <input className='form-control' disabled value={this.state.balance} onChange={this.handleChange} name="balance" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Комиссия</label>
                                        <input className='form-control' value={this.state.comission} onChange={this.handleChange} name="comission" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Зарегистрирован</label>
                                        <input className='form-control' disabled value={moment.unix(this.state.data.user.regdate / 1000).format("LLL")} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Премиум юзер</label>
                                        <select className='form-control' value={this.state.premium} onChange={this.handleChange} name="premium">
                                            <option value="0">Нет</option>
                                            <option value="1">Да</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div onClick={() => { this.props.history.goBack() }} className='btn btn-secondary font-m left'>Назад</div>
                                    <div onClick={this.sendData} className='btn btn-primary font-m right'>Сохранить</div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Пароль</label>
                                        <input className='form-control' value={this.state.password} onChange={this.handleChange} name="password" />
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Добавить к балансу</label>
                                        <div className='input-group'>
                                            <input name="adder" type="number" onChange={this.handleChange} value={this.state.adder} class="form-control" />
                                            <span onClick={this.addition} className='input-group-text pointer'>Добавить</span>
                                        </div>
                                        <small>Если списать, просто указваем отрицательное число, например -0.05</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h3 className="font-m">Его магазины или где он является сотрудником</h3>
                            {
                                this.state.data.user.shops.length > 0
                                    ?
                                    <>
                                        {
                                            this.state.data.user.shops.map(item =>
                                                <div className='avatar-block text-left'>
                                                    <h3 className="font-m">Магазин #{item.id}</h3>
                                                    <div className="form-group">
                                                        <label className="form-control-label font-m">База</label>
                                                        <input className='form-control' value={item.db} disabled name="login" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-control-label font-m">Уникальный ID</label>
                                                        <input className='form-control' value={item.uniqueId} disabled name="login" />
                                                    </div>
                                                    <NavLink to={"/dashboard/shops/" + item.uniqueId + "/"}>
                                                        <div className='btn btn-secondary font-m auth-btn'>Открыть магазин</div>
                                                    </NavLink>
                                                    <div className="form-group margin-15">
                                                        <label className="form-control-label font-m">Домен для подключения (ТОЛЬКО ДОМЕН БЕЗ http И /)</label>
                                                        <input className='form-control' value={this.state.domain} onChange={this.handleChange} name="domain" />
                                                        <small>Пример: google.com</small>
                                                    </div>
                                                    <div className='row margin-15'>
                                                        <div className='col-lg-6'>
                                                            <div className='btn btn-primary font-m auth-btn' onClick={() => { this.giveNormalDomain(item.id) }}>Подключить</div>
                                                        </div>
                                                        <div className='col-lg-6'>
                                                            <div className='btn btn-primary font-m auth-btn' onClick={() => { this.giveOnion(item.id) }}>Выдать ONION</div>

                                                        </div>
                                                        <div className='col-lg-12'>
                                                            <div className='avatar-block notice font-m'>
                                                                Для подключения домена Вам необходимо установить наши NS сервера в настройках домена:<br /><br />
                                                                lady.ns.cloudflare.com<br />
                                                                micah.ns.cloudflare.com
                                                                <br />
                                                                <br />
                                                                В каждом сервисе по продаже доменов изменение NS серверов производится по-разному, если Вы не знаете как изменить NS сервера, обратитесь, пожалуйста, в службу поддержки сервиса, где приобретали домен.
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            )
                                        }
                                    </>
                                    :
                                    <div className='text-center'>
                                        Шопов нет
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h3 className="font-m">Движение средств</h3>
                            {
                                this.state.data.user.finance.length > 0
                                    ?
                                    <Table columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                    :
                                    <div className='text-center font-m'>операции отсутствуют</div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserProfileAdmin