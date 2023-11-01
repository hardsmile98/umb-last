import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'


class ModalSecretConfirm extends Component {
    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">Подтверждение действия</h4>
                    </div>
                    <ModalBody>
                    <div class="form-group">
                        <label class="form-control-label font-m">Секретная фраза аккаунта</label>
                        <input disabled={this.props.loading} autocomplete="off" type="password" onChange={this.props.handleChange} name="secret" placeholder="Введите секретную фразу" class="form-control" />
                    </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>Закрыть</button>
                                </div>
                                <div className="col-lg-8">
                                <button disabled={this.props.loading} onClick={this.props.sendData} value="Подтвердить" class="btn font-m auth-btn btn-primary">
                            {this.props.loading ? "Загрузка..." : "Подтвердить"}
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

export default ModalSecretConfirm

