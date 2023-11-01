import React, { Component } from 'react'

import moment from 'moment'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import md5 from 'md5'

import global from './../../../Global/index'
import Table from './../../../Table/index'
import Telegram from './Modal'
import ModalSecretConfirm from '../../../modalSecretConfirm'


const tableColumns = [
    {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true
    },
    {
        title: global.getLocales("Устройство"), dataIndex: 'device', key: 'device', sort: false
    },
    {
        title: global.getLocales("Адрес"), dataIndex: 'ip', key: 'operations', sort: false, render: (e, item) =>
            <a href={"https://www.whois.com/whois/" + item.ip} target="_blank">
                {item.ip}
            </a>
    },
    {
        title: global.getLocales('Последняя активность'), dataIndex: 'activity', key: 'activity', sort: true
    },
    {
        title: global.getLocales('Первая активность'), dataIndex: 'date', key: 'date', sort: true
    },
    {
        title: global.getLocales('Cтатус'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
            <div className="sparkline8">
                <button disabled
                    className={"btn font-m btn-sessions auth-btn " + (item.status == 1 ? " btn-primary" : " btn-danger")}> {item.status == 1 ? global.getLocales("Текущая сессия") : global.getLocales("Сессия завершена")}
                </button>
            </div>
    }
]

class Security extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                user: {
                    twoAuth: "none",
                    bot: {}
                },
                sessions: []
            },
            items: [],
            loading: true,
            password: "",
            newPassword: "",
            newPasswordTwo: "",
            secret: "",
            modal: false,
            confirm: false,
            action: "changePassword"
        }
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.confirmModal = this.confirmModal.bind(this)
        this.changePassword = this.changePassword.bind(this)
    }

    changePassword() {
        if (md5(this.state.password) === this.state.data.user.password) {
            if (this.state.newPassword.length >= 6) {
                if (this.state.newPassword === this.state.newPasswordTwo) {
                    this.setState({
                        action: "changePassword"
                    })
                    this.confirmModal()
                }
                else {
                    toast.error(global.getLocales("Пароли не совпадают"))
                }
            }
            else {
                toast.error(global.getLocales("Минимальная длина пароля - 6 символов"))
            }
        }
        else {
            toast.error(global.getLocales("Текущий пароль неверный"))
        }
    }

    confirmModal() {
        this.setState({
            confirm: !this.state.confirm
        })
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    componentDidMount() {
        this.getData()
    }

    prepareTableData() {
        let items = [];

        this.state.data.sessions.map((item) => {
            let itemModified = {
                id: item.id,
                device: item.device,
                ip: item.ip,
                activity: moment.unix(item.activity / 1000).format("LLL"),
                date: moment.unix(item.date / 1000).format("LLL"),
                status: item.status
            }
            items.push(itemModified)
        })

        this.setState({
            items: items
        })
    }

    updateItems(items) {
        this.setState({
            items: items
        })
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "security",
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
                    this.prepareTableData()
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

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    sendData() {
        if (md5(this.state.password) === this.state.data.user.password || this.state.action == "disable2Auth") {
            if (this.state.newPassword.length >= 6 || this.state.action == "disable2Auth") {
                if (this.state.newPassword === this.state.newPasswordTwo || this.state.action == "disable2Auth") {

                        this.setState({
                            loading: true
                        })

                        let data = {
                            api: "user",
                            body: {
                                data: {
                                    section: "security",
                                    type: this.state.action,
                                    password: this.state.password,
                                    newPassword: this.state.newPassword,
                                    secret: this.state.secret
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
                                        loading: false,
                                        password: "",
                                        newPassword: "",
                                        newPasswordTwo: "",
                                        secret: ""
                                    })
                                    this.confirmModal()
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
                else {
                    toast.error(global.getLocales("Пароли не совпадают"))
                }
            }
            else {
                toast.error(global.getLocales("Минимальная длина пароля - 6 символов"))
            }
        }
        else {
            toast.error(global.getLocales("Текущий пароль неверный"))
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-4">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h3 className="font-m">{global.getLocales("Изменение пароля")}</h3>
                                    <br />
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Текущий пароль")}</label>
                                        <input onChange={this.handleChange} value={this.state.password} autocomplete="off" type="text" name="password" class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Новый пароль")}</label>
                                        <input onChange={this.handleChange} value={this.state.newPassword} autocomplete="off" type="password" name="newPassword" class="form-control" />
                                        <small>{global.getLocales("Минимальная длина пароля - 6 символов")}</small>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Повторите новый пароль")}</label>
                                        <input onChange={this.handleChange} value={this.state.newPasswordTwo} autocomplete="off" type="password" name="newPasswordTwo" class="form-control" />
                                    </div>
                                    <button value="Подтвердить" onClick={this.changePassword} class="btn btn-primary right font-m auth-btn">{global.getLocales("Подтвердить")}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h3 className="font-m">{global.getLocales("Двухфакторная аутентификация")}</h3>
                                    <br />
                                    {
                                        this.state.data.user.twoAuth == "none"
                                            ?
                                            <>
                                                <div class="xbox__body font-m"><span><p>{global.getLocales("Подключение аккаунта Telegram улучшит защиту Вашей учетной записи и позволит получать через Telegram уведомления, выбранные в")} <Link to="/dashboard/profile/settings">{global.getLocales("настройках аккаунта")}</Link>{global.getLocales(", а также управлять магазином и аккаунтом из мессенджера.")}</p><p>{global.getLocales("Будьте внимательны, убедитесь в том, что Вы сможете восстановить аккаунт в случае утери доступа к аккаунту Telegram. Без доступа к аккаунту Telegram, Вы")} <span class="text-danger">{global.getLocales("не сможете восстановить пароль")}</span> {global.getLocales("от вашей учетной записи без секретного слова.")}</p></span></div>
                                                <div className="row">
                                                    <div className="col-lg-12 text-center">
                                                        <button value="Подключить" style={{ width: "50%" }} onClick={this.toggle} class="btn btn-secondary font-m auth-btn">{global.getLocales("Подключить")}</button>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <span class="font-m"><p>{global.getLocales("К Вашему аккаунту подключена двухфакторная аутентификация. В разделе")} <Link to="/dashboard/profile/settings">{global.getLocales("настройки аккаунта")}</Link> {global.getLocales("Вы можете выбрать действия, при которых наш бот")} {global.getLocales("будет присылать Вам уведомления.")}</p></span>
                                                <div class="form-group">
                                                    <label class="form-control-label font-m">Telegram ID</label>
                                                    <input disabled value={this.state.data.user.bot.chatid} class="form-control" />
                                                </div>
                                                <div class="form-group">
                                                    <label class="form-control-label font-m">{global.getLocales("Имя")}</label>
                                                    <input disabled value={this.state.data.user.bot.first_name} class="form-control" />
                                                </div>
                                                <div class="form-group">
                                                    <label class="form-control-label font-m">Username</label>
                                                    <input disabled value={this.state.data.user.bot.username ? "@" + this.state.data.user.bot.username : <>{global.getLocales("Нет")}</>} class="form-control" />
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-12 text-center">
                                                        <button  style={{ width: "50%" }} value="Отвязать аккаунт" onClick={() => {
                                                            this.setState({
                                                                action: "disable2Auth"
                                                            })
                                                            this.confirmModal()
                                                        }} class="btn btn-danger font-m right">{global.getLocales("Отвязать аккаунт")}</button>
                                                    </div>
                                                </div>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h3 className="font-m">{global.getLocales("История сессий")}</h3>
                                    <br />

                                    <Table columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalSecretConfirm loading={this.state.loading} sendData={this.sendData} handleChange={this.handleChange} modal={this.state.confirm} toggle={this.confirmModal} />
                <Telegram getData={this.getData} modal={this.state.modal} toggle={this.toggle} />
            </div>
        )
    }
}

export default Security