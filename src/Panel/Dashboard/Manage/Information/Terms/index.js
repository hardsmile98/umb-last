import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

class TermsAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            terms: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "inform",
                    type: "getTerms"
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
                    this.setState({
                        terms: response.data.data.terms,
                        loading: false
                    })
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

    sendData() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "inform",
                    type: "updateTerms",
                    value: this.state.terms
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
                    toast.success(response.data.message)
                    this.getData()
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

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })

    }

    render() {
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">Настроки пользовательского соглашения</h3>
                            <div className='avatar-block notice-chat'>
                                <FontAwesomeIcon icon={faInfoCircle} /> HTML поддерживается.
                            </div>
                            <div className="form-group message-area">
                                <label for="terms" className="font-m">Пользовательское соглашение</label>
                                <textarea name="terms" value={this.state.terms} onChange={this.handleChange} className="form-control" placeholder="Введите соглашение" />
                            </div>
                            <button className='btn btn-primary font-m right' onClick={this.sendData}>Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TermsAdmin