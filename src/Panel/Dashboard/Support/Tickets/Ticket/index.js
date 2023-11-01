import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import moment from 'moment'

import renderHTML from 'react-render-html'



import global from '../../../../Global/index'

let interval;


class Ticket extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                ticket: {
                    direction: "support",
                    category: "generalIssues",
                    messages: [],
                    status: 0
                },
                directions: {
                    support: {
                        name: "Поддержка пользователей"
                    }
                },
                categories: {
                    generalIssues: {
                        title: "Вопросы по функционалу"
                    }
                },
                user: {
                    type: "user"
                }
            },
            message: "",
            loading: true
        }
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.changeDirection = this.changeDirection.bind(this)
        this.closeTicket = this.closeTicket.bind(this)
    }


    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    componentDidMount() {
        this.getData(result => { this.scrollToBottom() })
        interval = setInterval(() => { this.getData(result => { }) }, 1000)
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    sendData() {
        if (this.state.message) {
            this.setState({
                loading: true
            })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "tickets",
                        type: "reply",
                        id: this.props.match.params.id,
                        message: this.state.message
                    },
                    action: "support"
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
                            message: ""
                        })
                        this.getData(result => {
                            this.scrollToBottom()
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
        else {
            toast.error("Вы не ввели сообщение")
        }
    }

    getData(callback) {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "tickets",
                    type: "ticket",
                    id: this.props.match.params.id
                },
                action: "support"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    if (JSON.stringify(this.state.data.ticket.messages) !== JSON.stringify(response.data.data.ticket.messages)) {
                        this.setState({
                            data: response.data.data,
                            loading: false
                        }, () => {
                            this.scrollToBottom()
                            callback(true)
                        })
                    }
                    else {
                        this.setState({
                            data: response.data.data,
                            loading: false
                        }, () => {
                            callback(true)
                        })
                    }
                }
                else {
                    this.setState({
                        loading: false
                    }, () => {
                        callback(true)
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

    changeDirection(e) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "tickets",
                    type: "changeDirection",
                    id: this.props.match.params.id,
                    direction: e.target.value
                },
                action: "support"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.setState({
                        loading: false
                    })
                    this.getData(result => {
                        this.scrollToBottom()
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

    closeTicket() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "tickets",
                    type: "close",
                    id: this.props.match.params.id
                },
                action: "support"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.setState({
                        loading: false
                    })
                    this.props.history.push("/dashboard/support/tickets")
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
            <div className="row">
                <div className="col-lg-8">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{this.state.data.ticket.theme}</h4>
                            <div className="messages-block" ref={el => {
                                this.el = el
                            }}>
                                {
                                    this.state.data.ticket.messages.map(message =>
                                        <div className="message-block font-m">
                                            <div className="bold message-name">{message.user}</div>
                                            <div className="message-content"><p>{renderHTML(message.value)}</p></div>
                                            <div className="message-date text-right">{moment.unix(message.date / 1000).format("LLL")}</div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={this.state.data.ticket.status > -1 ? "" : "blur"}>
                                <div className="form-group message-area">
                                    <label for="message" className="font-m">Сообщение</label>
                                    <textarea name="message" value={this.state.message} onChange={this.handleChange} className="form-control" placeholder="Введите сообщение" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-3">
                                    <NavLink to={`/dashboard/support/tickets`}>
                                        <button className="btn btn-secondary font-m auth-btn">
                                            Назад
                                    </button>
                                    </NavLink>
                                </div>
                                <div className="col-lg-3" />
                                <div className="col-lg-6">
                                    <button onClick={this.sendData} disabled={this.state.loading || this.state.data.ticket.status < 0} class="btn btn-primary right font-m auth-btn">{this.state.loading ? "Загрузка..." : "Отправить сообщение"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    {
                        this.state.data.user.type !== "user"
                            ?
                            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                <div class="block-body">
                                <h4 className="font-m">Настройки обращения</h4>
                                <br/>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">Категория</label>
                                        <input disabled value={this.state.data.categories[this.state.data.ticket.category].title} class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">Направление</label>
                                        <select disabled={this.state.loading || this.state.data.ticket.status == -1} onChange={this.changeDirection} value={this.state.data.ticket.direction} class="form-control">
                                            {
                                                Object.entries(this.state.data.directions).map(direction =>
                                                    <option value={direction[0]}>{direction[1].name}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    <button disabled={this.state.data.ticket.status == -1} onClick={this.closeTicket} className="btn btn-danger fullwidth font-m auth-btn">
                                        Закрыть обращение
                                    </button>
                                </div>
                            </div>
                            :
                            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                                <div class="block-body">
                                    <div class="form-group">
                                        <label class="form-control-label font-m">Категория</label>
                                        <input disabled value={this.state.data.categories[this.state.data.ticket.category].title} class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">Направление</label>
                                        <input disabled value={this.state.data.directions[this.state.data.ticket.direction].name} class="form-control" />
                                    </div>
                                    <button disabled={this.state.data.ticket.status == -1} onClick={this.closeTicket} className="btn btn-danger fullwidth font-m auth-btn">
                                        Закрыть обращение
                                    </button>
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default Ticket