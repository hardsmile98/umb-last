import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackspace, faCopy, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import Table from '../../../../../Table'
import ModalConfirm from '../../../../../modalConfirm'

class SitePages extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: {
                pages: []
            },
            items: [],
            id: 0,
            confirmModal: false
        }
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
        this.confirmToggle = this.confirmToggle.bind(this)
        this.delete = this.delete.bind(this)

    }

    
    confirmToggle(id) {
        this.setState({
            confirmModal: !this.state.confirmModal,
            id: id
        })
    }

    componentDidMount() {
        this.getData()
    }

    
    prepareTableData() {
        let items = [];

        this.state.data.pages.map((item) => {
            let itemModified = {
                id: item.id,
                name: item.name,
                path: item.path ? ("/" + item.path) : item.content,
                type: item.type.replace(/text/g, global.getLocales("Информационная страница")).replace(/link/g, global.getLocales("Страница-ссылка"))
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

    delete() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "site",
                    subtype: "pages",
                    shop: this.props.match.params.shopId,
                    action: "delete",
                    id: this.state.id
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
                    this.confirmToggle(0)
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
                    type: "site",
                    subtype: "pages",
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
                title: global.getLocales("Тип"), dataIndex: 'type', key: 'type', sort: true
            },
            {
                title: global.getLocales("Название"), dataIndex: 'name', key: 'name', sort: true
            },
            {
                title: global.getLocales("Путь"), dataIndex: 'path', key: 'path', sort: true
            },
            {
                title: global.getLocales("Действия"), itemClassName: 'text-center', headerClassName: 'text-center', dataIndex: 'value', key: 'operations', render: (e, item) => 
                <div className="sparkline8">
                <NavLink to={'/dashboard/shops/' + this.props.match.params.shopId + '/site/pages/' + item.id}><button className="btn btn-secondary btn-table"><FontAwesomeIcon icon={faSearchPlus} /></button></NavLink>
                <button onClick={() => { this.confirmToggle(item.id) }} className="btn btn-danger btn-table"><FontAwesomeIcon icon={faBackspace} /></button>
            </div>
            }
        ]
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
            <div class="block-body">
                <div className="row">
                    <div className="col-lg-12">
                        <h3 className="font-m">{global.getLocales("Страницы")} <span className='right'><NavLink to={'/dashboard/shops/' + this.props.match.params.shopId + '/site/pages/new'}> + {global.getLocales("Создать страницу")}</NavLink></span></h3>
                        {
                            this.state.data.pages.length > 0
                            ?
                            <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                            :
                            <div className='text-center font-m'>
                                {global.getLocales("Страницы отсутствуют")}
                                </div>
                        }

                    </div>
                </div>
            </div>
            <ModalConfirm action={global.getLocales("Вы действительно хотите удалить данную страницу?")} consequences="" modal={this.state.confirmModal} toggle={this.confirmToggle} loading={this.state.loading} sendData={this.delete} />

        </div>
        )
    }
}

export default SitePages