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
import FaqModal from './Modal'
import CreateFaq from './ModalNew'

class AdminFAQ extends Component {
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
                    type: "faqDelete",
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
                name: item.name,
                indexNum: item.indexNum,
                flag: item.flag
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
        let data = {
            api: "user",
            body: {
                data: {
                    section: "inform",
                    type: "faqGet"
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
                title: 'Название', dataIndex: 'name', key: 'name', sort: true
            },
            {
                title: 'Порядковый номер', dataIndex: 'indexNum', key: 'indexNum', sort: true
            },
            {
                title: 'FLAG', dataIndex: 'flag', key: 'flag', sort: true
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
                            <h3 className="font-m">Статьи FAQ <span className='right cursor-pointer' onClick={this.togglenew}> + Создать статью</span></h3>
                            <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />

                        </div>
                    </div>
                </div>
                <ModalConfirm action="Вы действительно хотите удалить статью?" consequences="" modal={this.state.confirmModal} toggle={() => {this.deleteModal(0)}} loading={this.state.loading} sendData={this.delete} />
                <FaqModal modal={this.state.modal} toggle={this.change} new={this.state.new} getData={this.getData}/>
                <CreateFaq modal={this.state.modalCreate} toggle={this.togglenew} getData={this.getData}/>
            </div>
        )
    }
}

export default AdminFAQ