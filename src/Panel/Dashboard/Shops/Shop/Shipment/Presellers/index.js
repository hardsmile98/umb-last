import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faSearchPlus, faBackspace } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../../Table'
import ModalConfirm from '../../../../../modalConfirm'

let sellers = [""]

class Presellers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            method: "one",
            category: "0",
            product: "0",
            subcategory: "0",
            subproduct: "0",
            subcategories: [],
            subproducts: [],
            data: {
                categories: [],
                products: [],
                presellers: [],
				typeOfKlads: []
            },
            sellers: [""],
            seller: "",
			typeofklad: 0,
            items: [],
            confirmModal: false,
            deleteSeller: 0,
            editModal: false,
            editSeller: {},
            categorySort: "all",
            productSort: "all",
            sorted: []
        }
        this.getData = this.getData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addSeller = this.addSeller.bind(this)
        this.deleteSeller = this.deleteSeller.bind(this)
        this.createSeller = this.createSeller.bind(this)
        this.confirmToggle = this.confirmToggle.bind(this)
        this.sellerDelete = this.sellerDelete.bind(this)
        this.editToggle = this.editToggle.bind(this)
        this.sort = this.sort.bind(this)
        this.changeStatus = this.changeStatus.bind(this)
    }

    changeStatus(id) {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "shipment",
                    subtype: "presellers",
                    shop: this.props.match.params.shopId,
                    action: "updateStatus",
                    id: id
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

    editToggle(id) {
        this.state.data.sellers.map(item => {
            if (item.id == id) {
                this.setState({
                    editSeller: item
                })
            }
        })
        this.setState({
            editModal: !this.state.editModal
        })
    }

    confirmToggle(id) {
        this.setState({
            confirmModal: !this.state.confirmModal,
            deleteSeller: id
        })
    }

    updateItems(items) {
        this.setState({
            items: items
        })
    }

    prepareTableData() {
        let items = []

        let data = {}

        this.state.sorted.map((item) => {
            this.state.data.categories.map(category => {
                if (item.category == category.id) {
                    data.category = category.name
                    if (category.sub == 1) {
                        category.subcategories.map(subcategory => {
                            if (subcategory.id == item.subcategory) {
                                data.category += " / " + subcategory.name
                            }
                        })
                    }
                }
            })
            this.state.data.products.map(product => {
                if (item.product == product.id) {
                    data.product = product.name
                    if (product.sub == 1) {
                        product.subproducts.map(subproduct => {
                            if (subproduct.id == item.subproduct) {
                                data.product += " / " + subproduct.name
                            }
                        })
                    }
                }
            })
            let itemModified = {
                id: item.id,
                category: data.category,
                product: data.product,
                status: item.status
            }
			
			this.state.data.typeOfKlads.map(type => {
				if(type.id == item.typeofklad) {
					itemModified.typeofklad = type.name
				}
			})
            items.push(itemModified)
        })


        this.setState({
            items: items
        })
    }

    addSeller() {
        sellers.push("")

        this.setState({
            sellers: sellers
        }, () => {
            window.scrollTo(0,document.body.scrollHeight);
        })
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
                    subtype: "presellers",
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
                        sorted: response.data.data.presellers,
                        loading: false
                    }, () => {
                        this.sort({target: {
                            name: "categorySort",
                            value: this.state.categorySort
                        }})
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
            sellers[e.target.id] = value

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

    createSeller() {
        this.setState({
            loading: true
        })

        if (this.state.category !== "0" && this.state.product !== "0") {
			
			console.log(this.state)

            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "shipment",
                        subtype: "presellers",
                        category: this.state.category,
                        subcategory: this.state.subcategory,
                        product: this.state.product,
                        subproduct: this.state.subproduct,
						typeofklad: this.state.typeofklad,
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
                            category: "0",
                            subcategory: "0",
                            product: "0",
                            subproduct: "0",
                            seller: "",
                            sellers: [""],
							typeofklad: 0,
                            subcategories: [],
                            subproducts: [],
                            loading: false
                        })
                        sellers = [""]
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

    sort(e) {
        let sorted = []
        if(e.target.name == "categorySort") {
            this.state.data.presellers.map(item => {
                if((item.category == e.target.value || e.target.value == "all") && (this.state.productSort == "all" || this.state.productSort == item.product)) {
                    sorted.push(item)
                }
            })
            this.setState({
                sorted: sorted,
                categorySort: e.target.value
            }, () => {
                this.prepareTableData()
            })
        }
        else {
            this.state.data.presellers.map(item => {
                if((item.product == e.target.value || e.target.value == "all") && (this.state.categorySort == "all" || this.state.categorySort == item.category)) {
                    sorted.push(item)
                }
            })
            this.setState({
                sorted: sorted,
                productSort: e.target.value
            }, () => {
                this.prepareTableData()
            })
        }
    }

    sellerDelete() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "shipment",
                    subtype: "presellers",
                    shop: this.props.match.params.shopId,
                    id: this.state.deleteSeller,
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
                    toast.success(response.data.message)
                    this.confirmToggle()
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
        const tableColumns = [
            {
                title: 'ID', dataIndex: 'id', key: 'id', sort: true
            },
            {
                title: global.getLocales('Город / Район'), dataIndex: 'category', key: 'category', sort: true
            },
            {
                title: global.getLocales('Товар / Фасовка'), dataIndex: 'product', key: 'product', sort: true
            },
			{
                title: global.getLocales('Тип клада'), dataIndex: 'typeofklad', key: 'typeofklad', sort: true
            },
            {
                title: global.getLocales('Статус'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <button
                            onClick={() => {this.changeStatus(item.id)}}
                            className={"btn  font-m auth-btn " + (item.status == 1 ? " btn-primary" : (item.status == 2 ? " btn-danger" : " btn-secondary"))}> {item.status == 1 ? global.getLocales('Доступно') : global.getLocales('Отключено')}
                        </button>
                    </div>
            },
            {
                title: global.getLocales('Действия'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <button disabled={item.status == 2} onClick={() => { this.confirmToggle(item.id) }} className="btn btn-danger btn-table"><FontAwesomeIcon icon={faBackspace} /></button>
                    </div>
            }
        ]
        return (
            <div className="row">
                <div className="col-lg-4">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Добавление возможности предзаказа')}</h4>
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
                                        this.state.data.typeOfKlads.map(item =>
                                            <option value={item.id}>{item.name}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <button onClick={this.createSeller} disabled={this.state.loading} class="btn btn-primary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales('Добавить возможность предзаказа')}</>}</button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Доступные для предзаказа направления')}</h4>
                            <div className="avatar-block">
                                <h4 className="font-m">
                                    {global.getLocales('Сортировка')}
                                </h4>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales('Город')}</label>
                                            <select disabled={this.state.loading} value={this.state.categorySort} onChange={this.sort} name="categorySort" class="form-control">
                                                <option value="all">{global.getLocales('Все')}</option>
                                                {
                                                    this.state.data.categories.map(item =>
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales('Товар')}</label>
                                            <select disabled={this.state.loading} value={this.state.productSort} onChange={this.sort} name="productSort" class="form-control">
                                                <option value="all">{global.getLocales('Все')}</option>
                                                {
                                                    this.state.data.products.map(item =>
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="margin-15">
                                {
                                    this.state.items.length <= 0
                                        ?
                                        <div className="text-center font-m">{global.getLocales('Направления для предзаказа отсутствуют')}</div>
                                        :
                                        <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <ModalConfirm action={global.getLocales('Вы действительно хотите удалить данное направление предзаказа товара?')} consequences="" modal={this.state.confirmModal} toggle={this.confirmToggle} loading={this.state.loading} sendData={this.sellerDelete} />
            </div>
        )
    }
}

export default Presellers