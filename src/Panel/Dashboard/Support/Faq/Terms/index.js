import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import moment from 'moment'
import global from './../../../../Global/index'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import renderHTML from 'react-render-html'



class Terms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                terms: ""
            },
            opened: [],
            loading: true
        }
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
                    section: "getTerms"
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
                    response.data.data.terms = response.data.data.terms.split("----")
                    response.data.data.terms.map(item => {
                        if(item.replace(/[\r\n]/gm, '').slice(0,2) == localStorage.getItem('lang')) {
                            response.data.data.terms = item.slice(2)
                        }
                    })
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

    render() {
        return (
            <>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3 className="font-m">{global.getLocales('Пользовательское соглашение')}</h3>
                                <div className='row'>
                                    <div className='col-lg-12 font-m' dangerouslySetInnerHTML={{__html: this.state.data.terms}}>
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

export default Terms