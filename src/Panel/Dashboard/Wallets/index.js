import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import CryptoWallets from './Cryptowallets'


class Wallets extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div class="container-fluid">
                <div class="row">
                    <div className="col-lg-9">
                        <Switch>
                        <Route exact path={`${this.props.match.path}/cryptowallets`} component={CryptoWallets} />

                        <Route render={props =>
                            <Redirect to="/dashboard/wallets/cryptowallets" />
                        } />
                        </Switch>

                    </div>
                    <div className="col-lg-3">
                        <div class="xtabs xtabs_left animate__animated animate__fadeIn">
                            <div class="xtabs__body font-m">
                                <NavLink to={`${this.props.match.path}/cryptowallets`} activeClassName="active" className="xtabs__item">Криптокошельки</NavLink>
                                <NavLink to={`${this.props.match.path}/qiwi`} activeClassName="active" className="xtabs__item">Qiwi</NavLink>
                                <NavLink to={`${this.props.match.path}/globalmoney`} activeClassName="active" className="xtabs__item">GlobalMoney</NavLink>
                                <NavLink to={`${this.props.match.path}/kunaio`} activeClassName="active" className="xtabs__item">Kuna.IO</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Wallets