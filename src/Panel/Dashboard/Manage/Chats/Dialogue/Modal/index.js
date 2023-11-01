import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'
import { NavLink } from 'react-router-dom'



class ModalOrderInfo extends Component {
    render() {
        return (
            <div>
                <Modal size="lg" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">Информация о заказе</h4>
                    </div>
                    <ModalBody>
                        <div className='avatar-block notice-chat'>
                            <h4 className="font-m">Информация о заказе в магазине</h4>
                            {
                                JSON.stringify(this.props.order.purchase).toString()
                            }
                        </div>
                        <div className='avatar-block notice-chat'>
                            <h4 className="font-m">Информация о платеже</h4>
                            <b>ID</b>: {this.props.order.deposit.id}<br />
                            <b>Способ оплаты</b>: {this.props.order.deposit.type}<br />
                            <b>Куда оплатить</b>: {this.props.order.deposit.walletPay}<br />
                            <b>Сумма оплаты</b>: {this.props.order.deposit.sumPay}<br />
                            <b>Обменник ID</b>: {this.props.order.deposit.exId}<br />
                            <b>TXID</b>: {this.props.order.deposit.txid}<br />
                            <b>Статус</b>: {this.props.order.deposit.status == -1 ? "Отменен" : (this.props.order.deposit.status == 0 ? "Ожидает оплаты" : (this.props.order.deposit.status == 1 ? "Ожидает подтверждений" : "Оплачен"))}<br />
                            <b>Дата</b>: {this.props.order.deposit.status == 2 ? moment.unix(this.props.order.deposit.closed / 1000).format("LLL") : moment.unix(this.props.order.deposit.created / 1000).format("LLL")}



                        </div>
                        {
                            this.props.order.deposit.status == 2
                                ?
                                ''
                                :
                                <>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">Пароль</label>
                                        <input name="password" onChange={this.props.handleChange} value={this.props.password} class="form-control" />
                                    </div>
                                    <button onClick={() => {this.props.setPayedOrder(this.props.order.deposit.id)}} class="btn btn-primary font-m auth-btn">
                                        Отметить оплаченным

                                    </button>
                                </>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <button onClick={this.props.toggle} class="btn btn-secondary font-m auth-btn">
                            Закрыть

                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ModalOrderInfo

