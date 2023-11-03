import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { NavLink, Link } from 'react-router-dom'
import ModalConfirm from '../../../../../modalConfirm'

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                products: [],
                currency: ""
            },
            currentProduct: 0,
            confirmModal: false
        }
        this.getData = this.getData.bind(this)
        this.confirmToggle = this.confirmToggle.bind(this)
        this.deleteProduct = this.deleteProduct.bind(this)
    }

    confirmToggle(id) {
        this.setState({
            confirmModal: !this.state.confirmModal,
            currenctProduct: id
        })
    }

    componentDidMount() {
        this.getData()
    }

    deleteProduct() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "shipment",
                    subtype: "products",
                    id: this.state.currenctProduct,
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

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "shipment",
                    subtype: "products",
                    name: this.state.name,
                    sub: this.state.sub,
                    subcategories: this.state.subcategories,
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
                <div className="col-lg-12">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h4 className="font-m">{global.getLocales('Товары')}</h4>
                            <div className="row">
                                <div className="col-lg-12 margin-15">
                                    <div className="row">
                                        {
                                            this.state.data.products.length > 0
                                                ?
                                                this.state.data.products.map(item =>
                                                    <div className="col-lg-3">
                                                        <div className="avatar-block">
                                                            <div className="text-center">
                                                                <h4 className="font-m">{item.name}</h4>
                                                                <div className="text-left font-m">
                                                                    {global.getLocales('Фасовка')}: <span className="highlight">{item.sub == 1 ? <>{global.getLocales('Да')}</> : <>{global.getLocales('Нет')}</>}</span><br />
                                                                    {global.getLocales('Скидка')}: <span className="highlight">{item.discount}%</span><br />
                                                                    {global.getLocales('Адресов в наличии')}: <span className="highlight">{item.sellers} {global.getLocales('шт.')}</span><br />
                                                                    {global.getLocales('Продаж')}: <span className="highlight">{item.sales} {global.getLocales('шт.')}</span><br />
                                                                    {global.getLocales('Сумма продаж')}: <span className="highlight">{item.salessum.toFixed(2)} {this.state.data.currency}</span><br />
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="row">
                                                                        <div className="col-lg-8">
                                                                            <Link to={`${this.props.match.url}/${item.id}`}>
                                                                                <button disabled={this.state.loading} class="btn btn-secondary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Открыть")}</>}</button>
                                                                            </Link>
                                                                        </div>
                                                                        <div className="col-lg-4">
                                                                            <button onClick={() => { this.confirmToggle(item.id) }} disabled={this.state.loading} class="btn btn-danger font-m auth-btn margin-15"><FontAwesomeIcon icon={faTrashAlt} /></button>
                                                                        </div>
                                                                    </div>                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                <div className="text-center">
                                                    {global.getLocales('Товары отсутствуют')}
                                                </div>
                                        }
                                        <div className='col-lg-12'>
                                            <NavLink to={`${this.props.match.url}/add`}>
                                                <button disabled={this.state.loading} class="btn btn-primary margin-15 font-m auth-btn right">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Добавить товар")}</>}</button>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalConfirm action={global.getLocales('Вы действительно хотите удалить данный товар?')} consequences={global.getLocales("Все адреса данного товара будут перенесены в раздел удаленных адресов.")} modal={this.state.confirmModal} toggle={this.confirmToggle} loading={this.state.loading} sendData={this.deleteProduct} />
            </div>
        )
    }
}

export default Products