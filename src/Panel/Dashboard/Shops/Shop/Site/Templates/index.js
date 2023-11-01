import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'
import ModalConfirm from '../../../../../modalConfirm'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

class Templates extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                templates: [],
                template: "default",
                templatesBuyed: []
            },
            templatenow: "classic",
            modal: false
        }
        this.getData = this.getData.bind(this)
        this.setT = this.setT.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    toggle(name) {
        this.setState({
            modal: !this.state.modal,
            templatenow: name
        })
    }

    setT(name, needconfrim) {
        if(needconfrim) {
            let needbuy = true
            this.state.data.templates.map(item => {
                if(item.name == name) {
                    if(item.price == 0) {
                        needbuy = false
                    }
                    else {
                        this.state.data.templatesBuyed.map(buyed => {
                            if(buyed.name == name) {
                                needbuy = false
                            }
                        })
                    }
                }
            })
            if(needbuy) {
                this.toggle(name)
            }
            else {
                this.setState({
                    loading: true
                })
                let data = {
                    api: "user",
                    body: {
                        data: {
                            section: "shop",
                            type: "site",
                            subtype: "templates",
                            shop: this.props.match.params.shopId,
                            action: "set",
                            name: name
                        },
                        action: "shops"
                    },
                    headers: {
                        'authorization': localStorage.getItem('token')
                    }
                }
        
                global.createRequest(data, response => {
                    if(this.state.modal) {
                        this.setState({
                            modal: false
                        })
                    }
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
        }
        else {
            this.setState({
                loading: true
            })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "site",
                        subtype: "templates",
                        shop: this.props.match.params.shopId,
                        action: "set",
                        name: name
                    },
                    action: "shops"
                },
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }
    
            global.createRequest(data, response => {
                if(this.state.modal) {
                    this.setState({
                        modal: false
                    })
                }
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
                    type: "site",
                    subtype: "templates",
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

    render() {
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">

                    <h3 className="font-m">{global.getLocales('Шаблоны')}</h3>
                    <div className="row">
                        {this.state.data.templates.map(item =>
                            <div className="col-lg-4">
                                <div className="text-center template-block">
                                    <h3 className="font-m text-center">{global.getLocales(item.label)}</h3>
                                    <a href={'http://' + item.name + '.umbrella.day'} target="_blank"><img src={item.img} width="100%" /></a>
                                    <div className="row margin-15">
                                        <div className="col-lg-8">
                                            <button onClick={() => { this.setT(item.name, true) }} className="btn btn-primary auth-btn font-m" disabled={this.state.data.template === item.name}>{this.state.data.template == item.name ? global.getLocales('Установлен') : global.getLocales('Установить')}</button>

                                        </div>
                                        <div className="col-lg-4">
                                            <b> <button className="btn btn-secondary auth-btn font-m">{item.price == 0 ? "FREE" : (item.price + "$")} {item.premium ? <FontAwesomeIcon icon={faStar} /> : ''}</button></b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <ModalConfirm action={global.getLocales("Вы действительно хотите приобрести данный шаблон?")} consequences="Средства спишутся единоразово и не поделжат возврату" modal={this.state.modal} toggle={this.toggle} loading={this.state.loading} sendData={() => {this.setT(this.state.templatenow, false)}} />
            </div>
        )
    }
}

export default Templates