import React, { Component, useState } from 'react'
import Picker from 'emoji-picker-react'


import ReactDOMServer from 'react-dom/server'


import renderEmoji from 'react-easy-emoji'


import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import EmojiInput from '../../../../../EmojiInput'
import PageEdit from './Modal'
import ModalConfirm from '../../../../../modalConfirm'

let links = []


class BotPages extends Component {
    constructor(props) {
        super(props)
        this.contentEditable = React.createRef()
        this.state = {
            loading: true,
            emoji: "",
            name: "",
            width: 1,
            data: {
                pages: []
            },
            indexPage: 0,
            content: "",
            type: "content",
            links: [],
            modal: false,
            activePage: {},
            pageDelete: 0,
            modalDelete: false,
            keyboard: [[{}]]
        }
        this.onEmojiClick = this.onEmojiClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getData = this.getData.bind(this)
        this.sendData = this.sendData.bind(this)
        this.deleteSubcategory = this.deleteSubcategory.bind(this)
        this.addSubcategory = this.addSubcategory.bind(this)
        this.toggle = this.toggle.bind(this)
        this.delete = this.delete.bind(this)
        this.toggleDelete = this.toggleDelete.bind(this)
        this.sortPages = this.sortPages.bind(this)
    }

    toggleDelete(id) {
        this.setState({
            pageDelete: id,
            modalDelete: !this.state.modalDelete
        })
    }

    delete() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "pages",
                    shop: this.props.match.params.shopId,
                    action: "delete",
                    id: this.state.pageDelete
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
                    this.toggleDelete(0)
                    this.getData()
                    toast.success(response.data.message)
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

    toggle(id) {
        if(id) {
            this.state.data.pages.map(item => {
                if(item.id == id) {
                    this.setState({
                        activePage: item,
                        modal: !this.state.modal
                    })
                }
            })
        }
        else {
            this.setState({
                modal: !this.state.modal
            })
        }
    }

    deleteSubcategory(id) {
        links.splice(id, 1)
        this.setState({
            links: links
        })
    }

    addSubcategory() {
        links.push({
            link: "",
            value: ""
        })
        this.setState({
            links: links
        }, () => {
            window.scrollTo(0, document.body.scrollHeight);

        })
    }

    componentDidMount() {
        this.getData()
    }

    componentWillUnmount() {
        links = []
    }


    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name


