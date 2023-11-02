import React, { Component } from 'react'

import global from '../../../Global/index'
import { toast } from 'react-toastify'
import moment from 'moment'
import Table from '../../../Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchPlus, faBackspace } from '@fortawesome/free-solid-svg-icons'
import ModalConfirm from '../../../modalConfirm'
import WalletModal from './Modal'


class CryptoWallets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                wallets: [],
                directions: {
                    btc: {
                        name: "btc",
                        title: "BitCoin"
                    }
                }
            },
            type: "none",
            note: "",
            wallet: "",
            items: [],
            delete: false,
            deleteTarget: 0,
            infoModal: false,
            infoWallet: {
                id: 0,
                type: "NONE",
                value: "NONE",
                created: 0,
                note: ""
            }
        }
        this.getData = this.getData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.addWallet = this.addWallet.bind(this)
        this.delete = this.delete.bind(this)
        this.deleteWallet = this.deleteWallet.bind(this)
        this.toggleInfo = this.toggleInfo.bind(this)
    }

    toggleInfo(id) {
        this.state.data.wallets.map(item => {
            if(item.id == id) {
                this.setState({
                    infoWallet: item
                })
            }
        })
        this.setState({
            infoModal: !this.state.infoModal
        })
    }

    delete(id) {
        this.setState({
            delete: !this.state.delete,
            deleteTarget: id
        })
    }

    prepareTableData() {
        let items = [];

        this.state.data.wallets.map((item) => {
            let itemModified = {
                id: item.id,
                type: item.type.toUpperCase(),
                value: item.note == "Отсутствует" ? (item.value.slice(0, 15) + "...") : item.note,
                created: moment.unix(item.created / 1000).format("LLL")
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

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    addWallet() {
        this.setState({
            loading: true
        })
        if (this.state.type !== "none") {
            if (this.state.wallet.length > 0) {
                if (this.state.note.length < 50) {
                    let data = {
                        api: "user",
                        body: {
                            data: {
                                section: "crypto",
                                type: "add",
                                wallet: this.state.wallet,
                                direction: this.state.type,
                                note: this.state.note
                            },
                            action: "wallets"
                        },
                        headers: {
                            'authorization': localStorage.getItem('token')
                        }
                    }

                    global.createRequest(data, response => {
                        if (response.status == 200) {
                            if (response.data.success) {
                                this.setState({
                                    loading: false,
                                    wallet: "",
                                    note: "",
                                    type: "none"
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
                            this.setState({
                                loading: false
                            })
                            toast.error("Сервер недоступен")
                        }
                    })
                }
                else {
                    this.setState({
                        loading: false
                    })
                    toast.error("Максимальная длина заметки - 50 символов")
                }
            }
            else {
                this.setState({
                    loading: false
                })
                toast.error("Не введен кошелек")
            }
        }
        else {
            this.setState({
                loading: false
            })
            toast.error("Не выбран тип кошелька")
        }

    }

    deleteWallet() {
        this.setState({
            loading: true
        })

        let data = {
            api: "user",
            body: {
                data: {
                    section: "crypto",
                    type: "delete",
                    id: this.state.deleteTarget
                },
                action: "wallets"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.setState({
                        loading: false,
                        delete: false,
                        deleteTarget: 0
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
                this.setState({
                    loading: false
                })
                toast.error("Сервер недоступен")
            }
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
                    section: "crypto",
                    type: "get"
                },
                action: "wallets"
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
        const tableColumns = [
            {
                title: 'ID', dataIndex: 'id', key: 'id', sort: true
            },
            {
                title: 'Тип', dataIndex: 'type', key: 'type', sort: true
            },
            {
                title: 'Кошелек / Заметка', dataIndex: 'value', key: 'value', sort: true
            },
            {
                title: 'Добавлен', dataIndex: 'created', key: 'created', sort: true
            },
            {
                title: 'Действия', dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <button onClick={() => {this.toggleInfo(item.id)}} className="btn btn-secondary btn-table"><FontAwesomeIcon icon={faSearchPlus}/></button>
                        <button onClick={() => {this.delete(item.id)}} className="btn btn-danger btn-table"><FontAwesomeIcon icon={faBackspace}/></button>
                    </div>
            }
        ]
        return (
            <div className="row">
                <div className="col-lg-4">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                        <h4 className="font-m">Добавление кошелька</h4>

                            <div class="form-group">
                                <label class="form-control-label font-m">Тип</label>
                                <select disabled={this.state.loading} value={this.state.type} onChange={this.handleChange} name="type" class="form-control">
                                    <option value="none">Не выбран</option>
                                    {
                                        Object.entries(this.state.data.directions).map(item =>
                                            <option value={item[1].name}>{item[1].title}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-control-label font-m">Адрес</label>
                                <input disabled={this.state.loading} value={this.state.wallet} onChange={this.handleChange} autocomplete="off" type="text" placeholder="Введите адрес кошелька" name="wallet" class="form-control" />
                            </div>
                            <div class="form-group">
                                <label class="form-control-label font-m">Заметка</label>
                                <input disabled={this.state.loading} value={this.state.note} onChange={this.handleChange} maxLength="50" autocomplete="off" type="text" placeholder="Введите примечание" name="note" class="form-control" />
                                <small>Максимальная длина заметки - 50 символов</small>
                            </div>
                            <div className="text-right">
                                <button onClick={this.addWallet} disabled={this.state.loading} class="btn btn-primary font-g auth-btn">{this.state.loading ? "Загрузка..." : "Добавить"}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                        <h4 className="font-m">Кошельки</h4>

                            {
                                this.state.items.length > 0
                                    ?
                                    <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                    :
                                    <div className="text-center">
                                        Кошельки отсутствуют
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <ModalConfirm action="Вы действительно хотите удалить данный кошелек?" consequences="Данное действие приведет к удалению кошелька из всех магазинов." modal={this.state.delete} toggle={this.delete} loading={this.state.loading} sendData={this.deleteWallet}/>
                <WalletModal loadData={this.getData} modal={this.state.infoModal} toggle={this.toggleInfo} wallet={this.state.infoWallet}/>
            </div>
        )
    }
}

export default CryptoWallets