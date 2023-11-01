import React, { Component } from 'react'

import ReactDOM from 'react-dom'


import moment from 'moment'
import global from '../../../../Global'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSearchPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import { NavLink } from 'react-router-dom'
import ModalOrderInfo from './Modal'

let interval = ""


class AdminDialogue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: {
                chat: {
                    messages: [],
                    user: {
                        balance: 0
                    },
                    shops: []
                }
            },
            message: "",
            chatId: "",
            order: "",
            orderInfo: {
                purchase: {},
                deposit: {}
            },
            modal: false,
            password: ""
        }
        this.getData = this.getData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.send = this.send.bind(this)
        this.block = this.block.bind(this)
        this.setOk = this.setOk.bind(this)
        this.changeContent = this.changeContent.bind(this)
        this.orderSearch = this.orderSearch.bind(this)
        this.toggle = this.toggle.bind(this)
        this.orderSearch = this.orderSearch.bind(this)
        this.setPayedOrder = this.setPayedOrder.bind(this)
        this.deleteMessage = this.deleteMessage.bind(this)
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.chatId !== nextProps.match.params.chatId) {
            clearInterval(interval)
            this.setState({
                loading: true,
                chatId: nextProps.match.params.chatId
            }, () => {
                this.getData()
            })
        }
    }

    componentDidMount() {
        this.setState({
            chatId: this.props.match.params.chatId
        }, () => {
            this.getData()
            interval = setInterval(this.getData, 1000)
        })
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    send() {
        if (this.state.message.length > 0) {
            this.setState({
                loading: true
            })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "chats",
                        type: "send",
                        id: this.state.chatId,
                        text: this.state.message
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
                            message: ""
                        })
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
            toast.error('Сообщение слишком короткое')
        }
    }

    orderSearch(id) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "chats",
                    type: "order",
                    id: this.state.order,
                    uniqueId: id
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
                        orderInfo: response.data.data
                    }, () => {
                        this.toggle()
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


    block() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "chats",
                    type: "blockAction",
                    id: this.state.chatId
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

    setOk() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "chats",
                    type: "setOk",
                    id: this.state.chatId
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

    changeContent(v) {
        this.setState({
            message: v
        })
    }

    setPayedOrder(id) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "chats",
                    type: "setPayedOrder",
                    id: id,
                    password: this.state.password
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
                    this.toggle()

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

    deleteMessage(id) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "chats",
                    type: "deleteMessage",
                    id: id
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
                    section: "chats",
                    type: "getChat",
                    id: this.state.chatId
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
				if(response.data.data.chat.id == this.state.chatId) {
				                    let last = this.state.data
                    this.setState({
                        data: response.data.data,
                        loading: false
                    }, () => {
                        if (JSON.stringify(last) !== JSON.stringify(response.data.data)) {
                            this.scrollToBottom()
                        }
                    })	
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
                toast.error("Сервер недоступен")
            }
        })
    }

    scrollToBottom() {
        const messagesContainer = ReactDOM.findDOMNode(this.el);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    render() {
        return (
            <div className='row'>
                <div className='col-lg-8'>
                    <div className={"block animate__animated animate__fadeIn chats-block-list " + (this.state.loading ? "blur" : "")}>
                        <div className="block-body">
                            <h3 className="font-m">Чат <span className='right font-m pointer' onClick={this.setOk}>Пометить решенным</span></h3>
                            <div className='shop-chat-bottom'>
                                <div className="messages-block chat" ref={el => {
                                    this.el = el
                                }}>

                                    {
                                        this.state.data.chat.messages.length > 0
                                            ?
                                            this.state.data.chat.messages.map(message =>
                                                <div className={"message-block font-m chat " + (message.admin == 0 ? "admin" : "user")}>
                                                    <div className="bold message-name">{message.user}</div>
                                                    <div className="message-content"><p>{message.value}</p></div>
                                                    <div className="message-date text-right"><a className='left' onClick={() => {this.deleteMessage(message.id)}}><FontAwesomeIcon icon={faTrashAlt}/></a>{moment.unix(message.date / 1000).format("LLL")}</div>
                                                </div>
                                            )
                                            :
                                            <div className='text-center font-m'>Сообщения отсутствуют</div>
                                    }
                                </div>
                                <div className={""}>
                                    <div className="form-group">
                                        <label htmlFor="message" className="font-m">Сообщение</label>
                                        <textarea name="message" value={this.state.message} onChange={this.handleChange} className="form-control" placeholder={global.getLocales("Введите сообщение")} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-3">
                                    </div>
                                    <div className="col-lg-3" />
                                    <div className="col-lg-6">
                                        <button onClick={this.send} disabled={this.state.loading} className="btn btn-primary right font-m auth-btn">{this.state.loading ? "Загрузка..." : "Отправить сообщение"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div className={"block animate__animated animate__fadeIn chats-block-list " + (this.state.loading ? "blur" : "")}>
                        <div className="block-body">
                            <h3 className="font-m">Пользователь</h3>
                            <div className='row'>
                                <div className='col-lg-12'>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Логин</label>
                                        <div className='input-group'>
                                            <input disabled value={this.state.data.chat.user.login} className="form-control" />
                                            <NavLink to={"/dashboard/manage/datas/users/" + this.state.data.chat.user.id}><span className='input-group-text'>Перейти в профиль</span></NavLink>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-6'>

                                    <div className="form-group">
                                        <label className="form-control-label font-m">Баланс</label>
                                        <div className='input-group'>
                                            <input disabled value={this.state.data.chat.user.balance.toFixed(8)} className="form-control" />
                                            <span className='input-group-text'>BTC</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div className="form-group">
                                        <label className="form-control-label font-m">Комиссия</label>
                                        <div className='input-group'>
                                            <input disabled value={this.state.data.chat.user.comission} className="form-control" />
                                            <span className='input-group-text'>%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                <div className="form-group">
                                        <label className="form-control-label font-m">Зарегистрирован</label>
                                        <input disabled value={moment.unix(this.state.data.chat.user.regdate / 1000).format("LLL")} className="form-control" />
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                <div className="form-group">
                                        <label className="form-control-label font-m">Заметка</label>
                                        <input disabled value={this.state.data.chat.user.notice} className="form-control" />
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    {
                                        this.state.data.chat.user.block == 0
                                            ?
                                            <button onClick={this.block} className='btn btn-danger auth-btn font-m'>Закрыть доступ к поддержке</button>
                                            :
                                            <button onClick={this.block} className='btn btn-secondary auth-btn font-m'>Открыть доступ к поддержке</button>
                                    }
                                    <h3 className="font-m margin-15">Магазины</h3>
                                    {
                                        this.state.data.chat.shops.length <= 0
                                            ?
                                            <div className='font-m text-center'>Магазинов нет</div>
                                            :
                                            this.state.data.chat.shops.map(item =>
                                                <>
                                                    <div className='input-group'>
                                                        <input disabled value={item.domain} className="form-control" />
                                                        <NavLink to={"/dashboard/shops/" + item.uniqueId}><span className='input-group-text'><FontAwesomeIcon icon={faSearchPlus} /></span></NavLink>
                                                    </div>
                                                    <div className="form-group">
                                                        <label className="form-control-label font-m">Поиск заказа</label>
                                                        <div className='input-group'>
                                                            <input name="order" onChange={this.handleChange} value={this.state.order} className="form-control" />
                                                            <span onClick={() => {this.orderSearch(item.uniqueId)}} className='input-group-text pointer'><FontAwesomeIcon icon={faSearch} /></span>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalOrderInfo setPayedOrder={this.setPayedOrder} password={this.state.password} handleChange={this.handleChange} modal={this.state.modal} toggle={this.toggle} order={this.state.orderInfo}/>
            </div>
        )
    }
}

export default AdminDialogue