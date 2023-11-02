import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import Table from '../../../../../Table'

class Domains extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: {
                domains: []
            },
            items: [],
            type: "sub"
        }
        this.getData = this.getData.bind(this)
        this.prepareTableData = this.prepareTableData.bind(this)
        this.updateItems = this.updateItems.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.add = this.add.bind(this)
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
    add() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "site",
                    subtype: "domains",
                    shop: this.props.match.params.shopId,
                    action: "create"
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
                    subtype: "domains",
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


    prepareTableData() {
        let items = [];

        this.state.data.domains.map((item) => {
            let itemModified = {
                value: item.value,
                type: item.type.replace(/onion/g, "ONION").replace(/sub/g, global.getLocales("Поддомен")).replace(/own/g, global.getLocales("Собственный"))
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
                title: global.getLocales('Тип'), dataIndex: 'type', key: 'type', sort: true
            },
            {
                title: global.getLocales('Домен'), dataIndex: 'value', key: 'operations', render: (e, item) => <a target="_blank" href={"http://" + item.value}>{item.value}</a>
            }
        ]
        return (
            <div className="row">
                <div className="col-lg-4">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h3 className="font-m">{global.getLocales("Добавление домена")}</h3>
                            <div class="form-group margin-15">
                                <label class="form-control-label font-m">{global.getLocales("Тип домена")}</label>
                                <select disabled={this.state.loading} value={this.state.type} onChange={this.handleChange} name="type" class="form-control">
                                    <option value="sub">{global.getLocales("Субдомен")}</option>
                                    <option value="onion">{global.getLocales("Onion домен")}</option>
                                    <option value="own">{global.getLocales("Собственный домен")}</option>
                                </select>
                            </div>
                            {
                                this.state.type == "own"
                                    ?
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Домен")}</label>
                                        <input placeholder={global.getLocales("Введите домен")} disabled={this.state.loading} value={this.state.domain} onChange={this.handleChange} name="domain" class="form-control" />
                                        <small>{global.getLocales("Введите домен, который желаете подключить")}</small>
                                    </div>
                                    :
                                    <>
                                        {
                                            this.state.type == "sub"
                                                ?
                                                <div class="form-group">
                                                    <label class="form-control-label font-m">{global.getLocales("Субдомен")}</label>
                                                    <div class="input-group">
                                                        <input type="text" autoComplete="off" class="form-control" placeholder={global.getLocales("Введите субдомен")} name="domain" />
                                                        <span class="input-group-text font-m">.umb.market</span>
                                                    </div>
                                                </div>
                                                :
                                                ''
                                        }
                                    </>
                            }
                            <button disabled={this.state.loading} onClick={this.add} class="btn btn-primary font-m auth-btn">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Добавить домен")}</>}</button>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">  
                            <h3 className="font-m">{global.getLocales("Домены")}</h3>
                            <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Domains