import React, { Component } from 'react'

import moment from 'moment'
import global from './../../../../Global/index'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4lang_ru_RU from "@amcharts/amcharts4/lang/ru_RU";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { NavLink } from 'react-router-dom'


am4core.useTheme(am4themes_animated);

class Statka extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                exchanges: [],
                cripta: [],
                card: [],
                shops: [],
                users: []
            },
            card: [],
            cripta: [],
            shops: [],
            dateFrom: moment.unix(new Date(Date.now() - 2592000000).setHours(0, 0, 0, 0) / 1000).format("YYYY-MM-DD"),
            dateTo: moment.unix(new Date(Date.now() + 86400000).setHours(0, 0, 0, 0) / 1000).format("YYYY-MM-DD")
        }
        this.prepateChartCard = this.prepateChartCard.bind(this)
        this.prepateChartCripto = this.prepateChartCripto.bind(this)
        this.getDataCripta = this.getDataCripta.bind(this)
        this.getDataCard = this.getDataCard.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.getData = this.getData.bind(this)
        this.getTopShops = this.getTopShops.bind(this)

    }

    getTopShops() {
        let shops = []
        this.state.data.exchanges.map(item => {
            let find = false
            shops.map(shop => {
                if(shop.db == item.shop) {
                    shop.sum += +item.sum

                    find = true
                }
            })
            if(!find) {
                this.state.data.shops.map(shopList => {
                    if(shopList.db == item.shop) {
                        this.state.data.users.map(user => {
                            if(shopList.owner == user.id) {
                                shops.push({db: item.shop, sum: +item.sum, owner: user.id, login: user.login, id: shopList.uniqueId, brut: (user.ref == "fa0f5236cd6b466585c18980e238c755" ? true : false)})
                            }
                        })
                    }
                })
            }
        })

        shops = shops.sort(function(a,b) {
            return a.sum - b.sum;
        })

        shops = shops.reverse()



        this.setState({
            shops: shops
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getDataCripta() {
        let newData = []
        this.state.data.exchanges.map(item => {
            if (item.type !== "CARDRUB") {
                if (newData.length > 0) {
                    let check = false
                    newData.map(data => {
                        if (+data.date == +new Date(+item.closed).setHours(0, 0, 0, 0)) {
                            data.value += +item.sum
                            check = true
                        }
                    })
                    if (!check) {
                        newData.push({
                            value: +item.sum,
                            date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0))
                        })
                    }
                }
                else {
                    newData.push({
                        value: +item.sum,
                        date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0))
                    })
                }
            }
        })
        this.setState({
            cripta: newData
        }, () => {
            this.prepateChartCripto()
        })
    }

    getDataCard() {
        let newData = []
        this.state.data.exchanges.map(item => {
            if (item.type == "CARDRUB") {
                if (newData.length > 0) {
                    let check = false
                    newData.map(data => {
                        if (+data.date == +new Date(+item.closed).setHours(0, 0, 0, 0)) {
                            data.value += +item.sumPay
                            check = true
                        }
                    })
                    if (!check) {
                        newData.push({
                            value: +item.sumPay,
                            date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0))
                        })
                    }
                }
                else {
                    newData.push({
                        value: +item.sumPay,
                        date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0))
                    })
                }
            }
        })
        this.setState({
            card: newData
        }, () => {
            this.prepateChartCard()
        })
    }

    getData() {
        this.setState({
            loading: true
        })
        let data = {
            api: "user",
            body: {
                data: {
                    section: "datas",
                    type: "getStatsv2",
                    dateFrom: +new Date(this.state.dateFrom),
                    dateTo: +new Date(this.state.dateTo)
                },
                action: "admin"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    this.setState({
                        data: response.data.data
                    }, () => {
                        this.getDataCard()
                        this.getDataCripta()
                        this.getTopShops()
                        this.setState({
                            loading: false
                        })

                    })
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

    componentDidMount() {
        am4core.addLicense("ch-custom-attribution");
        if (localStorage.getItem('theme') !== "default") {
            am4core.useTheme(am4themes_dark);
        }
        this.getData()
    }

    prepateChartCripto() {

        let chart = am4core.create("cripta", am4charts.XYChart);


        let data = this.state.cripta

        data = data.sort(
            (objA, objB) => Number(objA.date) - Number(objB.date),
        )

        chart.language.locale = am4lang_ru_RU;


        chart.data = data;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        let series = chart.series.push(new am4charts.LineSeries);
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";

        series.tooltipText = "{valueY.value} BTC";
        chart.cursor = new am4charts.XYCursor();


        series.bullets.push(new am4charts.CircleBullet());



        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;



        this.chart = chart;
    }

    prepateChartCard() {

        let chart = am4core.create("card", am4charts.XYChart);


        let data = this.state.card
        data = data.sort(
            (objA, objB) => Number(objA.date) - Number(objB.date),
        )

        chart.language.locale = am4lang_ru_RU;


        chart.data = data;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        let series = chart.series.push(new am4charts.LineSeries);
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";

        series.tooltipText = "{valueY.value} RUB";
        chart.cursor = new am4charts.XYCursor();


        series.bullets.push(new am4charts.CircleBullet());



        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;



        this.chart = chart;
    }



    render() {
        return (
            <>
                <div class={"block animate__animated animate__fadeIn margin-15 " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <h3 className="font-m">Выбор даты</h3>
                        <div className="row">
                <div className='col-lg-6'>
                    <div class="form-group">
                        <label class="form-control-label font-m">{global.getLocales("От")}</label>
                        <input type="date" onChange={this.handleChange} value={this.state.dateFrom} name="dateFrom" class="form-control" />
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div class="form-group">
                        <label class="form-control-label font-m">{global.getLocales("До")}</label>
                        <input type="date" onChange={this.handleChange} value={this.state.dateTo} name="dateTo" class="form-control" />
                    </div>
                </div>
                <div className="col-lg-8">
							
							</div>
							<div className="col-lg-4">
							                                    <button onClick={this.getData} className='btn btn-primary auth-btn font-m margin-15'>
                                        {global.getLocales('Применить')}

                                    </button>
							</div>
                            </div>
                </div>
                </div>
                <div class={"block animate__animated animate__fadeIn margin-15 " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <h3 className="font-m">Оборот по Криптам</h3>
                        <div id="cripta" style={{ width: "100%", height: "50vh" }}></div>

                    </div>

                </div>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <h3 className="font-m">Оборот по CARDRUB</h3>
                        <div id="card" style={{ width: "100%", height: "50vh" }}></div>

                    </div>

                </div>
                <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                    <div class="block-body">
                        <h3 className="font-m">Топ шопы</h3>

                                            <>
                                                <div className='avatar-block font-m'>
                                                    <div className='row'>
                                                        <div className='col-lg-5 text-center'>
                                                            {global.getLocales("Магазин")}
                                                        </div>
                                                        <div className='col-lg-2 text-center'>
                                                            {global.getLocales("Оборот")}
                                                        </div>
                                                        <div className='col-lg-5 text-center'>
                                                            {global.getLocales("Владелец")}
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.shops.map((shop) =>
                                                        <div className='avatar-block font-m'>
                                                            <div className='row'>
                                                                <div className='col-lg-5 text-center'>
                                                                    <NavLink class={shop.brut ? "brutshop" : "umbshop"} className={shop.brut ? "brutshop" : "umbshop"} to={'/dashboard/shops/' + shop.id}>{shop.id}</NavLink>
                                                                </div>
                                                                <div className='col-lg-2 text-center'>
                                                                    {shop.sum.toFixed(6)} BTC
                                                                </div>
                                                                <div className='col-lg-5 text-center'>
                                                                    <NavLink to={'/dashboard/manage/datas/users/' + shop.owner + '/'}><button className="btn btn-secondary btn-table">{shop.login}</button></NavLink>
                                                                </div>
                                                   
                                                                
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </>

                    </div>

                </div>

            </>
        )
    }
}

export default Statka