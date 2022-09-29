<template>
  <!-- <v-col
    class="board"
    cols="12"
  > -->
    <v-card
      elevation="2"
      class="board overflow-hidden"
    >
      <v-card-title class="text-uppercase">
        {{ card.title }}
      </v-card-title>
      <v-card-text>
        <apexchart
          height="290px"
          type="bar"
          :options="card.data.chartOptions"
          :series="card.data.series"
        ></apexchart>
      </v-card-text>
    </v-card>
  <!-- </v-col> -->
</template>

<script>
export default {
  name: 'PaymentsCard',
  props: {
    values: {
      type: Array,
      default: () => [{
        name: 'млрд. руб.',
        data: [0, 0, 0]
      }]
    }
  },
  data: () => ({
    card: {
      'title': 'Начисления и платежи',
      'data': {
        series: [{
          name: 'млрд. руб.',
          data: [0, 0, 0]
        }],
        chartOptions: {
          chart: {
            type: 'bar',
            toolbar: {
              show: false
            }
          },
          colors: ['#119c4a', '#a6ce39', '#af1e23'],
          plotOptions: {
            bar: {
              columnWidth: '45%',
              distributed: true,
            }
          },
          dataLabels: {
            enabled: true
          },
          legend: {
            show: false
          },
          labels: ['1,2 млрд.', '0,8 млрд.', '1,2 млрд.'],
          xaxis: {
            categories: [
              ['Начислено'],
              ['Оплачено'],
              ['Задолженность']
            ],
            labels: {
              style: {
                colors: ['#119c4a', '#a6ce39', '#af1e23'],
                fontSize: '12px'
              }
            }
          },
          yaxis: {
            title: {
              text: 'млрд. руб.',
              style: {
                color: undefined,
                fontSize: '14px',
                fontFamily: 'Gilroy, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-yaxis-title',
              },
            },
          },
        },
      }
    }
  })
}
</script>
