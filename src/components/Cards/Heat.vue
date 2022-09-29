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
        <apexchart ref="chart" height="100%" type="donut" :options="card.data.chartOptions" :series="values"></apexchart>
      </v-card-text>
    </v-card>
  <!-- </v-col> -->
</template>

<script>
export default {
  name: 'HeatCard',
  props: {
    values: {
      type: Array,
      default: () => [1]
    }
  },
  data: () => ({
    card: {
      'title': 'Приборы учета тепла',
      'data': {
        series: [44, 55, 41, 17, 15],
        chartOptions: {
          chart: {
            type: 'donut',
          },
          labels: ['Нет данных'],
          legend: {
            position: 'right'
          }
        },
      }
    }
  })
}
</script>
