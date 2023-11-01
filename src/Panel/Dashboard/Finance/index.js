import React, { Component } from 'react'

import global from '../../Global/index'
import { toast } from 'react-toastify'
import moment from 'moment'
import Table from '../../Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleDown, faArrowAltCircleUp, faSearchPlus, faBackspace, faCopy, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import ModalConfirm from '../../modalConfirm'
import FinanceModal from './Modal'
import ModalSend from './ModalSend'

let interval;

class Finance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            cryptoSum: 1,
            cryptoName: "btc",
            data: {
                courses: {
                    "RUB": 0,
                    "USD": 0,
                    "UAH": 0,
                    "fee30min": 0,
                    "fee60min": 0
                },
                user: {
                    balance: 0
                },
                wallets: []
            },
            paymentSum: 0,
            withdrawalSum: 0,
            withdrawalSumFiat: 0,
            wallet: "",
            items: [],
            withType: "moment",
            confirmModal: false,
            paymentCancel: 0,
            operation: {},
            modal: false,
            fiatName: "USD",
            fee: 5,
            feeConst: 0.00000275,
            satoshi: 1,
            transFee: 0,
            transSum: 0,
            typeSend: "ALL",
            password: ""
        }
        this.getData = this.getData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.createPayment = this.createPayment.bind(this)
        this.createWithdrawal = this.createWithdrawal.bind(this)
        this.cancelPayment = this.cancelPayment.bind(this)
        this.confirmToggle = this.confirmToggle.bind(this)
        this.toggle = this.toggle.bind(this)
        this.createWallet = this.createWallet.bind(this)
        this.sendAll = this.sendAll.bind(this)
        this.toggleSend = this.toggleSend.bind(this)
        this.sendForAll = this.sendForAll.bind(this)
        this.sendSum = this.sendSum.bind(this)
    }

    toggleSend() {
        this.setState({
            modalSend: !this.state.modalSend
        })
    }

    toggle(id) {
        this.state.data.operations.map(operation => {
            if (operation.id == id) {
                this.setState({
                    operation: operation
                })
            }
        })
        this.setState({
            modal: !this.state.modal
        })
    }

    confirmToggle(id) {
        this.setState({
            confirmModal: !this.state.confirmModal,
            paymentCancel: id
        })
    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name
        
        if(name == "withdrawalSumFiat") {
               this.setState({
            [name]: value,
            withdrawalSum: +((value/this.state.data.courses[this.state.fiatName]).toFixed(8).replace(',', '.'))
        })   
        }
        else if(name == "withdrawalSum") {
                    this.setState({
            [name]: value,
            withdrawalSumFiat: Math.round(value * this.state.data.courses[this.state.fiatName])
        })
        }
        else {
                 this.setState({
            [name]: value
        })   
        }
    }

    prepareTableData() {
        let items = [];

        this.state.data.operations.map((item) => {
            let itemModified = {
                id: item.id,
                type: item.type,
                name: global.getLocales(item.name),
                sum: item.sum + " BTC",
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
        interval = setInterval(this.getData, 1000)
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    cancelPayment() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "main",
                    type: "cancelPayment",
                    id: this.state.paymentCancel
                },
                action: "finance"
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
                        cancelPayment: 0,
                        confirmModal: false
                    })
                    toast.success(response.data.message)
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

    createWallet() {
        this.setState({
            loading: true
        })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "main",
                        type: "createWallet"
                    },
                    action: "finance"
                },
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }

            global.createRequest(data, response => {
                if (response.status == 200) {
                    if (response.data.success) {
                        toast.success(response.data.message)
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

    createPayment() {
        this.setState({
            loading: true
        })

        if (this.state.paymentSum >= 10) {
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "main",
                        type: "createPayment",
                        sum: this.state.paymentSum
                    },
                    action: "finance"
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
                            paymentSum: 0
                        })
                        toast.success(response.data.message)
                        this.getData(response.data.data.id)
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
            this.setState({
                loading: false
            })
            toast.error("Минимальная сумма пополнения - 10 долларов")
        }
    }

    createWithdrawal() {
        this.setState({
            loading: true
        })

        if (this.state.withdrawalSum > 0) {
            if (this.state.wallet !== 0) {
                let data = {
                    api: "user",
                    body: {
                        data: {
                            section: "main",
                            type: "createWithdrawal",
                            sum: this.state.withdrawalSum,
                            wallet: this.state.wallet
                        },
                        action: "finance"
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
                                withdrawalSum: 0,
                                withdrawalSumFiat: 0,
                                wallet: 0
                            })
                            toast.success(response.data.message)
                            this.getData(response.data.data.id)
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
                this.setState({
                    loading: false
                })
                toast.error("Не выбран кошелек для вывода")
            }
        }
        else {
            this.setState({
                loading: false
            })
            toast.error("Введите сумму вывода")
        }
    }

    sendForAll() {
        this.setState({
            loading: true
        })
        let data = {
            api: "withdrawal",
            body: {
                data: {
                    wallet: this.state.wallet,
                    type: "all",
                    sendType: "send",
                    sum: this.state.typeSend == "ALL" ? (+this.state.transSum - (this.state.transFee*this.state.satoshi)) : +this.state.transSum,
                    satoshi: this.state.satoshi,
					password: this.state.password
                }
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    toast.success(response.data.message)
                    this.toggleSend()
                    this.setState({
                        loading: false,
                        sum: 0,
                        wallet: "",
                        transSum: 0,
                        withdrawalSum: 0,
                        withdrawalSumFiat: 0,
                        password: ""
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

    sendSum() {
        if(this.state.wallet !== "") {
            this.setState({
                loading: true
            })
            let data = {
                api: "withdrawal",
                body: {
                    data: {
                        wallet: this.state.wallet,
                        type: "sum",
                        sum: +this.state.withdrawalSum,
                        sendType: "pred",
                    withType: this.state.withType,
					password: this.state.password
                    }
                },
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }
    
            global.createRequest(data, response => {
                if (response.status == 200) {
                    if (response.data.success) {
                        if(this.state.withType == "moment") {
                        this.setState({
                            transFee: response.data.data.fee,
                            transSum: response.data.data.sum,
                            typeSend: "SUM"
                        }, () => {
                            this.toggleSend()
                        })
                        }
                        else {
                            this.setState({
                                wallet: "",
                                withdrawalSum: 0,
                                withdrawalSumFiat: 0,
                        password: ""
                            })
                              toast.success(response.data.message)

                        }
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
            toast.error("Вставьте адрес, куда требуется перевести средства")
        }
    }

    sendAll() {
        if(this.state.wallet !== "") {
            this.setState({
                loading: true
            })
            let data = {
                api: "withdrawal",
                body: {
                    data: {
                        wallet: this.state.wallet,
                        type: "all",
                        sendType: "pred",
                    withType: this.state.withType,
					password: this.state.password
                    }
                },
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }
    
            global.createRequest(data, response => {
                if (response.status == 200) {
                    if (response.data.success) {
                        if(this.state.withType == "moment") {
                                                    this.setState({
                            transFee: response.data.data.fee,
                            transSum: response.data.data.sum,
                            typeSend: "ALL"
                        }, () => {
                            this.toggleSend()
                        })
                        }
                        else {
                               this.setState({
                                wallet: "",
                                withdrawalSum: 0,
                                withdrawalSumFiat: 0,
                        password: ""
                            })
                            
                                                    toast.success(response.data.message)
                        }
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
            toast.error("Вставьте адрес, куда требуется перевести средства")
        }
    }

    getData(open) {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "main",
                    type: "get"
                },
                action: "finance"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.setState({
                        data: response.data.data
                    })
                    if(!this.state.modalSend) {
                         this.setState({
                        loading: false
                    })
                    }
                    if(this.state.satoshi == 1) {
                        this.setState({
                            satoshi: +response.data.data.courses['fee60min']
                        })
                    }
                    this.prepareTableData()
                    if (this.props.match.params.operationId) {
                        this.toggle(this.props.match.params.operationId)
                    }
                    if (open) {
                        this.toggle(open)
                    }
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
                title: global.getLocales("Тип"), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <span className={(item.name == "Покупка услуги" || item.name == "Вывод средств") ? "text-danger" : "text-success"}><FontAwesomeIcon icon={(item.name == "Покупка услуги" || item.name == "Вывод средств") ? faArrowAltCircleUp : faArrowCircleDown} /></span>
                    </div>
            },
            {
                title: global.getLocales('Операция'), dataIndex: 'name', key: 'name', sort: true
            },
            {
                title: global.getLocales('Сумма'), dataIndex: 'sum', key: 'sum', sort: true
            },
            {
                title: global.getLocales('Создана'), dataIndex: 'created', key: 'created', sort: true
            },
            {
                title: global.getLocales('Статус'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <button
                            className={"btn  font-m auth-btn " + (item.status == 1 ? " btn-primary" : (item.status == -1 ? " btn-danger" : " btn-secondary"))}> {item.status == 1 ? global.getLocales("Завершена") : (item.status == -1 ? global.getLocales("Отменена") : global.getLocales("Ожидает подтверждений"))}
                        </button>
                    </div>
            },
            {
                title: global.getLocales('Действия'), dataIndex: '', key: 'operations', itemClassName: 'text-center', headerClassName: 'text-center', render: (e, item) =>
                    <div className="sparkline8">
                        <button onClick={() => { this.toggle(item.id) }} className="btn btn-secondary btn-table"><FontAwesomeIcon icon={faSearchPlus} /></button>
                    </div>
            }
        ]
        return (
            <>
                <div className="row">
                    <div className="col-lg-4">
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <h3 className="font-m">{global.getLocales('Кошелек')}</h3>
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales('Баланс')}</label>
                                            <div class="input-group">
                                                <input name="available" disabled value={this.state.data.user.balance.toFixed(8)} type="number" autoComplete="off" class="form-control" />
                                                <span class="input-group-text">BTC</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className="form-group">
                                            <label class="form-control-label font-m">{global.getLocales('Баланс в')} {this.state.fiatName}</label>
                                            <div class="input-group">
                                                <input name="availableFiat" disabled value={Math.round(this.state.data.user.balance * this.state.data.courses[this.state.fiatName])} type="number" autoComplete="off" class="form-control" />
                                                <div class="input-group-append">
                                                    <select disabled={this.state.loading} onChange={this.handleChange} value={this.state.fiatName} name="fiatName" class="form-control">
                                                        <option value="USD">USD ▼</option>
                                                        <option value="RUB">RUB ▼</option>
                                                        <option value="UAH">UAH ▼</option>
                                                        <option value="KZT">KZT ▼</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-12'>
                                        <h3 className="font-m">{global.getLocales('Адреса')}  <span className='right text-danger cursor-pointer pointer' onClick={this.createWallet}><FontAwesomeIcon icon={faPlusCircle}/> {global.getLocales('Создать адрес')}</span></h3>
                                        <div className='row'>
                                                {
                                                    this.state.data.wallets.map(item =>
                                                        <div className='col-lg-12 address-block'>
                                                        <div class="input-group">
                                                        <input name="available" disabled value={item.value} autoComplete="off" class="form-control" />
                                                        <div class="input-group-append">
                                                            <button onClick={() => {
                                                                navigator.clipboard.writeText(item.value)
                                                                toast.success(global.getLocales('Успешно добавлено в буфер обмена'))
                                                            }} class="btn btn-secondary" type="button"><FontAwesomeIcon icon={faCopy}/></button>
                                                        </div>
                                                    </div>
                                                    </div>
                                                        )
                                                }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <h3 className="font-m">{global.getLocales('Вывод средств')}</h3>
                                <div className='row'>
                                <div className="col-lg-12">
                                <div className="avatar-block notice font-m">
                                <b>{global.getLocales('Типы выводов')}:</b><br/>
                                <b>{global.getLocales('Моментальный')}</b> - {global.getLocales('комиссию сети оплачиваете Вы, транзакция отправляется в течении 2-3 минут после создания заявки на вывод.')}<br/>
                                <b>{global.getLocales('Массовый')}</b> - {global.getLocales('комиссию сети оплачивает сервис, выплата производится раз в 12 часов, в 6 утра и в 6 вечера по UTC+3 (Московское время), заявку на вывод можно создать в любое время.')}
                                </div>
                                </div>
                                    <div className='col-lg-4'>
                                        <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales('Тип вывода')}</label>
                                     <select disabled={this.state.loading} value={this.state.withType} onChange={this.handleChange} name="withType" class="form-control">
                                    <option value="moment">{global.getLocales("Моментальный")}</option>
                                    <option value="mass">{global.getLocales("Массовый")}</option>
                                </select>
                                        </div>
                                    </div>
                                    <div className='col-lg-8'>
                                        <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales('Адрес для перевода')}</label>
                                            <input type="text" autoComplete="off" class="form-control" placeholder={global.getLocales("Вставьте адрес")} name="wallet" value={this.state.wallet} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                                                        <div className='col-lg-4'>
                                        <div className="form-group">
                                            <label class="form-control-label font-m">{global.getLocales("Пароль")} </label>
                                           
                                                <input type="password" autoComplete="off" class="form-control" placeholder={global.getLocales("Введите пароль")} name="password" value={this.state.password} onChange={this.handleChange} />
                                          
                                       
                                        </div>
                                    </div>
                                    <div className='col-lg-5'>
                                        <div className="form-group">
                                            <label class="form-control-label font-m">{global.getLocales("Сумма перевода")} </label>
                                            <div class="input-group">
                                                <input type="number" autoComplete="off" class="form-control" placeholder={global.getLocales("Введите сумму")} name="withdrawalSum" value={this.state.withdrawalSum} onChange={this.handleChange} />
                                                <span class="input-group-text">BTC</span>
                                                <div class="input-group-append">
                                                    <button onClick={this.sendAll} className='btn btn-secondary font-m'>{global.getLocales("Вывести всё")}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-3'>
                                        <div className="form-group">
                                            <label class="form-control-label font-m">{global.getLocales("Сумма перевода в")} {this.state.fiatName}</label>
                                            <div class="input-group">
                                                <input type="number" autoComplete="off" class="form-control" placeholder={global.getLocales("Введите сумму")} name="withdrawalSumFiat" value={this.state.withdrawalSumFiat} onChange={this.handleChange} />
                                                <div class="input-group-append">
                                                    <select disabled={this.state.loading} onChange={this.handleChange} value={this.state.fiatName} name="fiatName" class="form-control">
                                                    <option value="USD">USD ▼</option>
                                                        <option value="RUB">RUB ▼</option>
                                                        <option value="UAH">UAH ▼</option>
                                                        <option value="KZT">KZT ▼</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="row">
                                    <div className='col-lg-6'/>
                                    <div className='col-lg-6'>
                                    <button onClick={this.sendSum} disabled={this.state.loading} class="btn btn-primary font-m auth-btn">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Отправить средства")}</>}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <h3 className="font-m"><>{global.getLocales("Финансовые операции")}</></h3>
                                <br />
                                {
                                    this.state.items.length <= 0
                                        ?
                                        <div className="text-center font-m">{global.getLocales("Операции отсутствуют")}</div>
                                        :
                                        <Table search={false} columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                                }
                                <FinanceModal modal={this.state.modal} toggle={this.toggle} operation={this.state.operation} />
                                <ModalConfirm action={global.getLocales("Вы действительно хотите отменить данную заявку на пополнение?")} consequences={global.getLocales("Данное действие безвозвратно, если Вы уже перевели средства, или сделаете это после, средства не начислятся на баланс.")} modal={this.state.confirmModal} toggle={this.confirmToggle} loading={this.state.loading} sendData={this.cancelPayment} />
                            </div>
                        </div>
                    </div>
                </div>
                <ModalSend courses={this.state.data.courses} type={this.state.typeSend} send={this.sendForAll} loading={this.state.loading} modal={this.state.modalSend} toggle={this.toggleSend} satoshi={this.state.satoshi} sum={this.state.transSum} fee={this.state.transFee} wallet={this.state.wallet} handleChange={this.handleChange}/>
            </>
        )
    }
}

export default Finance