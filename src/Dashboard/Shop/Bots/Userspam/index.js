import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import EmojiInput from '../../../../../EmojiInput'
import Table from '../../../../../Table'

class Userspam extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                spam: []
            },
            content: "",
            items: []
        }
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
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

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "spam",
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

    sendData(e) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "spam",
                    shop: this.props.match.params.shopId,
                    action: "create",
                    value: this.state.content
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
                    this.setState({
                        content: ""
                    })
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

    prepareTableData() {
        let items = [];

        this.state.data.spam.map((item) => {
            let itemModified = {
                id: item.id,
                content: item.content,
                date: moment.unix(item.date/1000).format("LLL"),
                count: item.count
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

    render() {
        const tableColumns = [
            {
                title: global.getLocales('Сообщение'), dataIndex: 'value', key: 'operations', render: (e, item) => <p>{item.content}</p>
            },
            {
                title: global.getLocales('Кол-во получателей рассылки'), dataIndex: 'count', itemClassName: 'text-left', headerClassName: 'text-left', key: 'operations', render: (e, item) => <p>{item.count}</p>
            },
            {
                title: global.getLocales('Дата'), dataIndex: '', key: 'operations', render: (e, item) => <p>{item.date}</p>
            },
            {
                title: global.getLocales('Действие'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <button onClick={() => { this.handleChange({ target: { name: "content", value: item.content } }); window.scrollTo(0, 0) }}
                            className={"btn font-m btn-primary btn-width-auto"}>{global.getLocales('Повторить')}
                        </button>
                    </div>
            }
        ]
        return (
            <>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3 className="font-m">{global.getLocales('Массовая рассылка')}</h3>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales('Сообщение')}</label>
                                            <EmojiInput type="textarea" value={this.state.content} placeholder={global.getLocales('Введите сообщение, которое необходимо разослать')} name="content" handleChange={this.handleChange} />
                                        </div>

                                    </div>
                                    <div className='col-lg-12'>
                                        <button onClick={this.sendData} className='btn btn-primary font-m right'>{global.getLocales('Начать массовую рассылку')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3 className="font-m">{global.getLocales('Предыдущие рассылки')}</h3>
                                {
                                    this.state.data.spam.length > 0
                                        ?
                                        <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                        :
                                        <div className='text-center font-m'>
                                            
                                            {global.getLocales('Рассылок ранее не было')}
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

export default Userspam