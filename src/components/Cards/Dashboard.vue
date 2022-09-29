<template>
  <!-- <v-col
    class="board"
    cols="12"
  > -->
    <v-card
      elevation="2"
      class="board overflow-hidden"
    >
      <v-card-title class="text-uppercase">{{ card.title }}</v-card-title>
      <v-card-text>
        <apexchart height="100%" type="line" :options="card.data.chartOptions" :series="values"></apexchart>
      </v-card-text>
    </v-card>
  <!-- </v-col> -->
</template>

<script>
export default {
  name: 'DashboardCard',
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    card: {
      'title': 'Соответствие температурному графику',
      'data': {
        series: [
          {
            name: "High - 2013",
            data: [25, 23, 14, 36, 32, 32, 33]
          },
          {
            name: "Low - 2013",
            data: [28, 29, 33, 18, 17, 13, 13]
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
          colors: ['#77B6EA', '#545454'],
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
            min: 5,
            max: 40
          },
          legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
          }
        },
      }
    }
  })
}
</script>
