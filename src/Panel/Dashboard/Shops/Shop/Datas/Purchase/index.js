import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../../Table'
import SetAsNoffoundModal from './Modal'

class PurchaseItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                purchase: {
                    exchange: {}
                },
                currency: "EE"
            },
            modal: false
        }
        this.getData = this.getData.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    componentDidMount() {
        this.getData()
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
                    action: "getPurchase",
                    id: this.props.match.params.purchaseId
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
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales('Покупка')} #{this.props.match.params.purchaseId} {(this.state.data.purchase.notfound == 0 && this.state.data.purchase.courier !== null )? <span className='right pointer' onClick={this.toggle}>{global.getLocales("Отметить как ненаход")}</span> : '' }</h3>
                        </div>
                        <div className='col-lg-4'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Локация')}</label>
                                <input name="location" value={this.state.data.purchase.category + (this.state.data.purchase.subcategory ? (" / " + this.state.data.purchase.subcategory) : '')} class="form-control" disabled />
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Товар')}</label>
                                <input name="product" value={this.state.data.purchase.product + (this.state.data.purchase.subproduct ? (" / " + this.state.data.purchase.subproduct) : '')} class="form-control" disabled />
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Покупатель')}</label>
                                <div class="input-group mb-3">
                                    <input name="nameUser" value={this.state.data.purchase.nameUser} class="form-control" disabled />
                                    {
                                        this.state.data.purchase.user !== 0
                                            ?
                                            <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/users/" + this.state.data.purchase.user}><button class="btn btn-secondary font-m" type="button" id="button-addon2">{global.getLocales('Перейти в профиль')}</button></NavLink>
                                            :
                                            ''
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-12'>
                            {
                                this.state.data.purchase.seller !== null
                                    ?
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Адрес')}</label>
                                        <textarea value={this.state.data.purchase.seller} className='form-control' disabled>{this.state.data.purchase.seller}</textarea>

                                    </div>
                                    :
                                    <div className='avatar-block notice-chat font-m text-center'>
                                        
                                        <p>{global.getLocales('Адрес не был выдан, по причине того, что в наличии не было товара по данному направлению, после пополнения магазина адресами, заказам, с невыданным адресом по данному направлению будет автоматически распределяться добавленный товар, в порядке очереди.')}</p>
                                    </div>
                            }
                        </div>
                        <div className='col-lg-4'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Сумма')}</label>
                                <div class="input-group">
                                    <input disabled value={this.state.data.purchase.sum} class="form-control" />
                                    <span class="input-group-text">{this.state.data.currency}</span>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Способ оплаты')}</label>
                                <input name="method" value={this.state.data.purchase.type} class="form-control" disabled />
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Заказ создан')}</label>
                                <input name="method" value={moment.unix(this.state.data.purchase.created / 1000).format("LLL")} class="form-control" disabled />
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Кошелек для оплаты')}</label>
                                <input name="method" value={this.state.data.purchase.exchange.wallet} class="form-control" disabled />
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Сумма для оплаты')}</label>
                                <input disabled value={this.state.data.purchase.exchange.sum} class="form-control" />
                            </div>
                        </div>
                        <div className='col-lg-8'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Начислено на баланс')}</label>
                                <div class="input-group">
                                    <input disabled value={this.state.data.purchase.exchange.toUser} class="form-control" />
                                    <span class="input-group-text">BTC</span>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales('Дата завершения покупки')}</label>
                                <div class="input-group">
                                    <input disabled value={moment.unix(this.state.data.purchase.closed / 1000).format("LLL")} class="form-control" />
                                </div>
                            </div>
                        </div>
                        {
                            this.state.data.purchase.courier == null
                                ?
                                <></>
                                :
                                <>
                                    <div className='col-lg-6'>
                                        <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales('Создатель адреса')}</label>
                                            <input disabled value={this.state.data.purchase.courier} class="form-control" />
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                    <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales('Заказ отмечен как ненаход')}</label>
                                            <input disabled value={this.state.data.purchase.notfound == 0 ? global.getLocales('Нет') : global.getLocales('Да')} class="form-control" />
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                    <button className='btn btn-secondary font-m' onClick={() => { this.props.history.goBack() }}><>{global.getLocales('Назад')}</></button>
                </div>
                <SetAsNoffoundModal getData={this.getData} shop={this.props.match.params.shopId} purchase={this.props.match.params.purchaseId} currency={this.state.data.currency} ownerAdd={this.state.data.purchase.ownerAdd} toggle={this.toggle} modal={this.state.modal}/>
            </div>
        )
    }
}

export default PurchaseItem