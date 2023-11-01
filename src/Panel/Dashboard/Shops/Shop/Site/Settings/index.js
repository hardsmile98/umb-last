import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import renderHTML from 'react-render-html'


class WebsiteSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                available: {},
                settings: {}
            }
        }
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
                    section: "shop",
                    type: "site",
                    subtype: "settings",
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

    sendData(e) {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "shop",
                    type: "site",
                    subtype: "settings",
                    shop: this.props.match.params.shopId,
                    action: "change",
                    name: e.target.name,
                    value: e.target.value.toString()
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

    render() {
        return (
            <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                <div class="block-body">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="font-m">{global.getLocales('Настройки')}</h3>
                            <div className='avatar-block notice font-m text-center margin-15'>
                                        {global.getLocales('Для изображений')} <b>{global.getLocales('необходимо')}</b> {global.getLocales('указывать прямую ссылку, прямая ссылка')} <b>{global.getLocales('всегда')}</b> {global.getLocales('оканчивается на формат изображения (png, jpg, jpeg и т.д.).')}
                                    </div>
                            <div className='row matgin-15'>
                            {Object.keys(this.state.data.available).map((keyName, i) => (
                                <div className='col-lg-6'>
                                    <div class="form-group">
                                        <label class="form-control-label font-m">{global.getLocales(this.state.data.available[keyName].title)}</label>
                                        {
                                            this.state.data.available[keyName].type == "select"
                                            ?
                                            <>
                                            <select onChange={this.sendData} value={this.state.data.settings[keyName] ? this.state.data.settings[keyName] : this.state.data.available[keyName].default} name={this.state.data.available[keyName].name} class="form-control">
                                            {
                                                this.state.data.available[keyName].values.split(",").map((value, key) =>
                                                    <option value={value}>{global.getLocales(this.state.data.available[keyName].valuesNames.split(",")[key])}</option>
                                                )
                                            }
                                        </select>
                                        {this.state.data.available[keyName].tip ? <small dangerouslySetInnerHTML={{__html: global.getLocales(this.state.data.available[keyName].tip.replace(/"/g, "'"))}}/> : ''}
                                        </>
                                        :
                                        <>
                                        <input name={this.state.data.available[keyName].name} onChange={this.sendData} className='form-control' value={this.state.data.settings[keyName] ? this.state.data.settings[keyName] : this.state.data.available[keyName].default}/>
                                        {this.state.data.available[keyName].tip ? <small dangerouslySetInnerHTML={{__html: global.getLocales(this.state.data.available[keyName].tip.replace(/"/g, "'"))}}/> : ''}
                                        </>
                                        }
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WebsiteSettings