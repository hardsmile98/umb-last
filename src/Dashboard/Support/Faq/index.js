import React, { Component } from 'react'
import { NavLink, Link, Route, Switch, Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import moment from 'moment'

import { faCircle } from '@fortawesome/free-regular-svg-icons'
import Faq from './Answers'
import Guide from './Guide'
import Terms from './Terms'

import global from '../../../Global/index'

let opened = []


class FaqAll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
     
    }


    render() {
        return (
            <>
                <div class="row">
                <div className="col-lg-3">
                        <div class="xtabs xtabs_left animate__animated animate__fadeIn">
                            <div class="xtabs__body font-m">
                                <NavLink to={`${this.props.match.path}/answers`} activeClassName="active" className="xtabs__item">{global.getLocales('Вопрос-Ответ')}</NavLink>
                                <NavLink to={`${this.props.match.path}/guide`} activeClassName="active" className="xtabs__item">{global.getLocales('Полное руководство')}</NavLink>
                                <NavLink to={`${this.props.match.path}/terms`} activeClassName="active" className="xtabs__item">{global.getLocales('Пользовательское соглашение')}</NavLink>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <Switch>
                        <Route path={`${this.props.match.path}/answers`} component={Faq} />
                        <Route path={`${this.props.match.path}/guide`} component={Guide} />
                        <Route path={`${this.props.match.path}/terms`} component={Terms} />

                        <Route render={props =>
                            <Redirect to={`${this.props.match.path}/answers`}/>
                        } />
                        </Switch>
                    </div>
                </div>
            </>
        )
    }
}

export default FaqAll