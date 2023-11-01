import React, { Component } from 'react'
import { NavLink, Route, Redirect, Switch } from 'react-router-dom'
import PricesForPrice from './Prices'
import AdminAllSettings from './Settings'
import AdminWallet from './Wallet'
import AdminWalletLTC from './WalletLTC'
import Withdrawals from './Withdrawal'
import WithdrawalsMass from './MassWith'
import CoworkersAdmin from './Coworkers'
import DispansersAdmin from './Dispansers'


class AdminSettings extends Component {
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
                                <NavLink exact to={`${this.props.match.url}/settings`} activeClassName="active" className="xtabs__item">Общие</NavLink>
                                <NavLink exact to={`${this.props.match.url}/wallet/btc`} activeClassName="active" className="xtabs__item">Кошелек BTC</NavLink>
                                <NavLink exact to={`${this.props.match.url}/wallet/ltc`} activeClassName="active" className="xtabs__item">Кошелек LTC</NavLink>
                                <NavLink exact to={`${this.props.match.url}/prices`} activeClassName="active" className="xtabs__item">Платные услуги</NavLink>
                                <NavLink exact to={`${this.props.match.url}/withdrawals`} activeClassName="active" className="xtabs__item">Выводы</NavLink>
                                <NavLink exact to={`${this.props.match.url}/masswith`} activeClassName="active" className="xtabs__item">Массовый выводы</NavLink>
                                <NavLink exact to={`${this.props.match.url}/coworkers`} activeClassName="active" className="xtabs__item">Сотрудники</NavLink>
                                <NavLink exact to={`${this.props.match.url}/dispansers`} activeClassName="active" className="xtabs__item">Профили ТГ</NavLink>


                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">

                        <Switch>
                        <Route exact path={`${this.props.match.path}/settings`} component={AdminAllSettings} />
                        <Route exact path={`${this.props.match.path}/wallet/btc`} component={AdminWallet} />
                        <Route exact path={`${this.props.match.path}/wallet/ltc`} component={AdminWalletLTC} />
                        <Route exact path={`${this.props.match.path}/prices`} component={PricesForPrice} />
                        <Route exact path={`${this.props.match.path}/withdrawals`} component={Withdrawals} />
                        <Route exact path={`${this.props.match.path}/masswith`} component={WithdrawalsMass} />
                        <Route exact path={`${this.props.match.path}/coworkers`} component={CoworkersAdmin} />
                        <Route exact path={`${this.props.match.path}/dispansers`} component={DispansersAdmin} />

                        <Route render={props =>
                            <Redirect to={`${this.props.match.path}/settings`}/>
                        } />
                        </Switch>
                    </div>
                </div>
        )
    }
}

export default AdminSettings