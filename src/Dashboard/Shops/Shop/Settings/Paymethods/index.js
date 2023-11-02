import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'

class PayMethods extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: {
                allMethods: [],
                shopMethods: {}
            }
        }
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "settings",
                    subtype: "paymethods",
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

    sendData(e) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "settings",
                    subtype: "paymethods",
                    shop: this.props.match.params.shopId,
                    action: "update",
                    name: e.target.name,
                    value: e.target.value
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

    render() {
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales("Способы оплаты")}</h3>
                            <div className='avatar-block notice-chat'>
                                <p>
                                    <FontAwesomeIcon icon={faInfoCircle}/> {global.getLocales("Все нижеперечисленные способы оплаты работают в автоматическом режиме без Вашего вмешательства, все средства переводятся по курсу BitCoin на момент сделки, и зачисляются к Вам на баланс.")}
                                </p>
                            </div>
                            <div className='avatar-block pay-method'>
                                <div className='row'>
                                    <div className='col-lg-1 pay-stolb'>

                                    </div>

                                    <div className='col-lg-2 pay-stolb'>
                                        <h1 className='font-m'>{global.getLocales("Название")}</h1>
                                    </div>
                                    <div className='col-lg-1 pay-stolb'>
                                    </div>
                                    <div className='col-lg-3 pay-stolb'>
                                    </div>
                                </div>
                            </div>
                            {
                                this.state.data.allMethods.map(item =>
                                    <div className='avatar-block pay-method'>
                                        <div className='row'>
                                            <div className='col-lg-1 pay-stolb'>
                                                <img src={item.img} />
                                            </div>
                                            <div className='col-lg-2 pay-stolb'>
                                                <h1 className='font-m'>{item.name}</h1>
                                            </div>
                                            <div className='col-lg-1 pay-stolb'>
                                            </div>
                                            <div className='col-lg-3 pay-stolb'>
                                            </div>
                                            <div className='col-lg-1 pay-stolb'>
                                            </div>
                                            <div className='col-lg-4 pay-stolb'>
                                                    <select onChange={this.sendData} value={this.state.data.shopMethods[item.snopm] ? this.state.data.shopMethods[item.snopm] : 0} name={item.snopm} class="form-control">
                                                        {
                                                            item.settingsValues.split(",").map((value, key) =>
                                                                <option value={value}>{global.getLocales(item.settings.split(",")[key])}</option>
                                                            )
                                                        }
                                                    </select>
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

export default PayMethods