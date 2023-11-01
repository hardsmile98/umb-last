import { faCashRegister, faPlusCircle, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import global from '../../Global/index'
import ModalConfirm from '../../modalConfirm'
import ShopNotifyModal from './Modal'

class Shops extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                shops: [],
                limit: 1,
                price: 100
            },
            modal: false,
            modalNot: false
        }
        this.getData = this.getData.bind(this)
        this.createNew = this.createNew.bind(this)
        this.toggle = this.toggle.bind(this)
        this.buySlot = this.buySlot.bind(this)
        this.toggleNot = this.toggleNot.bind(this)
    }

    toggleNot() {
        this.setState({
            modalNot: !this.state.modalNot
        })
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    componentDidMount() {
        this.getData()
    }

    buySlot() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "buyslot"
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
                    this.toggle()
                    this.getData()
                }
                else {
                    this.toggle()
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
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "get"
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
                        if(this.state.data.shops.length <= 0) {
                            this.toggleNot()
                        }
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

    createNew() {
        if(+this.state.data.shops.length < +this.state.data.limit) {
            this.props.history.push('/dashboard/shops/new')
        }
        else {
            this.toggle()
            toast.error(global.getLocales('Достигнут лимит магазинов'))
        }
    }
    
    render() {
        return (
            <div className="row">
                <ShopNotifyModal modal={this.state.modalNot} toggle={this.toggleNot}/>
                <div className="col-lg-12">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Ваши магазины')}</h4>
                            <br />
                            <div className='row'>
                                {
                                    this.state.data.shops.map((item, i) =>
                                        <Link to={`${this.props.match.url}/${item.uniqueId}`}>
                                            <div className="col-lg-3">
                                                <div className="avatar-block coworker-block shop-block-act">
                                                    <div className="text-center flex-center">
                                                        <div className="avatar">
                                                            <FontAwesomeIcon icon={faCashRegister} />
                                                        </div>
                                                        <br />
                                                    </div>
                                                    <div className="text-center margin-15">
                                                        <div className="bold font-m">{global.getLocales('Магазин')} #{i + 1}</div>
                                                        <small className='text-danger'>{item.uniqueId}</small>
                                                    </div>

                                                </div>
                                            </div>
                                        </Link>
                                    )
                                }
                                <div className="col-lg-3">
                                    <a onClick={this.createNew}>
                                        <div className="avatar-block coworker-block add-coworker shop-block-act">
                                            <div className="text-center flex-center">
                                                <div className="avatar">
                                                    <FontAwesomeIcon icon={faPlusCircle} />
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalConfirm action={global.getLocales("Лимит магазинов достигнут. Желаете приобрести 3 дополнительных слота для магазина за ") + " " + this.state.data.price + "$?"} consequences="" modal={this.state.modal} toggle={this.toggle} loading={this.state.loading} sendData={this.buySlot} />
            </div>
        )
    }
}

export default Shops