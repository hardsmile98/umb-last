/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4lang_ru_RU from '@amcharts/amcharts4/lang/ru_RU';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Table } from 'components';
import { request, getLocales } from 'utils';
// import ProfitModal from './ProfitModal'

am4core.useTheme(am4themes_animated);

class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {
        purchases: [],
        products: [],
        sellersSum: 0,
        subproducts: [],
      },
      graphData: [],
      dateFrom: moment.unix(new Date(Date.now() - 2592000000)
        .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
      dateTo: moment.unix(new Date(Date.now() + 86400000)
        .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
      items: [],
      modal: false,
      productGraph: [],
      date2: +new Date(Date.now()).setHours(0, 0, 0, 0),
    };

    this.getData = this.getData.bind(this);
    this.prepareDataForDays = this.prepareDataForDays.bind(this);
    this.prepareForProducts = this.prepareForProducts.bind(this);
    this.prepareProducts = this.prepareProducts.bind(this);
    this.prepareForDaysProd = this.prepareForDaysProd.bind(this);
    this.prepareAreas = this.prepareAreas.bind(this);
    this.toggle = this.toggle.bind(this);
    this.loadSortings = this.loadSortings.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  loadSortings() {
    if (this.state.data.purchases.length > 0) {
      const cats = [];
      const prods = [];

      this.state.data.purchases.map((item) => {
        if (cats.indexOf(item.category) == -1) {
          cats.push(item.category);
        }
        if (prods.indexOf(item.product) == -1) {
          prods.push(item.product);
        }
      });

      this.setState({
        categories: cats,
        products: prods,
      });
    }
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  componentDidMount() {
    am4core.addLicense('ch-custom-attribution');

    if (localStorage.getItem('theme') !== 'default') {
      am4core.useTheme(am4themes_dark);
    }

    this.getData();
  }

  prepareForProducts(callback) {
    const datas = [];

    this.state.data.purchases.map((item) => {
      if (datas.length > 0) {
        let check = false;
        datas.map((data) => {
          if (data.name === (`${item.product} ${item.subproduct}`)) {
            data.value += 1;
            check = true;
          }
        });
        if (!check) {
          datas.push({
            value: 1,
            name: (`${item.product} ${item.subproduct}`),
          });
        }
      } else {
        datas.push({
          value: 1,
          name: (`${item.product} ${item.subproduct}`),
        });
      }
    });

    this.setState({
      productGraph: datas,
    }, () => {
      callback(true);
    });
  }

  prepareDataForDays(callback) {
    const newData = [];
    this.state.data.purchases.map((item) => {
      if (newData.length > 0) {
        let check = false;
        newData.map((data) => {
          if (+data.date === +new Date(+item.closed).setHours(0, 0, 0, 0)) {
            data.value += item.sum;
            check = true;
          }
        });
        if (!check) {
          newData.push({
            value: +item.sum,
            date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0)),
          });
        }
      } else {
        newData.push({
          value: +item.sum,
          date: new Date(+new Date(+item.closed).setHours(0, 0, 0, 0)),
        });
      }
    });
    this.setState({
      graphData: newData,
    }, () => {
      callback(true);
    });
  }

  getData() {
    this.setState({
      loading: true,
    });
    const data = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'statistic',
          subtype: 'getnew',
          dateFrom: +new Date(this.state.dateFrom),
          dateTo: +new Date(this.state.dateTo),
          shop: this.props.match.params.shopId,
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(data, (response) => {
      if (response.status === 200) {
        if (response.data.success) {
          this.setState({
            data: response.data.data,
            loading: false,
          }, () => {
            this.loadSortings();
            this.prepareDataForDays(() => {
              this.prepareTableData();
              this.prepateChart();

              this.prepareForProducts(() => {
                this.prepareProducts();
                this.prepareForDaysProd();

                if (this.state.data.purchases.length > 0) {
                  this.prepareAreas();
                }
              });
            });
          });
        } else {
          this.setState({
            loading: false,
          });

          toast.error(response.data.message);
        }
      } else {
        toast.error('Сервер недоступен');
      }
    });
  }

  prepareForDaysProd() {
    const chart = am4core.create('graph2', am4charts.PieChart);

    const dat = [];

    this.state.data.purchases.map((item) => {
      if (+item.closed >= +this.state.date2) {
        if (dat.length > 0) {
          let check = false;

          dat.map((data) => {
            if (data.name === (`${item.product} ${item.subproduct}`)) {
              data.value += 1;
              check = true;
            }
          });
          if (!check) {
            dat.push({
              value: 1,
              name: (`${item.product} ${item.subproduct}`),
            });
          }
        } else {
          dat.push({
            value: 1,
            name: (`${item.product} ${item.subproduct}`),
          });
        }
      }
    });

    chart.data = dat;
    chart.language.locale = am4lang_ru_RU;
    const pieSeries = chart.series.push(new am4charts.PieSeries());

    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';

    pieSeries.slices.template.stroke = am4core.color('#d3190a');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 0.5;

    pieSeries.labels.template.disabled = true;

    pieSeries.slices.template.fillOpacity = 0.2;

    pieSeries.slices.template.tooltipText = `{category}: {value.value} ${getLocales('распродано')}`;
  }

  prepareProducts() {
    const chart = am4core.create('productsgraph', am4charts.PieChart);

    chart.data = this.state.productGraph;

    chart.language.locale = am4lang_ru_RU;

    const pieSeries = chart.series.push(new am4charts.PieSeries());

    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';

    pieSeries.slices.template.stroke = am4core.color('#d3190a');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 0.5;

    pieSeries.labels.template.disabled = true;

    pieSeries.slices.template.fillOpacity = 0.2;

    pieSeries.slices.template.tooltipText = `{category}: {value.value} ${getLocales('распродано')}`;
  }

  prepareAreas() {
    const chart = am4core.create('areas', am4charts.XYChart);

    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4core.Scrollbar();

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.dataItems.template.text = '{realName}';
    categoryAxis.adapter.add('tooltipText', () => categoryAxis.tooltipDataItem.dataContext.realName);
    categoryAxis.renderer.grid.template.disabled = true;

    categoryAxis.renderer.labels.template.disabled = true;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.min = 0;

    const columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.columns.template.width = am4core.percent(80);
    columnSeries.tooltipText = '{provider}: {realName}, {valueY}';
    columnSeries.dataFields.categoryX = 'category';
    columnSeries.dataFields.valueY = 'value';
    columnSeries.strokeOpacity = 0.5;

    columnSeries.fillOpacity = 0.2;

    const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.renderer.opposite = true;
    valueAxis2.syncWithAxis = valueAxis;
    valueAxis2.tooltip.disabled = true;

    const lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.tooltipText = `${getLocales('Всего продаж в городе')}: {valueY}`;
    lineSeries.dataFields.categoryX = 'category';
    lineSeries.dataFields.valueY = 'quantity';
    lineSeries.yAxis = valueAxis2;
    lineSeries.bullets.push(new am4charts.CircleBullet());
    lineSeries.stroke = chart.colors.getIndex(13);
    lineSeries.fill = lineSeries.stroke;
    lineSeries.opacity = 0.2;
    lineSeries.strokeWidth = 5;
    lineSeries.snapTooltip = true;

    // when data validated, adjust location of data item based on count
    lineSeries.events.on('datavalidated', () => {
      lineSeries.dataItems.each((dataItem) => {
        // if count divides by two, location is 0 (on the grid)
        if (dataItem.dataContext.count / 2 === Math.round(dataItem.dataContext.count / 2)) {
          dataItem.setLocation('categoryX', 0);
        } else {
          dataItem.setLocation('categoryX', 0.5);
        }
      });
    });

    const rangeTemplate = categoryAxis.axisRanges.template;
    rangeTemplate.tick.disabled = false;
    rangeTemplate.tick.location = 0;
    rangeTemplate.tick.strokeOpacity = 0.5;
    rangeTemplate.tick.length = 60;
    rangeTemplate.grid.strokeOpacity = 0.1;
    rangeTemplate.label.tooltip = new am4core.Tooltip();
    rangeTemplate.label.tooltip.dy = -10;
    rangeTemplate.label.cloneTooltip = false;

    let chartData = [];

    const data = {};

    if (this.state.data.purchases.length > 0) {
      this.state.data.purchases.map((item) => {
        if (data[item.category]) {
          if (data[item.category][item.subcategory]) {
            data[item.category][item.subcategory] += 1;
            data[item.category].quantity += 1;
          } else if (item.subcategory) {
            data[item.category][item.subcategory] = 1;
            data[item.category].quantity += 1;
          } else {
            data[item.category]['Город'] += 1;
            data[item.category].quantity += 1;
          }
        } else if (item.subcategory) {
          data[item.category] = {};
          data[item.category][item.subcategory] = 1;
          data[item.category].quantity = 1;
        } else {
          data[item.category] = {};
          data[item.category]['Город'] = 1;
          data[item.category].quantity = 1;
        }
      });

      // process data ant prepare it for the chart
      for (const providerName in data) {
        const providerData = data[providerName];

        // add data of one provider to temp array
        const tempArray = [];
        let count = 0;
        // add items
        for (const itemName in providerData) {
          if (itemName != 'quantity') {
            count++;
            // we generate unique category for each column (providerName + "_" + itemName) and store realName
            tempArray.push({
              category: `${providerName}_${itemName}`, realName: itemName, value: providerData[itemName], provider: providerName,
            });
          }
        }
        // sort temp array
        tempArray.sort((a, b) => {
          if (a.value > b.value) {
            return 1;
          }
          if (a.value < b.value) {
            return -1;
          }

          return 0;
        });

        // add quantity and count to middle data item (line series uses it)
        const lineSeriesDataIndex = Math.floor(count / 2);
        tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
        tempArray[lineSeriesDataIndex].count = count;
        // push to the final data
        am4core.array.each(tempArray, (item) => {
          chartData.push(item);
        });

        // create range (the additional label at the bottom)
        const range = categoryAxis.axisRanges.create();
        range.category = tempArray[0].category;
        range.endCategory = tempArray[tempArray.length - 1].category;
        range.label.text = tempArray[0].provider;
        range.label.dy = 30;
        range.label.truncate = true;
        range.label.fontWeight = 'bold';
        range.label.tooltipText = tempArray[0].provider;

        range.label.adapter.add('maxWidth', (maxWidth, target) => {
          const range = target.dataItem;
          const startPosition = categoryAxis.categoryToPosition(range.category, 0);
          const endPosition = categoryAxis.categoryToPosition(range.endCategory, 1);
          const startX = categoryAxis.positionToCoordinate(startPosition);
          const endX = categoryAxis.positionToCoordinate(endPosition);
          return endX - startX;
        });
      }
    } else {
      chartData = [];
    }

    chart.data = chartData;

    const range = categoryAxis.axisRanges.create();
    range.category = chart.data[chart.data.length - 1].category;
    range.label.disabled = true;
    range.tick.location = 1;
    range.grid.location = 1;
  }

  prepateChart() {
    const chart = am4core.create('prefer', am4charts.XYChart);

    const data = this.state.graphData;

    chart.language.locale = am4lang_ru_RU;

    chart.data = data;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';

    series.tooltipText = `{valueY.value} ${this.state.data.currency}`;
    chart.cursor = new am4charts.XYCursor();

    series.bullets.push(new am4charts.CircleBullet());

    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;
  }

  prepareTableData() {
    const items = [];

    this.state.data.products.map((item) => {
      const itemModified = {
        name: item.name,
        sales: `${item.sales} ${getLocales('шт.')}`,
      };
      items.push(itemModified);
    });

    this.setState({
      items,
    });
  }

  updateItems(items) {
    this.setState({
      items,
    });
  }

  render() {
    const tableColumns = [
      {
        title: getLocales('Товар'), dataIndex: 'name', key: 'name', sort: true,
      },
      {
        title: getLocales('Кол-во продаж'), dataIndex: 'sales', key: 'sales', sort: true,
      },
    ];

    return (
      <>
        <div className="row margin-15">
          <div className="col-lg-8">
            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Статистика магазина')}
                  {' '}
                  <span className="text-right right"><a onClick={this.toggle}>{getLocales('Рассчитать прибыль')}</a></span>
                </h4>

                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('От')}
                      </label>
                      <input
                        type="date"
                        onChange={this.handleChange}
                        value={this.state.dateFrom}
                        name="dateFrom"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="form-control-label font-m">
                        {getLocales('До')}
                      </label>
                      <input
                        type="date"
                        onChange={this.handleChange}
                        value={this.state.dateTo}
                        name="dateTo"
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="col-lg-8" />

                  <div className="col-lg-4">
                    <button
                      type="button"
                      onClick={this.getData}
                      className="btn btn-primary auth-btn font-m margin-15"
                    >
                      {getLocales('Применить')}
                    </button>
                  </div>

                  <div className="col-lg-12">
                    <h4 className="font-m">{getLocales('График оборота')}</h4>
                    <div id="prefer" style={{ width: '100%', height: '50vh' }} />
                  </div>

                  <div className="col-lg-12">
                    <h4 className="font-m">{getLocales('График продаж по районам')}</h4>
                    <div id="areas" style={{ width: '100%', height: '50vh' }} />
                  </div>

                  <div className="col-lg-12 margin-15">
                    <h4 className="font-m">{getLocales('График продаж товаров')}</h4>
                    <div id="productsgraph" style={{ width: '100%', height: '50vh' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="col-lg-4">
            <div className={`income font-m animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <h4>
                <span>{getLocales('Сумма адресов в наличии')}</span>
                {' '}
                <span className="text-right right">
                  <a onClick={this.toggle}>
                    {getLocales('Подробнее')}
                  </a>
                </span>
              </h4>
              <h2>
                <span>
                  {this.state.data.sellersSum}
                  {' '}
                  {this.state.data.currency}
                </span>
              </h2>
            </div>

            <div className={`block animate__animated animate__fadeIn ${this.state.loading ? 'blur' : ''}`}>
              <div className="block-body">
                <h4 className="font-m">
                  {getLocales('Топ продаж')}
                </h4>
                {this.state.data.products.length > 0
                  ? (
                    <Table
                      columns={tableColumns}
                      items={this.state.items}
                      updateItems={this.updateItems}
                      rowsPerPage="5"
                    />
                  )
                  : (
                    <div className="text-center font-m">
                      {getLocales('Товары отсутствуют')}
                    </div>
                  )}

              </div>
            </div>
          </div>
        </div>

        {/* <ProfitModal
        products={this.state.data.products}
        currency={this.state.data.currency}
        purchases={this.state.data.purchases}
        subproducts={this.state.data.subproducts}
        toggle={this.toggle}
        modal={this.state.modal}/> */}
      </>
    );
  }
}

export default Statistics;
