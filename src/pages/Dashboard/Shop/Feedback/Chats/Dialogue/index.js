import React, { Component } from 'react'

import ReactDOM from 'react-dom'


import moment from 'moment'
import global from '../../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faTrashAlt, faUser } from '@fortawesome/free-solid-svg-icons'

import renderHTML from 'react-render-html'
import { NavItem } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import ModalConfirm from '../../../../../../modalConfirm'

let interval = ""


class FeedbackDialogue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                chat: {
                    messages: [],
                    user: {}
                }
            },
            message: "",
            chatId: "",
            modal: false,
            idDel: 0
        }
        this.getData = this.getData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.send = this.send.bind(this)
        this.block = this.block.bind(this)
        this.toggle = this.toggle.bind(this)
        this.delete = this.delete.bind(this)
                this.readed = this.readed.bind(this)
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
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
                    type: "feedback",
                    subtype: "chats",
                    shop: this.props.match.params.shopId,
                    action: "delete",
                    id: this.state.chatId
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
                    this.props.history.push('/dashboard/shops/' + this.props.match.params.shopId + '/feedback/chats')
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
    
        readed() {
            this.setState({
                loading: true
            })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "feedback",
                        subtype: "chats",
                        shop: this.props.match.params.shopId,
                        action: "setReaded",
                        id: this.state.chatId
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

    send() {
        if (this.state.message.length > 0) {
            this.setState({
                loading: true
            })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "feedback",
                        subtype: "chats",
                        shop: this.props.match.params.shopId,
                        action: "send",
                        id: this.state.chatId,
                        message: this.state.message
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

    block() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "feedback",
                    subtype: "chats",
                    shop: this.props.match.params.shopId,
                    action: "blockAction",
                    id: this.props.match.params.chatId
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

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "feedback",
                    subtype: "chats",
                    shop: this.props.match.params.shopId,
                    action: "getChat",
                    id: this.props.match.params.chatId
                },
                action: "shops"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            },
			signal: 1000
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
                    <div class={"block animate__animated animate__fadeIn chats-block-list " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h3 className="font-m chat-delete-chat">{global.getLocales("Чат")} {this.state.data.chat.readed == 0 ? <span>| <a onClick={this.readed}>{global.getLocales("Отметить прочитанным")}</a></span> : ''} <span className='text-danger right pointer' onClick={this.toggle}>{global.getLocales("Удалить чат")}</span></h3>
                            <div className='shop-chat-bottom'>
                                <div className="messages-block chat" ref={el => {
                                    this.el = el
                                }}>

                                    {
                                        this.state.data.chat.messages.length > 0
                                            ?
                                            this.state.data.chat.messages.map(message =>
                                                <div className={"message-block font-m chat " + (message.typeof == "user" ? "admin" : "user")}>
                                                    <div className="bold message-name">{message.typeof == "user" ? this.state.data.chat.user.name : message.name}</div>
                                                    <div className="message-content"><p>{message.message}</p></div>
                                                    <div className="message-date text-right">{moment.unix(message.date / 1000).format("LLL")}</div>
                                                </div>
                                            )
                                            :
                                            <div className='text-center font-m'>{global.getLocales("Сообщения отсутствуют")}</div>
                                    }
                                </div>
                                <div className={""}>
                                    <div className="form-group message-area">
                                        <label for="message" className="font-m">{global.getLocales("Сообщение")}</label>
                                        <textarea name="message" value={this.state.message} onChange={this.handleChange} className="form-control" placeholder={global.getLocales("Введите сообщение")} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-3">
                                    </div>
                                    <div className="col-lg-3" />
                                    <div className="col-lg-6">
                                        <button onClick={this.send} disabled={this.state.loading} class="btn btn-primary right font-m auth-btn">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Отправить сообщение")}</>}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div class={"block animate__animated animate__fadeIn chats-block-list " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h3 className="font-m">{global.getLocales("Пользователь")}</h3>
                            <div className='row'>
                                <div className='col-lg-12'>
                                    <div className="text-center flex-center">
                                        <div className="avatar dialogue-chat">
                                            <FontAwesomeIcon icon={faUser} />
                                        </div>

                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Имя")}</label>
                                        <div className='input-group'>
                                            <input disabled value={this.state.data.chat.user.name} class="form-control" />
                                            <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/users/" + this.state.data.chat.user.id}><span className='input-group-text'>{global.getLocales("Перейти в профиль")}</span></NavLink>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Юзернейм")}</label>
                                        <input disabled value={this.state.data.chat.user.username ? this.state.data.chat.user.username : global.getLocales("Отсутствует")} class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Кол-во покупок")}</label>
                                        <input disabled value={this.state.data.chat.user.purchases} class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Сумма покупок")}</label>
                                        <div class="input-group">
                                            <input disabled value={this.state.data.chat.user.purchasesSum} class="form-control" />
                                            <span class="input-group-text">{this.state.data.currency}</span>
                                        </div>
                                    </div>
                                                                        <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Заметка")}</label>
                                        <input disabled value={this.state.data.chat.user.notice} class="form-control" />
                                    </div>
                                </div>

                                <div className='col-lg-12'>
                                    {
                                        this.state.data.chat.user.block == 0
                                            ?
                                            <button onClick={this.block} className='btn btn-danger auth-btn font-m'>{global.getLocales("Заблокировать")}</button>
                                            :
                                            <button onClick={this.block} className='btn btn-secondary auth-btn font-m'>{global.getLocales("Разблокировать")}</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalConfirm action={global.getLocales("Вы действительно хотите удалить данный чат и все сообщения в нем?")} consequences="" modal={this.state.modal} toggle={this.toggle} loading={this.state.loading} sendData={this.delete} />
            </div>
        )
    }
}

export default FeedbackDialogue