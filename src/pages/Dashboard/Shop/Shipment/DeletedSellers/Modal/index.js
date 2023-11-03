import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'

import global from '../../../../../../Global/index'



class DeletedModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            category: 0,
            subcategory: 0,
            product: 0,
            subproduct: 0,
            subproducts: [],
            subcategories: [],
            typeofklad: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.sendData = this.sendData.bind(this)
    }

    sendData() {
        if (this.state.category !== 0 && this.state.product !== 0) {
            this.setState({
                loading: true
            })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "shipment",
                        subtype: "sellers",
                        shop: this.props.match.params.shopId,
                        category: this.state.category.toString(),
                        subcategory: this.state.subcategory.toString(),
                        product: this.state.product.toString(),
                        subproduct: this.state.subproduct.toString(),
                        typeofklad: +this.state.typeofklad,
                        selected: this.props.selected,
                        action: "updateDeleted"
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
                            loading: false
                        })
                        toast.success(response.data.message)
                        this.props.toggle()
                        this.props.getData()
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
        this.props.categories.map(item => {
            if (item.id == this.state.category) {
                if (item.sub == 1) {
                    this.setState({
                        subcategories: item.subcategories
                    })
                }
                else {
                    this.setState({
                        subcategories: [],
                        subcategory: 0
                    })
                }
            }
        })

        this.props.products.map(item => {
            if (item.id == this.state.product) {
                if (item.sub == 1) {
                    this.setState({
                        subproducts: item.subproducts
                    })
                }
                else {
                    this.setState({
                        subproducts: [],
                        subproduct: 0
                    })
                }
            }
        })
    }


    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        if (name == "category") {
            this.props.categories.map(item => {
                if (item.id == value) {
                    if (item.sub == 1) {
                        this.setState({
                            subcategories: item.subcategories,
                            subcategory: 0
                        })
                    }
                    else {
                        this.setState({
                            subcategories: [],
                            subcategory: 0
                        })
                    }
                    this.setState({
                        [name]: value
                    })
                }
            })
        }
        else if (name == "product") {
            this.props.products.map(item => {
                if (item.id == value) {
                    if (item.sub == 1) {
                        this.setState({
                            subproducts: item.subproducts,
                            subproduct: 0
                        })
                    }
                    else {
                        this.setState({
                            subproducts: [],
                            subproduct: 0
                        })
                    }
                    this.setState({
                        [name]: value
                    })
                }
            })
        }
        else {
            this.setState({
                [name]: value
            })
        }
    }


    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{global.getLocales('Восстановление адресов')}</h4>
                    </div>
                    <ModalBody>
                        <div class={"form-group "}>
                            <label class="form-control-label font-m">{global.getLocales('Город')}</label>
                            <select disabled={this.state.loading} value={this.state.category} onChange={this.handleChange} name="category" class="form-control">
                                <option disabled value="0">{global.getLocales('Не выбран')}</option>
                                {
                                    this.props.categories.map(item =>
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
                                    this.props.products.map(item =>
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
                                                <option value={item.id}>{item.name}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                :
                                ''
                        }
                                                <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Тип клада')}</label>
                            <select disabled={this.state.loading} value={this.state.typeofklad} onChange={this.handleChange} name="typeofklad" class="form-control">
                                {
                                    this.props.typeOfKlads.map(item =>
                                        <option value={item.id}>{item.name}</option>
                                    )
                                }
                            </select>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="mr-auto">
                                        <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales('Закрыть')}</button>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <button disabled={this.state.loading} onClick={this.sendData} class="btn btn-primary font-m auth-btn">
                                        {this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Восстановить")}</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default DeletedModal