        if (name == "link" || name == "value") {
            links[e.target.id][name] = value
            this.setState({
                links: links
            })
        }
        else {
            this.setState({
                [name]: value
            })
        }

    }

    onEmojiClick(event, emojiObject) {
        this.setState({
            name: this.state.name + ReactDOMServer.renderToString(renderEmoji(emojiObject.emoji))
        })
    }

    sendData() {
        if (this.state.name.length >= 1 && this.state.content.length >= 1) {
            this.setState({
                loading: true
            })
            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "bots",
                        subtype: "pages",
                        shop: this.props.match.params.shopId,
                        action: "create",
                        name: this.state.name,
                        width: this.state.width,
                        indexPage: this.state.indexPage,
                        content: this.state.content,
                        links: this.state.links,
                        pageType: this.state.type
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
                            name: "",
                            width: 1,
                            indexPage: 0,
                            content: "",
                            links: [],
                            type: "content"
                        })
                        links = []
                        this.getData()
                        toast.success(response.data.message)
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
            toast.error("Заполнены не все поля")
        }
    }


    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "bots",
                    subtype: "pages",
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
                        data: response.data.data
                    }, () => {
                        this.sortPages(get => {
                            this.setState({
                                loading: false
                            })
                        })
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
    
    sortPages(callback) {
            let keyboard = [],
    line = []
        this.state.data.pages.map((page, index) => {
                 if(page.width == 1) {
        if(line.length == 0) {
            line.push(page)
            keyboard.push(line)
            line = []
        }
        else {
          keyboard.push(line)
          line = []
            line.push(page)
            keyboard.push(line)
            line = []
        }
      }
      else {
        if(line.length == 1) {
            line.push(page)
            keyboard.push(line)
            line = []
        }
        else {
            line.push(page)
            if(this.state.data.pages.length == (+index + 1)) {
              keyboard.push(line)
            }
        }
      }
        })
        
        this.setState({
            keyboard: keyboard
        }, () => {
            callback('ok')
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-5" style={{ zIndex: "100" }}>
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h3 className="font-m">{global.getLocales('Добавление страницы')}</h3>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales('Название')}</label>
                                        <EmojiInput value={this.state.name} placeholder={global.getLocales("Введите название страницы")} name="name" handleChange={this.handleChange} />
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Ширина кнопки")}</label>
                                        <select disabled={this.state.loading} value={this.state.width} onChange={this.handleChange} name="width" class="form-control">
                                            <option value="1">{global.getLocales("Полная ширина экрана")}</option>
                                            <option value="2">{global.getLocales("Половина ширины экрана")}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='col-lg-6'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Порядковый номер")}</label>
                                        <input type="number" disabled={this.state.loading} value={this.state.indexPage} onChange={this.handleChange} name="indexPage" class="form-control" />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Тип страницы")}</label>
                                        <select disabled={this.state.loading} value={this.state.type} onChange={this.handleChange} name="type" class="form-control">
                                            <option value="content">{global.getLocales("Страница с текстом")}</option>
                                            <option value="link">{global.getLocales("Страница-ссылка")}</option>
                                        </select>
                                    </div>
                                    {
                                        this.state.type == "content"
                                            ?
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales("Содержание страницы")}</label>
                                                <EmojiInput type="textarea" value={this.state.content} placeholder={global.getLocales("Введите содержание страницы")} name="content" handleChange={this.handleChange} />
                                            </div>
                                            :
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales("Ссылка")}</label>
                                                <input placeholder={global.getLocales("Вставьте ссылку")} type="text" disabled={this.state.loading} value={this.state.content} onChange={this.handleChange} name="content" class="form-control" />
                                            </div>
                                    }
                                </div>
                                {
                                    this.state.type == "content"
                                        ?
                                        <div className='col-lg-12'>
                                            <label class="form-control-label font-m">{global.getLocales("Ссылки под страницей")}</label>
                                            <div className="avatar-block">
                                                {
                                                    this.state.links.length <= 0
                                                        ?
                                                        <div className='text-center'>
                                                            <span className='font-m'>{global.getLocales("Ссылки отсутствуют")}</span>
                                                        </div>
                                                        :
                                                        ''
                                                }
                                                {
                                                    this.state.links.map((item, key) =>
                                                        <div className="avatar-block">
                                                            <div className='row'>

                                                                <div className='col-lg-12'>
                                                                    <div class="form-group">
                                                                        <label class="form-control-label font-m">{global.getLocales("Название ссылки")}</label>
                                                                        <EmojiInput value={this.state.links[key].link} placeholder={global.getLocales("Введите название ссылки")} name="link" handleChange={this.handleChange} id={key} />
                                                                    </div>
                                                                </div>
                                                                <div className='col-lg-12'>
                                                                    <div class="form-group">
                                                                        <label class="form-control-label font-m">{global.getLocales("Ссылка")}</label>
                                                                        <input disabled={this.state.loading} value={this.state.links[key].value} autocomplete="off" onChange={this.handleChange} type="text" placeholder={global.getLocales("Вставьте ссылку")} name="value" id={key} class="form-control" />
                                                                    </div>
                                                                    <button onClick={() => { this.deleteSubcategory(key) }} disabled={this.state.loading} class="btn btn-danger font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Удалить")}</>}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <button onClick={this.addSubcategory} disabled={this.state.loading} class="btn btn-secondary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Добавить")}</>}</button>
                                            </div>
                                        </div>
                                        :
                                        ''
                                }
                                <div className='col-lg-12'>
                                    <button onClick={this.sendData} disabled={this.state.loading} class="btn btn-primary font-m auth-btn margin-15">{this.state.loading ? <>{global.getLocales("Загрузка...")}</> : <>{global.getLocales("Создать страницу")}</>}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                        <div class="block-body">
                            <div className="row">
                                <div className="col-lg-12">
                                    <h3 className="font-m">{global.getLocales("Страницы")}</h3>
                                    <br />
                                    <div className="row">
                                        {
                                            this.state.keyboard.map((item, i) =>
                                            <>
                                            {
                                                item.length > 1
                                                ?
                                                <>
                                                {
                                                item.map(item => 
                                                                                                                                                <div className="col-lg-6">
                                                    <div onClick={() => {this.toggle(item.id)}} className="page-block font-m cursor-pointer">
                                                        <h3>{item.name}</h3>
                                                    </div>
                                                </div>
                                                )
                                            }
                                                </>
                                                :
                                                <>
                                                {
                                                item.map(item => 
                                                                                                                                                <div className="col-lg-12">
                                                    <div onClick={() => {this.toggle(item.id)}} className="page-block font-m cursor-pointer">
                                                        <h3>{item.name}</h3>
                                                    </div>
                                                </div>
                                                )
                                                }
                                                </>
                                            }
                                            </>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <PageEdit toggleDelete={this.toggleDelete} getData={this.getData} {...this.props} page={this.state.activePage} modal={this.state.modal} toggle={this.toggle}/>
                <ModalConfirm action={global.getLocales("Вы действительно хотите удалить данную страницу?")} consequences={global.getLocales("Содеражние, ссылки - будут безвозвратно удалены.")} modal={this.state.modalDelete} toggle={this.toggleDelete} loading={this.state.loading} sendData={this.delete} />
            </div>
        )
    }
}

export default BotPages