import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import moment from 'moment'

import global from './../../../../Global/index'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import renderHTML from 'react-render-html'

let opened = []


class Faq extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                faq: [{
                    content: "das",
                    name: "sa"
                }]
            },
            opened: [],
            loading: true,
            search: "",
            display: []
        }
        this.getData = this.getData.bind(this)
        this.search = this.search.bind(this)
    }

    search(e) {
        let results = []
        this.setState({
            search: e.target.value.toLowerCase()
        }, () => {
            for (let i = 0; i < this.state.data.faq.length; i++) {
                if (this.state.data.faq[i]['name'].toLowerCase().indexOf(this.state.search) != -1 || this.state.data.faq[i]['content'].toLowerCase().indexOf(this.state.search) != -1) {
                    results.push(this.state.data.faq[i]);
                }
            }
            this.setState({
                display: results
            })
        })
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
                    section: "get"
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
                    let res = []
                    response.data.data.faq.map(item => {
                        if(item.flag == localStorage.getItem('lang')) {
                            res.push(item)
                        }
                    })
                    response.data.data.faq = res
                    this.setState({
                        data: response.data.data,
                        loading: false
                    }, () => {
                        this.search({ target: { value: "" } })
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
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3 className="font-m">{global.getLocales('Инструкции')}</h3>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div className='form-group'>
                                            <label className="font-m">{global.getLocales('Поиск')}</label>
                                            <input className='form-control' autoComplete={false} name="search" onChange={this.search} value={this.state.search} placeholder={global.getLocales("Введите ключевое слово")} />
                                        </div>
                                    </div>
                                    {
                                        this.state.display.map(item =>
                                            <div className='col-lg-12'>

                                                <div className='avatar-block notice-chat cursor-pointer font-m'>
                                                    <span className='head-faq' onClick={() => {
                                                        if (this.state.opened.indexOf(item.id) == -1) {
                                                            opened.push(item.id)
                                                            this.setState({
                                                                opened: opened
                                                            })
                                                        }
                                                        else {

                                                            let index = opened.indexOf(item.id)
                                                            opened.splice(index, 1)
                                                            this.setState({
                                                                opened: opened
                                                            })
                                                        }
                                                    }}><FontAwesomeIcon icon={faInfoCircle} /> {item.name}</span>
                                                    {
                                                        this.state.opened.indexOf(item.id) !== -1
                                                            ?
                                                            <div className='avatar-block notice-chat font-m'>
                                                                {renderHTML(item.content)}
                                                            </div>
                                                            :
                                                            ''
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Faq