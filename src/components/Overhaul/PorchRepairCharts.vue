<template>
  <ChartWrapper :title="title">
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
import { convertIntegerToText } from "@/constants/helpers";

export default {
  name: 'PorchRepairCharts',
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
    meaning: {
      type: Object,
      default: () => {
        return {
          titles: [],
          values: [],
          color: '#FFED00'
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
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontWeight: 700,
            colors: this.themeMode === 'dark' ? ['#E2E2E2'] : ['#444445'],
          },
          formatter: function (val) {
            val = typeof val === 'number' ? convertIntegerToText(val) : val;
            return val;
          },
        },
        colors: this.meaning.color,
        xaxis: {
          categories: this.meaning.titles,
          labels: {
            show: true,
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
          show: true,
          axisBorder: {
            show: true,
            color: '#E2E2E2',
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: true,
            formatter: function (val) {
              val = typeof val === 'number' ? convertIntegerToText(val).replace(' млн.', '').replace(' тыс.', '') : val;
              return val;
            },
          }
        },
      }
    },
  }
};
</script>
