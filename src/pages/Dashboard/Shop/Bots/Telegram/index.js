import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faSearchPlus, faBackspace, faLink, faUnlink } from '@fortawesome/free-solid-svg-icons'
import Table from './../../../../../Table'
import ModalConfirm from '../../../../../modalConfirm'
import BotTModal from './Modal'
import { NavLink } from 'react-router-dom'

const { default: axios } = require('axios')


class TelegramBots extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                bots: [],
                price: 0
            },
            token: "",
            ok: false,
            firstname: "",
            username: "",
            notice: "",
            items: [],
            modalConfirm: false,
            infoModal: false,
            bot: {
                type: ""
            },
            type: "token",
            nameauto: "",
            usernameauto: "",
            name: ""
        }
        this.onChange = this.onChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.sendData = this.sendData.bind(this)
        this.toggleStatus = this.toggleStatus.bind(this)
        this.toggleConfirm = this.toggleConfirm.bind(this)
        this.delete = this.delete.bind(this)
        this.toggleInfo = this.toggleInfo.bind(this)
        this.getData = this.getData.bind(this)
        this.sendDataAuto = this.sendDataAuto.bind(this)
    }

    toggleInfo(id) {
        this.state.data.bots.map(item => {
            if(item.id == id) {
                this.setState({
                    bot: item
                })
            }
        })
        this.setState({
            infoModal: !this.state.infoModal
        })
    }

    componentDidMount() {
        this.getData()
    }

    toggleConfirm(id) {
        this.setState({
            deleteId: id,
            modalConfirm: !this.state.modalConfirm
        })
    }

    prepareTableData() {
        let items = []

        this.state.data.bots.map(item => {
            let itemModified = {
                id: item.id,
                username: item.username,
                notice: item.notice,
                status: item.status
            }
            items.push(itemModified)
        })

        this.setState({
            items: items
        })
    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    onChange(e) {
        this.setState({
            loading: true
        })
        let token = e.target.value
        axios.get('https://api.telegram.org/bot' + token + '/getMe')
            .then((response) => {
                if (response.data.ok) {
                    this.setState({
                        firstname: response.data.result.first_name,
                        username: response.data.result.username,
                        ok: true,
                        token: token,
                        loading: false
                    })
                }
                else {
                    toast.error("Токен неверен")
                }
            })
            .catch(error => {
                this.setState({
                    loading: false
                })
                toast.error("Токен неверен")
            })
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "telegram",
                    shop: this.props.match.params.shopId,
                    action: "get"
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
                        data: response.data.data,
                        loading: false
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

    delete() {
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
                    shop: this.props.match.params.shopId,
                    id: this.state.deleteId,
                    action: "delete"
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
                    toast.success(response.data.message)
                    this.toggleConfirm()
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

    toggleStatus(id) {
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
                    shop: this.props.match.params.shopId,
                    id: id,
                    action: "toggleStatus"
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
    
        sendDataAuto() {
        this.setState({
            loading: true
        })
        if (this.state.usernameauto && this.state.nameauto) {
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "bots",
                        subtype: "telegram",
                        shop: this.props.match.params.shopId,
                        name: this.state.nameauto,
                        username: this.state.usernameauto + "_bot",
                        action: "createauto"
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
                            firstname: "",
                            username: "",
                            token: "",
                            notice: "",
                            loading: false,
                            nameauto: "",
                            usernameauto: ""
                        })
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
            this.setState({
                loading: false
            })
            toast.error("Заполните поле токена")
        }
    }

    sendData() {
        this.setState({
            loading: true
        })
        if (this.state.token) {
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "bots",
                        subtype: "telegram",
                        shop: this.props.match.params.shopId,
                        token: this.state.token,
                        notice: this.state.notice,
                        action: "create"
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
                            firstname: "",
                            username: "",
                            token: "",
                            notice: "",
                            loading: false
                        })
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
            this.setState({
                loading: false
            })
            toast.error("Заполните поле токена")
        }
    }

    
    updateItems(items) {
        this.setState({
            items: items
        })
    }

    render() {
        const tableColumns = [
            {
                title: 'ID', dataIndex: 'id', key: 'id', sort: true
            },
            {
                title: global.getLocales('Юзернейм / Примечание'), dataIndex: '', key: 'operations', render: (e, item) =>
                <a target="_blank" href={"https://t.me/" + item.username}>{item.notice ? item.notice : ("@" + item.username)}</a>
            },
            {
                title: global.getLocales('Статус'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                        <button title={item.status == 1 ? global.getLocales('Отключить бота') : global.getLocales('Включить бота')} onClick={() => { this.toggleStatus(item.id) }} className={"btn btn-table width-100 " + (item.status == 0 ? "btn-danger" : "btn-primary")}><FontAwesomeIcon icon={item.status == 0 ? faUnlink : faLink} /></button>
            },
            {
                title: global.getLocales('Действия'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <button onClick={() => { this.toggleInfo(item.id) }} className="btn btn-secondary btn-table"><FontAwesomeIcon icon={faSearchPlus} /></button>
                        <button onClick={() => { this.toggleConfirm(item.id) }} className="btn btn-danger btn-table"><FontAwesomeIcon icon={faBackspace} /></button>
                    </div>
            }
        ]
        return (
            <div className="row">
                <div className="col-lg-4">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h3 className="font-m">{global.getLocales('Добавление бота')}</h3>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Способ добавления')}</label>
                                        <select name="type" autoComplete="off" disabled={this.state.loading} onChange={this.handleChange} value={this.state.type} class="form-control">
                                        <option value="token">{global.getLocales('Вручную')}</option>
                                        <option value="auto">{global.getLocales('Автоматически (платно)')}</option>
                                        </select>
                                    </div>
                                    {
                                        this.state.type == "token"
                                        ?
                                        <>
                                                                            <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Telegram токен')}</label>
                                        <input name="token" autoComplete="off" onChange={this.onChange} disabled={this.state.loading} value={this.state.token} placeholder={global.getLocales('Вставьте токен Телеграм бота')} class="form-control" />
                                        <NavLink to="/dashboard/support/faq/answers"><small className="highlight pointer">{global.getLocales('Как его получить?')}</small></NavLink>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Имя')}</label>
                                        <input name="name" autoComplete="off" disabled value={this.state.name == "" ? global.getLocales('Нет информации') : this.state.name} class="form-control" />
                                    </div>
                                      <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Юзернейм')}</label>
                                        <input name="username" autoComplete="off" disabled value={this.state.username == "" ? global.getLocales('Нет информации') : "@" + this.state.username} class="form-control" />
                                    </div>
                                        </>
                                        :
                                        <>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Имя')}</label>
                                        <input name="nameauto" autoComplete="off" onChange={this.handleChange} disabled={this.state.loading} value={this.state.nameauto} placeholder={global.getLocales('Введите имя бота')} class="form-control" />
                                    </div>
                             
                                         <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Юзернейм')}</label>
                                                                                <div className="input-group">
                                                                                                                        <span class="input-group-text">@</span>

                                        <input name="usernameauto" autoComplete="off" onChange={this.handleChange} disabled={this.state.loading} placeholder={global.getLocales('Введите юзернейм')} value={this.state.usernameauto} class="form-control" />
                                                                                                                                                           <span class="input-group-text">_bot</span>

                                   </div>
                                    </div>
                                        </>
                                    }
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Примечание')}</label>
                                        <input name="notice" autoComplete="off" onChange={this.handleChange} placeholder={global.getLocales('Введите примечание')} value={this.state.notice} class="form-control" />
                                        <small>{global.getLocales('Максимальная длина заметки - 50 символов')}</small>
                                    </div>
                                    <button onClick={this.state.type == "token" ? this.sendData : this.sendDataAuto} disabled={this.state.loading} class="btn btn-primary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{this.state.type == "token" ? global.getLocales("Добавить") : (global.getLocales("Приобрести за ") + this.state.data.price + "$")}</>}</button>
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
                                    <h3 className="font-m">{global.getLocales('Telegram боты')}</h3>
                                    {
                                        this.state.items.length > 0
                                            ?
                                            <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="5" />
                                            :
                                            <div className="text-center">
                                                
                                                {global.getLocales('Боты отсутствуют')}
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalConfirm action={global.getLocales('Вы действительно хотите удалить данного бота?')} modal={this.state.modalConfirm} toggle={this.toggleConfirm} loading={this.state.loading} sendData={this.delete}/>
                <BotTModal loadData={this.getData} modal={this.state.infoModal} toggle={this.toggleInfo} bot={this.state.bot} shopId={this.props.match.params.shopId}/>
            </div>
        )
    }
}

export default TelegramBots