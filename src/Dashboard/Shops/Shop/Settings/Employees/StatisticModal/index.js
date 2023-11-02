import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'

import global from '../../../../../../Global/index'


class StatisticModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateFrom: moment.unix(Date.now()/1000).subtract(1, "days").format("YYYY-MM-DD"),
            dateTo: moment.unix((+Date.now() + 200000000) / 1000).subtract(1, "days").format("YYYY-MM-DD"),
            products: {},
            sellers: []
        }
        this.getProd = this.getProd.bind(this)
        this.getSale = this.getSale.bind(this)
        this.getProducts = this.getProducts.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getSellers = this.getSellers.bind(this)
    }
    
    getSellers() {
        let sellers = []
        this.props.data.purchases.map(item => {
            if(item.notfound == 1) {
                sellers.push(item)
            }
        })
        this.setState({
            sellers: sellers.reverse()
        })
    }

    componentDidMount() {
        this.getProducts()
        this.getSellers()
    }

    componentWillReceiveProps(nextProps) {
        this.getProducts()
        this.getSellers()
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        this.getProducts()
    }


    getProd(status, sellers) {
        let num = 0
        sellers.map(item => {
            if (status == "check") {
                if (item.status == 2 || item.status == 3) {
                    num++
                }
            }
            else {
                if (item.status == status) {
                    num++
                }
            }
        })
        return num
    }

    getSale(type, purchases) {
        let res = []
        purchases.map(item => {
            if(+item.closed > +new Date(this.state.dateFrom) && +item.closed < +new Date(this.state.dateTo)) {
                res.push(item)
            }
        })

        purchases = res

        res = 0
        switch (type) {
            case "sales":
                res = purchases.length
                break;
            case "notfounded":
                purchases.map(item => {
                    if (item.notfound == 1) {
                        res++
                    }
                })
                break;
            case "coeff":
                if (purchases.length > 0) {
                    purchases.map(item => {
                        if (item.notfound == 1) {
                            res++
                        }
                    })
                    res = Math.round((res / purchases.length)*100)
                }
                break;
        }
        return res
    }

    getProducts() {
        let res = [],
            purchases = this.props.data.purchases;
        purchases.map(item => {
            if(+item.closed > +new Date(this.state.dateFrom) && +item.closed < +new Date(this.state.dateTo)) {
                res.push(item)
            }
        })

        purchases = res
        res = []

        purchases.map(item => {
            if (res[item.product]) {
                res[item.product].sales += 1
                if (item.notfound == 1) {
                    res[item.product].notfound += 1
                }
                if(res[item.product].subproducts[item.subproduct]) {
                    res[item.product].subproducts[item.subproduct].sales += 1
                                    if (item.notfound == 1) {
                    res[item.product].subproducts[item.subproduct].notfound += 1
                }
                }
                else {
                    res[item.product].subproducts[item.subproduct] = {
                        sales: 1
                        }
                if (item.notfound == 1) {
                    res[item.product].subproducts[item.subproduct].notfound = 1
                }
                else {
                    res[item.product].subproducts[item.subproduct].notfound = 0
                }
                }
            }
            else {
                res[item.product] = {
                    sales: 1,
                    notfound: item.notfound == 1 ? 1 : 0,
                    subproducts: {
                        [item.subproduct]: {
                            notfound: item.notfound == 1 ? 1 : 0,
                            sales: 1
                        }
                    }
                }
            }
        })
        
        this.setState({
            products: res
        })


    }

    render() {
        return (
            <div>
                <Modal size="lg" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{global.getLocales("Сотрудник")} #{this.props.id}</h4>
                    </div>
                    <ModalBody>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Адресов в продаже")}</label>
                                    <input disabled value={this.getProd(1, this.props.data.sellers) + " " + global.getLocales("шт.")} class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Адресов на проверке")}</label>
                                    <input disabled value={this.getProd("check", this.props.data.sellers) + " " + global.getLocales("шт.")} class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Удаленных адресов")}</label>
                                    <input disabled value={this.getProd(-1, this.props.data.sellers) + " " + global.getLocales("шт.")} class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("От")}</label>
                                    <input type="date" onChange={this.handleChange} value={this.state.dateFrom} name="dateFrom" class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("До")}</label>
                                    <input type="date" onChange={this.handleChange} value={this.state.dateTo} name="dateTo" class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Продано адресов")}</label>
                                    <input disabled value={this.getSale("sales", this.props.data.purchases) + " " + global.getLocales("шт.")} class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Ненаходов")}</label>
                                    <input disabled value={this.getSale("notfounded", this.props.data.purchases) + " " + global.getLocales("шт.")} class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Процент ненаходов")}</label>
                                    <input disabled value={this.getSale("coeff", this.props.data.purchases) + "%"} class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-12'>
                                <div className='avatar-block notice no-margin'>
                                    <h3 className="font-m">{global.getLocales("Статистика по товарам")}</h3>

                                    {
                                        Object.keys(this.state.products).length > 0
                                            ?
                                            <>
                                                <div className='avatar-block font-m'>
                                                    <div className='row'>
                                                        <div className='col-lg-4'>
                                                            {global.getLocales("Товар")}
                                                        </div>
                                                        <div className='col-lg-2'>
                                                            {global.getLocales("Продано")}
                                                        </div>
                                                        <div className='col-lg-2'>
                                                            {global.getLocales("Ненаходов")}
                                                        </div>
                                                        <div className='col-lg-4 text-center'>
                                                            {global.getLocales("Процент")}
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    Object.keys(this.state.products).map((key) =>
                                                        <div className='avatar-block font-m'>
                                                            <div className='row'>
                                                                <div className='col-lg-4'>
                                                                    <b>{key}</b>
                                                                </div>
                                                                <div className='col-lg-2 text-center'>
                                                                    {this.state.products[key].sales} {global.getLocales("шт.")}
                                                                </div>
                                                                <div className='col-lg-2 text-center'>
                                                                    {this.state.products[key].notfound} {global.getLocales("шт.")}
                                                                </div>
                                                                <div className='col-lg-4 text-center'>
                                                                    {Math.round((this.state.products[key].notfound / this.state.products[key].sales)*100)}%
                                                                </div>
                                                                {
                                                              
                                                                <>
                                                                {
                                                                    Object.keys(this.state.products[key].subproducts).map((key2) =>
                                                                    <>
                                                                <div className='col-lg-4'>
                                                                    {key2}
                                                                </div>
                                                                <div className='col-lg-2 text-center'>
                                                                    {this.state.products[key].subproducts[key2].sales} {global.getLocales("шт.")}
                                                                </div>
                                                                <div className='col-lg-2 text-center'>
                                                                    {this.state.products[key].subproducts[key2].notfound} {global.getLocales("шт.")}
                                                                </div>
                                                                <div className='col-lg-4 text-center'>
                                                                    {Math.round((this.state.products[key].subproducts[key2].notfound / this.state.products[key].subproducts[key2].sales)*100)}%
                                                                </div>
                                                                </>
                                                                    )
                                                                }
                                                                </>
                                                                
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </>

                                            :
                                            <div className='text-center font-m'>
                                                {global.getLocales("Не найдено")}
                                            </div>
                                    }
                                    </div>
                                    <div className='avatar-block notice'>
                                    <h4 className="modal-title font-m">{global.getLocales("Ненаходы")}</h4>
                                    {
                                        this.state.sellers.length > 0
                                        ?
                                        <>
                                    {
                                        this.state.sellers.map(item =>
                                                                                                         <div className="notice avatar-block font-m">
                                 <h4 className="modal-title font-m">{item.category} {item.subcategory == "" ? '' : (" / " + item.subcategory)} / {item.product} {item.subproduct == "" ? '' : (" / " + item.subproduct)}</h4>
                                {item.seller}
                                <div class="text-right">
                                {moment.unix(item.closed/1000).format("LLL")}
                                </div>
                                </div>   
                                    )
                                        
                                    }
                                        </>
                                        :
                                        <div className="text-center font-m">{global.getLocales('Не найдено')}</div>
                                    }

                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="mr-auto">
                                        <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales("Закрыть")}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default StatisticModal

