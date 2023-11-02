import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'


class FinanceModal extends Component {

    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">Финансовая операция #{this.props.operation.id}</h4>
                    </div>
                    <ModalBody>
                        <div className="row">
                            <div className="col-lg-12">
                                <div class="form-group">
                                    <label class="form-control-label font-m">Операция</label>
                                    <input disabled autocomplete="off" value={this.props.operation.name} class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label class="form-control-label font-m">Дата создания</label>
                                    <input disabled autocomplete="off" value={moment.unix(this.props.operation.created / 1000).format("LLL")} class="form-control" />
                                </div>
                                          <div class="form-group">
                                    <label class="form-control-label font-m">Кошелек</label>
                                    <input disabled autocomplete="off" value={this.props.operation.wallet} class="form-control" />
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div class="form-group">
                                    <label class="form-control-label font-m">Сумма</label>
                                    <div class="input-group">
                                        <input value={this.props.operation.sum} disabled type="number" class="form-control" placeholder="Введите сумму" />
                                        <span class="input-group-text">BTC</span>
                                    </div>
                                </div>

                            </div>
                            <div class="form-group">
                                <label class="form-control-label font-m">Статус</label>
                                <input disabled autocomplete="off" value={this.props.operation.status == 1 ? "Завершена" : (this.props.operation.status == -1 ? "Отменена" : "Ожидает подтверждений")} class="form-control" />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-12">
                                        <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>Закрыть</button>
                                </div>
                            </div>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default FinanceModal

