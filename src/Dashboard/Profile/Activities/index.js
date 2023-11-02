import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../Global/index'
import { toast } from 'react-toastify'

import Table from './../../../Table/index'


const tableColumns = [
    {
        title: 'ID', dataIndex: 'id', key:'id', sort:true
    }, 
    {
        title: global.getLocales('Описание'), dataIndex: 'description', key:'description', sort:false
    }, 
    {
        title: global.getLocales('Дата'), dataIndex: 'date', key:'date', sort:true
    }
]

class Activities extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                user: {},
                activities: []
            },
            items: [],
            loading: true
        }
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.getData()
    }

    prepareTableData() {
        let items = [];

        this.state.data.activities.map((item) => {
            let itemModified = {
                id: item.id,
                description: item.description.replace(/Регистрация аккаута/g, global.getLocales('Регистрация аккаута')).replace(/Успешный вход в аккаунт/g, global.getLocales('Успешный вход в аккаунт')).replace(/Выход из аккаунта/g, global.getLocales('Выход из аккаунта').replace(/Сессия/g, "Session")),
                date: moment.unix(item.date/1000).format("LLL")
            }
            items.push(itemModified)
        })

        this.setState({
            items: items
        })
    }

    updateItems(items) {
        this.setState({
            items: items
        })
    }

    getData() {
        let data = {
            api: "user",
            body: {
                data: {
                    section: "activities",
                    type: "get"
                },
                action: "profile"
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
                    
                    this.prepareTableData()
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
                            <h3 className="font-m">{global.getLocales('Активность аккаунта')}</h3>
                                <br/>
                            <Table columns={tableColumns} items={this.state.items} updateItems={this.updateItems} rowsPerPage="10" />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Activities