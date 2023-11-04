import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import Table from '../../../../../Table'
import { NavLink } from 'react-router-dom'

class Reviews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: {
                reviewsAc: [],
                reviewsDe: [],
                users: []
            },
            items1: [],
            items2: []
        }
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
        this.getUserLogin = this.getUserLogin.bind(this)
    }

    componentDidMount() {
        this.getData()
    }
    
    getUserLogin(id) {
        this.state.data.users.map(user => {
            if(user.id == id) {
                return user.name
            }
        })
    }

    prepareTableData() {
        let items1 = [],
            items2 = [],
            name;

        this.state.data.reviewsAc.map((item) => {
            this.state.data.users.map(user => {
                if(user.id == item.user) {
                    name = user.name
                }
            })
           let itemModified = {
                loc: item.category + " / " + item.product, 
                message: JSON.parse(item.review).text,
                status: JSON.parse(item.review).status,
                user: item.user,
                userName: name,
                id: item.id
            }
            items1.push(itemModified)
        })

        this.state.data.reviewsDe.map((item) => {
                        this.state.data.users.map(user => {
                if(user.id == item.user) {
                    name = user.name
                }
            })
            let itemModified = {
                loc: item.category + " / " + item.product, 
                message: JSON.parse(item.review).text,
                status: JSON.parse(item.review).status,
                user: item.user,
                                userName: name,
                id: item.id
            }
            items2.push(itemModified)
        })


        this.setState({
            items1: items1,
            items2: items2
        })
    }

    updateItems(items) {
        console.log("OK :)")
    }

    sendData(id) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "datas",
                    subtype: "reviews",
                    shop: this.props.match.params.shopId,
                    action: "set",
                    id: id
                },
                action: "shops"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        request(data, response => {
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
                    subtype: "reviews",
                    shop: this.props.match.params.shopId,
                    action: "get"
                },
                action: "shops"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        request(data, response => {
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
                title: getLocales('Город / Товар'), dataIndex: 'loc', key: 'loc', sort: true
            },
            {
                title: getLocales('Отзыв'), dataIndex: 'message', key: 'message', sort: true
            },
            {
                title: getLocales('Пользователь'), dataIndex: 'user', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => 
                <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/datas/users/" + item.user}>{item.userName}</NavLink>
            },
            {
                title: getLocales('Действие'), dataIndex: 'name', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => <button onClick={() => {this.sendData(item.id)}} className={'btn font-m ' + (item.status == 0 ? "btn-secondary" : "btn-danger")}>{item.status == 0 ? getLocales("Одобрить") : getLocales("Скрыть")}</button>
            }
        ]
        return (
            <>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <h3 className="font-m">{getLocales('Отображаемые отзывы')}</h3>
                        {
                            this.state.data.reviewsAc.length > 0
                            ?
                            <Table columns={tableColumns} items={this.state.items1} updateItems={this.updateItems} rowsPerPage="10" />
                            :
                            <div className='text-center font-m'>{getLocales('Отзывы отсутствуют')}</div>
                        }
                    </div>
                </div>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <h3 className="font-m">{getLocales('Отзывы для модерации')}</h3>
                        {
                            this.state.data.reviewsDe.length > 0
                            ?
                            <Table columns={tableColumns} items={this.state.items2} updateItems={this.updateItems} rowsPerPage="10" />
                            :
                            <div className='text-center font-m'>{getLocales('Отзывы отсутствуют')}</div>
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default Reviews