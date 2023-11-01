import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt, faBolt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import moment from 'moment'

import renderHTML from 'react-render-html'



import global from '../../../Global/index'

let interval;


class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                messages: []
            },
            message: "",
            loading: true
        }
        this.getData = this.getData.bind(this)
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
                        section: "chat",
                        type: "send",
                        text: this.state.message
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
                    section: "chat",
                    type: "get"
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
                        data: response.data.data,
                        loading: false
                    }, () => {
                        callback(true)
                    })
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

    render() {
        return (
            <div className="row">
                <div className="col-lg-8">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Чат с командой поддержки')}</h4>
                            <div className="messages-block chat" ref={el => {
                                this.el = el
                            }}>

                                {
                                    this.state.data.messages.length > 0
                                        ?
                                        this.state.data.messages.map(message =>
                                            <div className={"message-block font-m chat " + (message.admin ? "admin" : "user")}>
                                                <div className="bold message-name">{message.user}</div>
                                                <div className="message-content"><p>{renderHTML(message.value)}</p></div>
                                                <div className="message-date text-right">{moment.unix(message.date / 1000).format("LLL")}</div>
                                                {
                                                    message.user.indexOf('стажёр') > -1
                                                    ?
                                                    <>
                                                   
                                                    <div className="avatar-block font-m">
                                                    <FontAwesomeIcon icon={faBolt}/> <b>Ни при каких условиях не передавайте данному сотруднику данные Вашей учетной записи, АПИ токены и другую компроментирующую информацию.</b>
                                                    </div>
                                                    </>
                                                    :
                                                    ''
                                                    }
                                            </div>
                                        )
                                        :
                                        <div className="message-block font-m admin chat">
                                            <div className="bold message-name">System</div>
                                            <div className="message-content"><p dangerouslySetInnerHTML={{__html: global.getLocales('Доброго времени суток. Перед обращением в поддержку рекомендуем ознакомиться с инструкциями в базе знаний.<br/><br/>Наша команда поддержки работает 24/7, но ночью время ответа может составлять дольше обычного. Чем можем Вам помочь?')}}/></div>
                                            <div className="message-date text-right">{global.getLocales("сейчас")}</div>
                                        </div>
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
                                    <button onClick={this.sendData} disabled={this.state.loading} class="btn btn-primary right font-m auth-btn">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Отправить сообщение")}</>}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales("Памятка")}</h4>
                            <div className='avatar-block notice-chat'>
                                {global.getLocales("Ни при каких условиях")} <span className="text-danger">{global.getLocales("не сообщайте")}</span> {global.getLocales("никому, в том числе нашей команде технической поддержки конфиденциальные данные Вашего аккаунта.")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat