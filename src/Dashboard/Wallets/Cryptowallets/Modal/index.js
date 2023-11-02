import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import global from '../../../../Global/index'
import { toast } from 'react-toastify'

class WalletModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            note: ""
        }
        this.sendData = this.sendData.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    sendData() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "crypto",
                    type: "edit",
                    id: this.props.wallet.id,
                    note: this.state.note
                },
                action: "wallets"
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
                        note: ""
                    })
                    toast.success(response.data.message)
                    this.props.loadData()
                    this.props.toggle()
                }
                else {
                    this.setState({
                        loading: false
                    })
                    toast.error(response.data.message)
                }
            }
            else {
                this.setState({
                    loading: false
                })
                toast.error("Сервер недоступен")
            }
        })
    }

    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header">
                    <h4 className="font-m">Кошелек #{this.props.wallet.id}</h4>
                    </div>
                    <ModalBody>
                        <div class="form-group">
                            <label class="form-control-label font-m">Тип</label>
                            <input disabled autocomplete="off" value={this.props.wallet.type.toUpperCase()} name="type" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">Кошелек</label>
                            <input disabled autocomplete="off" value={this.props.wallet.value} name="wallet" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">Дата добавления</label>
                            <input disabled autocomplete="off" name="created" value={moment.unix(this.props.wallet.created / 1000).format("LLL")} class="form-control" />
                        </div>
                        <div class="form-group">
                            <label class="form-control-label font-m">Заметка</label>
                            <input maxLength="50" disabled={this.state.loading} defaultValue={this.props.wallet.note} autocomplete="off" type="text" onChange={this.handleChange} name="note" placeholder="Введите примечание" class="form-control" />
                            <small>Максимальная длина заметки - 50 символов</small>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-4">
                                <button value="Закрыть" class="btn btn-secondary font-g auth-btn" onClick={this.props.toggle}>Закрыть</button>
                            </div>
                            <div className="col-lg-8">
                                <button disabled={this.state.loading} onClick={this.sendData} class="btn btn-primary font-g auth-btn">
                                    {this.state.loading ? "Загрузка..." : "Сохранить"}
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

export default WalletModal

