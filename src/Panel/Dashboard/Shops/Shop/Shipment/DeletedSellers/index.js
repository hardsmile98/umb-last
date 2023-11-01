import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { NavLink, Link } from 'react-router-dom'
import Table from '../../../../../Table'
import ModalConfirm from '../../../../../modalConfirm'
import ProductsAdd from '../Products/Add'
import DeletedModal from './Modal'

let selected = []

class DeletedSellers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                categories: [],
                products: [],
                sellers: [],
                typeOfKlads: []
            },
            items: [],
            selected: [],
            confirmModal: false,
            modal: false
        }
        this.getData = this.getData.bind(this)
        this.sellerAction = this.sellerAction.bind(this)
        this.confirmToggle = this.confirmToggle.bind(this)
        this.deleteSellers = this.deleteSellers.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    confirmToggle() {
        this.setState({
            confirmModal: !this.state.confirmModal
        })
    }

    sellerAction(id) {
        id = id.target.value

        if(selected.indexOf(parseInt(id)) < 0) {
            selected.push(parseInt(id))
        }
        else {
            selected.splice(selected.indexOf(parseInt(id)) , 1)
        }
        this.setState({
            selected: selected
        })
    }

    updateItems(items) {
        this.setState({
            items: items
        })
    }

    componentDidMount() {
        this.getData()
    }

    prepareTableData() {
        let items = []

        let data = {}

        this.state.data.sellers.map((item) => {
            let itemModified = {
                id: item.id,
                value: item.value
            }
            items.push(itemModified)
        })


        this.setState({
            items: items
        })
    }

    deleteSellers() {
        if(this.state.selected.length > 0) {
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "shipment",
                        subtype: "sellers",
                        shop: this.props.match.params.shopId,
                        selected: this.state.selected,
                        action: "deletedDel"
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
                        this.getData()
                        selected = []
                        this.setState({
                            selected: []
                        })
                        this.confirmToggle()
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
            toast.error("Адреса не выбраны")
        }
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
                    action: "getDeleted"
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
                        loading: false,
                        selected: []
                    })
                    selected = []
                    this.prepareTableData()
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
                title: global.getLocales('Выбрать'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                                                                        <div class="i-checks">
                        <input checked={this.state.selected.indexOf(item.id) > -1} onChange={this.sellerAction} value={item.id} type="checkbox" class="checkbox-template" />
                        </div>
                    </div>
            },
            {
                title: global.getLocales('Адрес'), itemClassName: 'width-100', dataIndex: 'value', key: 'value', sort: true
            }
        ]
        return (
            <div className="row">
                <div className="col-lg-8">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Удаленные адреса')}</h4>
                            <div className="row">
                                <div className="col-lg-12 margin-15">
                                    <div className="row">
                                    {
                                    this.state.items.length <= 0
                                        ?
                                        <div className="text-center font-m">{global.getLocales('Адреса отсутствуют')}</div>
                                        :
                                        <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                        <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Выбрано адресов')}</label>
                                <input disabled={this.state.loading} value={this.state.selected.length + " " + global.getLocales('шт.')} autocomplete="off" type="text" name="selected" class="form-control" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6">
                            <button onClick={this.confirmToggle} disabled={this.state.loading || this.state.selected.length <= 0} class="btn btn-danger font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales("Удалить")}</>}</button>
                            </div>
                            <div className="col-lg-6">
                            <button onClick={this.toggle} disabled={this.state.loading || this.state.selected.length <= 0} class="btn btn-primary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales("Восстановить")}</>}</button>
                                </div>
                        </div>
                    </div>
                </div>
                <DeletedModal typeOfKlads={this.state.data.typeOfKlads} categories={this.state.data.categories} products={this.state.data.products} modal={this.state.modal} toggle={this.toggle} getData={this.getData} {...this.props} selected={this.state.selected}/>
                <ModalConfirm action={global.getLocales('Вы действительно хотите удалить данные товары?" consequences="Это действие безвозвратно, будьте осторожны.')} modal={this.state.confirmModal} toggle={this.confirmToggle} loading={this.state.loading} sendData={this.deleteSellers} />
            </div>
        )
    }
}

export default DeletedSellers