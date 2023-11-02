import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'

import global from '../../../../../Global/index'


class FaqModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            content: "",
            id: 0,
            name: "",
            flag: "",
            indexNum: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.sendData = this.sendData.bind(this)
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.new != nextProps.new) {
            this.setState({
                content: nextProps.new.content,
                id: nextProps.new.id,
                flag: nextProps.new.flag,
                name: nextProps.new.name,
                indexNum: nextProps.new.indexNum,

            })
        }
    }


    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    sendData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "inform",
                    type: "faqUpdate",
                    id: this.state.id,
                    content: this.state.content,
                    name: this.state.name,
                    indexNum: this.state.indexNum,
                    flag: this.state.flag
                },
                action: "admin"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.props.toggle(0)
                    this.props.getData()
                }
                else {
                    this.setState({
                        loading: false
                    })
                    toast.error(response.data.message)
                }
            }
            else {
                toast.error("Сервер недоступен")
            }
        })
    }


    render() {
        return (
            <div>
                <Modal size="lg" isOpen={this.props.modal} toggle={() => { this.props.toggle(0) }}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">Статья #{this.props.new.id}</h4>
                    </div>
                    <ModalBody>
                        <div className="row">
                            <div className="col-lg-12">
                            <div class="form-group">
                                    <label class="form-control-label font-m">Название</label>
                                    <input className='form-control' value={this.state.name} placeholder="Введите название" name="name" onChange={this.handleChange} />
                                </div>
                                <div class="form-group">
                                    <label class="form-control-label font-m">FLAG</label>
                                    <input className='form-control' value={this.state.flag} placeholder="Введите FLAG" name="flag" onChange={this.handleChange} />
                                </div>
                                <div class="form-group">
                                    <label class="form-control-label font-m">Порядковый номер</label>
                                    <input className='form-control' value={this.state.indexNum} placeholder="Введите порядковый номер" name="indexNum" onChange={this.handleChange} />
                                </div>
                                <div class="form-group">
                                    <label class="form-control-label font-m">Содержание статьи (HTML поддерживается)</label>
                                    <textarea className='form-control' value={this.state.content} placeholder="Введите содержание статьи" name="content" onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="mr-auto">
                                        <button value="Закрыть" class="btn btn-secondary font-m auth-btn" onClick={() => { this.props.toggle(0) }}>Закрыть</button>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <button disabled={this.state.loading} onClick={this.sendData} class="btn btn-primary font-m auth-btn">
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

export default FaqModal

