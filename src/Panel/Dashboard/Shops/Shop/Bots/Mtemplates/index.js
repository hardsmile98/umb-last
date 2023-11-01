import React, { Component } from 'react'

import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import EmojiInput from '../../../../../EmojiInput'
import renderHTML from 'react-render-html'
import ModalConfirm from '../../../../../modalConfirm'


class Mtemplates extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                tTemplates: [],
                shoptTemplates: []
            },
            category: "page",
            datas: [],
            content: "",
            templateName: "",
            systemName: "startPage",
            variables: "",
            canRecovery: false,
            modal: false
        }
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
        this.changeCategory = this.changeCategory.bind(this)
        this.compile = this.compile.bind(this)
        this.getValueOfTemplate = this.getValueOfTemplate.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.toggle = this.toggle.bind(this)
        this.recovery = this.recovery.bind(this)

    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    recovery() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "tTemplates",
                    shop: this.props.match.params.shopId,
                    action: "recovery",
                    name: this.state.systemName
                },
                action: "shops"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.toggle()
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

    getValueOfTemplate(name) {
        let result = false,
            nameT = false,
            systemName = false,
            variables = "",
            canRecovery = false
        this.state.data.shoptTemplates.map(item => {
            if (item.name == name) {
                result = item.content
                nameT = item.label
                systemName = name
                canRecovery = true
            }
        })
        if (!result) {
            this.state.data.tTemplates.map(item => {
                if (item.name == name) {
                    result = item.content
                    nameT = item.label
                    systemName = name
                    canRecovery = false
                }
            })
        }

        this.state.data.tTemplates.map(item => {
            if (item.name == name) {
                variables = item.variables
            }
        })

        this.setState({
            content: result,
            templateName: nameT,
            systemName: systemName,
            variables: variables,
            canRecovery: canRecovery
        })
    }

    sendData() {
        if (this.state.content.length > 0) {
            this.setState({
                loading: true
            })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "bots",
                        subtype: "tTemplates",
                        shop: this.props.match.params.shopId,
                        action: "update",
                        name: this.state.systemName,
                        value: this.state.content
                    },
                    action: "shops"
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
        else {
            toast.error('Шаблон не может быть пустым')
        }
    }

    componentDidMount() {
        this.getData()
    }

    changeCategory(name) {
        this.setState({
            category: name
        }, () => {
            this.compile()
        })
    }

    compile() {
        let datas = []
        this.state.data.tTemplates.map(item => {
            if (item.category == this.state.category) {
                datas.push(item)
            }
        })
        this.state.data.shoptTemplates.map(item => {
            if (item.name == datas[0].name) {
                datas[0].content = item.content
                datas[0].canRecovery = true
            }
        })
        this.setState({
            datas: datas,
            content: datas[0].content,
            templateName: datas[0].label,
            name: datas[0].name,
            systemName: datas[0].name,
            variables: datas[0].variables,
            canRecovery: datas[0].canRecovery ? datas[0].canRecovery : false
        })
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "tTemplates",
                    shop: this.props.match.params.shopId,
                    action: "get"
                },
                action: "shops"
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
                    }, () => {
                        this.compile()
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
    render() {
        return (
            <>
                <div class={"block animate__animated animate__fadeIn no-margin " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3 className="font-m">{global.getLocales('Шаблоны сообщений')}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div class={"xtabs template xtabs_bottom animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}
                >
                    <div class="xtabs__body">
                        <a className={"xtabs__item font-m " + (this.state.category == "page" ? "active" : "")} onClick={() => { this.changeCategory("page") }}>
                            <span>{global.getLocales('Общие')}</span>
                        </a>
                        <a className={"xtabs__item font-m " + (this.state.category == "shop" ? "active" : "")} onClick={() => { this.changeCategory("shop") }}>
                            <span>{global.getLocales('Магазин')}</span>
                        </a>
                        <a className={"xtabs__item font-m " + (this.state.category == "support" ? "active" : "")} onClick={() => { this.changeCategory("support") }}>
                            <span>{global.getLocales('Поддержка')}</span>
                        </a>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-lg-8 bigzindex'>
                        <div class={"block animate__animated animate__fadeIn margin-block-top " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <h3 className="font-m">{global.getLocales('Шаблон')}: {this.state.templateName} {this.state.canRecovery ? <span className='right'><a onClick={this.toggle}>{global.getLocales('Восстановить шаблон')}</a></span> : ''}</h3>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <EmojiInput type="textarea" value={this.state.content} placeholder={global.getLocales("Введите содержание страницы")} name="content" handleChange={this.handleChange} />
                                        <br />
                                    </div>
                                    <div className='col-lg-10'>
                                        <div className='avatar-block notice-chat no-margin'>
                                            <h3 className="font-m">{global.getLocales("Переменные")}:</h3>
                                            {
                                                renderHTML(this.state.variables)
                                            }
                                        </div>
                                    </div>
                                    <div className='col-lg-2 text-right'>
                                        <button disabled={this.state.loading} className='btn btn-primary list font-m' onClick={this.sendData}>{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Сохранить")}</>}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div class={"block animate__animated animate__fadeIn margin-block-top " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                {
                                    this.state.datas.map(item =>
                                        <button onClick={() => { this.getValueOfTemplate(item.name) }} className='btn btn-secondary auth-btn list font-m'>{item.label}</button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <ModalConfirm action={global.getLocales("Вы действительно хотите восстановить данный шаблон?")} modal={this.state.modal} toggle={this.toggle} loading={this.state.loading} sendData={this.recovery} />
                </div>
            </>
        )
    }
}

export default Mtemplates