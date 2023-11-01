import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import global from '../../../Global/index'
import CreateShopModal from './Modal'

class ShopNew extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                subdomain: "",
                currencies: []
            },
            currency: "",
            subdomain: "",
            modal: false
        }
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        if(this.state.currency !== "" && this.state.subdomain !== "") {
            this.setState({
                modal: !this.state.modal
            })
        }
        else {
            toast.error(global.getLocales('Заполнены не все поля'))
        }
    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    componentDidMount() {
        this.getData()
    }

    sendData() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "new",
                    type: "create",
                    currency: this.state.currency,
                    subdomain: this.state.subdomain
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
                   this.props.history.push('/dashboard/shops/' + response.data.data.id)
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
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "new",
                    type: "get"
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
            <div className="row">
                <div className="col-lg-4">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Создание магазина')}</h4>
                            <br />
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Субдомен')}</label>
                                <div class="input-group">
                                    <input type="text" value={this.state.subdomain} onChange={this.handleChange} autoComplete="off" class="form-control" placeholder={global.getLocales('Введите субдомен')} name="subdomain" />
                                    <span class="input-group-text font-m">.{this.state.data.subdomain}</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Валюта')}</label>
                                <select value={this.state.currency} onChange={this.handleChange} name="currency" class="form-control">
                                    <option disabled value="">{global.getLocales('Не выбрано')}</option>
                                    {
                                        this.state.data.currencies.map(item =>
                                            <option value={item.name}>{global.getLocales(item.title)}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <div className="text-right">
                                <Link to="/dashboard/shops">
                                    <button disabled={this.state.loading} class="btn btn-secondary font-m left">{this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales('Назад')}</>}</button>
                                </Link>
                                <button onClick={this.toggle} disabled={this.state.loading} class="btn btn-primary font-m">{this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales('Создать магазин')}</>}</button>
                            </div>
                        </div>
                    </div>
                    <CreateShopModal sendData={this.sendData} loading={this.state.loading} modal={this.state.modal} toggle={this.toggle}/>
                </div>
            </div>
        )
    }
}

export default ShopNew