<template>
    <v-card
      elevation="2"
      class="overflow-hidden"
    >
      <v-card-title class="text-uppercase" :class="small ? 'text-subtitle-2' : ''">{{ card.title }}</v-card-title>
      <v-card-text>
        <apexchart :height="small ? '200px' : '270px'" type="line" :options="card.data.chartOptions" :series="card.data.series"></apexchart>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
  name: 'ResourceConsumptionCard',
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    card: {
      'title': 'Потребление ресурсов',
      'data': {
        series: [
          {
            name: "Газ",
            data: [0]
          },
          {
            name: "Вода",
            data: [0]
          },
          {
            name: "Электричество",
            data: [0]
          },
          {
            name: "Отопление",
            data: [0]
          },
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
            min: 0,
            max: 40
          },
          legend: {
            show: true,
            position: 'right',
            horizontalAlign: 'top',
            floating: false,
            offsetY: 0,
            offsetX: 0
          }
        },
      }
    }
  })
}
</script>
