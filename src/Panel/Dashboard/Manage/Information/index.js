import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import AdminFAQ from './FAQ'
import GuideAdmin from './GuideAdmin'
import InformSettingsAdmin from './InformSettings'
import LangAdmin from './Langs'
import AdminNews from './News'
import TermsAdmin from './Terms'
import LangAdminShop from './LangShop'


class AdminInform extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    render() {
        return (
            <div class="row">
                <div className="col-lg-3">
                    <div class="xtabs xtabs_left animate__animated animate__fadeIn">
                        <div class="xtabs__body font-m">
                            <NavLink exact to={`${this.props.match.url}`} activeClassName="active" className="xtabs__item">Общие</NavLink>
                            <NavLink exact to={`${this.props.match.url}/news`} activeClassName="active" className="xtabs__item">Новости</NavLink>
                            <NavLink to={`${this.props.match.url}/faq`} activeClassName="active" className="xtabs__item">FAQ</NavLink>
                            <NavLink to={`${this.props.match.url}/guide`} activeClassName="active" className="xtabs__item">Гайд</NavLink>
                            <NavLink to={`${this.props.match.url}/terms`} activeClassName="active" className="xtabs__item">Польз. Соглашение</NavLink>
                            <NavLink to={`${this.props.match.url}/locales`} activeClassName="active" className="xtabs__item">Локализация</NavLink>
                            <NavLink to={`${this.props.match.url}/localesshop`} activeClassName="active" className="xtabs__item">Локализация Магазинов</NavLink>

                        </div>
                    </div>
                </div>
                <div className="col-lg-9">

                    <Switch>
                        <Route exact path={`${this.props.match.path}`} component={InformSettingsAdmin} />
                        <Route exact path={`${this.props.match.path}/news`} component={AdminNews} />
                        <Route exact path={`${this.props.match.path}/faq`} component={AdminFAQ} />
                        <Route exact path={`${this.props.match.path}/guide`} component={GuideAdmin} />
                        <Route exact path={`${this.props.match.path}/terms`} component={TermsAdmin} />
                        <Route exact path={`${this.props.match.path}/locales`} component={LangAdmin} />
                        <Route exact path={`${this.props.match.path}/localesshop`} component={LangAdminShop} />


                        <Route render={props =>
                            <Redirect to={`${this.props.match.path}`} />
                        } />
                    </Switch>
                </div>
            </div>
        )
    }
}

export default AdminInform