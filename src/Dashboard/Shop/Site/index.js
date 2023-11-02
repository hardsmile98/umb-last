import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import Config from './Config'
import Domains from './Domains'
import SitePages from './Pages'
import NewPage from './Pages/NewPage'
import PageChange from './Pages/PageChange'
import SiteSettings from './Settings'
import Templates from './Templates'
import Widgets from './Widgets'

import global from '../../../../Global/index'


class SiteParser extends Component {
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
                                <NavLink exact to={`${this.props.match.url}`} activeClassName="active" className="xtabs__item">{global.getLocales('Настройки')}</NavLink>
                                <NavLink exact to={`${this.props.match.url}/templates`} activeClassName="active" className="xtabs__item">{global.getLocales('Шаблоны')}</NavLink>
                                <NavLink exact to={`${this.props.match.url}/domains`} activeClassName="active" className="xtabs__item">{global.getLocales('Домены')}</NavLink>
                                <NavLink to={`${this.props.match.url}/pages`} activeClassName="active" className="xtabs__item">{global.getLocales('Страницы')}</NavLink>
                                <NavLink exact to={`${this.props.match.url}/widgets`} activeClassName="active" className="xtabs__item">{global.getLocales('Виджеты')}</NavLink>
                                <NavLink exact to={`${this.props.match.url}/config`} activeClassName="active" className="xtabs__item">{global.getLocales('Продвинутая конфигурация')}</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <Switch>
                        <Route exact path={`${this.props.match.path}`} component={SiteSettings} />
                        <Route exact path={`${this.props.match.path}/templates`} component={Templates} />
                        <Route exact path={`${this.props.match.path}/pages`} component={SitePages} />
                        <Route exact path={`${this.props.match.path}/pages/new`} component={NewPage} />
                        <Route exact path={`${this.props.match.path}/pages/:pageId`} component={PageChange} />
                        <Route exact path={`${this.props.match.path}/domains`} component={Domains} />
                        <Route exact path={`${this.props.match.path}/widgets`} component={Widgets} />
                        <Route exact path={`${this.props.match.path}/templates`} component={Templates} />
                        <Route exact path={`${this.props.match.path}/config`} component={Config} />

                        <Route render={props =>
                            <Redirect to={"/dashboard/shops/" + this.props.match.params.shopId + "/site/"}/>
                        } />
                        </Switch>

                    </div>
                </div>
        )
    }
}

export default SiteParser