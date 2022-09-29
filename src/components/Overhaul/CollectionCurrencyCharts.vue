<template>
  <ChartWrapper
    :title="title"
    :sub-title="subTitle"
    :title-max-width="titleMaxWidth"
  >
    <apexchart
      type="bar"
      height="210"
      :options="chartOptions"
      :series="series"
    />
  </ChartWrapper>
</template>

<script>
import ChartWrapper from '@/components/Overhaul/ChartWrapper';

export default {
  name: 'CollectionCurrencyCharts',
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
    titleMaxWidth: {
      type: String,
      default: '',
    },
    themeMode: {
      type: String,
      default: 'light',
    },
    dataLabelsFormatter: {
      type: Function,
      default: (val) => val === null ? '' : val,
    },
    yaxisLabelsFormatter: {
      type: Function,
      default: (val) => val,
    },
    splitTitles: {
      type: Boolean,
      default: false,
    },
    meaning: {
      type: Object,
      default: () => {
        return {
          titles: [ 'Физ.лица', 'Юр.лица', 'Муниципалитеты', 'РБ', 'РФ' ],
          series: [
            {
              name: 'Начислено',
              data: [ 44, 55, 57, 56, 61 ],
            },
            {
              name: 'Собрано',
              data: [ 76, 85, 101, 98, 87 ],
            },
          ],
          colors: ['#48485A', '#1EB94B'],
          distributed: false,
          showLegend: true,
        }
      }
    }
  },
  computed: {
    series() {
      return this.meaning?.series || [];
    },
    chartOptions() {
      return {
        colors: this.meaning?.colors || [],
        theme: {
          mode: this.themeMode,
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
          show: ('showLegend' in this.meaning) ? this.meaning.showLegend : true,
          position: 'top',
          horizontalAlign: 'center',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            distributed: this.meaning?.distributed || false,
            borderRadius: 6,
            columnWidth: '70%',
            dataLabels: {
              position: 'top'
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: this.dataLabelsFormatter,
          offsetY: -20,
          style: {
            colors: this.themeMode === 'dark' ? ['#E2E2E2'] : ['#444445'],
          }
        },
        xaxis: {
          categories: this.splitTitles ? this.meaning?.titles?.map(item => item.split(' ') || []) : this.meaning?.titles,
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              fontSize: '8px',
              cssClass: 'text-uppercase',
            },
          },
        },
        yaxis: {
          max: (max) => max * 1.1,
          forceNiceScale: true,
          labels: {
            formatter: this.yaxisLabelsFormatter,
          },
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
