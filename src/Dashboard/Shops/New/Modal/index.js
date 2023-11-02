import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
import global from '../../../../Global/index'


class CreateShopModal extends Component {


    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{global.getLocales('Подтверждение')}</h4>
                    </div>
                    <ModalBody>
                        <div className='avatar-block font-m'>
                            <div className='row'>
                                <div className='col-lg-3 confirm-terms'>
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                </div>
                                <div className='col-lg-9'>
                                    {global.getLocales('Нажимая кнопку')}, <b>{global.getLocales('принять')}</b>, {global.getLocales('Вы автоматически соглашаетесь с')} <NavLink to="/dashboard/support/faq/terms">{global.getLocales('пользовательскимсоглашением')}</NavLink>.
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                    <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{global.getLocales('Закрыть')}</button>
                                </div>
                                <div className="col-lg-8">
                                    <button value={global.getLocales('Принять')} onClick={this.props.sendData} disabled={this.props.loading} class="btn btn-primary font-m auth-btn">
                                        {this.props.loading ? <>{global.getLocales('Загрузка...')}</> : <>{global.getLocales('Принять')}</>}
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

export default CreateShopModal

