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
      <v-card-subtitle class="d-flex justify-center">Общее количество объектов: {{ values ? values.totalHouses : 'Нет данных' }}</v-card-subtitle>
      <v-card-text>
        <v-row class="flex-nowrap justify-center">
          <ul class="efficiency-list d-flex flex-column" style="width: 100%">
            <li class="d-flex justify-space-between" v-for="(n, ni) in info" :key="ni">
              <span :class="'efficiency-type-'+ni+' text-body-1 mt-2'">
                <b>{{ n.title }}</b>
                <b class="pseudo-arrow">&#9654;</b>
              </span>
              <span class="text-body-1 mt-2">{{ values ? getClassValue(n.title) : n.value }}</span>
            </li>
          </ul>
          <!-- <v-img
            src="/img/main/energy.png"
            max-width="210"
          /> -->
          <!-- <v-spacer></v-spacer>
          <ul class="efficiency-list d-flex flex-column">
            <li v-for="n in 7" :key="n">
              <span class="text-body-1">{{ n**n }}</span>
            </li>
          </ul> -->
        </v-row>
      </v-card-text>
    </v-card>
  <!-- </v-col> -->
</template>

<script>
export default {
  name: 'EfficiencyCard',
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    info: [
      {
        'title': 'A',
        'value': 'Нет данных',
        'color': '#119c4a'
      },
      {
        'title': 'B',
        'value': 'Нет данных',
        'color': '#22b24c'
      },
      {
        'title': 'C',
        'value': 'Нет данных',
        'color': '#a6ce39'
      },
      {
        'title': 'D',
        'value': 'Нет данных',
        'color': '#e2e417'
      },
      {
        'title': 'E',
        'value': 'Нет данных',
        'color': '#f7941e'
      },
      {
        'title': 'F',
        'value': 'Нет данных',
        'color': '#ed1c24'
      },
      {
        'title': 'G',
        'value': 'Нет данных',
        'color': '#af1e23'
      },
    ],
    card: {
      'title': 'Энергоэффективность',
      'data': {
        series: [44, 55, 41, 17, 15],
        chartOptions: {
          chart: {
            type: 'donut',
          },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: '100%'
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
        },
      }
    }
  }),
  methods: {
    getClassValue(type) {
      var r = 'Нет данных';
      switch (type) {
        case 'A':
          r = this.values.classA;
          break;
        case 'B':
          r = this.values.classB;
          break;
        case 'C':
          r = this.values.classC;
          break;
        case 'D':
          r = this.values.classD;
          break;
        case 'E':
          r = this.values.classE;
          break;
        case 'F':
          r = this.values.classF;
          break;
        case 'G':
          r = this.values.classG;
          break;
      }
      return r;
    }
  }
}
</script>

<style lang="sass">
// #119c4a
// #22b24c
// #a6ce39
// #e2e417
// #f7941e
// #ed1c24
// #af1e23
$colors: #119c4a, #22b24c, #a6ce39, #e2e417, #f7941e, #ed1c24, #af1e23

.efficiency-list li
  span:first-of-type
    // &::after
    //   width: 20px
    //   height: 100%
    display: inline-flex
    justify-content: flex-end
    align-items: center
    b
      display: flex
      transform: translate(10px, 0)
    .pseudo-arrow
      transform: scale(2) translate(8px, 0)

// [class^="efficiency-type"]
//   &::after
//     content: ''

@for $i from 0 through 6
  .efficiency-type-#{$i}
    background-color: nth($colors, $i+1)
    width: calc(20% + #{$i*3%})
    .pseudo-arrow
      color: nth($colors, $i+1)
</style>
