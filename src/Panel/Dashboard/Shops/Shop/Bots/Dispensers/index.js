import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faUser, faLink } from '@fortawesome/free-solid-svg-icons'
import EmojiInput from '../../../../../EmojiInput'
import Table from '../../../../../Table'
import DispanserModal from './Modal'
import ModalConfirm from '../../../../../modalConfirm'


class Dispensers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                dispansers: [],
                price: 0,
                subscription: false,
                subscriptionPrice: 0,
                autoDebit: 0
            },
            content: "",
            items: [],
            idChange: 0,
            modal: false,
            modalAction: "create",
            name: "",
            username: "",
            modalConfirm: false
            
        }
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.buy = this.buy.bind(this)
        this.toggleConfirm = this.toggleConfirm.bind(this)
        this.debtOff = this.debtOff.bind(this)
    }
    
    toggleConfirm() {
        this.setState({
            modalConfirm: !this.state.modalConfirm
        })
    }
    
    debtOff() {
                      this.setState({
            loading: true
        })
                let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "dispansers",
                    shop: this.props.match.params.shopId,
                    action: "debitOff"
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
    
    buy() {
                this.setState({
            loading: true
        })
                let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "dispansers",
                    shop: this.props.match.params.shopId,
                    action: "disableAdvert"
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
                    this.toggleConfirm()
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
    
    toggle(action, id) {
        if(action == "edit") {
                        this.state.data.dispansers.map(dis => {
                if(dis.id == id) {
                                     this.setState({
          modal: !this.state.modal,
          modalAction: action,
          name: dis.name,
          idChange: id,
          username: dis.username
        })  
                }
            })
        }
        else {
                 this.setState({
          modal: !this.state.modal,
          modalAction: action
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

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "dispansers",
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
                    subtype: "dispansers",
                    shop: this.props.match.params.shopId,
                    action: this.state.modalAction,
                    name: this.state.name,
                    id: this.state.idChange,
                    username: this.state.username
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
                        username: ""
                    })
                    toast.success(response.data.message)
                    this.toggle()
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


    render() {
        return (
            <div className="row">
            <div className="col-lg-8">
                            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                  
                                <h3 className="font-m">{global.getLocales('Боты распределители')}</h3>
                                <div className="avatar-block font-m">
                                 <b>{global.getLocales('Информация')}</b><br/>{global.getLocales('Бот распределитель представляет собой раздатчик актуальных ссылок на ваших ботов автопродаж. Вероятность блокировок нашего распределителя в разы меньше, чем стандартного бота автопродаж, что позволяет клиентам всегда получать доступ к актуальному боту.')}   
                                </div>
                                <div className='row'>
                                                                {
                                    this.state.data.dispansers.map(item =>
                                        <div className="col-lg-4">
                                            <div className="avatar-block coworker-block shop-block-act">
                                                <div className="text-center flex-center">
                                                    <div className="avatar">
                                                        <FontAwesomeIcon icon={faUser} />
                                                    </div>
                                                    <br />
                                                </div>
                                                <div className="text-center margin-15">
                                                    <div className="bold font-m">{item.name}</div>
                                                    <small>@{item.username}</small>
                                           
                                                    <div className="row">
                                                                                                            <div className="col-lg-8">
                                                                                                                                     <button onClick={() => {this.toggle("edit", item.id)}} disabled={this.state.loading} class="btn btn-secondary font-m auth-btn margin-15">{global.getLocales('Изменить')}</button>
                               
                                                                                                            </div>
                                                        <div className="col-lg-4">
                                                        <a href={"https://t.me/" + item.username} target="_blank">
                                                        <button disabled={this.state.loading} class="btn btn-primary font-m auth-btn margin-15"><FontAwesomeIcon icon={faLink} /></button>
                                                        </a>
                                                            </div>
                                                  
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                }
                            
                                                             <div className="col-lg-4">
                                    
                                        <div onClick={() => {this.toggle("create")}} className="avatar-block coworker-block add-coworker pointer shop-block-act">
                                            <div className="text-center flex-center">
                                                <div className="avatar">
                                                    <FontAwesomeIcon icon={faPlusCircle} />
                                                    
                                                </div>
                                       
                                            </div>
                                        </div>
                                  
                                </div>

                                </div>
                            </div>
               <DispanserModal loading={this.state.loading} name={this.state.name} username={this.state.username} handleChange={this.handleChange} sendData={this.sendData} price={this.state.data.price} action={this.state.modalAction} modal={this.state.modal} toggle={this.toggle}/>
                </div>
            </div>
            <div className="col-lg-4">
                                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <h3 className="font-m">{global.getLocales("Подписка #NOBLOCK")}</h3>
                            {
                                this.state.data.subscription == false
                                    ?
                                    <>
                                    <div className='avatar-block font-m notice-chat' dangerouslySetInnerHTML={{__html:global.getLocales("Наша система будет автоматически следить за блокировкой Ваших ботов и в случае обнаружения, создавать бота, а бот распределитель будет высылать ссылку на нового бота.<br/>Стоимость указана за 1 месяц.")}}/>
                                        <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales("Стоимость")}</label>
                                            <div class="input-group">
                                                <input disabled value={this.state.data.subscriptionPrice} class="form-control" />
                                                <span class="input-group-text">$</span>
                                            </div>
                                        </div>
                                        <div className='btn btn-primary auth-btn font-m' onClick={this.toggleConfirm}>{global.getLocales("Подключить")}</div>
                                    </>
                                    :
                                    <>
                                    <div className='avatar-block font-m notice-chat'>
                                        
                                        {global.getLocales("Подписка активна")}
                                    </div>
                                    <div class="form-group">
                                            <label class="form-control-label font-m">{global.getLocales("Активна до")}</label>
                                                <input disabled value={moment.unix(this.state.data.subscription/1000).format("LLL")} class="form-control" />
                                        </div>
                                        {
                                            this.state.data.autoDebit == 1
                                            ?
                                            <div className='btn btn-danger auth-btn font-m' onClick={this.debtOff}>{global.getLocales("Отключить автопродление")}</div>
                                            :
                                            <div className='btn btn-primary auth-btn font-m' onClick={this.debtOff}>{global.getLocales("Включить автопродление")}</div>
                                        }
                                    </>
                            }
                        </div>
                    </div>
            </div>
                            <ModalConfirm action={global.getLocales("Вы действительно хотите подключить подписку #NOBLOCK?")} consequences={global.getLocales("Средства будут списаны с Вашего баланса, данное действие необратимо, вернуть средства не будет возможным.")} modal={this.state.modalConfirm} toggle={this.toggleConfirm} loading={this.state.loading} sendData={this.buy} />
            </div>
        )
    }
}

export default Dispensers