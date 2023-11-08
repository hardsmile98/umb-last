/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getLocales, request } from 'utils';
import moment from 'moment';
import { toast } from 'react-toastify';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4lang_ru_RU from '@amcharts/amcharts4/lang/ru_RU';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Table } from 'components';
import ProfitModal from './ProfitModal';
import AddressesModal from './AddressesModal';

am4core.useTheme(am4themes_animated);

const tableColumns = [
  {
    title: getLocales('Товар'), dataIndex: 'name', key: 'name', sort: true,
  },
  {
    title: getLocales('Кол-во продаж'), dataIndex: 'sales', key: 'sales', sort: true,
  },
];

function Statistics() {
  const { shopId } = useParams();

  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [filter, setFilter] = useState({
    dateFrom: moment.unix(new Date(Date.now() - 2592000000)
      .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
    dateTo: moment.unix(new Date(Date.now() + 86400000)
      .setHours(0, 0, 0, 0) / 1000).format('YYYY-MM-DD'),
    product: null,
  });
  const [data, setData] = useState({
    purchases: [],
    products: [],
    sellersSum: 0,
    subproducts: [],
    currency: '',
  });
  const [items, setItems] = useState([]);
  const [isProfitModalOpen, setProfitModalOpen] = useState(false);
  const [isAddressesModalOpen, setAddressesModalOpen] = useState(false);

  const toggleProfitModal = () => setProfitModalOpen((prev) => !prev);
  const toggleAddressesModal = () => setAddressesModalOpen((prev) => !prev);

  const updateItems = (newItems) => setItems(newItems);

  const onChangeFilter = (e) => {
    const { name, value } = e.target;

    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const prepareTable = useCallback(() => {
    const newItems = data.products.map((item) => ({
      name: item.name,
      sales: `${item.sales} ${getLocales('шт.')}`,
    }));

    setItems(newItems);
  }, [data.products]);

  // График продаж по районам
  const prepareAreas = useCallback(() => {
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

    const chartData = [];

    if (data.purchases.length > 0) {
      const formattedData = data.purchases.reduce((acc, cur) => {
        if (acc[cur.category]) {
          if (acc[cur.category][cur.subcategory]) {
            return {
              ...acc,
              [cur.category]: {
                [cur.subcategory]: acc[cur.category][cur.subcategory] + 1,
                quantity: acc[cur.category].quantity + 1,
              },
            };
          }

          return {
            ...acc,
            ...acc,
            [cur.category]: {
              [cur.subcategory]: 1,
              quantity: acc[cur.category].quantity
                ? acc[cur.category].quantity + 1
                : 1,
            },
          };
        }

        if (cur.subcategory) {
          return {
            ...acc,
            [cur.category]: {
              [cur.subcategory]: 1,
              quantity: 1,
            },
          };
        }

        return {
          ...acc,
          [cur.category]: {
            Город: 1,
            quantity: 1,
          },
        };
      }, {});

      Object.keys(formattedData).forEach((providerName) => {
        const providerData = formattedData[providerName];

        const tempArray = [];

        let count = 0;

        Object.keys(providerData).forEach((itemName) => {
          if (itemName !== 'quantity') {
            count += 1;
            tempArray.push({
              category: `${providerName}_${itemName}`,
              realName: itemName,
              value: providerData[itemName],
              provider: providerName,
            });
          }
        });

        const lineSeriesDataIndex = Math.floor(count / 2);
        tempArray[lineSeriesDataIndex].quantity = providerData.quantity;
        tempArray[lineSeriesDataIndex].count = count;

        am4core.array.each(tempArray, (item) => {
          chartData.push(item);
        });

        const range = categoryAxis.axisRanges.create();
        range.category = tempArray[0].category;
        range.endCategory = tempArray[tempArray.length - 1].category;
        range.label.text = tempArray[0].provider;
        range.label.dy = 30;
        range.label.truncate = true;
        range.label.fontWeight = 'bold';
        range.label.tooltipText = tempArray[0].provider;

        range.label.adapter.add('maxWidth', (_maxWidth, target) => {
          const rangeCategory = target.dataItem;
          const startPosition = categoryAxis.categoryToPosition(rangeCategory.category, 0);
          const endPosition = categoryAxis.categoryToPosition(rangeCategory.endCategory, 1);
          const startX = categoryAxis.positionToCoordinate(startPosition);
          const endX = categoryAxis.positionToCoordinate(endPosition);
          return endX - startX;
        });
      });
    }

    chart.data = chartData;

    const range = categoryAxis.axisRanges.create();
    range.category = chart.data[chart.data.length - 1]?.category;
    range.label.disabled = true;
    range.tick.location = 1;
    range.grid.location = 1;
  }, [data.purchases]);

  // График оборота
  const prepateTurnover = useCallback(() => {
    const chart = am4core.create('prefer', am4charts.XYChart);

    chart.language.locale = am4lang_ru_RU;

    const statistics = data.purchases.reduce((acc, cur) => {
      const date = new Date(+new Date(+cur.closed).setHours(0, 0, 0, 0));

      if (!acc[date]) {
        return {
          ...acc,
          [date]: {
            value: +cur.sum,
            date: new Date(+new Date(+cur.closed).setHours(0, 0, 0, 0)),
          },
        };
      }

      return {
        ...acc,
        [date]: {
          ...acc[date],
          value: acc[date].value + (+cur.sum),
        },
      };
    }, {});

    const turnover = Object.keys(statistics).map((date) => ({
      date: new Date(date),
      value: statistics[date].value,
    }));

    chart.data = turnover;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = 'date';
    series.dataFields.valueY = 'value';

    series.tooltipText = `{valueY.value} ${data.currency}`;
    chart.cursor = new am4charts.XYCursor();

    series.bullets.push(new am4charts.CircleBullet());

    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;
  }, [data.currency, data.purchases]);

  // График продаж товаров
  const prepareProducts = useCallback(() => {
    const chart = am4core.create('productsgraph', am4charts.PieChart);

    chart.language.locale = am4lang_ru_RU;

    const statistics = data.purchases.reduce((acc, cur) => {
      const name = `${cur.product} ${cur.subproduct}`;

      if (!acc[name]) {
        return {
          ...acc,
          [name]: 1,
        };
      }

      return {
        ...acc,
        [name]: acc[name] + 1,
      };
    }, {});

    const products = Object.keys(statistics).map((name) => ({
      name,
      value: statistics[name],
    }));

    chart.data = products;

    const pieSeries = chart.series.push(new am4charts.PieSeries());

    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'name';

    pieSeries.slices.template.stroke = am4core.color('#d3190a');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 0.5;

    pieSeries.labels.template.disabled = true;

    pieSeries.slices.template.fillOpacity = 0.2;

    pieSeries.slices.template.tooltipText = `{category}: {value.value} ${getLocales('распродано')}`;
  }, [data.purchases]);

  useEffect(() => {
    if (isSuccess) {
      prepareTable();
      prepareAreas();
      prepateTurnover();
      prepareProducts();
    }
  }, [
    isSuccess,
    prepareTable,
    prepareAreas,
    prepateTurnover,
    prepareProducts,
  ]);

  const getData = useCallback(() => {
    setLoading(true);
    setSuccess(false);

    const body = {
      api: 'user',
      body: {
        data: {
          section: 'shop',
          type: 'statistic',
          subtype: 'getnew',
          dateFrom: +new Date(filter.dateFrom),
          dateTo: +new Date(filter.dateTo),
          shop: shopId,
        },
        action: 'shops',
      },
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };

    request(body, (response) => {
      if (response.status !== 200) {
        setSuccess(false);
        toast.error('Сервер недоступен');
        return;
      }

      if (!response.data.success) {
        setLoading(false);
        setSuccess(false);
        toast.error(response.data.message);
        return;
      }

      setData(response.data.data);
      setLoading(false);
      setSuccess(true);
    });
  }, [shopId, filter]);

  useEffect(() => {
    am4core.addLicense('ch-custom-attribution');

    if (localStorage.getItem('theme') !== 'default') {
      am4core.useTheme(am4themes_dark);
    }

    getData();

    return () => {
      am4core.disposeAllCharts();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="row margin-15">
        <div className="col-lg-8">
          <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {getLocales('Статистика магазина')}
                {' '}
                <span className="text-right right">
                  <a onClick={toggleProfitModal} aria-hidden>
                    {getLocales('Рассчитать прибыль')}
                  </a>
                </span>
              </h4>

              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('От')}
                    </label>
                    <input
                      type="date"
                      onChange={onChangeFilter}
                      value={filter.dateFrom}
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
                      onChange={onChangeFilter}
                      value={filter.dateTo}
                      name="dateTo"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Город')}
                    </label>
                    <input
                      type="date"
                      onChange={onChangeFilter}
                      value={filter.dateTo}
                      name="dateTo"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label className="form-control-label font-m">
                      {getLocales('Товар')}
                    </label>
                    <input
                      type="date"
                      onChange={onChangeFilter}
                      value={filter.dateTo}
                      name="dateTo"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  <button
                    type="button"
                    onClick={getData}
                    className="btn btn-primary auth-btn font-m"
                  >
                    {getLocales('Применить')}
                  </button>
                </div>

                <div className="col-lg-12 margin-15">
                  <h4 className="font-m">
                    {getLocales('График оборота')}
                  </h4>
                  <div
                    id="prefer"
                    style={{ width: '100%', height: '50vh' }}
                  />
                </div>

                <div className="col-lg-12">
                  <h4 className="font-m">
                    {getLocales('График продаж по районам')}
                  </h4>
                  <div
                    id="areas"
                    style={{ width: '100%', height: '50vh' }}
                  />
                </div>

                <div className="col-lg-12 margin-15">
                  <h4 className="font-m">
                    {getLocales('График продаж товаров')}
                  </h4>
                  <div
                    id="productsgraph"
                    style={{ width: '100%', height: '50vh' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`income font-m animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
            <h4>
              <span>
                {getLocales('Сумма адресов в наличии')}
              </span>
              {' '}
              <span className="text-right right">
                <a onClick={toggleAddressesModal} aria-hidden>
                  {getLocales('Подробнее')}
                </a>
              </span>
            </h4>
            <h2>
              <span>
                {data.sellersSum}
                {' '}
                {data.currency}
              </span>
            </h2>
          </div>

          <div className={`block animate__animated animate__fadeIn ${isLoading ? 'blur' : ''}`}>
            <div className="block-body">
              <h4 className="font-m">
                {getLocales('Топ продаж')}
              </h4>

              {data.products.length > 0
                ? (
                  <Table
                    columns={tableColumns}
                    items={items}
                    updateItems={updateItems}
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

      <ProfitModal
        products={data.products}
        currency={data.currency}
        purchases={data.purchases}
        subproducts={data.subproducts}
        toggle={toggleProfitModal}
        modal={isProfitModalOpen}
      />

      <AddressesModal
        toggle={toggleAddressesModal}
        modal={isAddressesModalOpen}
      />
    </>
  );
}

export default Statistics;
