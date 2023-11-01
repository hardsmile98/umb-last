import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../Global/index'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

class Settings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                user: {
                    login: "test",
                    comission: 3,
                    shopLimit: 1,
                    regdate: Date.now(),
                    twoAuth: "telegram",
                    notifications: {},
                    theme: "default"
                },
                notifications: []
            },
            loading: true
        }
        this.getData = this.getData.bind(this)
        this.notifyUpdate = this.notifyUpdate.bind(this)
        this.changeStyle = this.changeStyle.bind(this)
        this.changeLang = this.changeLang.bind(this)
    }


    componentDidMount() {
        this.getData()
    }

    changeStyle(e) {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "settings",
                    type: "changeStyle",
                    style: e.target.value
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
                    localStorage.setItem('theme', e.target.value)
                    this.getData()
                    toast.success(response.data.message)
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

    changeLang(e) {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "settings",
                    type: "changeLang",
                    lang: e.target.value
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
                    localStorage.setItem('lang', e.target.value)
                    this.forceUpdate()
                    this.getData()
                    toast.success(response.data.message)
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
                        loading: false,
                        theme: response.data.data.user.theme,
                        lang: response.data.data.user.lang
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

    notifyUpdate(e) {
        this.setState({
            loading: true
        })

        let data = {
            api: "user",
            body: {
                data: {
                    section: "settings",
                    type: "set",
                    name: e.target.name
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
        return (
            <>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales("Информация об аккаунте")}</h3>
                            <br/>
                            </div>
                            <div className="col-lg-6">
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Имя пользователя")}</label>
                                    <input value={this.state.data.user.login} disabled class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Дата регистрации")}</label>
                                    <input value={moment.unix(this.state.data.user.regdate / 1000).format("LLL")} disabled class="form-control" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Комиссия системы")}</label>
                                    <input value={this.state.data.user.comission + "%"} disabled class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Лимит магазинов")}</label>
                                    <input value={this.state.data.user.shopLimit + " " + global.getLocales("шт.")} disabled class="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales("Настройки")}</h3>
                            </div>
                            <div className="col-lg-6">
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales("Тема панели")}</label>
                                <select disabled={this.state.loading} value={this.state.theme} onChange={this.changeStyle} name="theme" class="form-control">
                                    <option value="default">{global.getLocales("Светлая")}</option>
                                    <option value="dark">{global.getLocales("Тёмная")}</option>
                                </select>
                            </div>
                            </div>
                            <div className="col-lg-6">
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales("Язык интерфейса")}</label>
                                <select disabled={this.state.loading} value={this.state.lang} onChange={this.changeLang} name="lang" class="form-control">
                                    <option value="RU">Русский</option>
                                    <option value="UA">Український</option>
                                    <option value="EN">English</option>
                                    <option value="ES">Español</option>

                                </select>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    this.state.data.user.twoAuth == "none"
                        ?
                        <div class="block animate__animated animate__fadeIn">
                            <div className="text-center font-m">
                            {global.getLocales("Для настройки уведомлений Вам необходимо подключить двухфакторную аутентификацию в разделе")} <Link to="/dashboard/profile/security">{global.getLocales("безопасность")}</Link>
                            </div>
                        </div>
                        :
                        ''
                }
                <div class={"block animate__animated animate__fadeIn " + ((this.state.loading || this.state.data.user.twoAuth == "none") ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales("Уведомления от Telegram бота")}</h3>
                            </div>
                            {
                                this.state.data.notifications.map(item =>
                                    <div className="col-lg-6">
                                        <div className="avatar-block">
                                            <h2 className="font-m">
                                            {global.getLocales(item.label)}
                                            </h2>
                                            {item.items.map(item =>
                                                <div class="i-checks">
                                                    <input name={item.name} checked={this.state.data.user.notifications[item.name] ? true : false} onClick={this.notifyUpdate} id={item.name} type="checkbox" class="checkbox-template" />
                                                    <label for={item.name} className="checkbox-label font-m">{global.getLocales(item.label)}</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Settings