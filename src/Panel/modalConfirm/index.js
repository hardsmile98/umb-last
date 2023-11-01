import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import global from '../Global/index'


class ModalConfirm extends Component {
    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{global.getLocales('Подтверждение действия')}</h4>
                    </div>
                    <ModalBody>
                        <p className="avatar-block font-m">{this.props.action} {this.props.consequences ? <><br /><br /><span className="text-danger">{this.props.consequences}</span></> : ''}</p>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                <button value={global.getLocales('Закрыть')} class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales('Закрыть')}</button>
                                </div>
                                <div className="col-lg-8">
                                <button disabled={this.props.loading} onClick={this.props.sendData} value={global.getLocales('Подтвердить')} class="btn font-m auth-btn btn-primary">
                            {this.props.loading ? <>{global.getLocales('Загрузка...')}</>  : <>{global.getLocales('Подтвердить')}</> }
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

