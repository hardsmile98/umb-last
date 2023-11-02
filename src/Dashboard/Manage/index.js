import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import AdminChats from './Chats'
import DatasAdmin from './Datas'
import Disputes from './Disputes'
import AdminInform from './Information'
import AdminSettings from './Settings'


class ManageAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <>
                <div class="row">
                    <div className="col-lg-12">
                        <div class="xtabs xtabs_bottom animate__animated animate__fadeIn"
                        ><div class="xtabs__body">
                                {
                                    this.props.user.type !== "user"
                                        ?
                                        <NavLink to={`${this.props.match.path}/chats`} className="xtabs__item font-m" activeClassName="active">
                                            <span> Чаты {this.props.unreadAdmin > 0 ? <span className='badge badge-danger'>{this.props.unreadAdmin}</span> : ''}</span>
                                        </NavLink>
                                        :
                                        ''
                                }
                                {
                                    (this.props.user.type == "admin" || this.props.user.type == "superadmin")
                                        ?
                                        <>
                                            <NavLink to={`${this.props.match.path}/inform`} className="xtabs__item font-m" activeClassName="active">
                                                <span> Информационные</span>
                                            </NavLink>
                                            <NavLink to={`${this.props.match.path}/datas`} className="xtabs__item font-m" activeClassName="active">
                                                <span> Данные</span>
                                            </NavLink>
                                        </>
                                        :
                                        ''
                                }
                                {
                                    this.props.user.type == "superadmin"
                                        ?
                                        <NavLink to={`${this.props.match.path}/settings`} className="xtabs__item font-m" activeClassName="active">
                                            <span> Настройки</span>
                                        </NavLink>
                                        :
                                        ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row margin-15'>
                    <div className="col-lg-12">
                        <Switch>
                            <Route path={`${this.props.match.path}/chats`} component={AdminChats} />
                            <Route path={`${this.props.match.path}/disputes`} component={Disputes} />
                            <Route path={`${this.props.match.path}/datas`} render={props => <DatasAdmin {...props} user={this.props.user}/>} />
                            <Route path={`${this.props.match.path}/inform`} component={AdminInform} />
                            <Route path={`${this.props.match.path}/settings`} component={AdminSettings} />


                            <Route render={props =>
                                <Redirect to={"/dashboard/manage/chats"} />
                            } />
                        </Switch>
                    </div>
                </div>
            </>
        )
    }
}

export default ManageAdmin