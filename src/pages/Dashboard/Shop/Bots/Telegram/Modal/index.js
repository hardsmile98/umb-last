import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import global from '../../../../../../Global/index'
import { toast } from 'react-toastify'

class BotTModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            notice: ""
        }
        this.sendData = this.sendData.bind(this)
        this.handleChange = this.handleChange.bind(this)
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
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "telegram",
                    shop: this.props.shopId,
                    id: this.props.bot.id,
                    notice: this.state.notice,
                    action: "edit"
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
                        loading: false,
                        note: ""
                    })
                    toast.success(response.data.message)
                    this.props.loadData()
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
                this.setState({
                    loading: false
                })
                toast.error("Сервер недоступен")
            }
        })
    }

    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header">
                    <h4 className="font-m">{global.getLocales('Бот')} #{this.props.bot.id}</h4>
                    </div>
                    <ModalBody>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Тип')}</label>
                            <input disabled autocomplete="off" value={this.props.bot.type.toUpperCase()} name="type" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Токен')}</label>
                            <input disabled autocomplete="off" value={this.props.bot.token} name="token" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Дата добавления')}</label>
                            <input disabled autocomplete="off" name="created" value={moment.unix(this.props.bot.created / 1000).format("LLL")} class="form-control" />
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Заметка')}</label>
                            <input maxLength="50" disabled={this.state.loading} defaultValue={this.props.bot.notice} autocomplete="off" type="text" onChange={this.handleChange} name="notice" placeholder={global.getLocales("Введите примечание")} class="form-control" />
                            <small>{global.getLocales('Максимальная длина заметки - 50 символов')}</small>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4">
                                <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales('Закрыть')}</button>
                            </div>
                            <div className="col-lg-8">
                                <button disabled={this.state.loading} onClick={this.sendData} class="btn btn-primary font-m auth-btn">
                                    {this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales('Сохранить')}</>}
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

export default BotTModal

