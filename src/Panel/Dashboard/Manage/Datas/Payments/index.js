import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp, faArrowCircleRight, faCopy, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../Table'

let interval = ''


class PaymentsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                payments: []
            },
            items: []
        }
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
    }

    componentDidMount() {
        this.getData()
        interval = setInterval(this.getData, 30000)
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    prepareTableData() {
        let items = [];

        this.state.data.payments.map((item) => {
            let itemModified = {
                id: item.id,
                uniqueId: item.shop,
                sum: item.sum.toString() + " BTC",
                toUser: item.toUser.toString() + " BTC",
                fee: item.fee.toString() + " BTC",
                type: item.type,
                exId: item.exId,
                realStatus: item.status,
                status: item.status == 0 ? 'Ожидает оплаты' : (item.status == 1 ? 'Ожидает подтверждений' : (item.status == 2 ? 'Успешно оплачена' : "Отменена")),
                closed:item.status == 2 ? moment.unix(item.closed/1000).format("LLL") : moment.unix(item.created/1000).format("LLL")
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
        let data = {
            api: "user",
            body: {
                data: {
                    section: "datas",
                    type: "getPayments"
                },
                action: "admin"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    response.data.data.payments = response.data.data.payments.reverse()
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
                title: 'Способ оплаты', dataIndex: 'type', key: 'type', sort: true
            },
            {
                title: 'Сумма', dataIndex: 'sum', key: 'sum', sort: true
            },
            {
                title: 'Наш заработок', dataIndex: 'fee', key: 'fee', sort: true
            },
            {
                title: 'Начислено юзеру', dataIndex: 'toUser', key: 'toUser', sort: true
            },
            {
                title: 'Магазин', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => 
                <div className="sparkline8">
                <NavLink to={'/dashboard/shops/' + item.uniqueId + '/'}>{item.uniqueId}</NavLink>
            </div>
            },
            {
                title: 'Статус', dataIndex: 'status', key: 'operations', render: (e, item) => 
                <div className="sparkline8">
                <span className={item.realStatus == -1 ? 'text-danger' : (item.realStatus == 2 ? 'text-success' : (item.realStatus == 0 ? 'text-warning' : 'text-primary'))}>
                {item.status}
                </span>
            </div>
            },
            {
                title: 'Дата', dataIndex: 'closed', key: 'closed', sort: true
            },
            {
                title: 'Обменник ID', dataIndex: 'exId', key: 'exId', sort: true
            },
        ]
        return (
            <div class={"block animate__animated animate__fadeIn margin-15 " + (this.state.loading ? "blur" : "")}>
            <div class="block-body">
                <div className="row">
                    <div className="col-lg-12">
                        <h3 className="font-m">Оплаты</h3>
                        {
                            this.state.data.payments.length > 0
                            ?
                            <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                            :
                            <div className='text-center font-m'>Оплаты отсутствуют</div>
                        }
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default PaymentsAdmin