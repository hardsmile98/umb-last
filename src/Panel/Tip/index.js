import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'


class ModalConfirm extends Component {
    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">Подсказка</h4>
                    </div>
                    <ModalBody>
                        
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                <button value="Закрыть" class="btn btn-secondary font-g auth-btn" onClick={this.props.toggle}>Закрыть</button>
                                </div>
                                <div className="col-lg-8">
                                <button disabled={this.props.loading} onClick={this.props.sendData} value="Подтвердить" class="btn font-g auth-btn btn-primary">
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

export default ModalConfirm

