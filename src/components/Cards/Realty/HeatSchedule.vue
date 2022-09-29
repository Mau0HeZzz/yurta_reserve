<template>
    <v-card
      elevation="0"
      class="overflow-hidden"
    >
      <v-card-title class="text-uppercase" :class="small ? 'text-subtitle-2' : ''">{{ card.title }}</v-card-title>
      <v-card-text>
        <apexchart ref="chart" :height="small ? '200px' : '270px'" type="line" :options="card.data.chartOptions" :series="card.data.series"></apexchart>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'HeatScheduleCard',
  props: {
    small: {
      type: Boolean,
      default: false
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    card: {
      'title': 'График потребления теплоснабжения',
      'data': {
        series: [
          {
            name: "Фактическое потребление",
            data: [0]
          },
          {
            name: "Плановое потребление",
            data: [0]
          }
        ],
        chartOptions: {
          chart: {
            height: '100%',
            type: 'line',
            dropShadow: {
              enabled: false,
              color: '#000',
              top: 18,
              left: 7,
              blur: 10,
              opacity: 0.2
            },
            toolbar: {
              show: false
            }
          },
          colors: ['#008ffb', '#00e396', '#feb019', '#ff4560'],
          dataLabels: {
            enabled: true,
          },
          stroke: {
            curve: 'smooth'
          },
          // title: {
          //   text: 'Average High & Low Temperature',
          //   align: 'left'
          // },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          markers: {
            size: 1
          },
          xaxis: {
            categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'],
            // title: {
            //   text: 'Months'
            // }
          },
          yaxis: {
            title: {
              text: 'Q, Гкал'
            },
            // min: 0,
            // max: 40
          },
          legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'top',
            floating: false,
            offsetY: 0,
            offsetX: 0
          }
        },
      }
    }
  }),
  methods: {
    updChart() {
      if (this.values.length == 0) {
        this.$refs.chart.updateOptions({
            series: [
              {
                name: "Фактическое потребление",
                data: [0]
              },
              {
                name: "Плановое потребление",
                data: [0]
              }
            ],
            xaxis: {
              categories: [0]
            }
          })
        return false;
      }
      console.log('upd');
      var fact = [],
          plan = [],
          date = [];
      for (var i = this.values.length - 14; i < this.values.length; i++) {
        fact.push(this.values[i].factualConsumption);
        plan.push(this.values[i].plannedConsumption != null ? this.values[i].plannedConsumption : 0 );
        date.push(this.$moment(this.values[i].date).format('DD.MM'));
      }
  // console.log(fact);
  // console.log(plan);
  // console.log(date);
      // this.card.data.series[0].data = fact;
      // this.card.data.series[1].data = plan;
      // this.card.data.chartOptions.xaxis.categories = date;


      // this.$refs.chart.updateOptions({
      //   xaxis: {
      //     categories: date
      //   }
      // });
      // this.$refs.chart.updateSeries([{
      //     data: [{
      //       name: "Фактическое потребление",
      //       data: fact
      //     },
      //     {
      //       name: "Плановое потребление",
      //       data: plan
      //     }]
      //   }]);
      this.$refs.chart.updateOptions({
          series: [
            {
              name: "Фактическое потребление",
              data: fact
            },
            {
              name: "Плановое потребление",
              data: plan
            }
          ],
          xaxis: {
            categories: date
          }
        })
    }
  },
  mounted() {
    // var vm = this;
    // setTimeout(this.updChart(), 500);
    // this.updChart();
  },
  watch: {
    values: {
      handler() {
        this.updChart();
        console.log('val upd');
      },
      deep: true
    }
  }
}
</script>
