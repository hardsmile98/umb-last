import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

class DispansersAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                bots: [],
                dispansers: []
            },
            availableBots: 0
        }
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    sendData(e) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "settings",
                    type: "updatePrice",
                    price: e.target.value,
                    name: e.target.name
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
                    section: "settings",
                    type: "getBotsInfo"
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
                    let availableBots = 0
                    response.data.data.bots.map(item => {
                        let need = 10 - +item.countBots
                        availableBots += need
                    })
                   this.setState({
                    data: response.data.data,
                    availableBots: availableBots,
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
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
            <div class="block-body">
                <div className="row">
                    <div className="col-lg-12">
                        <h3 className="font-m">Профили распределители ТГ</h3>
                        <div className="row">
                                                <div className="col-lg-4">
                                                <div className='avatar-block font-m text-center'>
                        <b>{this.state.data.bots.length-this.state.data.dispansers.length}/{this.state.data.bots.length}</b><br/>
                        Доступно распределителей
                        </div>
                        </div>
                        <div className="col-lg-4">
                                                <div className='avatar-block font-m text-center'>
                        <b>{this.state.availableBots}</b><br/>
                        Доступно ботов для создания
                        </div>
                        </div>
                        <div className="col-lg-4">
                        
                        </div>
                        </div>
                        <div className='avatar-block font-m'>
                            <div className='row'>
                                <div className='col-lg-4 flex-center'>
                                    <b>Телефон</b>
                                </div>
                                <div className='col-lg-4 flex-center'>
                                    <b>Кол-во созданных ботов</b>
                                </div>
                                <div className='col-lg-4 flex-center'>
                                    <b>Юзернейм</b>
                                </div>
                            </div>
                        </div>
                        {
                            this.state.data.bots.map(item => 
                                <div className='avatar-block font-m'>
                                <div className='row'>
                                    <div className='col-lg-4 flex-center'>
                                        +{item.account}
                                    </div>
                                    <div className='col-lg-4 flex-center'>
                                    {item.countBots} из 10
                                    </div>
                                         <div className='col-lg-4 flex-center'>
                                    @{item.username}
                                    </div>
                                </div>
                            </div>
                                )
                        }
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default DispansersAdmin