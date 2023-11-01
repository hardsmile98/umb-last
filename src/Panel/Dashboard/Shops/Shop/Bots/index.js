import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import Btemplates from './Btemplates'
import Mtemplates from './Mtemplates'
import BotPages from './Pages'
import BotsSettings from './Settings'
import TelegramBots from './Telegram'
import Userspam from './Userspam'
import Dispensers from './Dispensers'

import global from '../../../../Global/index'


class ShopBots extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    render() {
        return (
                <div class="row margin-15">
                                        <div className="col-lg-3">
                        <div class="xtabs xtabs_left animate__animated animate__fadeIn">
                            <div class="xtabs__body font-m">
                                <NavLink to={`${this.props.match.url}/settings`} activeClassName="active" className="xtabs__item">{global.getLocales('Настройки')}</NavLink>
                                <NavLink to={`${this.props.match.url}/telegram`} activeClassName="active" className="xtabs__item">Telegram {global.getLocales('Боты')}</NavLink>
                                <NavLink to={`${this.props.match.url}/dispensers`} activeClassName="active" className="xtabs__item">{global.getLocales('Боты распределители')}</NavLink>
                                <NavLink to={`${this.props.match.url}/pages`} activeClassName="active" className="xtabs__item">{global.getLocales('Страницы')}</NavLink>
                                <NavLink to={`${this.props.match.url}/messages`} activeClassName="active" className="xtabs__item">{global.getLocales('Шаблоны сообщений')}</NavLink>
                                <NavLink to={`${this.props.match.url}/buttons`} activeClassName="active" className="xtabs__item">{global.getLocales('Шаблоны кнопок')}</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9 zindex999999">
                        <Switch>
                        <Route exact path={`${this.props.match.path}/settings`} component={BotsSettings} />
                        <Route exact path={`${this.props.match.path}/telegram`} component={TelegramBots} />
                        <Route exact path={`${this.props.match.path}/pages`} component={BotPages} />
                        <Route exact path={`${this.props.match.path}/dispensers`} component={Dispensers} />
                        <Route exact path={`${this.props.match.path}/userspam`} component={Userspam} />
                        <Route exact path={`${this.props.match.path}/messages`} component={Mtemplates} />
                        <Route exact path={`${this.props.match.path}/buttons`} component={Btemplates} />

                        <Route render={props =>
                            <Redirect to={"/dashboard/shops/" + this.props.match.params.shopId + "/bots/settings"}/>
                        } />
                        </Switch>

                    </div>
                </div>
        )
    }
}

export default ShopBots