import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackspace, faCopy, faInfoCircle, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import Table from '../../../../Table'
import NewsModal from './Modal'
import ModalConfirm from '../../../../modalConfirm'
import CreateNews from './ModalNew'

class AdminNews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                news: []
            },
            items: [],
            modal: false,
            new: {},
            confirmModal: false,
            deleteId: 0,
            modalCreate: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
        this.change = this.change.bind(this)
        this.delete = this.delete.bind(this)
        this.deleteModal = this.deleteModal.bind(this)
        this.togglenew = this.togglenew.bind(this)
    }

    togglenew() {
        this.setState({
            modalCreate: !this.state.modalCreate
        })
    }

    deleteModal(id) {
        if(id !== 0) {
            this.setState({
                confirmModal: true,
                deleteId: id
            })
        }
        else {
            this.setState({
                confirmModal: false
            })
        }
    }

    delete() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "inform",
                    type: "newsDelete",
                    id: this.state.deleteId
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
                    this.deleteModal(0)
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

    componentDidMount() {
        this.getData()
    }

    prepareTableData() {
        let items = [];

        this.state.data.news.map((item) => {
            let itemModified = {
                id: item.id,
                content: item.content.slice(0, 25),
                date: moment.unix(item.date/1000).format("LLL")
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

    change(id) {
        if(id !== 0) {
            this.state.data.news.map(item => {
                if(item.id == id) {
                    this.setState({
                        modal: true,
                        new: item
                    })
                }
            })
        }
        else {
            this.setState({
                modal: !this.state.modal,
                new: {}
            })
        }
    }

    getData() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "inform",
                    type: "newsGet"
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

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })

    }

    render() {
        const tableColumns = [
            {
                title: 'ID', dataIndex: 'id', key: 'id', sort: true
            },
            {
                title: 'Новость', dataIndex: 'content', key: 'content', sort: true
            },
            {
                title: 'Дата', dataIndex: 'date', key: 'date', sort: true
            },

            {
                title: 'Действие', dataIndex: 'name', itemClassName: 'text-center', headerClassName: 'text-center', key: 'operations', render: (e, item) => 
                <div className="sparkline8">
                <button onClick={() => { this.change(item.id) }} className="btn btn-secondary btn-table"><FontAwesomeIcon icon={faSearchPlus} /></button>
                <button onClick={() => { this.deleteModal(item.id) }} className="btn btn-danger btn-table"><FontAwesomeIcon icon={faBackspace} /></button>
            </div>
            }
        ]
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">Новости <span className='right cursor-pointer' onClick={this.togglenew}> + Создать новость</span></h3>
                            <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />

                        </div>
                    </div>
                </div>
                <ModalConfirm action="Вы действительно хотите удалить новость?" consequences="" modal={this.state.confirmModal} toggle={() => {this.deleteModal(0)}} loading={this.state.loading} sendData={this.delete} />
                <NewsModal modal={this.state.modal} toggle={this.change} new={this.state.new} getData={this.getData}/>
                <CreateNews modal={this.state.modalCreate} toggle={this.togglenew} getData={this.getData}/>
            </div>
        )
    }
}

export default AdminNews