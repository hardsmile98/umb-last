import React, { Component, useState } from 'react'
import Picker from 'emoji-picker-react'


import ReactDOMServer from 'react-dom/server'


import renderEmoji from 'react-easy-emoji'


import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackspace, faCopy, faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import EmojiInput from '../../../../../EmojiInput'
import PageEdit from './Modal'
import ModalConfirm from '../../../../../modalConfirm'
import WidgetModal from './Modal'
import Table from '../../../../../Table'

let links = []


class BotPages extends Component {
    constructor(props) {
        super(props)
        this.contentEditable = React.createRef()
        this.state = {
            loading: true,
            emoji: "",
            name: "",
            width: 1,
            data: {
                widgets: []
            },
            indexPage: 0,
            content: "",
            type: "content",
            links: [],
            modal: false,
            activePage: {},
            pageDelete: 0,
            modalDelete: false,
            items: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
        this.toggle = this.toggle.bind(this)
        this.delete = this.delete.bind(this)
        this.toggleDelete = this.toggleDelete.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
    }

    prepareTableData() {
        let items = [];

        this.state.data.widgets.map((item) => {
            let itemModified = {
                id: item.id,
                name: item.name,
                type: item.type.replace(/content/g, global.getLocales("Текстовой")).replace(/link/g, global.getLocales("Ссылка")),
                indexPage: item.indexPage
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

    toggleDelete(id) {
        this.setState({
            pageDelete: id,
            modalDelete: !this.state.modalDelete
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
                    subtype: "widgets",
                    shop: this.props.match.params.shopId,
                    action: "delete",
                    id: this.state.pageDelete
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
                    this.toggleDelete(0)
                    this.getData()
                    toast.success(response.data.message)
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

    toggle(id) {
        if(id) {
            this.state.data.widgets.map(item => {
                if(item.id == id) {
                    this.setState({
                        activePage: item,
                        modal: !this.state.modal
                    })
                }
            })
        }
        else {
            this.setState({
                modal: !this.state.modal
            })
        }
    }

    componentDidMount() {
        this.getData()
    }


    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })

    }


    sendData() {
        if (this.state.name.length >= 1 && this.state.content.length >= 1) {
            this.setState({
                loading: true
            })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "site",
                        subtype: "widgets",
                        shop: this.props.match.params.shopId,
                        action: "create",
                        name: this.state.name,
                        indexPage: this.state.indexPage,
                        content: this.state.content,
                        pageType: this.state.type
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
                            name: "",
                            indexPage: 0,
                            content: "",
                            type: "content"
                        })
                        this.getData()
                        toast.success(response.data.message)
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
        else {
            toast.error("Заполнены не все поля")
        }
    }


    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "site",
                    subtype: "widgets",
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
                title: global.getLocales("Действия"), itemClassName: 'text-center', headerClassName: 'text-center', dataIndex: 'value', key: 'operations', render: (e, item) => 
                <div className="sparkline8">
                <button onClick={() => {this.toggle(item.id)}} className="btn btn-secondary btn-table"><FontAwesomeIcon icon={faSearchPlus} /></button>
                <button onClick={() => { this.toggleDelete(item.id) }} className="btn btn-danger btn-table"><FontAwesomeIcon icon={faBackspace} /></button>
            </div>
            }
        ]
        return (
            <div className="row">
                <div className="col-lg-5" style={{ zIndex: "100" }}>
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h3 className="font-m">{global.getLocales("Добавление виджета")}</h3>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Название")}</label>
                                        <input type="text"  placeholder={global.getLocales("Введите название виджета")}  disabled={this.state.loading} value={this.state.name} onChange={this.handleChange} name="name" class="form-control" />
                                    </div>
                                </div>
                                <div className='col-lg-12'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Порядковый номер")}</label>
                                        <input type="number" disabled={this.state.loading} value={this.state.indexPage} onChange={this.handleChange} name="indexPage" class="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Тип виджета")}</label>
                                        <select disabled={this.state.loading} value={this.state.type} onChange={this.handleChange} name="type" class="form-control">
                                            <option value="content">{global.getLocales("Виджет с текстом")}</option>
                                            <option value="link">{global.getLocales("Виджет-ссылка")}</option>
                                        </select>
                                    </div>
                                    {
                                        this.state.type == "content"
                                            ?
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales("Содержание виджета")}</label>
                                                <textarea placeholder={global.getLocales("Введите содержание виджета")} value={this.state.content} class="form-control" name="content" onChange={this.handleChange}></textarea>
                                            </div>
                                            :
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales("Ссылка")}</label>
                                                <input placeholder={global.getLocales('Вставьте ссылку')} type="text" disabled={this.state.loading} value={this.state.content} onChange={this.handleChange} name="content" class="form-control" />
                                            </div>
                                    }
                                </div>
                                <div className='col-lg-12'>
                                    <button onClick={this.sendData} disabled={this.state.loading} class="btn btn-primary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Создать виджет")}</>}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h3 className="font-m">{global.getLocales("Виджеты")}</h3>
                                    {
                            this.state.data.widgets.length > 0
                            ?
                            <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                            :
                            <div className='text-center font-m'>
                                
                                {global.getLocales("Виджеты отсутствуют")}
                                </div>
                        }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <WidgetModal toggleDelete={this.toggleDelete} getData={this.getData} {...this.props} page={this.state.activePage} modal={this.state.modal} toggle={this.toggle}/>
                <ModalConfirm action={global.getLocales("Вы действительно хотите удалить данный виджет?")} consequences="" modal={this.state.modalDelete} toggle={this.toggleDelete} loading={this.state.loading} sendData={this.delete} />
            </div>
        )
    }
}

export default BotPages