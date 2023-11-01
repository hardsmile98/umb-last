import moment from 'moment'
import React, { Component } from 'react'
import { toast } from 'react-toastify'

import global from '../../Global/index'

import renderHTML from 'react-render-html'

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4lang_ru_RU from "@amcharts/amcharts4/lang/ru_RU";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faFire, faLink } from '@fortawesome/free-solid-svg-icons'

am4core.useTheme(am4themes_material);



class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: {
                news: [],
                transactions: [],
                adv: "",
                domains: []
            },
            today: 0,
            threedays: 0,
            monthSum: 0,
            allSum: 0,
            graphData: []
        }
        this.getData = this.getData.bind(this)
        this.prepareData = this.prepareData.bind(this)
        this.prepareDataForDays = this.prepareDataForDays.bind(this)
    }

    componentDidMount() {
        am4core.addLicense("ch-custom-attribution");
        if(localStorage.getItem('theme') !== "default") {
            am4core.useTheme(am4themes_dark);
        }
        this.getData()
    }

    prepareDataForDays(callback) {
        let newData = []
        this.state.data.transactions.map(item => {
            if(newData.length > 0) {
                let check = false
                newData.map(data => {
                    if(+data.date == +new Date(+item.created).setHours(0, 0, 0, 0)) {
                        data.value += item.sum
                        check = true
                    }
                })
                if(!check) {
                    newData.push({
                        value: +item.sum,
                        date: new Date(+new Date(+item.created).setHours(0, 0, 0, 0))
                    })
                }
            }
            else {
                newData.push({
                    value: +item.sum,
                    date: new Date(+new Date(+item.created).setHours(0, 0, 0, 0))
                })
            }
        })
        this.setState({
            graphData: newData
        }, () => {
            callback(true)
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
                    type: "get"
                },
                action: "home"
            },
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }

        global.createRequest(data, response => {
            if (response.status == 200) {
                if (response.data.success) {
                    response.data.data.news = response.data.data.news.reverse()
                    this.setState({
                        data: response.data.data,
                        loading: false
                    }, () => {
                        this.prepareData()
                        this.prepareDataForDays(result => {
                            this.prepateChart()
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

    prepateChart() {
        let chart = am4core.create("prefer", am4charts.XYChart);

    
            let data = this.state.graphData

            chart.language.locale = am4lang_ru_RU;

    
            chart.data = data;

            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.location = 0;
        
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.tooltip.disabled = true;
            valueAxis.renderer.minWidth = 35;
        
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = "date";
            series.dataFields.valueY = "value";
        
            series.tooltipText = "{valueY.value} BTC";
            chart.cursor = new am4charts.XYCursor();
        
            let scrollbarX = new am4charts.XYChartScrollbar();
            scrollbarX.series.push(series);
            chart.scrollbarX = scrollbarX;
        
            this.chart = chart;
    }
 
    prepareData() {
        let today = +new Date().setHours(0, 0, 0, 0),
            todaySum = 0

        this.state.data.transactions.map(item => {
            if (+item.created >= today) {
                todaySum += +item.sum
            }
        })

        let todays = new Date();
        let priorDate = +new Date(new Date().setDate(todays.getDate() - 30)),
            days30sum = 0

        this.state.data.transactions.map(item => {
            if (+item.created >= priorDate) {
                days30sum += +item.sum
            }
        })

        let date = new Date();
        let firstDay = +new Date(date.getFullYear(), date.getMonth(), 1),
            monthSum = 0

        this.state.data.transactions.map(item => {
            if (+item.created >= firstDay) {
                monthSum += +item.sum
            }
        })

        let allSum = 0

        this.state.data.transactions.map(item => {
            allSum += +item.sum
        })

        this.setState({
            today: todaySum,
            threedays: days30sum,
            monthSum: monthSum,
            allSum: allSum
        })


    }
    render() {
        return (
            <>
                <div className="row">
                    {
                        this.state.data.adv == "" 
                        ?
                        ''
                         :
                    <div className='col-lg-12'>
                        <div className='block font-m block-top not-block-main'>
                            <div className="text-center logoforblockicon">
                            <h1 className="text-danger h1-for-icon"><FontAwesomeIcon icon={faFire}/></h1>
                            </div>
                            <div className="text-left text-for-ob-block">
                            <span dangerouslySetInnerHTML={{__html: this.state.data.adv}}/>
                            </div>
                    </div>
                    </div>
                    }
                    <div class="col-lg-3">
                        <div class={"income font-m income-orange animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <h5><span>{global.getLocales('За сегодня')}</span></h5><h2><span>{this.state.today.toFixed(8)} BTC</span></h2>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <h5><span>{global.getLocales('За последние 30 дней')}</span></h5><h2><span>{this.state.threedays.toFixed(8)} BTC</span></h2>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <h5><span>{global.getLocales('За текущий месяц')}</span></h5><h2><span>{this.state.monthSum.toFixed(8)} BTC</span></h2>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class={"income font-m animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <h5><span>{global.getLocales('За все время')}</span></h5><h2><span>{this.state.allSum.toFixed(8)} BTC</span></h2>
                        </div>
                    </div>
                    <div className='col-lg-6'>
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <h4 className="font-m">{global.getLocales('График доходов')}</h4>
                                <div id="prefer" style={{ width: "100%", height: "50vh" }}></div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-6'>
                        <div class={"block animate__animated animate__fadeIn " + (this.state.loading ? "blur" : "")}>
                            <div class="block-body">
                                <h4 className="font-m">{global.getLocales('Новости проекта')}</h4>
                                <div className='news-conteiner'>
                                {
                                    this.state.data.news.map(item =>
                                        <div className={"avatar-block font-m news "}>
                                        <div className="message-content"><p>{renderHTML(item.content)}</p></div>
                                        <div className="message-date text-right">{moment.unix(item.date / 1000).format("LLL")}</div>
                                    </div>
                                        )
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                                                                                                   <div className="col-lg-12">
                                        <div className={'block font-m block-top not-block-main ' + (this.state.loading ? "blur" : "")}>
                            <div className="text-center logoforblockicon">
                            <span className="text-danger h1-for-icon"><FontAwesomeIcon icon={faLink}/></span>
                            </div>
                            <div className="text-center text-for-ob-block">
                                {
                                    this.state.data.domains.map(item =>
                                        <button onClick={() => {
                                            navigator.clipboard.writeText(item)
                                            toast.success(global.getLocales('Успешно добавлено в буфер обмена'))
                                        }} className="btn btn-mirrow btn-primary font-m">{item}</button>
                                        )
                                }
                            </div>
                    </div>
                </div>
                </div>
            </>
        )
    }
}

export default HomePage