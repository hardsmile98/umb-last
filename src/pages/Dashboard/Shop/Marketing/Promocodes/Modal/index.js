import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'

import global from '../../../../../../Global/index'
import { NavLink } from 'react-router-dom'


class PromocodeModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            value: "",
            fromDate: "",
            toDate: "",
            percent: "",
            sum: "",
            limitActive: 0,
            onlyone: 1,
            note: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.sendData = this.sendData.bind(this)
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
                    type: "settings",
                    subtype: "promocodes",
                    shop: this.props.match.params.shopId,
                    id: this.state.id,
                    percent: this.state.percent,
                    sum: this.state.sum,
                    fromDate: +new Date(this.state.fromDate),
                    toDate: +new Date(this.state.toDate),
                    limitActive: this.state.limitActive,
                    onlyone: this.state.onlyone,
                    note: this.state.note,
                    action: "update"
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
                        loading: false,
                        value: "",
                        fromDate: "",
                        toDate: "",
                        percent: "",
                        sum: "",
                        limitActive: 0,
                        onlyone: 1,
                        note: ""
                    })
                    toast.success(response.data.message)
                    this.props.toggle()
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


    componentWillReceiveProps(nextProps) {
        if (this.props.promocode != nextProps.promocode) {
            this.setState({
                value: nextProps.promocode.value,
                fromDate: moment.unix(nextProps.promocode.fromDate/1000).format('YYYY-MM-DD'),
                toDate: moment.unix(nextProps.promocode.toDate/1000).format('YYYY-MM-DD'),
                percent: nextProps.promocode.percent,
                sum: nextProps.promocode.sum,
                limitActive: nextProps.promocode.limitActive,
                onlyone: nextProps.promocode.onlyone,
                note: nextProps.promocode.note,
                status: nextProps.promocode.status,
                id: nextProps.promocode.id
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


    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{global.getLocales("Промокод")} #{this.state.id}</h4>
                    </div>
                    <ModalBody>
                    <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales("Промокод")}</label>
                                <input placeholder={global.getLocales("Введите промокод")} disabled value={this.state.value} onChange={this.handleChange} name="value" class="form-control" />
                            </div>
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Скидка в")} %</label>
                                        <div class="input-group">
                                            <input placeholder={global.getLocales("Введите процент скидки")} disabled={this.state.loading} value={this.state.percent} onChange={this.handleChange} name="percent" class="form-control" />
                                            <span class="input-group-text">%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Скидка в")} {this.props.currency}</label>
                                        <div class="input-group">
                                            <input placeholder={global.getLocales("Введите сумму скидки")} disabled={this.state.loading} value={this.state.sum} onChange={this.handleChange} name="sum" class="form-control" />
                                            <span class="input-group-text">{this.props.currency}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="font-m">{global.getLocales("Время действия промокода")}</h3>
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("От")}</label>
                                        <input type="date" placeholder={global.getLocales("Выберите дату действия от")} disabled={this.state.loading} value={this.state.fromDate} onChange={this.handleChange} name="fromDate" class="form-control" />
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("До")}</label>
                                        <input type="date" placeholder={global.getLocales("Выберите дату действия до")} disabled={this.state.loading} value={this.state.toDate} onChange={this.handleChange} name="toDate" class="form-control" />
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales("Максимальное кол-во активаций")}</label>
                                <input placeholder={global.getLocales("Введите максимальное кол-во активаций")} disabled={this.state.loading} value={this.state.limitActive} onChange={this.handleChange} name="limitActive" class="form-control" />
                                <small>{global.getLocales("Оставьте 0, если хотите сделать бесконечное кол-во активаций")}</small>
                            </div>
                            <div className='avatar-block no-margin'>
                                <div class="i-checks">
                                    <input name="onlyone" checked={this.state.onlyone} onClick={this.handleChange} id="oneone" type="checkbox" class="checkbox-template" />
                                    <label for="onlyone" className="checkbox-label font-m promocode">{global.getLocales("Единичная активация (1 пользователь = 1 активация)")}</label>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-control-label font-m">{global.getLocales("Заметка")}</label>
                                <input placeholder={global.getLocales("Введите заметку о промокоде")} disabled={this.state.loading} value={this.state.note} onChange={this.handleChange} name="note" class="form-control" />
                            </div>
                            <h4 className="modal-title font-m">{global.getLocales("История активаций")}</h4>
                            {
                                this.props.active.length > 0
                                ?
                                <>
                                {
                                    this.props.active.map(item =>
                                    <div class="form-group"><div class="input-group"><input disabled class="form-control" value={item.name}/><NavLink to={"/dashboard/shops/" + this.props.shopId  + "/datas/users/" + item.id}><span class="input-group-text">{global.getLocales("Перейти в профиль")}</span></NavLink></div></div>
                                    )
                                }
                                </>
                                :
                                <div className="text-center font-m">{global.getLocales("История отсутствует")}</div>
                            }
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="mr-auto">
                                        <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales("Закрыть")}</button>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <button disabled={this.state.loading} onClick={this.sendData} class="btn btn-primary font-m auth-btn">
                                        {this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Сохранить")}</>}
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

export default PromocodeModal

