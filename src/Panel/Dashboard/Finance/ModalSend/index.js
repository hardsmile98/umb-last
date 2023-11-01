import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'

import global from '../../../Global/index'


class ModalSend extends Component {

    render() {
        return (
            <div>
                <Modal size="lg" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{global.getLocales("Вывод средств")}</h4>
                    </div>
                    <ModalBody>
                        <div className="row">
                            <div className='col-lg-12'>
                            <div class="alert alert-secondary font-m" role="alert">
                                 {global.getLocales("Комиссия сети влияет на скорость подверждения транзакции, чем выше комиссия - тем быстрее подтвердится Ваш вывод.")}
                                    <div className='row margin-15'>
                                        <div className='col-lg-12 text-center'>
                                            <b>{global.getLocales("Рекомендуемые комиссии")}</b>
                                        </div>
                                        <div className='col-lg-6 text-center'>
                                        <b>~ 30 {global.getLocales("минут")}<br/>
                                            {this.props.courses['fee30min']} sat/vByte</b>
                                        </div>
                                        <div className='col-lg-6 text-center'>
                                        <b>~ 60 {global.getLocales("минут")}<br/>
                                            {this.props.courses['fee60min']} sat/vByte</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Кошелек")}</label>
                                    <input disabled autocomplete="off" value={this.props.wallet} class="form-control" />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Сумма к списанию")}</label>
                                    <div class="input-group">
                                        <input value={this.props.type == "ALL" ? this.props.sum : (+this.props.sum + (this.props.fee * this.props.satoshi))} disabled type="number" class="form-control" placeholder="Введите сумму" />
                                        <span class="input-group-text">BTC</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Комиссия сети")} {this.props.satoshi} sat/vByte</label>
                                    <input type="range" name="satoshi" onChange={this.props.handleChange} min={+this.props.courses['fee60min']} max="256" step="1" value={this.props.satoshi} className="form-control-range" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Комиссия сети в BTC")}</label>
                                    <div class="input-group">
                                        <input value={(this.props.fee * this.props.satoshi).toFixed(8)} disabled type="number" class="form-control" placeholder="Введите сумму" />
                                        <span class="input-group-text">BTC</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div class="form-group">
                                    <label class="form-control-label font-m">{global.getLocales("Сумма к получению")}</label>
                                    <div class="input-group">
                                        <input value={this.props.type == "ALL" ? (this.props.sum - (this.props.fee * this.props.satoshi)).toFixed(8) : this.props.sum.toFixed(8)} disabled type="number" class="form-control" placeholder="Введите сумму" />
                                        <span class="input-group-text">BTC</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                    <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales("Закрыть")}</button>
                                </div>
                                <div className="col-lg-2">
                                </div>
                                <div className='col-lg-6'>
                                    <button onClick={this.props.send} disabled={this.props.loading} value="Отправить" class="btn btn-primary font-m auth-btn">{this.props.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Отправить")}</>}</button>
                                </div>
                            </div>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ModalSend

