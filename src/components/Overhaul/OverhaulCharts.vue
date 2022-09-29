<template>
  <ChartWrapper
    :title="title"
    :sub-title="subTitle"
  >
    <apexchart
      type="bar"
      height="180"
      :options="chartOptions"
      :series="series"
    />
  </ChartWrapper>
</template>

<script>
import ChartWrapper from '@/components/Overhaul/ChartWrapper';

export default {
  name: 'OverhaulCharts',
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
          titles: [],
          values: [],
        }
      },
    },
  },
  computed: {
    series() {
      return [{ data: this.meaning.values }];
    },
    chartOptions() {
      return {
        tooltip: {
          enabled: false,
        },
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
        plotOptions: {
          bar: {
            borderRadius: 6,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontWeight: 700,
            colors: this.themeMode === 'dark' ? ['#E2E2E2'] : ['#444445'],
          },
        },
        colors: '#6C5DD3',
        xaxis: {
          categories: this.meaning.titles,
          labels: {
            style: {
              fontSize: '10px',
            },
          },
          axisBorder: {
            show: true,
            color: '#E2E2E2',
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          axisBorder: {
            show: true,
            color: '#E2E2E2',
          },
          axisTicks: {
            show: false,
          },
        },
      }
    },
  }
};
</script>
