import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'
import { NavLink } from 'react-router-dom'

import global from '../../../Global/index'


class ShopNotifyModal extends Component {
    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{global.getLocales('Уведомление')}</h4>
                    </div>
                    <ModalBody>
                        <div className='avatar-block font-m no-margin text-center'>
                            {global.getLocales('У вас не создано ни одного магазина')}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <NavLink to="/dashboard/shops/new">
                            <button class="btn btn-primary font-m auth-btn">
                            {global.getLocales('Создать магазин')}
                            </button>
                        </NavLink>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ShopNotifyModal