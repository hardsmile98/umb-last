import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../../Table'
import ModalConfirm from '../../../../../modalConfirm'

let interval

class ActivePurchases extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                purchases: [],
                categories: [],
                subcategories: [],
                products: [],
                subproducts: [],
                currency: ""
            },
            items: [],
            deleteModal: false,
            deleteId: 0
        }
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
        this.sendMessage = this.sendMessage.bind(this)

    }

    componentDidMount() {
        this.getData()
        interval = setInterval(this.getData, 5000)
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    prepareTableData() {
        let items = []

        let data = {}

        this.state.data.purchases.reverse().map((item) => {
            this.state.data.categories.map(category => {
                if (item.category == category.id) {
                    data.category = category.name
                    if (category.sub == 1) {
                        this.state.data.subcategories.map(subcategory => {
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
                        this.state.data.subproducts.map(subproduct => {
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
                user: item.user,
                userName: item.login,
                sum: item.sum + " " + this.state.data.currency,
                type: item.type,
                date: moment.unix(item.created/1000).format("LLL")
            }
            items.push(itemModified)
        })


        this.setState({
            items: items
        })
    }

    updateItems(items) {
        this.setState({
            items: items
        })
    }

    sendMessage(id) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "datas",
                    subtype: "presellers",
                    shop: this.props.match.params.shopId,
                    action: "sendMessage",
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
                    this.props.history.push('/dashboard/shops/' + this.props.match.params.shopId + "/feedback/chats/" + response.data.data.id)
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
                    section: "shop",
                    type: "datas",
                    subtype: "activePurchases",
                    shop: this.props.match.params.shopId
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
                title: global.getLocales('Город / Район'), dataIndex: 'category', key: 'category', sort: true
            },
            {
                title: global.getLocales('Товар / Фасовка'), dataIndex: 'product', key: 'product', sort: true
            },
            {
                title: global.getLocales('Сумма'), dataIndex: 'sum', key: 'sum', sort: true
            },
            {
                title: global.getLocales('Способ оплаты'), dataIndex: 'type', key: 'type', sort: true
            },
            {
                title: global.getLocales('Пользователь'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                <>
                {
                    item.user == 0
                    ?
                    'Anonym'
                    :
                    <div className="sparkline8">
                    <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/users/" + item.user}>
                        {item.userName}
                    </NavLink>
                </div>
                }
                </>
            },
            {
                title: '', dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <span className='text-warning'>{global.getLocales('Ожидает оплаты')}</span>

                    </div>
            }
        ]
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales('Активные заказы')}</h3>
                            {
                                this.state.data.purchases <= 0
                                    ?
                                    <div className='text-center font-m'>
                                        
                                        {global.getLocales('Активные заказы отсутствуют')}
                                    </div>
                                    :
                                    <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                            }
                        </div>
                    </div>
                </div>

            </div>
            
        )
    }
}

export default ActivePurchases