import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../../Table'
import ModalConfirm from '../../../../../modalConfirm'

class ActivePresellers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                presellers: [],
                currency: "",
				typeOfKlads: []
            },
            items: [],
            deleteModal: false,
            deleteId: 0
        }
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
        this.toggle = this.toggle.bind(this)
        this.delete = this.delete.bind(this)
        this.sendMessage = this.sendMessage.bind(this)

    }

    delete() {
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
                    action: "delete",
                    id: this.state.deleteId
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
                    this.toggle()
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

    toggle(id) {
        if(id) {
            this.setState({
                deleteModal: !this.state.deleteModal,
                deleteId: id
            })
        }
        else {
            this.setState({
                deleteModal: !this.state.deleteModal,
                deleteId: 0
            })
        }
    }

    componentDidMount() {
        this.getData()
    }

    prepareTableData() {
        let items = []

        let data = {}

        this.state.data.presellers.map((item) => {
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
                user: item.user,
                userName: item.userName
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
                title: global.getLocales('Тип клада'), dataIndex: 'typeofklad', key: 'typeofklad', sort: true
            },
            {
                title: global.getLocales('Пользователь'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/users/" + item.user}>
                            {item.userName}
                        </NavLink>
                    </div>
            },
            {
                title: global.getLocales('Действия'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <button className='btn btn-secondary font-m btn-table' onClick={() => {this.sendMessage(item.id)}}>{global.getLocales('Написать клиенту')}</button>
                        <button className='btn btn-danger font-m btn-table' onClick={() => {this.toggle(item.id)}}>{global.getLocales('Удалить')}</button>

                    </div>
            }
        ]
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales('Активные предзаказы')}</h3>
                            {
                                this.state.data.presellers <= 0
                                    ?
                                    <div className='text-center font-m'>
                                        
                                        {global.getLocales('Предзаказы отсутствуют')}
                                    </div>
                                    :
                                    <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                            }
                        </div>
                    </div>
                </div>
                <ModalConfirm action={global.getLocales('Вы действительно хотите удалить данный предзаказ?')} modal={this.state.deleteModal} toggle={this.toggle} loading={this.state.loading} sendData={this.delete} />

            </div>
            
        )
    }
}

export default ActivePresellers