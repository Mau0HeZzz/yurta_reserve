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
  name: 'JobsTypesCharts',
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
    mainColor: {
      type: String,
      default: '#1EB94B',
    },
    meaning: {
      type: Object,
      default: () => {
        return {
          titles: [],
          values: []
        }
      }
    },
  },
  data() {
    return {
      series: [{
        data: this.meaning.values
      }],
      formatter: function (val) {
            val = typeof val === 'number' ? convertIntegerToText(val.toFixed(2)) : val.toFixed(2);
            return val;
          },
    }
  },
  computed: {
    chartOptions() {
      return {
        series: [{
          data: this.meaning.values
        }],
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
            borderRadius: 5,
            horizontal: true,
            barHeight: '50%',
            dataLabels: {
              position: 'top',
            }
          }
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          offsetX: 100000000000,
          style: {
            fontSize: '12px',
            colors: this.themeMode === 'dark' ? ['#E2E2E2'] : ['#444445'],
            textAlign: 'end'
          },
          formatter: this.meaning.formatter? this.meaning.formatter : this.formatter
        },
        colors: this.mainColor,
        xaxis: {
          categories: this.meaning.titles,
          labels: {
            show: false,
          },
          axisBorder: {
            color: this.mainColor,
            width: 0,
            height: 0,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          show: true,
          max: (max) => max * 1.4,
          axisBorder: {
            show: true,
            color: '#118332',
          },
          axisTicks: {
            show: false,
          },
        },
      }
    }
  }
};
</script>