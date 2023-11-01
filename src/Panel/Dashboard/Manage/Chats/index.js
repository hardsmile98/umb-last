import { faCircle, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import { toast } from 'react-toastify'

import global from './../../../Global/index'
import AdminDialogue from './Dialogue'


let interval = ""


class AdminChats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                chats: []
            }
        }
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()
        interval = setInterval(this.getData, 1000)
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    getData() {
        let data = {
            api: "user",
            body: {
                action: "admin",
                data: {
                    section: "chats",
                    type: "get"
                }
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
    render() {
        return (
            <div className="row">
                <div className="col-lg-3">
                    <div class={"block animate__animated animate__fadeIn chats-block-list " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h3 className="font-m">Чаты</h3>
                            {
                                this.state.data.chats.length <= 0
                                    ?
                                    <div className='text-center font-m'>Чаты отсутствуют</div>
                                    :
                                    this.state.data.chats.map(chat =>
                                        <NavLink to={"/dashboard/manage/chats/" + chat.id} activeClassName="activeChat">
                                            <div className={'avatar-block chat-block ' + (chat.typeof == "user" ? "unreaded" : "")}>
                                            {chat.ownerLogin} {chat.premium ? <FontAwesomeIcon icon={faStar}/> : ''}
                                                <div className='text-left'>
                                                    <span className='font-m'><b>{chat.typeof == "user" ? <><span className='text-danger'>•</span> {chat.message.user + ":"}</> : "Поддержка:"}</b> {chat.message.value}</span>
                                                </div>
                                                <div className='text-right font-m pad-time-chat'>
                                                    <span>{moment.unix(chat.last / 1000).format("LLL")}</span>
                                                </div>
                                            </div>
                                        </NavLink>
                                    )
                            }
                        </div>
                    </div>
                </div>
                <div className='col-lg-9'>
                    <Route path={`${this.props.match.path}/:chatId`} component={AdminDialogue} />
                    <Route exact path={`${this.props.match.path}/`} render={props =>
                        <div class={"block animate__animated animate__fadeIn dialogue-not-set "}>
                            <div class="block-body">
                                <div className='avatar-block text-center'>
                                    <h1 className="font-m">Выберите чат, в который хотите написать</h1>
                                </div>
                            </div>
                        </div>
                    } />
                </div>
            </div>
        )
    }
}

export default AdminChats