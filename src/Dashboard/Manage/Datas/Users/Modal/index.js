import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'

import global from '../../../../../Global/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'


class UserAdminModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            login: "",
            name: "",
            balance: 0,
            comission: 0,
            shops: [],
            regdate: 0,
            type: "user",
            notice: "",
            id: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.sendData = this.sendData.bind(this)
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.user != nextProps.user) {
            this.setState({
                id: nextProps.user.id,
                login: nextProps.user.login,
                name: nextProps.user.name,
                balance: nextProps.user.balance,
                comission: nextProps.user.comission,
                shops: nextProps.user.shops,
                regdate: nextProps.user.regdate,
                type: nextProps.user.type,
                notice: nextProps.user.notice
            })
        }
    }


    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    sendData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "datas",
                    type: "updateUser",
                    name: this.state.name,
                    balance: this.state.balance,
                    usertype: this.state.type,
                    comission: this.state.comission,
                    id: this.state.id,
                    notice: this.state.notice
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
                    this.props.toggle(0)
                    this.props.getData()
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
            <div>
                <Modal size="lg" isOpen={this.props.modal} toggle={() => { this.props.toggle(0) }}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">Пользователь #{this.props.user.id}</h4>
                    </div>
                    <ModalBody>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="form-group">
                                    <label className="form-control-label font-m">Логин</label>
                                    <input className='form-control' value={this.state.login} disabled name="name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-label font-m">Имя в поддержке</label>
                                    <input className='form-control' value={this.state.name} onChange={this.handleChange} name="name" />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-label font-m">Баланс</label>
                                    <input className='form-control' value={this.state.balance} onChange={this.handleChange} name="balance" />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-label font-m">Комиссия</label>
                                    <input className='form-control' value={this.state.comission} onChange={this.handleChange} name="comission" />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-label font-m">Заметка</label>
                                    <input className='form-control' value={this.state.notice} onChange={this.handleChange} name="notice" />
                                </div>
                                <div className="form-group">
                                    <label className="form-control-label font-m">Тип юзера</label>
                                    <select className='form-control' value={this.state.type} onChange={this.handleChange} name="type">
                                        <option value="user">Пользователь</option>
                                        <option value="support">Агент поддержки</option>
                                        <option value="admin">Администратор</option>
                                        <option value="superadmin">Супер-админ</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-control-label font-m">Зарегистрирован</label>
                                    <input className='form-control' disabled value={moment.unix(this.state.regdate / 1000).format("LLL")} />
                                </div>
                                <h3 className="font-m margin-15">Магазины</h3>
                                {
                                    this.state.shops.length <= 0
                                        ?
                                        <div className='font-m text-center'>Магазинов нет</div>
                                        :
                                        <div className='avatar-block'>
                                            {
                                                this.state.shops.map(item =>
                                                    <div className='input-group'>
                                                        <input disabled value={item.uniqueId} class="form-control" />
                                                        <NavLink to={"/dashboard/shops/" + item.uniqueId}><span className='input-group-text'><FontAwesomeIcon icon={faSearchPlus} /></span></NavLink>
                                                    </div>
                                                )
                                            }
                                        </div>
                                }
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="mr-auto">
                                        <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={() => { this.props.toggle(0) }}>Закрыть</button>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <button disabled={this.state.loading} onClick={this.sendData} class="btn btn-primary font-m auth-btn">
                                        {this.state.loading ? "Загрузка..." : "Сохранить"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default UserAdminModal

