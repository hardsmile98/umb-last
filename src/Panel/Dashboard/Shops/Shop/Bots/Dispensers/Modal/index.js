import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import global from '../../../../../../Global/index'
import moment from 'moment'

class DispanserModal extends Component {

    render() {
        return (
            <div>
                <Modal size="lg" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{this.props.action == "create" ? global.getLocales('Создание бота распределителя') : global.getLocales('Изменение бота распределителя')}</h4>
                    </div>
                    <ModalBody>
                                                        <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Имя')}</label>
                                        <input className="form-control" disabled={this.props.loading} value={this.props.name} onChange={this.props.handleChange} placeholder={global.getLocales("Введите имя бота")} name="name"/>
                                    </div>
                                                                                            <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Юзернейм')}</label>
                                        <div className="input-group">
                                        <span class="input-group-text">@</span>
                                                                                <input disabled={this.props.loading} className="form-control" value={this.props.username} onChange={this.props.handleChange} placeholder={global.getLocales("Введите юзернейм бота")} name="username"/>
                                        </div>
                                                                            <small>{global.getLocales('Юзернейм - уникальный идентификатор профиля в ТГ')}</small>

                                    </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                <button value={global.getLocales('Закрыть')} disabled={this.props.loading} class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales('Закрыть')}</button>
                                </div>
                                                                <div className="col-lg-8">
                                <button class="btn btn-primary font-m auth-btn" disabled={this.props.loading} onClick={this.props.sendData}>{this.props.loading ? global.getLocales('Загрузка...') : (this.props.action == "create" ? (global.getLocales('Приобрести за ') + this.props.price + "$") : global.getLocales('Сохранить'))}</button>
                                </div>
                            </div>
                        </div>

                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default DispanserModal

