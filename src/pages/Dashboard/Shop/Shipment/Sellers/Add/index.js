import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'

import global from '../../../../../../Global/index'

let sellers = [{
    value: "",
    typeofklad: 0
}]


class SellersAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            method: "one",
            category: "0",
            product: "0",
            subcategory: "0",
            subproduct: "0",
            allkladtypes: 0,
            subcategories: [],
            subproducts: [],
            data: {
                categories: [],
                products: [],
                sellers: [],
                employees: [],
                yourId: 0,
                typeOfKlads: []
            },
            sellers: [{
                value: "",
                typeofklad: 0
            }],
            seller: "",
            doubles: 1,
            double: 0,
            customCreater: 0,
            spam: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.addSeller = this.addSeller.bind(this)
        this.deleteSeller = this.deleteSeller.bind(this)
        this.getData = this.getData.bind(this)
        this.createSeller = this.createSeller.bind(this)

    }

    createSeller() {
        this.setState({
            loading: true
        })

        if (this.state.category !== "0" && this.state.product !== "0" && (this.state.sellers.length > 0 || this.state.seller.length > 0)) {
            let addresses = []
            if(this.state.method == "one") {
                addresses = this.state.sellers
            }
            else {
                let sels = this.state.seller.split("\n\n")
                sels.map(sel => {
                    addresses.push({
                        value: sel,
                        typeofklad: this.state.allkladtypes
                    })
                })
            }

            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "shipment",
                        subtype: "sellers",
                        category: this.state.category,
                        subcategory: this.state.subcategory,
                        product: this.state.product,
                        subproduct: this.state.subproduct,
                        addresses: addresses,
                        shop: this.props.match.params.shopId,
                        action: "createv2",
                        adder: this.props.admin ? this.state.customCreater : this.state.data.yourId,
                        doubleCheck: this.state.doubles,
                        spam: this.state.spam
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
                            category: "0",
                            subcategory: "0",
                            product: "0",
                            subproduct: "0",
                            seller: "",
                            sellers: [{
                                value: "",
                                typeofklad: 0
                            }],
                            subcategories: [],
                            subproducts: [],
                            loading: false
                        })
                        sellers = [{
                            value: "",
                            typeofklad: 0
                        }]
                        this.getData()
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
        else {
            this.setState({
                loading: false
            })
            toast.error("Заполнены не все поля")
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "shipment",
                    subtype: "sellers",
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
                        sorted: response.data.data.sellers,
                        loading: false,
                        customCreater: response.data.data.yourId
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


    addSeller() {
        sellers.push({
            value: "",
            typeofklad: 0
        })

        this.setState({
            sellers: sellers
        }, () => {
            window.scrollTo(0, document.body.scrollHeight);
        })
    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        if (name == "category") {
            this.state.data.categories.map(item => {
                if (item.id == value) {
                    if (item.sub == 1) {
                        this.setState({
                            subcategories: item.subcategories,
                            subcategory: "0"
                        })
                    }
                    else {
                        this.setState({
                            subcategories: [],
                            subcategory: "0"
                        })
                    }
                    this.setState({
                        [name]: value
                    })
                }
            })
        }
        else if (name == "product") {
            this.state.data.products.map(item => {
                if (item.id == value) {
                    if (item.sub == 1) {
                        this.setState({
                            subproducts: item.subproducts,
                            subproduct: "0"
                        })
                    }
                    else {
                        this.setState({
                            subproducts: [],
                            subproduct: "0"
                        })
                    }
                    this.setState({
                        [name]: value
                    })
                }
            })
        }
        else if (name == "sellers") {
            sellers[e.target.id].value = value

            this.setState({
                sellers: sellers
            })
        }
        else if(name == "typeofklad") {
            sellers[e.target.id].typeofklad = +value

            this.setState({
                sellers: sellers
            })
        }
        else {
            this.setState({
                [name]: value
            })
        }
    }

    deleteSeller(id) {
        sellers.splice(id, 1)
        this.setState({
            sellers: sellers
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Добавление адресов')}</h4>
                            <br />
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Способ добавления')}</label>
                                        <select disabled={this.state.loading} value={this.state.method} onChange={this.handleChange} name="method" class="form-control">
                                            <option value="one">{global.getLocales('По одному')}</option>
                                            <option value="many">{global.getLocales('Массово')}</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Проверка на дубли')}</label>
                                        <select disabled={this.state.loading} value={this.state.doubles} onChange={this.handleChange} name="doubles" class="form-control">
                                            <option value="1">{global.getLocales('Включена')}</option>
                                            <option value="0">{global.getLocales('Выключена')}</option>
                                        </select>
                                    </div>
                         
                                    {
                                        this.props.admin
                                        ?
                                        <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Добавить от имени')}</label>
                                        <select disabled={this.state.loading} value={this.state.customCreater} onChange={this.handleChange} name="customCreater" class="form-control">
                                            {
                                                this.state.data.employees.map(item => 
                                                    <option value={item.systemId}>{item.login} {item.notice ? ("(" + item.notice + ")") : ''}</option>
                                                    )
                                            }
                                        </select>
                                    </div>
                                    :
                                    ''
                                    }
                                    {
                                        this.state.method == "one"
                                        ?
                                        ''
                                        :
                                                                                                                                                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Тип кладов')}</label>
                            <select disabled={this.state.loading} value={this.state.allkladtypes} onChange={this.handleChange} name="allkladtypes" class="form-control" >
                                {
                                    this.state.data.typeOfKlads.map(item =>
                                        <option value={item.id}>{item.name}</option>
                                    )
                                }
                            </select>
                        </div>
                                    }
                                    
                                </div>
                                <div className='col-lg-6'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Город')}</label>
                                        <select disabled={this.state.loading} value={this.state.category} onChange={this.handleChange} name="category" class="form-control">
                                            <option disabled value="0">{global.getLocales('Не выбран')}</option>
                                            {
                                                this.state.data.categories.map(item =>
                                                    <option value={item.id}>{item.name}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    {
                                        this.state.subcategories.length > 0
                                            ?
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales('Район')}</label>
                                                <select disabled={this.state.loading} value={this.state.subcategory} onChange={this.handleChange} name="subcategory" class="form-control">
                                                    <option disabled value="0">{global.getLocales('Не выбран')}</option>
                                                    {
                                                        this.state.subcategories.map(item =>
                                                            <option value={item.id}>{item.name}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                            :
                                            ''
                                    }
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Товар')}</label>
                                        <select disabled={this.state.loading} value={this.state.product} onChange={this.handleChange} name="product" class="form-control">
                                            <option disabled value="0">{global.getLocales('Не выбран')}</option>
                                            {
                                                this.state.data.products.map(item =>
                                                    <option value={item.id}>{item.name}</option>
                                                )
                                            }
                                        </select>
                                    </div>
                                    {
                                        this.state.subproducts.length > 0
                                            ?
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales('Фасовка')}</label>
                                                <select disabled={this.state.loading} value={this.state.subproduct} onChange={this.handleChange} name="subproduct" class="form-control">
                                                    <option disabled value="0">{global.getLocales('Не выбран')}</option>
                                                    {
                                                        this.state.subproducts.map(item =>
                                                            <option value={item.id}>{item.name} {item.city ? (" (" + item.city + ")") : ''}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                            :
                                            ''
                                    }
                                </div>
                                <div className='col-lg-12'>
                                    {
                                        this.state.method == "one"
                                            ?
                                            <div className='row'>
                                                {
                                                    this.state.sellers.map((item, key) =>
                                                        <div className='col-lg-12'>
                                                            <div className="avatar-block">
                                                                <span className="font-m">
                                                                    {global.getLocales('Адрес')} #{key + 1}
                                                                </span>
                                                                <div class="row margin-15">
                                                                <div class="col-lg-6">
                                                                                                                <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Тип клада')}</label>
                            <select disabled={this.state.loading} id={key} value={item.typeofklad} onChange={this.handleChange} name="typeofklad" class="form-control" >
                                {
                                    this.state.data.typeOfKlads.map(item =>
                                        <option value={item.id}>{item.name}</option>
                                    )
                                }
                            </select>
                        </div>
                                                                </div>
                                                                <div class="col-lg-12">
                                                                <div class="form-group">
                                                                    <label class="form-control-label font-m">{global.getLocales('Содержание')}</label>
                                                                    <textarea placeholder={global.getLocales('Содержание')} disabled={this.state.loading} id={key} value={item.value} onChange={this.handleChange} name="sellers" class="form-control" />
                                                                </div>
                                                                </div>
                                                                </div>
                                                                <button onClick={() => { this.deleteSeller(key) }} disabled={this.state.loading} class="btn btn-danger font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Удалить")}</>}</button>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <div className='col-lg-12'>
                                                    <button onClick={this.addSeller} disabled={this.state.loading} class="btn btn-secondary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Добавить")}</>}</button>
                                                </div>

                                            </div>

                                            :
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales('Адреса')}</label>
                                                <textarea placeholder={global.getLocales("Каждый новый адрес необходимо вводить с интервалом 2 строки")} disabled={this.state.loading} value={this.state.seller} onChange={this.handleChange} name="seller" class="form-control sellers-textarea" />
                                                <small>{global.getLocales("Каждый новый адрес необходимо вводить с интервалом 2 строки")}</small>
                                            </div>
                                    }
                                </div>
                                <div className="col-lg-12">
                                <div className="avatar-block margin-15">
                                                                <div className="row">
                                                                <div className="col-lg-6">
                                                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Рассылка о пополнении')}</label>
                                        <select disabled={this.state.loading} value={this.state.spam} onChange={this.handleChange} name="spam" class="form-control">
                                            <option value="0">{global.getLocales('Нет')}</option>
                                            <option value="1">{global.getLocales('Да')}</option>
                                        </select>
                                    </div>
                                </div>
                                {
                                    this.state.method == "many"
                                        ?
                                    
                                         
                                            <div className='col-lg-6'>
                                                <div class="form-group">
                                                    <label class="form-control-label font-m">{global.getLocales("Итого к добавлению")}</label>
                                                    <input disabled value={(this.state.seller.length > 0 ? this.state.seller.split("\n\n").length : 0) + " " + global.getLocales("шт.")} class="form-control" />
                                                </div>
                                            </div>
                                     
                                        :
                                        ''
                                }
                                </div>
                                </div>
                                </div>
                            </div>
                            <div className="row margin-15">
                                <div className="col-lg-2">
                                </div>
                                <div className="col-lg-6" />
                                <div className="col-lg-4">
                                    <button onClick={this.createSeller} disabled={this.state.loading} class="btn btn-primary font-m auth-btn right">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : (this.state.action == "edit" ? <>{global.getLocales("Сохранить")}</> : <>{global.getLocales("Добавить адреса")}</>)}</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SellersAdd
