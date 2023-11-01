import HCaptcha from '@hcaptcha/react-hcaptcha'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { NavLink } from 'react-router-dom'

import logo from '../AuthModule/logo.png'
import { toast } from 'react-toastify'

import global from '../Global/index'

class RecoveryPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            step: 0,
            login: "",
            secret: "",
            password: "",
            password2: "",
            token: ""
        }
        this.nextStep = this.nextStep.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    nextStep() {
        if (this.state.step == 0) {
            this.setState({
                step: this.state.step + 1
            })
        }
        else if (this.state.step == 1) {
            this.setState({
                step: this.state.step + 1
            })
        }
        else {
            this.setState({
                loading: true
            })
                let data = {
                    api: "registration",
                    body: {
                        data: {
                            login: this.state.login,
                            password: this.state.password,
                            secret: this.state.secret,
                            token: this.state.token
                        },
                        action: "recovery"
                    },
                    headers: {
                        'authorization': 'none'
                    }
                }

                global.createRequest(data, response => {
                    if (response.status == 200) {
                        if (response.data.success) {

                            toast.success(response.data.message)

                           this.props.history.push('/security/authorization')

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
    }

    render() {

        return (
            <>
                <div className="text-center">
                    <img className="logotype-auth" src={logo} />
                    <br />
                    <h3 className="font-g">{global.getLocales('Восстановление доступа')}</h3>
                    <p className="font-m">{global.getLocales('Введите данные Вашей учетной записи для восстановления доступа')}</p>
                </div>
                <div class="block auth-block animate__animated animate__fadeIn">
                    <div class="block-body">
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Логин')}</label>
                            <input name="login" value={this.state.login} onChange={this.handleChange} type="text" disabled={this.state.step > 0} placeholder={global.getLocales("Введите логин")} class="form-control" />
                        </div>
                        {
                            this.state.step > 0
                                ?
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Секретная фраза')}</label>
                                    <input name="secret" value={this.state.secret} onChange={this.handleChange} type="password" placeholder={global.getLocales("Введите секретную фразу")} class="form-control" />
                                </div>
                                :
                                ''
                        }
                        {
                            this.state.step > 1
                                ?
                                <>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Новый пароль")}</label>
                                        <input name="password" value={this.state.password} onChange={this.handleChange} type="password" placeholder={global.getLocales("Введите новый пароль")} class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Повторите новый пароль")}</label>
                                        <input name="password2" value={this.state.password2} onChange={this.handleChange} type="password" placeholder={global.getLocales("Повторите новый пароль")} class="form-control" />
                                    </div>
                                    <div className='text-center'>
                                    <HCaptcha
                                        sitekey="951a4e66-a414-4ed4-9dce-3473af0fbd38"
                                        languageOverride="ru"
                                        onVerify={(token, ekey) => this.handleChange({target:{name:"token",value:token}})}
                                    />
                                    </div>
                                </>
                                :
                                ''
                        }
                        <div class="row">
                            <div className="col-lg-6">
                                <button onClick={this.nextStep} value="Войти" class="btn btn-primary font-g auth-btn" >{global.getLocales("Далее")}</button>

                            </div>
                            <div className="col-lg-6">
                                <NavLink to='/security/authorization'>
                                    <button value="Авторизация" class="btn btn-secondary right font-g auth-btn">
                                        
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

export default RecoveryPage