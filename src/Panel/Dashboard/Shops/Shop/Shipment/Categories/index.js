import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faMinus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import CategoryEdit from './Edit'
import ModalConfirm from '../../../../../modalConfirm'

let subcategories = [{
    name: ""
}]

class Categories extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            name: "",
            sub: 0,
            subcategories: [
                {
                    name: ""
                }
            ],
            data: [],
            modal: false,
            category: {},
            confirmModal: false,
            categoryDelete: 0,
            currency: "s"
        }
        this.handleChange = this.handleChange.bind(this)
        this.addSubcategory = this.addSubcategory.bind(this)
        this.createCategory = this.createCategory.bind(this)
        this.getData = this.getData.bind(this)
        this.deleteSubcategory = this.deleteSubcategory.bind(this)
        this.toggle = this.toggle.bind(this)
        this.confirmToggle = this.confirmToggle.bind(this)
        this.categoryDelete = this.categoryDelete.bind(this)
    }

    confirmToggle(id) {
        this.setState({
            confirmModal: !this.state.confirmModal,
            categoryDelete: id
        })
    }

    toggle(id) {
        this.state.data.map(item => {
            if (item.id == id) {
                this.setState({
                    category: item
                })
            }
        })
        this.setState({
            modal: !this.state.modal
        })
    }

    componentDidMount() {
        this.getData()
    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        if (name == "subcategory") {
            subcategories[e.target.id].name = value
            this.setState({
                subcategories: subcategories
            })
        }
        else {
            this.setState({
                [name]: value
            })
        }
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "shipment",
                    subtype: "categories",
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
                        data: response.data.data.categories,
                        currency: response.data.data.currency,
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

    createCategory() {
        if (this.state.name !== "") {
            this.setState({
                loading: true
            })

            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "shipment",
                        subtype: "categories",
                        name: this.state.name,
                        sub: this.state.sub,
                        subcategories: this.state.subcategories,
                        shop: this.props.match.params.shopId,
                        action: "create"
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
                            name: "",
                            sub: 0,
                            subcategories: this.state.subcategories,
                            loading: false
                        })
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
            toast.error("Заполните название категории")
        }
    }

    categoryDelete() {
        this.setState({
            loading: true
        })

        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "shipment",
                    subtype: "categories",
                    id: this.state.categoryDelete,
                    shop: this.props.match.params.shopId,
                    action: "delete"
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
                        categoryDelete: 0
                    })
                    this.getData()
                    this.confirmToggle()
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

    deleteSubcategory(id) {
        subcategories.splice(id, 1)
        this.setState({
            subcategories: subcategories
        })
    }

    addSubcategory() {
        subcategories.push({
            name: ""
        })
        this.setState({
            subcategories: subcategories
        }, () => {
            window.scrollTo(0,document.body.scrollHeight);

        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-4">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Создание города')}</h4>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Название')}</label>
                                <input disabled={this.state.loading} value={this.state.name} onChange={this.handleChange} autocomplete="off" type="text" placeholder={global.getLocales("Введите название города")} name="name" class="form-control" />
                            </div>

                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Районы')}</label>
                                <select disabled={this.state.loading} value={this.state.sub} onChange={this.handleChange} name="sub" class="form-control">
                                    <option value="0">{global.getLocales('Отсутствуют')}</option>
                                    <option value="1">{global.getLocales('Присутствуют')}</option>
                                </select>
                            </div>
                            {
                                this.state.sub == 1
                                    ?
                                    <>
                                        <label class="form-control-label font-m">{global.getLocales('Список районов')}</label>
                                        <div className="avatar-block">
                                            {
                                                this.state.subcategories.map((item, key) =>
                                                    <div className="avatar-block">
                                                        <div class="form-group">
                                                            <label class="form-control-label font-m">{global.getLocales('Название')}</label>
                                                            <input disabled={this.state.loading} value={this.state.subcategories[key].name} autocomplete="off" onChange={this.handleChange} autocomplete="off" type="text" placeholder={global.getLocales('Введите название района')} name="subcategory" id={key} class="form-control" />
                                                        </div>
                                                        <button onClick={() => { this.deleteSubcategory(key) }} disabled={this.state.loading} class="btn btn-danger font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales('Удалить')}</>}</button>
                                                    </div>
                                                )
                                            }
                                            <button onClick={this.addSubcategory} disabled={this.state.loading} class="btn btn-secondary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales('Добавить')}</>}</button>
                                        </div>
                                    </>
                                    :
                                    ''
                            }
                            <button onClick={this.createCategory} disabled={this.state.loading} class="btn btn-primary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales("Добавить город")}</>}</button>

                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Города')}</h4>
                            {
                                this.state.data.length > 0
                                    ?
                                    <div className="row">
                                        {
                                            this.state.data.map(item =>
                                                <div className="col-lg-4">
                                                    <div className="avatar-block">
                                                        <h4 className="text-center font-m">
                                                            {item.name}
                                                        </h4>
                                                        <br />
                                                        <p className="font-m">
                                                        {global.getLocales('Районов')}: <span className="highlight">{item.subcategories.length} {global.getLocales('шт.')}</span><br />
                                                        {global.getLocales('Адресов в наличии')}: <span className="highlight">{item.sellers} {global.getLocales('шт.')}</span><br />
                                                        {global.getLocales('Продаж')}: <span className="highlight">{item.sales} {global.getLocales('шт.')}</span><br />
                                                        {global.getLocales('Сумма продаж')}: <span className="highlight">{item.salessum.toFixed(2)} {this.state.currency}</span><br />
                                                        </p>

                                                        <div className="text-center">
                                                            <div className="row">
                                                                <div className="col-lg-8">
                                                                    <button onClick={() => { this.toggle(item.id) }} disabled={this.state.loading} class="btn btn-secondary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales("Открыть")}</>}</button>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <button onClick={() => { this.confirmToggle(item.id) }} disabled={this.state.loading} class="btn btn-danger font-m auth-btn margin-15"><FontAwesomeIcon icon={faTrashAlt} /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    :
                                    <div className="text-center">
                                        {global.getLocales('Городаненайдены')}
                                        </div>
                            }
                        </div>
                    </div>

                    <CategoryEdit {...this.props} getData={this.getData} modal={this.state.modal} toggle={this.toggle} category={this.state.category} />
                    <ModalConfirm action={global.getLocales('Вы действительно хотите удалить данный город?')} consequences={global.getLocales('Все адреса, из данной категории будут перенесены в раздел удаленных адресов.')} modal={this.state.confirmModal} toggle={this.confirmToggle} loading={this.state.loading} sendData={this.categoryDelete} />
                </div>
            </div>
        )
    }
}

export default Categories