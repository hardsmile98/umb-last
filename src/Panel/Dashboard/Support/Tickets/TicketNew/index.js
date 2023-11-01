import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

import global from '../../../../Global/index'



class TicketNew extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                categories: {}
            },
            category: "none",
            theme: "",
            message: "",
            loading: true
        }
        this.getData = this.getData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.sendData = this.sendData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    sendData() {
        this.setState({
            loading: true
        })
        if (this.state.category !== "none") {
            if (this.state.theme.length <= 36 && this.state.theme.length > 0) {
                if (this.state.message.length <= 2048 && this.state.message.length > 0) {
                    let data = {
                        api: "user",
                        body: {
                            data: {
                                section: "tickets",
                                type: "create",
                                category: this.state.category,
                                theme: this.state.theme,
                                message: this.state.message
                            },
                            action: "support"
                        },
                        headers: {
                            'authorization': localStorage.getItem('token')
                        }
                    }

                    global.createRequest(data, response => {
                        if (response.status == 200) {
                            if (response.data.success) {
                                this.setState({
                                    loading: false
                                })
                                toast.success(response.data.message)
                                this.props.history.push("/dashboard/support/ticket/" + response.data.data.ticket);
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
                else {
                    this.setState({
                        loading: false
                    })
                    toast.error("Максимальная длина проблемы - 2048 символов")
                }
            }
            else {
                this.setState({
                    loading: false
                })
                toast.error("Максимальная длина темы - 36 символов")
            }
        }
        else {
            this.setState({
                loading: false
            })
            toast.error("Необходимо выбрать категорию обращения")
        }
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "tickets",
                    type: "ticketsData"
                },
                action: "support"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.setState({
                        data: response.data.data,
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

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        this.setState({
            [name]: value
        })
    }

    render() {
        return (
            <>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")} style={{ marginBottom: "15px" }}>
                    <div className="text-center">
                        Ни при каких условиях <span className="text-danger">не сообщайте</span> никому конфиденциальные данные Вашего аккаунта
                    </div>
                </div>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <div class="form-group">
                                    <label class="form-control-label font-m">Категория обращения</label>
                                    <select disabled={this.state.loading} onChange={this.handleChange} value={this.state.category} name="category" class="form-control">
                                        <option disabled value="none">Не выбрано</option>
                                        {
                                            Object.entries(this.state.data.categories).map(item =>
                                                <option value={item[1].name}>{item[1].title}</option>
                                            )
                                        }
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-control-label font-m">Тема</label>
                                    <input autoComplete="off" maxLength={36} disabled={this.state.loading} onChange={this.handleChange} value={this.state.theme} class="form-control" placeholder="Введите тему" name="theme" />
                                    <small>Максимальная длина темы - 36 символов</small>
                                </div>
                                <div class="form-group">
                                    <label class="form-control-label font-m">Описание проблемы</label>
                                    <textarea autoComplete="off" maxLength={2048} disabled={this.state.loading} onChange={this.handleChange} value={this.state.message} class="form-control support-textarea" placeholder="Введите проблему" name="message" />
                                    <small>Максимальная длина сообщения - 2048 символов</small>
                                </div>
                                <div className="row">
                                    <div className="col-lg-2">
                                        <NavLink to={`/dashboard/support/tickets`}>
                                            <button className="btn btn-secondary font-g auth-btn">
                                                Назад
                                    </button>
                                        </NavLink>
                                    </div>
                                    <div className="col-lg-6" />
                                    <div className="col-lg-4">
                                        <button onClick={this.sendData} disabled={this.state.loading} class="btn btn-primary right font-g auth-btn">{this.state.loading ? "Загрузка..." : "Создать обращение"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default TicketNew