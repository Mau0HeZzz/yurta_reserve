<template>
  <ChartWrapper :title="title">
    <apexchart
      type="area"
      height="210"
      :options="chartOptions"
      :series="series"
    />
  </ChartWrapper>
</template>

<script>
import ChartWrapper from '@/components/Overhaul/ChartWrapper';

export default {
  name: 'CollectabilityCharts',
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
    enabledOnSeries: {
      type: [Array, Boolean],
      default: () => true,
    },
    info: {
      type: Object,
      required: true,
    }
  },
  computed: {
    series() {
      return this.info?.series || [];
    },
    chartOptions() {
      return {
        colors: ['#48485A', '#6C5DD3'],
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
          enabledOnSeries: this.enabledOnSeries,
          style: {
            fontSize: '10px',
          },
          formatter: (val, opts) => this.info?.percentages[opts.dataPointIndex] || '',
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.65,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        xaxis: {
          categories: this.info?.titles || [],
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
  }
};
</script>
