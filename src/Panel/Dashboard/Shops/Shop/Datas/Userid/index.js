import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../../Table'

class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                user: {
                    purchasesList: []
                },
                currency: "EE"
            },
            items: [],
            persDisc: 0,
            notFounded: 0
        }
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.discountZero = this.discountZero.bind(this)
                this.handleChange = this.handleChange.bind(this)
                                this.setPers = this.setPers.bind(this)
                                                                this.setNotice = this.setNotice.bind(this)
                                                                this.setBalanceZero = this.setBalanceZero.bind(this)
																this.blockAction = this.blockAction.bind(this)
    }
    
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    updateItems(items) {
        this.setState({
            items: items
        })
    }

    prepareTableData() {
        let items = []

        this.state.data.user.purchasesList.map((item) => {
            let itemModified = {
                id: item.id,
                category: item.category,
                subcategory: item.subcategory ? item.subcategory : "-",
                product: item.product,
                subproduct: item.subproduct ? item.subproduct : "-",
                sum: item.sum + " " + this.state.data.currency,
                date: moment.unix(item.closed / 1000).format("LLL"),
                status: item.status,
                type: item.type
            }
            items.push(itemModified)
        })


        this.setState({
            items: items
        })
    }

    componentDidMount() {
        this.getData()
    }
    
        setBalanceZero() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "datas",
                    subtype: "users",
                    shop: this.props.match.params.shopId,
                    action: "setBalanceZero",
                    id: this.props.match.params.userId
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

    discountZero() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "datas",
                    subtype: "users",
                    shop: this.props.match.params.shopId,
                    action: "discountZero",
                    id: this.props.match.params.userId
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
    
        setNotice() {
                this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "datas",
                    subtype: "users",
                    shop: this.props.match.params.shopId,
                    action: "setNotice",
                    id: this.props.match.params.userId,
                    notice: this.state.notice
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

    
    setPers() {
                this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "datas",
                    subtype: "users",
                    shop: this.props.match.params.shopId,
                    action: "setPers",
                    id: this.props.match.params.userId,
                    discount: this.state.persDisc
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
	
	    blockAction() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "datas",
                    subtype: "users",
                    shop: this.props.match.params.shopId,
                    action: "blockAction",
                    id: this.props.match.params.userId
                },
                action: "shops"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                                toast.success(response.data.message)
								this.getData()

            }
            else {
                toast.error("Сервер недоступен")
            }
        })
    }

    sendMessage() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "datas",
                    subtype: "users",
                    shop: this.props.match.params.shopId,
                    action: "sendMessage",
                    id: this.props.match.params.userId
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
                    subtype: "users",
                    shop: this.props.match.params.shopId,
                    action: "getUser",
                    id: this.props.match.params.userId
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
                    let notFounded = 0
                                            response.data.data.user.purchasesList.map(item => {
                            if(item.notfound == 1) {
                                notFounded++
                            }
                        })
                    this.setState({
                        data: response.data.data,
                        loading: false,
                        notFounded: notFounded,
                        persDisc: response.data.data.user.persDisc,
                        notice: response.data.data.user.notice
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
                title: global.getLocales('Способ оплаты'), dataIndex: 'type', key: 'type', sort: true
            },
            {
                title: global.getLocales('Дата'), dataIndex: 'date', key: 'date', sort: true
            },
            {
                title: global.getLocales('Действие'), dataIndex: 'name', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/purchases/" + item.id}><button className='btn btn-secondary font-m'>{global.getLocales('Подробнее')}</button></NavLink>
            }
        ]
        return (
            <>
                <div class={"block animate__animated animate__fadeIn no-margin " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3 className="font-m">{global.getLocales('Покупатель')} #{this.props.match.params.userId} <span onClick={this.discountZero} className='right pointer'>{global.getLocales('Обнулить скидки пользователя')}</span></h3>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Имя')}</label>
                                    <input name="location" value={this.state.data.user.name} class="form-control" disabled />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Юзернейм')}</label>
                                    <input name="product" value={this.state.data.user.username ? this.state.data.user.username : "Отсутствует"} class="form-control" disabled />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">Telegram ID</label>
                                    <input name="product" value={this.state.data.user.chatid ? this.state.data.user.chatid : "Отсутствует"} class="form-control" disabled />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Баланс')}</label>
                                    <div class="input-group">
                                        <input disabled value={this.state.data.user.balance} class="form-control" />
                                        <span class="input-group-text">{this.state.data.currency}</span>
                                                                                    <a onClick={this.setBalanceZero}><span className='input-group-text'>{global.getLocales('Обнулить')}</span></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                                                <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Персональная скидка')}</label>
                                          
                                        <div className='input-group'>
                                            <input name="persDisc" onChange={this.handleChange} value={this.state.persDisc} class="form-control" />
                                             <span class="input-group-text">%</span>
                                            <a onClick={this.setPers}><span className='input-group-text'>{global.getLocales('Сохранить')}</span></a>
                                        </div>
                                    </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Сумма покупок')}</label>
                                    <div class="input-group">
                                        <input disabled value={this.state.data.user.purchasesSum} class="form-control" />
                                        <span class="input-group-text">{this.state.data.currency}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Кол-во покупок')}</label>
                                    <input disabled value={this.state.data.user.purchases} class="form-control" />
                                </div>
                            </div>
                            
                                                        <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Ненаходов')}</label>
                                    <input disabled value={this.state.notFounded} class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Скидка пользователя в %')}</label>
                                    <div class="input-group">
                                        <input disabled value={this.state.data.user.percent} class="form-control" />
                                        <span class="input-group-text">%</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4'>
                            <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Скидка пользователя в')} {this.state.data.currency}</label>
                                    <div class="input-group">
                                        <input disabled value={this.state.data.user.sum} class="form-control" />
                                        <span class="input-group-text">{this.state.data.currency}</span>
                                    </div>
                                </div>
                            </div>
                                                        <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Пригласительный код')}</label>
                                    <input disabled value={this.state.data.user.refid} class="form-control" />
                                </div>
                            </div>
                                                           <div className='col-lg-4'>
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Привлечено покупателей')}</label>
                                    <input disabled value={this.state.data.user.referalls ? this.state.data.user.referalls : 0} class="form-control" />
                                </div>
                            </div>
                            <div className='col-lg-4'>
                            <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Зарегистрирован')}</label>
                                    <input disabled value={moment.unix(this.state.data.user.regdate/1000).format("LLL")} class="form-control" />

                                </div>
                            </div>
                                                        <div className="col-lg-8">
                                                                <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Персональная заметка')}</label>
                                          
                                        <div className='input-group'>
                                            <input name="notice" onChange={this.handleChange} value={this.state.notice} class="form-control" />
                                            <a onClick={this.setNotice}><span className='input-group-text'>{global.getLocales('Сохранить')}</span></a>
                                        </div>
                                    </div>
                            </div>

                            <div className='col-lg-12'>
                            <button onClick={() => {this.props.history.goBack()}} className='btn btn-secondary font-m left'>{global.getLocales('Назад')}</button>
	<button onClick={this.blockAction} className={'btn font-m right block-for-block-button ' + (this.state.data.user.block == 0 ? 'btn-danger' : 'btn-success')}>{global.getLocales(this.state.data.user.block == 0 ? 'Заблокировать' : 'Разблокировать')}</button>
                       
 <button onClick={this.sendMessage} className='btn btn-primary font-m right'>{global.getLocales('Отправить сообщение')}</button>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="xtabs template xtabs_bottom animate__animated animate__fadeIn"
                >
                    <div class="xtabs__body">
                        <a className={"xtabs__item font-m active"}>
                            <span>{global.getLocales('История покупок')}</span>
                        </a>
                    </div>
                </div>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3 className="font-m">{global.getLocales('Покупки')}</h3>
                                {
                                    this.state.data.user.purchasesList.length > 0
                                        ?
                                        <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                        :
                                        <div className='font-m text-center'>
                                            {global.getLocales('Покупки отсутствуют')}
                                            
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default UserProfile