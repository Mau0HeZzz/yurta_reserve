<template>
  <ChartWrapper
    :title="title"
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
  name: 'HistoryCharts',
  components: {
    ChartWrapper,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    themeMode: {
      type: String,
      default: 'light',
    },
    settings: {
      type: Object,
      default: () => ({
        series: [],
        colors: [],
        categories: [],
      }),
    },
  },
  computed: {
    series() {
      return this.settings?.series || [];
    },
    chartOptions() {
      return {
        colors: this.settings?.colors || [],
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
          showForSingleSeries: true,
          position: 'top',
          horizontalAlign: 'center',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 1,
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -4,
          style: {
            colors: this.themeMode === 'dark' ? ['#E2E2E2'] : ['#444445'],
          },
          background: {
            enabled: false,
          }
        },
        xaxis: {
          categories: this.settings?.categories || [],
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
          min: 1,
          axisBorder: {
            show: true,
            color: '#E2E2E2',
          },
          axisTicks: {
            show: false,
          },
          labels: {
            formatter: (value) => Math.round(Number(value)),
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
