<template>
  <ChartWrapper
    :title="title"
    title-max-width="100%"
    title-align="left"
  >
    <div :class="$style.wrapper">
      <apexchart
        :class="$style.chart"
        type="bar"
        height="430"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </ChartWrapper>
</template>

<script>
import ChartWrapper from '@/components/Overhaul/ChartWrapper';

export default {
  name: 'AverageInstallmentChart',
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
          show: false,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            distributed: true,
            borderRadius: 15,
            columnWidth: '80%',
            dataLabels: {
              position: 'top'
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -30,
          style: {
            fontWeight: 600,
            fontSize: 16,
            colors: this.themeMode === 'dark' ? ['#E2E2E2'] : ['#444445'],
          },
          background: {
            enabled: false,
          },
        },
        xaxis: {
          categories: this.settings?.categories?.map(item => item.split(' ')) || [],
          tickPlacement: 'between',
          minWidth: '90px',
          axisTicks: {
            show: false,
          },
          labels: {
            rotate: 0,
            minHeight: 60,
            style: {
              fontSize: '8px',
              cssClass: 'text-uppercase',
            },
          },
        },
        yaxis: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
      }
    }
  },
};
</script>

<style module>
.wrapper {
  overflow-x: auto;
}

.chart {
  min-width: 1000px;
}
</style>
