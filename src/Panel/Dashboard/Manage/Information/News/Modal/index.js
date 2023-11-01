import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'

import global from '../../../../../Global/index'


class NewsModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            content: "",
            id: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.sendData = this.sendData.bind(this)
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.new != nextProps.new) {
            this.setState({
                content: nextProps.new.content,
                id: nextProps.new.id,
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
                    type: "newsUpdate",
                    id: this.state.id,
                    content: this.state.content
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
                        <h4 className="modal-title font-m">Новость #{this.props.new.id}</h4>
                    </div>
                    <ModalBody>
                        <div className="row">
                            <div className="col-lg-12">
                                <div class="form-group">
                                    <label class="form-control-label font-m">Содержание новость (HTML поддерживается)</label>
                                    <textarea className='form-control' value={this.state.content} placeholder="Введите содержание страницы" name="content" onChange={this.handleChange} />
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

export default NewsModal

