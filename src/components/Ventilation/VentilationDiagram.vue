<template>
  <ChartWrapperVent :title="title" :sideText="meaning.sideTexts">
    <apexchart
      height="210"
      :options="chartOptions"
      :series="series"
    />
  </ChartWrapperVent>
</template>

<script>
import ChartWrapperVent from '@/components/Ventilation/ChartWrapperVent';
// import { convertIntegerToText } from "@/constants/helpers";

export default {
  name: 'VentilationDiagram',
  components: {
    ChartWrapperVent,
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
        }
      }
    },
  },
  data() {
    return {
      series: this.meaning.data.series,
    }
  },
  computed: {
    chartOptions() {
      return {
        chart: {
          type: 'donut'
        },
        colors: this.meaning.colors,
        states: {
          active: {
            filter: {
              type: 'none',
            }
          },
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          pie: {
            donut: {
              size: '50%',
            }
          }
        },
        legend: { show: false },
        labels: this.meaning.data.labels,
        tooltip: {
          enabled: true,
          y: {
            formatter: function(value) {
              value = '';
              return value
            }
          },
        }
      }
    }
  }
};
</script>