import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import moment from 'moment'

import global from './../../../Global/index'
import Table from '../../../Table'

const tableColumns = [
    {
        title: 'ID', dataIndex: 'id', key: 'id', sort: true
    },
    {
        title: global.getLocales('Тема'), dataIndex: 'theme', key: 'operations', render: (e, item) =>
            <Link to={"/dashboard/support/ticket/" + item.id}>{item.theme}</Link>
    },
    {
        title: global.getLocales('Последний ответ'), dataIndex: 'last', key: 'last', sort: true
    },
    {
        title: global.getLocales('Создано'), dataIndex: 'created', key: 'created', sort: true
    },
    {
        title: global.getLocales('Cтатус'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
            <div className="sparkline8">
                <NavLink to={"/dashboard/support/ticket/" + item.id}>
                    <button
                        className={"btn font-m auth-btn btn-sessions " + (item.status == 1 ? " btn-secondary" : (item.status == -1 ? " btn-danger" : " btn-primary"))}> {item.status == 1 ? global.getLocales("Отвечен") : (item.status == -1 ? global.getLocales("Закрыт") : global.getLocales("Ожидает ответа"))}
                    </button>
                </NavLink>
            </div>
    }
]

class Tickets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                tickets: []
            },
            loading: true,
            items: []
        }
        this.getData = this.getData.bind(this)
    }

    prepareTableData() {
        let items = [];

        this.state.data.tickets.map((item) => {
            let itemModified = {
                id: item.id,
                theme: item.theme,
                last: moment.unix(item.last / 1000).format("LLL"),
                created: moment.unix(item.created / 1000).format("LLL"),
                status: item.status
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
                    section: "tickets",
                    type: "get"
                },
                action: "support"
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
        return (
            <>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3 className="font-m">{global.getLocales("Обращения")}</h3>
                                {
                                    this.state.items.length > 0
                                        ?
                                        <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                        :
                                        <div className="text-center">
                                            <span className="font-m">{global.getLocales("Обращения отсутствуют")}</span>
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

export default Tickets