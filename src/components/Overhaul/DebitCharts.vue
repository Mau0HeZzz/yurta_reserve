<template>
  <ChartWrapper
    :title="title"
    :sub-title="subTitle"
  >
    <apexchart
      type="line"
      height="210"
      :options="chartOptions"
      :series="series"
    />
  </ChartWrapper>
</template>

<script>
import ChartWrapper from '@/components/Overhaul/ChartWrapper';

export default {
  name: 'DebitCharts',
  components: {
    ChartWrapper,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    subTitle: {
      type: String,
      default: '',
    },
    themeMode: {
      type: String,
      default: 'light',
    },
    meaning: {
      type: Object,
      default: () => {
        return {
          categories: [ '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022' ],
          series: [{
            name: 'муниципалитеты',
            data: [ 76, 85, 101, 98, 87, 105, 91, 114, 94 ],
          }, {
            name: 'физ.лица',
            data: [ 44, 55, 57, 56, 61, 58, 63, 60, 66 ],
          }, {
            name: 'юр.лица',
            data: [ 34, 45, 47, 46, 51, 48, 53, 50, 46 ],
          }, {
            name: 'рб',
            data: [ 29, 40, 42, 41, 46, 43, 48, 45, 41 ],
          }, {
            name: 'рф',
            data: [ 44, 55, 57, 56, 61, 58, 63, 60, 66 ],
          }],
        }
      }
    },
  },
  computed: {
    series() {
      return this.meaning?.series || [{
            name: 'муниципалитеты',
            data: [ 76, 85, 101, 98, 87, 105, 91, 114, 94 ],
          }, {
            name: 'физ.лица',
            data: [ 44, 55, 57, 56, 61, 58, 63, 60, 66 ],
          }, {
            name: 'юр.лица',
            data: [ 34, 45, 47, 46, 51, 48, 53, 50, 46 ],
          }, {
            name: 'рб',
            data: [ 29, 40, 42, 41, 46, 43, 48, 45, 41 ],
          }, {
            name: 'рф',
            data: [ 44, 55, 57, 56, 61, 58, 63, 60, 66 ],
          }];
    },
    chartOptions() {
      return {
        theme: {
          mode: this.themeMode,
        },
        stroke: {
          width: 2,
        },
        chart: {
          animations: {
            enabled: false,
          },
          background: 'transparent',
          fontFamily: 'Gilroy, sans-serif',
          toolbar: {
            show: false,
          },
        },
        grid: {
          show: false,
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'center',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 6,
            columnWidth: '70%',
          },
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0],
          offsetY: -4,
          style: {
            // fontSize: '10px',
            // fontWeight: 700,
            colors: this.themeMode === 'dark' ? ['#E2E2E2'] : ['#444445'],
            boxShadow: 'none',
          },
          background: {
            enabled: false,
          },
          dropShadow: {
            enabled: false,
          }
        },
        xaxis: {
          categories: this.meaning?.categories || [ '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022' ],
          tickPlacement: 'between',
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              fontSize: '10px',
            },
          },
        },
        yaxis: {
          min: 0,
          forceNiceScale: true,
          axisBorder: {
            show: true,
            color: '#E2E2E2',
          },
          axisTicks: {
            show: false,
          },
        },
        tooltip: {
          enabled: false,
        },
      }
    }
  },
};
</script>
