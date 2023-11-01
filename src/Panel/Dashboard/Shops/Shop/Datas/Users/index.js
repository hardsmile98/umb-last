import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../../Table'

class DataUsers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                users: [],
                currency: ""
            },
            items: [],
            sortPlatform: "all",
            sorted: []
        }
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
        this.sort = this.sort.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    sort(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => {
            let result = []
            this.state.data.users.map(item => {
                if(this.state.sortPlatform == "site") {
                    if(item.chatid == 0) {
                        result.push(item)
                    }
                }
                else if(this.state.sortPlatform == "telegram") {
                    if(+item.chatid > 0) {
                        result.push(item)
                    }
                }
                else {
                    result.push(item)
                }
            })
            this.setState({
                sorted: result
            }, () => {
                this.prepareTableData()
            })
        })
    }

    prepareTableData() {
        let items = [];

        this.state.sorted.map((item) => {
            let itemModified = {
                id: item.id,
                name: item.name,
                purchases: item.purchases,
                purchasesSum: item.purchasesSum,
                balance: item.balance + " " + this.state.data.currency,
                platform: item.chatid == 0 ? global.getLocales('Сайт') : "Telegram"
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
                        this.sort({target:{name: "sortPlatform",value: "all"}})
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
                title: global.getLocales('Имя'), dataIndex: 'name', key: 'operations', render: (e, item) => <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/users/" + item.id}>{item.name}</NavLink>
            },
            {
                title: global.getLocales('Платформа'), dataIndex: 'platform', key: 'platform', sort: true
            },
            {
                title: global.getLocales('Баланс'), dataIndex: 'balance', key: 'balance', sort: true
            },
            {
                title: global.getLocales('Кол-во покупок'), dataIndex: 'purchases', key: 'purchases', sort: true
            },
            {
                title: global.getLocales('Сумма покупок'), dataIndex: 'purchasesSum', sort: true, key: 'operations', render: (e, item) => <span>{item.purchasesSum} {this.state.data.currency}</span>
            },
            {
                title: global.getLocales('Действие'), dataIndex: 'name', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/users/" + item.id}><button className='btn btn-secondary font-m'>{global.getLocales('Перейти в профиль')}</button></NavLink>
            }
        ]
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales('Покупатели')}</h3>
                            {
                                this.state.data.users <= 0
                                    ?
                                    <div className='text-center font-m'>
                                        
                                        {global.getLocales('Покупатели отсутствуют')}
                                    </div>
                                    :
                                    <>
                                        <div className="avatar-block">
                                            <h4 className="font-m">
                                            {global.getLocales('Сортировка')}
                                                
                                            </h4>
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div class="form-group">
                                                        <label class="form-control-label font-m">{global.getLocales('Платформа')}</label>
                                                        <select disabled={this.state.loading} value={this.state.sortPlatform} onChange={this.sort} name="sortPlatform" class="form-control">
                                                            <option value="all">{global.getLocales('Все')}</option>
                                                            <option value="site">{global.getLocales('Сайт')}</option>
                                                            <option value="telegram">Telegram {global.getLocales('Бот')}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Table columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DataUsers