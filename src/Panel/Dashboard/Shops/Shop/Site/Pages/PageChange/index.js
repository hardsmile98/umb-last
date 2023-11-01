import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import 'react-quill/dist/quill.bubble.css';


import ReactQuill from 'react-quill';
import { NavLink } from 'react-router-dom'
import { useHistory } from "react-router-dom";




class PageChange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            name: "",
            path: "",
            indexPage: "",
            type: "text",
            content: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.changeContent = this.changeContent.bind(this)
        this.update = this.update.bind(this)
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "site",
                    subtype: "pages",
                    shop: this.props.match.params.shopId,
                    action: "getPage",
                    id: this.props.match.params.pageId
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
                        this.setState({
                            name: response.data.data.page.name,
                            type: response.data.data.page.type,
                            indexPage: response.data.data.page.indexPage,
                            path: response.data.data.page.path,
                            content: response.data.data.page.content
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

    update() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "site",
                    subtype: "pages",
                    shop: this.props.match.params.shopId,
                    action: "update",
                    name: this.state.name,
                    typePage: this.state.type,
                    indexPage: this.state.indexPage,
                    path: this.state.path,
                    content: this.state.content,
                    id: this.props.match.params.pageId
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
                    this.props.history.push('/dashboard/shops/' + this.props.match.params.shopId + "/site/pages")
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

        if(name == "type") {
            this.setState({
                content: "",
                [name]: value
            })
        }
        this.setState({
            [name]: value
        })
    }

    changeContent(v) {
        this.setState({
            content: v
        })
    }



    render() {
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales("Обновление страницы")}</h3>
                            <div className='row'>
                                <div className='col-lg-3'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Название")}</label>
                                        <input onChange={this.handleChange} value={this.state.name} type="text" autoComplete="off" class="form-control" placeholder={global.getLocales("Введите название")} name="name" />
                                    </div>
                                </div>
                                <div className='col-lg-3'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Тип страницы")}</label>
                                        <select onChange={this.handleChange} name="type" value={this.state.type} class="form-control">
                                            <option value="text">{global.getLocales("Информационная страница")}</option>
                                            <option value="link">{global.getLocales("Страница-ссылка")}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='col-lg-3'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales("Порядковый номер")}</label>
                                        <input type="number" onChange={this.handleChange} value={this.state.indexPage} autoComplete="off" class="form-control" placeholder={global.getLocales("Введите порядковый номер")} name="indexPage" />
                                    </div>
                                </div>
                                {
                                    this.state.type == "text"
                                        ?
                                        <div className='col-lg-3'>
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales("Путь")}</label>
                                                <div class="input-group">
                                                    <span class="input-group-text font-m">/</span>
                                                    <input type="text" onChange={this.handleChange} value={this.state.path} autoComplete="off" class="form-control" placeholder="page" name="path" />
                                                </div>
                                                <small>{global.getLocales("Путь, по которому будет доступна страница")}</small>
                                            </div>
                                        </div>
                                        :
                                        <div className='col-lg-3'>
                                            <div class="form-group">
                                                <label class="form-control-label font-m">{global.getLocales("Ссылка")}</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.content} autoComplete="off" class="form-control" placeholder={global.getLocales("Вставьте ссылку")} name="content" />
                                            </div>
                                        </div>
                                }
                                {
                                    this.state.type == "text"
                                        ?
                                        <div className='col-lg-12'>
                                            <div className="form-group">
                                                <label class="form-control-label font-m">{global.getLocales("Содержание страницы")}</label>
                                                <div className='avatar-block no-margin'>
                                                    <ReactQuill modules={{
                                                        toolbar: [
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            ['blockquote', 'code-block'],

                                                            [{ 'header': 1 }, { 'header': 2 }],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            [{ 'script': 'sub' }, { 'script': 'super' }],
                                                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                            [{ "direction": "rtl" }],

                                                            [{ 'size': ['small', false, 'large', 'huge'] }],
                                                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                                            ['link', 'image', 'video'],

                                                            [{ 'color': [] }, { 'background': [] }],
                                                            [{ 'font': [] }],
                                                            [{ 'align': [] }],

                                                            ['clean']
                                                        ]
                                                    }} theme="bubble" value={this.state.content} onChange={this.changeContent} />

                                                </div>
																									                                             <small class="font-m">Для кастомизации контента выделите требуемый текст.</small>

                                            </div>
                                        </div>
                                        :
                                        ''
                                }
                                <div className='col-lg-12'>
                                <NavLink to={"/dashboard/shops/" + this.props.match.params.shopId + "/site/pages"}><button className='btn btn-secondary left font-m'>{global.getLocales("Назад")}</button></NavLink>
                                <div className='mr-auto right'>
                                <button className='btn btn-primary left font-m' onClick={this.update}>{global.getLocales("Обновить")}</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageChange
