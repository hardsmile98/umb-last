import React, { Component } from 'react'
import { faQuestion, faUser } from "@fortawesome/free-solid-svg-icons/index"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, NavLink } from "react-router-dom"

import global from '../Global/index'
import { toast } from 'react-toastify'

import logo from './../AuthModule/logo.png'


class Authorization extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: "",
            password: "",
            code: 0,
            loading: false,
            needCode: false,
            action: "one"
        }
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

    sendData() {
        this.setState({
            loading: true
        })

        this.checkData(result => {
            if (result) {
                let data = {
                    api: "authorization",
                    body: {
                        data: {
                            login: this.state.login,
                            password: this.state.password,
                            code: this.state.code
                        },
                        action: this.state.action
                    },
                    headers: this.state.needCode ? { 'authorization': localStorage.getItem('token') } : ''
                }

                global.createRequest(data, response => {
                    if (response.status == 200) {
                        if (response.data.success) {

                            toast.success(response.data.message)
                            localStorage.setItem('token', response.data.data.token)

                            if (response.data.data.needCode) {
                                this.setState({
                                    needCode: true,
                                    loading: false,
                                    action: "two"
                                })
                            }
                            else {
                                this.setState({
                                    loading: false
                                })
                                localStorage.setItem('theme', response.data.data.theme)
                                if(localStorage.getItem('lang') !== response.data.data.lang) {
                                    localStorage.setItem('lang', response.data.data.lang)
                                    this.forceUpdate()
                                    
                                }
                                this.props.history.push('/dashboard')
                            }
                        }
                        else {
                            this.setState({
                                loading: false
                            })
                            toast.error(response.data.message)
                        }
                    }
                    else {
                        this.setState({
                            loading: false
                        })
                        toast.error("Сервер недоступен")
                    }
                })
            }
            else {
                this.setState({
                    loading: false
                })
            }
        })
    }

    checkData(callback) {
        if (this.state.login.length > 3) {
            if (this.state.password.length > 5) {
                if (this.state.code || !this.state.needCode) {
                    callback(true)
                }
                else {
                    toast.error(global.getLocales("Заполните поле кода подтверждения"))
                }
            }
            else {
                toast.error(global.getLocales("Неверный пароль"))
                callback(false)
            }
        }
        else {
            toast.error(global.getLocales("Заполните поле логина"))
            callback(false)
        }
    }

    render() {
        return (
            <>
                <div className="text-center">
                    <img className="logotype-auth" src={logo} />
                    <br />
                    <h3 className="font-g">{global.getLocales('АВТОРИЗАЦИЯ')}</h3>
                    <p className="font-m">{global.getLocales('Введите данные Вашей учетной записи')}</p>
                </div>
                <div class="block auth-block animate__animated animate__fadeIn">
                    <div class="block-body">
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Логин')}</label>
                            <input autocomplete="off" disabled={this.state.loading || this.state.needCode} type="text" name="login" onChange={this.handleChange} placeholder={global.getLocales("Введите логин")} class="form-control" />
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Пароль')}</label>
                            <input disabled={this.state.loading || this.state.needCode} autocomplete="off" name="password" onChange={this.handleChange} placeholder={global.getLocales("Введите пароль")} type="password" class="form-control" />
                        </div>
                        {
                            this.state.needCode
                                ?
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Код подтверждения')}</label>
                                    <input autocomplete="off" disabled={this.state.loading} type="number" name="code" onChange={this.handleChange} placeholder={global.getLocales("Введите код подтверждения")} class="form-control" />
                                </div>
                                :
                                ''
                        }
                        <div className="row">
                            <div className="col-lg-6">
                                <button value="Войти" class="btn btn-primary font-g auth-btn" onClick={this.sendData} disabled={this.state.loading}>{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <span className="font-g"><FontAwesomeIcon icon={faUser} /> <>{global.getLocales("ВОЙТИ")}</></span>}</button>

                            </div>
                            <div className="col-lg-6">
                                <NavLink to='/security/registration'>
                                    <button value="Регистрация" class="btn btn-secondary right font-g auth-btn">
                                        {global.getLocales('Регистрация')}
                        </button>
                                </NavLink>
                            </div>
                            <br/>
                            <div className="col-lg-12 text-center recovery">
                                <NavLink className="font-m" to='/security/recovery'>
                                    {global.getLocales('Забыли пароль?')}
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Authorization