import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleUp, faArrowCircleRight, faCopy, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../Table'


class ShopsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                shops: []
            },
            items: []
        }
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    prepareTableData() {
        let items = [];

        this.state.data.shops.map((item) => {
            let itemModified = {
                id: item.id,
                uniqueId: item.uniqueId,
                domains: item.domains,
                bots: item.bots,
                purchases: item.purchasesSum + " " + item.currency,
                owner: item.owner,
                ownerLogin: item.ownerLogin
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
                    type: "getShops"
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
                    response.data.data.shops = response.data.data.shops.reverse()
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
                title: 'Захэшированный ID', dataIndex: 'uniqueId', key: 'uniqueId', sort: true
            },
            {
                title: 'Домены', dataIndex: 'domains', key: 'domains', sort: true
            },
            {
                title: 'Боты', dataIndex: 'bots', key: 'bots', sort: true
            },
            {
                title: 'Оборот за все время', dataIndex: 'purchases', key: 'purchases', sort: true
            },
            {
                title: 'Владелец', dataIndex: 'ownerLogin',  key: 'operations', render: (e, item) => 
                <div className="sparkline8">
                <NavLink to={'/dashboard/manage/datas/users/' + item.owner + '/'}><button className="btn btn-secondary btn-table">{item.ownerLogin}</button></NavLink>
            </div>
            },
            {
                title: 'Действие', dataIndex: 'name', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => 
                <div className="sparkline8">
                <NavLink to={'/dashboard/shops/' + item.uniqueId + '/'}><button className="btn btn-secondary btn-table"><FontAwesomeIcon icon={faArrowCircleRight} /></button></NavLink>
            </div>
            }
        ]
        return (
            <div class={"block animate__animated animate__fadeIn margin-15 " + (this.state.loading ? "blur" : "")}>
            <div class="block-body">
                <div className="row">
                    <div className="col-lg-12">
                        <h3 className="font-m">Магазины</h3>
                        {
                            this.state.data.shops.length > 0
                            ?
                            <Table columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                            :
                            <div className='text-center font-m'>Магазины отсутствуют</div>
                        }
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default ShopsAdmin