import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import { toast } from 'react-toastify'

import global from './../../../../Global/index'


class Telegram extends Component {
    constructor(props) {
        super(props)
        this.state = {
            secret: "",
            code: "",
            loading: false
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

        if (this.state.secret !== "") {
            if (this.state.secret !== "") {
                let data = {
                    api: "user",
                    body: {
                        data: {
                            section: "security",
                            type: "connect2Auth",
                            secret: this.state.secret,
                            code: this.state.code
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
                            this.setState({
                                data: response.data.data,
                                loading: false,
                                secret: "",
                                code: ""
                            })
                            this.props.getData()
                            this.props.toggle()
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
                toast.error(global.getLocales("Секретный код не введен"))
            }
        }
        else {
            toast.error(global.getLocales("Секретная фраза не введена"))
        }
    }


    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{global.getLocales("Подключение Telegram")}</h4>
                    </div>
                    <ModalBody>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales("Секретная фраза")}</label>
                            <input autocomplete="off" value={this.state.secret} disabled={this.state.loading} onChange={this.handleChange} type="password" name="secret" placeholder={global.getLocales("Введите секретную фразу")} class="form-control" />
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales("Секретный код от Телеграм бота")}</label>
                            <input autocomplete="off" value={this.state.code} disabled={this.state.loading} onChange={this.handleChange} type="number" name="code" placeholder={global.getLocales("Введите код")} class="form-control" />
                            <small><span dangerouslySetInnerHTML={{__html: global.getLocales("Для получения кода от <a href='https://t.me/twoauthshopbiz_bot' target='_blank' rel='noopener noreferrer'>нашего Telegram-бота</a>, найдите <a href='https://t.me/twoauthshopbiz_bot' target='_blank' rel='noopener noreferrer'>его</a> по логину <a href='https://t.me/twoauthshopbiz_bot' target='_blank' rel='noopener noreferrer'>@twoauthshopbiz_bot</a> в месседжере Telegram и напишите <a href='https://t.me/twoauthshopbiz_bot' target='_blank' rel='noopener noreferrer'>ему</a> сообщение с текстом '/start', без кавычек.")}}/></small>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4">
                                <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales("Закрыть")}</button>
                            </div>
                            <div className="col-lg-8">
                                <button onClick={this.sendData} value="Подтвердить" disabled={this.state.loading} class="btn btn-primary font-m auth-btn">
                                    {this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Подтвердить")}</>}
                                </button>
                            </div>
                        </div>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default Telegram

