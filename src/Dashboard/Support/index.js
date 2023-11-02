import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import Tickets from './Tickets'
import TicketNew from './Tickets/TicketNew'
import Ticket from './Tickets/Ticket'
import Chat from './Chat'
import FaqAll from './Faq'

import global from '../../Global/index'


class Support extends Component {
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
                                <NavLink to={`${this.props.match.path}/faq`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('База знаний')}</span>
                                    <br />
                                    <small>{global.getLocales('Инструкции по пользованию системой')}</small>
                                </NavLink>
                                <NavLink to={`${this.props.match.path}/chat`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Поддержка')}</span>
                                    <br />
                                    <small>{global.getLocales('Онлайн-чат с командой поддержки')}</small>
                                </NavLink>
                                <NavLink to={`${this.props.match.path}/tickets`} className="xtabs__item font-m" activeClassName="active">
                                    <span> {global.getLocales('Обращения')}</span>
                                    <br />
                                    <small>{global.getLocales('Обращения, которые не удалось решить сразу')}</small>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row margin-15'>
                    <div className="col-lg-12">

                        <Switch>
                            <Route exact path={`${this.props.match.path}/tickets`} component={Tickets} />
                            <Route path={`${this.props.match.path}/tickets/new`} component={TicketNew} />
                            <Route path={`${this.props.match.path}/ticket/:id`} component={Ticket} />
                            <Route exact path={`${this.props.match.path}/chat`} component={Chat} />
                            <Route path={`${this.props.match.path}/faq`} component={FaqAll} />

                            <Route render={props =>
                                <Redirect to="/dashboard/support/faq" />
                            } />
                        </Switch>
                    </div>
                </div>
            </>
        )
    }
}

export default Support