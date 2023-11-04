import React, { Component } from 'react'
import { Modal, ModalBody, ModalFooter } from 'reactstrap'
import moment from 'moment'
import { toast } from 'react-toastify'

import global from '../../../../../../Global/index'


let subcategories = [],
deleted = []

class CategoryEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            name: this.props.category.name,
            sub: this.props.category.sub,
            subcategories: [],
            id: 0,
            deleted: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.deleteSubcategory = this.deleteSubcategory.bind(this)
        this.addSubcategory = this.addSubcategory.bind(this)
        this.sendData = this.sendData.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.category != nextProps.category) {
          this.setState({
            sub: nextProps.category.sub,
            name: nextProps.category.name,
            subcategories: nextProps.category.subcategories,
            id: nextProps.category.id
          })
          subcategories = nextProps.category.subcategories
        }
      }

      sendData() {
        if (this.state.name !== "") {
            this.setState({
                loading: true
            })

            let data = {
                api: "user",
                body: {
                    data: {
                        section: "shop",
                        type: "shipment",
                        subtype: "categories",
                        name: this.state.name,
                        sub: this.state.sub.toString(),
                        subcategories: this.state.subcategories,
                        deleted: this.state.deleted,
                        shop: this.props.match.params.shopId,
                        id: this.state.id,
                        action: "update"
                    },
                    action: "shops"
                },
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }

            request(data, response => {
                if (response.status == 200) {
                    if (response.data.success) {
                        this.setState({
                            name: "",
                            sub: 0,
                            subcategories: this.state.subcategories,
                            loading: false
                        })
                        this.props.getData()
                        this.props.toggle()
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
            toast.error("Заполните название категории")
        }
      }
    

    handleChange(e) {
        const value = e.target[e.target.type === "checkbox" ? "checked" : "value"]
        const name = e.target.name

        if (name == "subcategory") {
            subcategories[e.target.id].name = value
            this.setState({
                subcategories: subcategories
            })
        }
        else {
            this.setState({
                [name]: value
            })
        }
    }

    addSubcategory() {
        subcategories.push({
            name: ""
        })
        this.setState({
            subcategories: subcategories
        })
    }


    deleteSubcategory(id) {
        deleted.push(subcategories[id].id)
        subcategories.splice(id, 1)
        this.setState({
            subcategories: subcategories,
            deleted: deleted
        })
    }


    render() {
        return (
            <div>
                <Modal size="md" isOpen={this.props.modal} toggle={this.props.toggle}>
                    <div className="modal-header text-center">
                        <h4 className="modal-title font-m">{getLocales('Город')} #{this.props.category.id}</h4>
                    </div>
                    <ModalBody>
                        <div className="row">
                            <div className="col-lg-12">
                            <div className="avatar-block font-m no-margin" style={{margin: "0 !important"}}>
                                    <span className="text-danger">{getLocales('При удалении подкатегорий, все адреса данной подкатегории будут перенесены в раздел удаленных адресов. Будьте осторожны с редактированием.')}</span>
                                </div>
                            <div class="form-group margin-15">
                                <label class="form-control-label font-m">{getLocales('Название')}</label>
                                <input defaultValue={this.props.category.name} disabled={this.state.loading} onChange={this.handleChange} autocomplete="off" type="text" placeholder={getLocales("Введите название города")} name="name" class="form-control" />
                            </div>
                            <div class="form-group">
                                <label class="form-control-label font-m">{getLocales('Районы')}</label>
                                <select disabled={this.state.loading} defaultValue={this.props.category.sub} onChange={this.handleChange} name="sub" class="form-control">
                                    <option value="0">{getLocales('Отсутствуют')}</option>
                                    <option value="1">{getLocales('Присутствуют')}</option>
                                </select>
                            </div>
                            {
                                this.state.sub == 1
                                    ?
                                    <>
                                        <label class="form-control-label font-m">{getLocales('Список районов')}</label>
                                        <div className="avatar-block">
                                            {
                                                this.props.category.subcategories.map((item, key) =>
                                                    <div className="avatar-block">
                                                        <div class="form-group">
                                                            <label class="form-control-label font-m">{getLocales('Название')}</label>
                                                            <input disabled={this.state.loading} value={item.name} autocomplete="off" onChange={this.handleChange} autocomplete="off" type="text" placeholder={getLocales("Введите название района")} name="subcategory" id={key} class="form-control" />
                                                        </div>
                                                        <button onClick={() => { this.deleteSubcategory(key) }} disabled={this.state.loading} class="btn btn-danger font-m auth-btn margin-15">{this.state.loading ?  <>{getLocales('Загрузка...')}</>  : <>{getLocales('Удалить')}</> }</button>
                                                    </div>
                                                )
                                            }
                                            <button onClick={this.addSubcategory} disabled={this.state.loading} class="btn btn-secondary font-m auth-btn margin-15">{this.state.loading ?  <>{getLocales('Загрузка...')}</>  : <>{getLocales('Добавить')}</>}</button>
                                        </div>
                                    </>
                                    :
                                    ''
                            }
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4">
                                    <div className="mr-auto">
                                        <button value={getLocales('Закрыть')} class="btn btn-secondary font-m auth-btn" onClick={this.props.toggle}>{getLocales('Закрыть')}</button>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                <button disabled={this.state.loading} onClick={this.sendData} class="btn btn-primary font-m auth-btn">
                                    {this.state.loading ?  <>{getLocales('Загрузка...')}</> :  <>{getLocales('Сохранить')}</>}
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

export default CategoryEdit

