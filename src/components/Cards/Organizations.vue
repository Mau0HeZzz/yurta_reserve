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
      <v-card-subtitle class="d-flex justify-center">
        Общее количество объектов: {{ values ? values.totalHouses : 'Нет данных' }}
      </v-card-subtitle>
      <v-card-text>
        <ul class="org-list pl-0">
          <li class="d-flex justify-space-between org-list__item py-2" v-for="(cd, cd_id) in convertData" :key="cd_id">
            <span class="d-flex align-center font-weight-bold text-h2 text-no-wrap">
            <!-- <span class="org-list__item-value d-flex align-center"> -->
              <v-icon large color="teal lighten-2">mdi-chevron-right-circle-outline</v-icon>
              {{ cd.value != null ? cd.value : 'Нет данных' }}
            </span>
            <span class="d-flex align-center text-h5">{{ cd.title }}</span>
            <!-- <span class="org-list__item-title d-flex align-center">{{ cd.title }}</span> -->
          </li>
        </ul>
      </v-card-text>
    </v-card>
  <!-- </v-col> -->
</template>

<script>
export default {
  name: 'OrganizationsCard',
  props: {
    values: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    convertData() {
      var arr = [
        {
          'title': 'Теплоснабжающих организаций',
          'value': 'Нет данных'
        },
        {
          'title': 'Центральных тепловых пунктов',
          'value': 'Нет данных'
        },
        {
          'title': 'Индивидуальных тепловых пунктов',
          'value': 'Нет данных'
        },
      ];

      if (Object.prototype.hasOwnProperty.call(this.values, 'orgs')) {
        arr = [
          {
            'title': 'Теплоснабжающих организаций',
            'value': this.values.orgs.heatSupplyOrganizations
          },
          {
            'title': 'Центральных тепловых пунктов',
            'value': this.values.orgs.centralHeatingPoints
          },
          {
            'title': 'Индивидуальных тепловых пунктов',
            'value': this.values.orgs.individualHeatingPoints
          },
        ];
      }
      return arr;
    }
  },
  data: () => ({
    card: {
      'title': 'Теплоснабжающие организации',
      'data': [
        {
          'title': 'Теплоснабжающих организаций',
          'value': 'Нет данных'
        },
        {
          'title': 'Центральных тепловых пунктов',
          'value': 'Нет данных'
        },
        {
          'title': 'Индивидуальных тепловых пунктов',
          'value': 'Нет данных'
        },
      ]
    }
  })
}
</script>
