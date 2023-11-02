import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../../Table'

class Purchases extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                purchases: [],
                currency: "EE",
                users: []
            },
            items: [],
            sorted: [],
            categorySort: "all",
            productSort: "all",
            typeSort: "all",
            dateFrom: "",
            dateTo: "",
            categories: [],
            products: [],
            types: []
        }
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
        this.sort = this.sort.bind(this)
    }

    getCAndP() {
        let categories = [],
            products = [],
            types = []

        if (this.state.data.purchases.length > 0) {
            this.state.data.purchases.map(item => {
                if (categories.indexOf(item.category) == -1) {
                    categories.push(item.category)
                }
                if (products.indexOf(item.product) == -1) {
                    products.push(item.product)
                }
                if (types.indexOf(item.type) == -1) {
                    types.push(item.type)
                }
            })

            this.setState({
                categories: categories,
                products: products,
                types: types
            })
        }
    }

    sort(e) {
        let sorted = []
        if (e.target.name == "categorySort") {
            this.state.data.purchases.map(item => {
                if ((+item.closed <= +this.state.dateTo || this.state.dateTo == "") && (+item.closed >= +new Date(this.state.dateFrom) || this.state.dateFrom == "") && (item.category == e.target.value || e.target.value == "all") && (this.state.productSort == "all" || this.state.productSort == item.product) && (this.state.typeSort == "all" || this.state.typeSort == item.type)) {
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
        else if (e.target.name == "dateFrom") {
            this.state.data.purchases.map(item => {
                if ((+item.closed >= +new Date(e.target.value) || e.target.value == "") && (+item.closed <= +new Date(this.state.dateTo) || this.state.dateTo == "") && (item.category == this.state.categorySort || this.state.categorySort == "all") && (this.state.productSort == "all" || this.state.productSort == item.product) && (this.state.typeSort == "all" || this.state.typeSort == item.type)) {
                    sorted.push(item)
                }
            })
            this.setState({
                sorted: sorted,
                dateFrom: e.target.value
            }, () => {
                this.prepareTableData()
            })
        }
        else if (e.target.name == "dateTo") {
            this.state.data.purchases.map(item => {
                if ((+item.closed <= +new Date(e.target.value) || e.target.value == "") && (+item.closed >= +new Date(this.state.dateFrom) || this.state.dateFrom == "") && (item.category == this.state.categorySort || this.state.categorySort == "all") && (this.state.productSort == "all" || this.state.productSort == item.product) && (this.state.typeSort == "all" || this.state.typeSort == item.type)) {
                    sorted.push(item)
                }
            })
            this.setState({
                sorted: sorted,
                dateTo: e.target.value
            }, () => {
                this.prepareTableData()
            })
        }
        else if (e.target.name == "typeSort") {
            this.state.data.purchases.map(item => {
                if ((+item.closed <= +this.state.dateTo || this.state.dateTo == "") && (+item.closed >= +new Date(this.state.dateFrom) || this.state.dateFrom == "") && (item.category == this.state.categorySort || this.state.categorySort == "all") && (this.state.productSort == "all" || this.state.productSort == item.product) && (e.target.value == "all" || e.target.value == item.type)) {
                    sorted.push(item)
                }
            })
            this.setState({
                sorted: sorted,
                typeSort: e.target.value
            }, () => {
                this.prepareTableData()
            })
        }
        else {
            this.state.data.purchases.map(item => {
                if ((+item.closed <= +this.state.dateTo || this.state.dateTo == "") && (+item.closed >= +new Date(this.state.dateFrom) || this.state.dateFrom == "") && (item.product == e.target.value || e.target.value == "all") && (this.state.categorySort == "all" || this.state.categorySort == item.category) && (this.state.typeSort == "all" || this.state.typeSort == item.type)) {
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

    componentDidMount() {
        this.getData()
    }

    prepareTableData() {
        let items = []

        this.state.sorted.map((item) => {
                let itemModified;
                if (item.user == 0) {
                    itemModified = {
                        id: item.id,
                        category: item.category,
                        subcategory: item.subcategory ? item.subcategory : "-",
                        product: item.product,
                        subproduct: item.subproduct ? item.subproduct : "-",
                        sum: item.sum + " " + this.state.data.currency,
                        date: moment.unix(item.closed / 1000).format("LLL"),
                        status: item.status,
                        login: "Anonym",
                        user: 0,
                        type: item.type,
                        notfound: item.notfound
                    }
                }
                else {
                    this.state.data.users.map(user => {
                        if (item.user == user.id) {
                            itemModified = {
                                id: item.id,
                                category: item.category,
                                subcategory: item.subcategory ? item.subcategory : "-",
                                product: item.product,
                                subproduct: item.subproduct ? item.subproduct : "-",
                                sum: item.sum + " " + this.state.data.currency,
                                date: moment.unix(item.closed / 1000).format("LLL"),
                                status: item.status,
                                login: user.name,
                                user: item.user,
                                type: item.type,
                                notfound: item.notfound
                            }
                        }
                    })
                    if(!itemModified) {
                        itemModified = {
                            id: item.id,
                            category: item.category,
                            subcategory: item.subcategory ? item.subcategory : "-",
                            product: item.product,
                            subproduct: item.subproduct ? item.subproduct : "-",
                            sum: item.sum + " " + this.state.data.currency,
                            date: moment.unix(item.closed / 1000).format("LLL"),
                            status: item.status,
                            login: "Anonym",
                            user: 0,
                            type: item.type,
                            notfound: item.notfound
                        }
                    }
                }
                items.push(itemModified)
        })

        this.setState({
            items: items
        }, () => {
            this.getCAndP()
        })
    }

    updateItems(items) {
        this.setState({
            items: items
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
                    section: "shop",
                    type: "datas",
                    subtype: "purchases",
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
                        sorted: response.data.data.purchases,
                        loading: false
                    }, () => {
                        this.prepareTableData()
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
        const tableColumns = [
            {
                title: 'ID', dataIndex: 'id', key: 'id', sort: true
            },
            {
                title: global.getLocales('Город'), dataIndex: 'category', key: 'category', sort: true
            },
            {
                title: global.getLocales('Район'), dataIndex: 'subcategory', key: 'subcategory', sort: true
            },
            {
                title: global.getLocales('Товар'), dataIndex: 'product', key: 'product', sort: true
            },
            {
                title: global.getLocales('Фасовка'), dataIndex: 'subproduct', key: 'subproduct', sort: true
            },
            {
                title: global.getLocales('Сумма'), dataIndex: 'sum', key: 'sum', sort: true
            },
            {
                title: global.getLocales('Покупатель'), dataIndex: 'user', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => <>{item.user == 0 ? "Anonym" : <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/users/" + item.user}>{item.login}</NavLink>}</>
            },
            {
                title: global.getLocales('Способ оплаты'), dataIndex: 'type', key: 'type', sort: true
            },
            {
                title: global.getLocales('Дата'), dataIndex: 'date', key: 'date', sort: true
            },
            {
                title: global.getLocales('Теги'), dataIndex: 'tags', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => <>{item.notfound == 1 ? <span title={global.getLocales('Ненаход')} className='text-danger'><FontAwesomeIcon icon={faExclamationTriangle}/></span> : ''}</>
            },
            {
                title: global.getLocales('Действие'), dataIndex: 'name', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/purchases/" + item.id}><button className='btn btn-secondary font-m'>{global.getLocales('Подробнее')}</button></NavLink>
            }
        ]
        return (
            
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales('Покупки')}</h3>
                            {
                                this.state.data.purchases <= 0
                                    ?
                                    <div className='text-center font-m'>

                                        {global.getLocales('Покупки отсутствуют')}
                                    </div>
                                    :
                                    <>
                                        <div className="avatar-block">
                                            <h4 className="font-m">

                                                {global.getLocales('Сортировка')}
                                            </h4>
                                            <div className="row">
                                                <div className="col-lg-4">
                                                    <div class="form-group">
                                                        <label class="form-control-label font-m">{global.getLocales('Город')}</label>
                                                        <select disabled={this.state.loading} value={this.state.categorySort} onChange={this.sort} name="categorySort" class="form-control">
                                                            <option value="all">{global.getLocales('Все')}</option>
                                                            {
                                                                this.state.categories.map(item =>
                                                                    <option value={item}>{item}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4">
                                                    <div class="form-group">
                                                        <label class="form-control-label font-m">{global.getLocales('Товар')}</label>
                                                        <select disabled={this.state.loading} value={this.state.productSort} onChange={this.sort} name="productSort" class="form-control">
                                                            <option value="all">{global.getLocales('Все')}</option>
                                                            {
                                                                this.state.products.map(item =>
                                                                    <option value={item}>{item}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4">
                                                    <div class="form-group">
                                                        <label class="form-control-label font-m">{global.getLocales('Способ оплаты')}</label>
                                                        <select disabled={this.state.loading} value={this.state.typeSort} onChange={this.sort} name="typeSort" class="form-control">
                                                            <option value="all">{global.getLocales('Все')}</option>
                                                            {
                                                                this.state.types.map(item =>
                                                                    <option value={item}>{item}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='col-lg-6'>
                                                    <div class="form-group">
                                                        <label class="form-control-label font-m">{global.getLocales('Дата от')}</label>
                                                        <input type="date" disabled={this.state.loading} value={this.state.dateFrom} onChange={this.sort} name="dateFrom" class="form-control" />

                                                    </div>
                                                </div>
                                                <div className='col-lg-6'>
                                                    <div class="form-group">
                                                        <label class="form-control-label font-m">{global.getLocales('Дата до')}</label>
                                                        <input type="date" disabled={this.state.loading} value={this.state.dateTo} onChange={this.sort} name="dateTo" class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            this.state.items.length > 0
                                                ?
                                                <Table columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                                :
                                                <div className='font-m text-center'>

                                                    {global.getLocales('Покупки отсутствуют')}
                                                </div>
                                        }

                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Purchases