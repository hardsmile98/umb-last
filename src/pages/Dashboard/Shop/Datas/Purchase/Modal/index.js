import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import global from '../../../../../../Global/index'


class SetAsNoffoundModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            record: 0,
            fine: 0,
            fineInd: 0,
            loading: false,
        }
        this.handleChange = this.handleChange.bind(this)
        this.sendData = this.sendData.bind(this)
    }

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name


        this.setState({
            [name]: value
        })
    }

    sendData() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "datas",
                    subtype: "purchases",
                    shop: this.props.shop,
                    action: "setNotFound",
                    id: this.props.purchase,
                    record: this.state.record,
                    fine: this.state.fine,
                    fineInd: this.state.fineInd
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
                    this.props.getData()
                    this.props.toggle()
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
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{global.getLocales('Опции для ненахода')}</h4>
                    </div>
                    <ModalBody>
                        <div class="form-group">
                            <label class="form-control-label font-m">{global.getLocales('Учитывать покупку в общем обороте')}</label>
                            <select disabled={this.state.loading} value={this.state.record} onChange={this.handleChange} name="record" class="form-control">
                                <option value="0">{global.getLocales('Нет')}</option>
                                <option value="1">{global.getLocales('Да')}</option>
                            </select>
                        </div>
                        {
                            !this.props.ownerAdd
                                ?
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Оштрафовать курьера')}</label>
                                    <select disabled={this.state.loading} value={this.state.fine} onChange={this.handleChange} name="fine" class="form-control">
                                        <option value="0">{global.getLocales('Нет')}</option>
                                        <option value="1">{global.getLocales('Да')}</option>
                                        <option value="2">{global.getLocales('Да, но по отдельному тарифу')}</option>
                                    </select>
                                </div>
                                :
                                ''
                        }
                        {
                            this.state.fine == 2
                                ?
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales('Штраф для курьера')}</label>
                                    <div class="input-group">
                                        <input disabled={this.state.loading} value={this.state.fineInd} name="fineInd" onChange={this.handleChange} class="form-control" />
                                        <span class="input-group-text">{this.props.currency}</span>
                                    </div>
                                </div>
                                :
                                ''
                        }
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                    <button value={global.getLocales('Закрыть')} class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales('Закрыть')}</button>
                                </div>
                                <div className="col-lg-8">
                                    <button value="Отметить" onClick={this.sendData} disabled={this.props.loading} class="btn btn-primary font-m auth-btn">
                                        {this.props.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales('Отметить')}</>}
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

export default SetAsNoffoundModal
