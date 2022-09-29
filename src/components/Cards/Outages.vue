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
      <v-card-text class="d-inline-flex">
        <ul>
          <li
            class="d-flex justify-space-between py-2"
            v-for="(cd, cd_id) in convertData"
            :key="cd_id"
          >
            <span class="d-inline-flex">
              <v-icon large :color="cd.color" v-show="cd.color">
                mdi-map-marker
              </v-icon>
              <div class="d-flex flex-column">
                <div class="d-flex align-center text-decoration-underline font-weight-bold text-h6" :style="'color: '+ cd.color">
                  {{ cd.value != null ? cd.value : 'Нет данных' }}
                </div>
                <div class="d-flex align-center text-body-1">
                  {{ cd.title }}
                </div>
              </div>
            </span>
          </li>
        </ul>
        <v-img
          src="/img/main/map.png"
          contain
          max-height="220"
        />
      </v-card-text>
    </v-card>
  <!-- </v-col> -->
</template>

<script>
export default {
  name: 'OutagesCard',
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    convertData() {
      var arr = [];
      if (this.values) {
        arr = [
          {
            'title': 'аварийные отключения',
            'value': this.values.emergencyShutdowns,
            'color': 'red'
          },
          {
            'title': 'плановые отключения',
            'value': this.values.plannedShutdowns,
            'color': 'green'
          },
          {
            'title': 'жителей без отопления и ГВС',
            'value': this.values.peopleWithoutHeating,
            'color': null
          }
        ];
      }
      return arr;
    }
  },
  data: () => ({
    // plannedShutdowns
    // emergencyShutdowns
    // peopleWithoutHeating
    card: {
      'title': 'Аварийные/плановые отключения',
      'data': [
        {
          'title': 'аварийные отключения',
          'value': 'Нет данных',
          'color': 'red'
        },
        {
          'title': 'плановые отключения',
          'value': 'Нет данных',
          'color': 'green'
        },
        {
          'title': 'жителей без отопления и ГВС',
          'value': 'Нет данных',
          'color': null
        }
      ]
    }
  })
}
</script>
