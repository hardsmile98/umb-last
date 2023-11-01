import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faUser, faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

let rights = {},
    categories = {},
    products = {}

class Employeer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            action: "add",
            login: "",
            type: "courier",
            percent: 0,
            notice: "",
            bonus: 0,
            fine: 0,
            rate: 0,
            addType: 0,
            rateType: 0,
            data: {
                modules: [],
                categories: [],
                products: [],
                history: []
            },
            rights: [],
            categories: [],
            products: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.getData = this.getData.bind(this)
        this.notifyUpdateP = this.notifyUpdateP.bind(this)
        this.notifyUpdate = this.notifyUpdate.bind(this)
        this.sendData = this.sendData.bind(this)
        this.getUserData = this.getUserData.bind(this)
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getUserData()
        }
        else {
            this.getData()
        }
    }

    getUserData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "settings",
                    subtype: "employees",
                    action: "get",
                    id: this.props.match.params.id,
                    shop: this.props.match.params.shopId,
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

                    data = {
                        modules: response.data.data.modules,
                        categories: response.data.data.categories,
                        products: response.data.data.products,
                        history: response.data.data.history.reverse()
                    }

                    response.data.data.rights.categories = response.data.data.rights.categories.length > 0 ? response.data.data.rights.categories.split(",").map(function (item) {
                        return +item;
                    }) : []
                    response.data.data.rights.products = response.data.data.rights.products.length > 0 ? response.data.data.rights.products.split(",").map(function (item) {
                        return +item;
                    }) : []
                    response.data.data.rights.modules = response.data.data.rights.modules.length > 0 ? response.data.data.rights.modules.split(',') : []


                    this.setState({
                        data: data
                    })

                    this.setState({
                        login: response.data.data.rights.login,
                        type: response.data.data.rights.type,
                        notice: response.data.data.rights.notice,
                        bonus: response.data.data.rights.bonus,
                        fine: response.data.data.rights.fine,
                        percent: response.data.data.rights.percent,
                        rate: response.data.data.rights.rate,
                        categories: response.data.data.rights.categories,
                        products: response.data.data.rights.products,
                        rights: response.data.data.rights.modules,
                        rateType: response.data.data.rights.rateType,
                        addType: response.data.data.rights.addType,
                        action: "edit"
                    })

                    this.setState({
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

    notifyUpdateP(e) {
        e.target.name = e.target.name.split("_")[1]

        let products = this.state.products

        if (this.state.products.indexOf(+e.target.name) > -1) {
            products.splice(products.indexOf(e.target.name), 1)
        }
        else {
            products.push(+e.target.name)
        }
        this.setState({
            products: products
        })
    }

    notifyUpdate(e) {
        switch (e.target.value) {
            case "rights":
                let rights = this.state.rights

                if (this.state.rights.indexOf(e.target.name) > -1) {
                    rights.splice(rights.indexOf(e.target.name), 1)
                }
                else {
                    rights.push(e.target.name)
                }
                this.setState({
                    rights: rights
                })
                break;
            case "products":
                let products = this.state.products

                if (this.state.products.indexOf(+e.target.name) > -1) {
                    products.splice(products.indexOf(+e.target.name), 1)
                }
                else {
                    products.push(+e.target.name)
                }
                this.setState({
                    products: products
                })
                break;
            case "categories":
                let categories = this.state.categories

                if (this.state.categories.indexOf(+e.target.name) > -1) {
                    categories.splice(categories.indexOf(+e.target.name), 1)
                }
                else {
                    categories.push(+e.target.name)
                }
                this.setState({
                    categories: categories
                })
                break;
        }
    }

    sendData() {
        this.setState({
            loading: true
        })
        if (this.state.login) {
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "settings",
                        subtype: "employees",
                        action: this.state.action,
                        login: this.state.login,
                        userType: this.state.type,
                        notice: this.state.notice,
                        bonus: this.state.bonus,
                        fine: this.state.fine,
                        percent: this.state.percent,
                        rate: this.state.rate,
                        categories: this.state.categories.join(','),
                        products: this.state.products.join(','),
                        modules: this.state.rights.join(','),
                        rateType: this.state.rateType,
                        addType: this.state.addType,
                        shop: this.props.match.params.shopId,
                        id: this.props.match.params.id,
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
                        this.props.history.goBack()
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
            toast.error("Заполните поле логина")
        }
    }


    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "settings",
                    subtype: "employees",
                    action: "getData",
                    shop: this.props.match.params.shopId,
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
            <>
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales("Добавление сотрудника")}</h3>
                            <div className="avatar-block font-m text-center" style={{ margin: "0 !important" }}>
                                <span className="text-danger" dangerouslySetInnerHTML={{__html: global.getLocales("Для добавления сотрудника, он должен зарегистрироваться в системе <a href='https://umb.market' target='_blank'>UMB.MARKET</a>")}}></span>
                            </div>
                            <br />
                            <div class="row">
                                <div className="col-lg-6">
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Логин сотрудника")}</label>
                                        <input name="login" autoComplete="off" disabled={this.state.loading || this.state.action == "edit"} value={this.state.login} placeholder={global.getLocales("Введите логин сотрудника")} onChange={this.handleChange} class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Тип сотрудника")}</label>
                                        <select name="type" disabled={this.state.loading} value={this.state.type} onChange={this.handleChange} class="form-control">
                                            <option value="courier">{global.getLocales("Курьер")}</option>
                                            <option value="individual">{global.getLocales("Индивидуальные права")}</option>
                                        </select>
                                    </div>
                                    {
                                        this.state.type == "individual"
                                            ?
                                            <>
                                                <h3 className="font-m">{global.getLocales("Доступные сотруднику разделы")}:</h3>
                                                {
                                                    this.state.data.modules.map(item =>
                                                        <div className="avatar-block">
                                                            {item.subs.map(sub =>
                                                                <div class="i-checks">
                                                                    <input id={sub.name} name={sub.name} checked={this.state.rights.indexOf(sub.name) > -1 ? true : false} value="rights" onClick={this.notifyUpdate} type="checkbox" class="checkbox-template" />
                                                                    <label for={sub.name} className="checkbox-label font-m">{global.getLocales(sub.title)}</label>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                }
                                            </>
                                            :
                                            <>
                                                <h3 className="font-m">{global.getLocales("Доступные сотруднику города и товары")}:</h3>
                                                <div className="avatar-block">
                                                    <h4 className="font-m">{global.getLocales("Города")}:</h4>
                                                    {
                                                        this.state.data.categories.map(category =>
                                                            <div class="i-checks">
                                                                <input id={category.id} name={category.id} checked={this.state.categories.indexOf(category.id) > -1 ? true : false} onClick={this.notifyUpdate} value="categories" type="checkbox" class="checkbox-template" />
                                                                <label for={category.id} className="checkbox-label font-m">{category.name}</label>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <div className="avatar-block">
                                                    <h4 className="font-m">{global.getLocales("Товары")}:</h4>
                                                    {
                                                        this.state.data.products.map(product =>
                                                            <div class="i-checks">
                                                                <input id={"product_" + product.id} name={product.id} checked={this.state.products.indexOf(product.id) > -1 ? true : false} onClick={this.notifyUpdate} value="products" type="checkbox" class="checkbox-template" />
                                                                <label for={"product_" + product.id} className="checkbox-label font-m">{product.name}</label>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </>

                                    }
                                </div>
                                <div className="col-lg-6">
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Примечание")}</label>
                                        <input name="notice" disabled={this.state.loading} value={this.state.notice} placeholder={global.getLocales("Введите примечание о сотруднике")} onChange={this.handleChange} class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Куда добавляются адреса после добавления")}</label>
                                        <select name="addType" disabled={this.state.loading} value={this.state.addType} onChange={this.handleChange} class="form-control">
                                            <option value="0">{global.getLocales("На продажу")}</option>
                                            <option value="1">{global.getLocales("В раздел модерируемых адресов")}</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Плата за добавленные адреса")}</label>
                                        <select name="rate" disabled={this.state.loading} value={this.state.rate} onChange={this.handleChange} class="form-control">
                                            <option value="0">{global.getLocales("Отсутствует")}</option>
                                            <option value="1">{global.getLocales("По тарифам товара")}</option>
                                            <option value="2">{global.getLocales("Индивидуальные тарифы")}</option>
                                        </select>
                                    </div>
                                    {
                                        (this.state.rate == 1 || this.state.rate == 2)
                                            ?
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales("Начисление платы за адреса")}</label>
                                                <select name="rateType" disabled={this.state.loading} value={this.state.rateType} onChange={this.handleChange} class="form-control">
                                                    <option value="0">{global.getLocales("После продажи адреса")}</option>
                                                    <option value="1">{global.getLocales("После добавления адреса")}</option>
                                                </select>
                                            </div>
                                            :
                                            ''
                                    }
                                    {
                                        this.state.rate == 2
                                            ?
                                            <>
                                                <div class="form-group">
                                                    <label class="form-control-label font-m">{global.getLocales("Плата за добавленный адрес")}</label>
                                                    <input name="bonus" disabled={this.state.loading} value={this.state.bonus} placeholder="Введите сумму" onChange={this.handleChange} class="form-control" />
                                                </div>
                                                <div class="form-group">
                                                    <label class="form-control-label font-m">{global.getLocales("Штраф за ненаход")}</label>
                                                    <input name="fine" disabled={this.state.loading} value={this.state.fine} placeholder={global.getLocales("Введите сумму")} onChange={this.handleChange} class="form-control" />
                                                </div>
                                            </>
                                            :
                                            ""
                                    }
                                </div>
                            </div>
                            <div className="row margin-15">
                                <div className="col-lg-2">
                                    <button onClick={this.props.history.goBack} disabled={this.state.loading} class="btn btn-secondary auth-btn font-m left">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Назад")}</>}</button>
                                </div>
                                <div className="col-lg-6" />
                                <div className="col-lg-4">
                                    <button onClick={this.sendData} disabled={this.state.loading} class="btn btn-primary font-m auth-btn right">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : (this.state.action == "edit" ? <>{global.getLocales("Сохранить")}</> : <>{global.getLocales("Добавить")}</>)}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                this.props.match.params.id
                ?
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales("История действий")}</h3>
                            {
                                this.state.data.history.length > 0
                                ?
                                <>
                                {
                                    this.state.data.history.map(item =>
                                                                 <div className="notice avatar-block font-m text-center">
                                {item.value}
                                <div class="text-right">
                                {moment.unix(item.date/1000).format("LLL")}
                                </div>
                                </div>   
                                    )
                                }
                                </>
                                :
                                <div className="text-center font-m">{global.getLocales("Действия не найдены")}</div>
                            }
                            </div>
                            </div>
                            </div>
                            </div>
                            :
                            ''
            }

            </>
        )
    }
}

export default Employeer