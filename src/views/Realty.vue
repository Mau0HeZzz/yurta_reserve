<template>
  <v-container class="col-12">
    <v-row>
      <v-col class="font-weight-bold text-uppercase" cols="12">
        Карта объекта недвижимости
      </v-col>
    </v-row>

    <PageFilters :types="[ 'region', 'org', 'addr' ]" @changeFtr="changeFtr" />
    <!-- <PageFilters :types="[ 'resource', 'region', 'org', 'addr' ]" /> -->

    <v-row v-if="houseInfo">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            {{ houseInfo.shortAddress }}
          </v-card-title>
          <v-col cols="12" style="height: 200px; width: 100%">
            <div
              id="realty-map"
              style="height: 100%; min-height: 200px; z-index: 5;"
              v-if="houseInfo.geo"
            ></div>
            <div
              class="d-flex align-center justify-center"
              style="background-color: #f2f2f2; height: 100%"
              v-else
            >Нет геоданных</div>
          </v-col>
          <v-simple-table dense>
            <tbody>
              <tr v-for="(hd, hd_key) in houseData" :key="hd_key">
                <td>{{ hd.title }}:</td>
                <td>{{ hd.value != null ? hd.value : 'Нет данных' }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>

        <v-card class="mt-5">
          <v-card-title class="text-subtitle-2 text-decoration-underline">
            Обслуживающие организации:
          </v-card-title>
          <v-simple-table dense>
            <tbody>
              <tr v-for="(rod, rod_key) in resOrgData" :key="rod_key">
                <td>{{ rod.title }}:</td>
                <td v-if="Array.isArray(rod.value)">{{ rod.value.map(function(item) { return item['shortName'] }).join(', ') }}</td>
                <td v-else>{{ rod.value ? rod.value : 'Нет данных' }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12" md="6">
            <ResourceConsumptionCard />
          </v-col>
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="text-h5">
                Финансовые показатели
              </v-card-title>
              <v-simple-table dense>
                <thead>
                  <tr>
                    <th>Коммунальная услуга</th>
                    <th>Выставление</th>
                    <th>Собрано</th>
                    <th>Долг</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Газоснабжение</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                  </tr>
                  <tr>
                    <td>ХВС</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                  </tr>
                  <tr>
                    <td>ГВС</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                  </tr>
                  <tr>
                    <td>Отопление</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                  </tr>
                  <tr>
                    <td>Электроснабжение</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                  </tr>
                  <tr>
                    <td>Капитальный ремонт</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                  </tr>
                  <tr>
                    <td>ТКО</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                  </tr>
                  <tr>
                    <td>Содержание МКД</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                    <td>Нет данных</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-tabs v-model="activeTab">
              <v-tab v-for="(tab, tab_index) in tabNames" :key="tab_index">
                {{ tab }}
              </v-tab>
            </v-tabs>
            <!-- <div class="text-h6">
              Отопление
            </div> -->
          </v-col>
          <v-row class="col-12" v-if="activeTab == 0">
            <v-col cols="12" md="6">
              <HeatScheduleCard :values="heatConsumption.heatConsumptionData" />
              <v-col cols="12">
                Фактическое потребление: {{ heatConsumption.totalFactualConsumption != null ? heatConsumption.totalFactualConsumption +' Гкалл' : 'Нет данных' }}
              </v-col>
              <v-col cols="12">
                Плановое потребление: {{ heatConsumption.totalPlannedConsumption != null ? heatConsumption.totalPlannedConsumption +' Гкалл' : 'Нет данных' }}
              </v-col>
              <v-col cols="12">
                Класс энергоэффективности МКД: {{ houseInfo.energyEfficiency ? houseInfo.energyEfficiency : 'Нет данных' }}
              </v-col>
            </v-col>
            <v-col cols="12" md="6">
              <v-simple-table dense>
                <tbody>
                  <tr v-for="(rdi, rdi_key) in resDataInfo" :key="rdi_key">
                    <td>{{ rdi.title }}:</td>
                    <td>{{ rdi.value }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col class="d-flex justify-center">
              Нет данных
            </v-col>
          </v-row>
        </v-row>
      </v-col>
    </v-row>

    <NoFiltersSelected :title="'Карта объекта недвижимости'" v-show="!houseInfo" />
  </v-container>
</template>

<script>
import L from "leaflet";
import PageFilters from '@/components/PageFilters.vue';
import ResourceConsumptionCard from '@/components/Cards/Realty/ResourceConsumption.vue';
import HeatScheduleCard from '@/components/Cards/Realty/HeatSchedule.vue';

import NoFiltersSelected from '@/components/NoFiltersSelected.vue';

export default {
  name: 'Realty',
  metaInfo: {
    title: 'Карта объекта недвижимости'
  },
  components: {
    PageFilters,
    ResourceConsumptionCard,
    HeatScheduleCard,
    NoFiltersSelected,
  },
  apollo: {
    getGisHouse: {
      query: require('@/graphql/getGisHouse.gql'),
      variables() {
        return {
          "gar": this.filters.addr
        }
      },
      skip() {
        return (this.filters.addr ? false : true)
      },
      manual: true,
      result(response) {
        this.houseInfo = response.data.getGisHouse;
        this.initMap();
      }
    },
    getDashboard: {
      query: require('@/graphql/getDashboard.gql'),
      variables() {
        return {
          "houseGAR": this.filters.addr,
          "heatConsumption": true,
          "default": false
        }
      },
      skip() {
        return (this.filters.addr ? false : true)
      },
      manual: true,
      result(response) {
        this.heatConsumption = response.data.getDashboard.heatConsumption;
      }
    }
  },
  data: () => ({
    filters: {
      'region': null,
      'org': null,
      'addr': null
    },
    houseInfo: null,
    selectedAddr: null,
    activeTab: 0,
    tabNames: [
      'Отопление',
      'Конструктивные элементы',
      'Инженерные системы',
      'Энергетический паспорт',
      'Уборка',
      'Кап.ремонт',
      'Износ',
      'Сезонный осмотр',
      'План осмотра',
      'Особый режим',
      'Помещения',
      'Приборы учета',
      'Общие собрания',
      'Договоры',
      'Информация',
      'Собственники',
      'Документы',
    ],
    heatConsumption: {}
  }),
  computed: {
    houseData() {
      var data = [],
          house = this.houseInfo;

      for (var variable in house) {
        switch (variable) {
          case 'fias':
            data.push({ 'title': 'ФИАС', 'value': house[variable] });
            break;
          case 'floorCount':
            data.push({ 'title': 'Кол-во этажей', 'value': house[variable] });
            break;
          case 'totalSquare':
            data.push({ 'title': 'Общая площадь', 'value': house[variable] });
            break;
          case 'residentialSquare':
            data.push({ 'title': 'Жилая площадь', 'value': house[variable] });
            break;
          case 'residentialPremiseCount':
            data.push({ 'title': 'Кол-во жилых помещений', 'value': house[variable] });
            break;
          case 'nonResidentialPremiseCount':
            data.push({ 'title': 'Кол-во не жилых помещений', 'value': house[variable] });
            break;
          // case 'municipalityOrganization':
          //   data.push({ 'title': 'Муниципальная организация', 'value': house[variable].shortName });
          //   break;
          // case 'managementOrganization':
          //   data.push({ 'title': 'Управляющая организация', 'value': house[variable].shortName });
          //   break;
          // case 'gisHouseCondition':
          //   data.push({ 'title': 'Состояние дома', 'value': house[variable].houseCondition });
          //   break;
          // case 'gisHouseType':
          //   data.push({ 'title': 'Тип дома', 'value': house[variable].houseTypeName });
          //   break;
          // case 'energyEfficiency':
          //   data.push({ 'title': 'Класс энергоэффективности', 'value': house[variable] });
          //   break;
          // case 'resourceOrganizations':
          //   data.push({ 'title': 'Ресурсные организации', 'value': house[variable] });
          //   break;
        }
      }

      data.push({
        'title': 'Кад. номер',
        'value': 'Нет данных'
      });
      data.push({
        'title': 'УИН ГИСЖКХ',
        'value': 'Нет данных'
      });
      return data;
    },
    resOrgData() {
      return [
        {
          'title': 'Теплоснабжение',
          'value': 'Нет данных'
          // 'value': this.houseInfo.resourceOrganizations ? this.houseInfo.resourceOrganizations : 'Нет данных'
        },
        {
          'title': 'Водоснабжение(ХВС)',
          'value': 'Нет данных'
        },
        {
          'title': 'Водоснабжение(ГВС)',
          'value': 'Нет данных'
        },
        {
          'title': 'Газоснабжение',
          'value': 'Нет данных'
        },
        {
          'title': 'Электроснабжение',
          'value': 'Нет данных'
        },
        {
          'title': 'Оператор ТКО',
          'value': 'Нет данных'
        },
        {
          'title': 'Капитальный ремонт',
          'value': 'Нет данных'
        },
        {
          'title': 'Лифтовая компания',
          'value': 'Нет данных'
        },
        {
          'title': 'Управляющая компания',
          'value': this.houseInfo.managementOrganization ? this.houseInfo.managementOrganization.shortName : 'Нет данных'
        },
        {
          'title': 'Домофонная компания',
          'value': 'Нет данных'
        },
        {
          'title': 'Медицинские учреждения',
          'value': 'Нет данных'
        },
        {
          'title': 'Образовательная организация',
          'value': 'Нет данных'
        },
      ];
    },
    resDataInfo() {
      var arr = [
        {
          'title': 'Общедомовой прибор учета',
          'value': 'Нет данных'
        },
        {
          'title': 'Марка',
          'value': 'Нет данных'
        },
        {
          'title': 'Модель',
          'value': 'Нет данных'
        },
        {
          'title': 'Заводской номер',
          'value': 'Нет данных'
        },
        {
          'title': 'Дата установки',
          'value': 'Нет данных'
        },
        {
          'title': 'Дата поверки',
          'value': 'Нет данных'
        },
        {
          'title': 'Телеметрия',
          'value': 'Нет данных'
        },
        {
          'title': 'Система отопления',
          'value': 'Нет данных'
        },
        {
          'title': 'Инженерные коммуникации',
          'value': 'Нет данных'
        },
        {
          'title': 'Используемый ресурс',
          'value': 'Нет данных'
        },
      ];
      if (this.filters.addr == 79318310) {
// общедомовой прибор учета: да
// марка: б/н (без названия как я понял)
// модель: - (нет отдельного поля под модель в ГИС ЖКХ, фактически модель указана в марке)
// Заводской номер: 18-072444
// Дата установки: -
// Дата поверки: 03.12.2022
// Телеметрия: нет
// Система отопления: Центральная
// Инженерные коммуникации: полипропилен, сталь
// Используемый ресурс: Горячая вода
        arr = [
          {
            'title': 'Общедомовой прибор учета',
            'value': 'Да'
          },
          {
            'title': 'Марка',
            'value': 'б/н'
          },
          {
            'title': 'Модель',
            'value': 'Нет данных'
          },
          {
            'title': 'Заводской номер',
            'value': '18-072444'
          },
          {
            'title': 'Дата установки',
            'value': 'Нет данных'
          },
          {
            'title': 'Дата поверки',
            'value': '03.12.2022'
          },
          {
            'title': 'Телеметрия',
            'value': 'Нет данных'
          },
          {
            'title': 'Система отопления',
            'value': 'Центральная'
          },
          {
            'title': 'Инженерные коммуникации',
            'value': 'полипропилен, сталь'
          },
          {
            'title': 'Используемый ресурс',
            'value': 'Горячая вода'
          },
        ]
      }
      return arr;
    }
  },
  methods: {
    changeFtr(args) {
      switch(args.name) {
        case 'region':
          this.filters.region = args.value;
          break;
        case 'org': {
          this.filters.org = args.value;
          // let orgs = this.$refs.filter.$apollo.data.getResourceOrganizations;
          // let org = orgs.find((o) => { return (o.guid == args.value ? true : false) });
          // this.orgList = [org];
          break;
        }
        case 'addr':
          this.filters.addr = args.value;
          break;
      }
    },
    initMap() {
      if (!this.houseInfo.geo) {
        return false;
      }
      var mymap = null;
      mymap = L.map('realty-map').setView(this.houseInfo.geo, 12);

      L.tileLayer(this.$root.urlMap, {
        foo: 'bar',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      }).addTo(mymap);

      L.marker(this.houseInfo.geo, {
        'title': this.houseInfo.shortAddress
      }).addTo(mymap);
    }
  },
  mounted() {
  },
  watch: {

  }
}
</script>
