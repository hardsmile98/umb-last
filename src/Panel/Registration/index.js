import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'

import global from '../Global/index'

import logo from '../AuthModule/logo.png'
import HCaptcha from '@hcaptcha/react-hcaptcha'


class Regisration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: "",
            password: "",
            repeatPassword: "",
            secret: "",
            loading: false,
            token: ""
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
                    api: "registration",
                    body: {
                        data: {
                            login: this.state.login,
                            password: this.state.password,
                            secret: this.state.secret,
                            token: this.state.token,
                            lang: localStorage.getItem('lang')
                        },
                        action: "one"
                    },
                    headers: {
                        'authorization': 'none'
                    }
                }

                global.createRequest(data, response => {
                    if (response.status == 200) {
                        if (response.data.success) {

                            toast.success(response.data.message)

                            data.api = "authorization"

                            global.createRequest(data, response => {
                                if (response.status == 200) {
                                    if (response.data.success) {

                                        this.setState({
                                            loading: false
                                        })

                                        localStorage.setItem('token', response.data.data.token)

                                        this.props.history.push('/dashboard')
                                    }
                                    else {
                                        toast.error(response.data.message)
                                    }
                                }
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
        if (this.state.login.length >= 4) {
            if (this.state.password.length >= 6) {
                if (this.state.password === this.state.repeatPassword) {
                    if (this.state.secret.length >= 3) {
                        callback(true)
                    }
                    else {
                        toast.error(global.getLocales("Минимальная длина секретной фразы - 3 символа"))
                        callback(false)
                    }
                }
                else {
                    toast.error(global.getLocales("Пароли не совпадают"))
                    callback(false)
                }
            }
            else {
                toast.error(global.getLocales("Минимальная длина пароля - 6 символов"))
                callback(false)
            }
        }
        else {
            toast.error(global.getLocales("Минимальная длина логина - 4 символа"))
            callback(false)
        }
    }


    render() {
        return (
            <>
                <div className="text-center">
                    <img className="logotype-auth" src={logo} />
                    <br />
                    <h3 className="font-g">{global.getLocales("РЕГИСТРАЦИЯ")}</h3>
                    <p className="font-m">{global.getLocales("Введите данные Вашей будущей учетной записи")}</p>
                </div>
                <div class="block auth-block animate__animated animate__fadeIn">
                    <div class="block-body">
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales("Логин")}</label>
                            <input disabled={this.state.loading} onChange={this.handleChange} autoComplete="off" name="login" type="text" placeholder={global.getLocales("Введите логин")} class="form-control" />
                            <small>{global.getLocales("Минимальная длина логина - 4 символов")}</small>
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales("Пароль")}</label>
                            <input disabled={this.state.loading} onChange={this.handleChange} autoComplete="off" name="password" placeholder={global.getLocales("Введите пароль")} type="password" class="form-control" />
                            <small>{global.getLocales("Минимальная длина пароля - 6 символов")}</small>
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales("Повторение пароля")}</label>
                            <input disabled={this.state.loading} onChange={this.handleChange} autoComplete="off" name="repeatPassword" placeholder={global.getLocales("Введите пароль ещё раз")} type="password" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales("Секретная фраза")}</label>
                            <input disabled={this.state.loading} onChange={this.handleChange} autoComplete="off" name="secret" placeholder={global.getLocales("Введите секретную фразу")} type="password" class="form-control" />
                            <small>{global.getLocales("Запомните данную фразу, она является ключевым фактором для восстановления доступа в случае утери остальных данных")}</small>
                        </div>
                        <div className='text-center'>
                                    <HCaptcha
                                        sitekey="951a4e66-a414-4ed4-9dce-3473af0fbd38"
                                        languageOverride="ru"
                                        onVerify={(token, ekey) => this.handleChange({target:{name:"token",value:token}})}
                                    />
                                    </div>
                        <div class="row">
                            <div className="col-lg-6">
                                <button class="btn btn-primary font-g auth-btn" disabled={this.state.loading} onClick={this.sendData}>{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Зарегистрироваться")}</>}</button>

                            </div>
                            <div className="col-lg-6">
                                <NavLink to='/security/authorization'>
                                    <button class="btn btn-secondary right font-g auth-btn">
                                        {global.getLocales("Авторизация")}
                        </button>
                                </NavLink>
                            </div>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Regisration