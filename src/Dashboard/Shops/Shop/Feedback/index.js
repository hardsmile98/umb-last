import React, { Component } from 'react'

import moment from 'moment'
import global from '../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { NavLink, Switch, Route, Redirect } from 'react-router-dom'
import FeedbackChats from './Chats'

class Feedback extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="row margin-15">
                <div className="col-lg-12">
                    <div className="">
                    <Switch>
                    <Route path={`${this.props.match.path}/chats`} component={FeedbackChats} />

                    <Route render={props =>
                            <Redirect to={"/dashboard/shops/" + this.props.match.params.shopId + "/feedback/chats"}/>
                        } />
                    </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default Feedback