<template>
  <v-container class="col-12">
    <v-row>
      <v-col class="font-weight-bold text-uppercase" cols="12">
        Класс энергоэффективности объекта недвижимости
      </v-col>
    </v-row>

    <PageFilters :types="[ 'region', 'org' ]" @changeFtr="changeFtr" />

    <v-row v-if="filters.org">
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" md="4" class="px-0">
            <EfficiencyCard :values="{}" class="mx-3" />
          </v-col>
          <v-col cols="12" md="4" class="px-0">
            <DashboardCard :values="[]" class="mx-3" />
          </v-col>
          <v-col cols="12" md="4" class="px-0">
            <HeatCard :values="[]" class="mx-3" />
          </v-col>
        </v-row>

        <v-row>
          <v-spacer></v-spacer>
          <v-col cols="12" md="6">

            <!-- <PageFilters :types="[ 'addr' ]" @changeFtr="changeFtr" /> -->

            <v-autocomplete
              clearable
              dense
              placeholder="Выберите адрес"
              v-model="filters.addr"
              :items="housesFullList"
              item-text="shortAddress"
              item-value="gar"
              @click:clear="$apollo.queries.getHouses.refetch()"
            ></v-autocomplete>
            <!-- <v-text-field label="Поиск адреса">
              <v-icon
                slot="append"
                color="grey"
              >
                mdi-magnify
              </v-icon>
            </v-text-field> -->
          </v-col>
        </v-row>

        <v-simple-table dense class="table_striped" v-if="!$apollo.queries.getHouses.loading">
          <thead>
            <tr>
              <th>№</th>
              <th>Адрес</th>
              <th>Статус объекта</th>
              <th>% соответствия</th>
              <th>класс энерг.эф.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(oh, oh_key) in houses" :key="oh_key">
              <td>{{ (pagination.page - 1) * 10 + oh_key + 1 }}</td>
              <td>{{ oh.shortAddress }}</td>
              <td>{{ oh.gisHouseType ? oh.gisHouseType.houseTypeName : '' }}</td>
              <td>{{ oh.gisHouseCondition ? oh.gisHouseCondition.houseCondition : '' }}</td>
              <td>{{ oh.energyEfficiency }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-skeleton-loader type="table" style="width: 100%" v-else></v-skeleton-loader>

        <v-row style="margin: 10px" v-show="!filters.addr">
          <v-spacer></v-spacer>
          <v-pagination
            v-model="pagination.page"
            :length="pagination.totalPages"
            :total-visible="7"
            v-show="pagination.totalPages > 1"
          ></v-pagination>
        </v-row>
      </v-col>

      <v-col cols="12" md="6">
        <v-row class="col-12">
          <v-simple-table dense class="table" style="width: 100%">
            <thead>
              <tr class="table_row-header_light">
                <th colspan="5" class="text-subtitle-1 font-weight-bold">Расчет изменения класса энергоэффективности</th>
              </tr>
              <tr class="table_row-header">
                <th colspan="5" class="text-center">Класс предварительного уровня энергоэффективности</th>
              </tr>
              <tr class="table_row-header">
                <th rowspan="2">Вид используемого ресурса</th>
                <th colspan="2">Текущий</th>
                <th colspan="2">Прогнозный</th>
              </tr>
              <tr class="table_row-header">
                <th>Баллы</th>
                <th>Класс</th>
                <th>Баллы</th>
                <th>Класс</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="height: 0px"></td>
                <td style="height: 0px"></td>
                <td rowspan="5">Нет данных</td>
                <td style="height: 0px"></td>
                <td rowspan="5">Нет данных</td>
              </tr>
              <tr>
                <td>Тепловая энергия (отопление)</td>
                <td>Нет данных</td>
                <td>Нет данных</td>
              </tr>
              <tr>
                <td>Электрическая энергия</td>
                <td>Нет данных</td>
                <td>Нет данных</td>
              </tr>
              <tr>
                <td>Водоснабжение</td>
                <td>Нет данных</td>
                <td>Нет данных</td>
              </tr>
              <tr>
                <td>Качество управления, использование ВЭР, экологий</td>
                <td>Нет данных</td>
                <td>Нет данных</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table_row-header">
                <td>Сумма баллов</td>
                <td>Нет данных</td>
                <td>Нет данных</td>
                <td>Нет данных</td>
                <td>Нет данных</td>
              </tr>
            </tfoot>
          </v-simple-table>
        </v-row>

        <v-row class="col-12">
          <v-simple-table dense style="width: 100%">
            <thead>
              <tr class="table_row-header_light">
                <th colspan="3" class="text-subtitle-1 font-weight-bold">Энергосберегающие мероприятия</th>
              </tr>
              <tr class="table_row-header">
                <th></th>
                <th>Кол-во баллов</th>
                <th>Наименование мероприятия</th>
              </tr>
            </thead>
            <tbody>
              <tr :class="true ? 'table_row-selected' : ''">
                <td>
                  <v-checkbox
                    input-value="true"
                    disabled
                  ></v-checkbox>
                </td>
                <td>Нет данных</td>
                <td>Нет данных</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-row>
      </v-col>
    </v-row>

    <NoFiltersSelected :title="'Класс энергоэффективности объекта недвижимости'" v-show="!filters.org" />
  </v-container>
</template>

<script>
import PageFilters from '@/components/PageFilters.vue';
import EfficiencyCard from '@/components/Cards/Efficiency.vue';
import DashboardCard from '@/components/Cards/Dashboard.vue';
import HeatCard from '@/components/Cards/Heat.vue';

import NoFiltersSelected from '@/components/NoFiltersSelected.vue';

export default {
  name: 'EnergyEfficiency',
  metaInfo: {
    title: 'Класс энергоэффективности объекта недвижимости'
  },
  components: {
    PageFilters,
    NoFiltersSelected,
    EfficiencyCard,
    DashboardCard,
    HeatCard
  },
  apollo: {
    getEnergyEfficiency: {
      query: require('@/graphql/getEnergyEfficiency.gql'),
      variables() {
        return {
          "houseGar": this.filters.addr
        }
      },
      skip() {
        return (this.filters.addr ? false : true)
      },
      manual: true,
      result(response) {
        this.energyEfficiency = response.data.getEnergyEfficiency;
      }
    },
    getHouses: {
      query: require('@/graphql/getHouses.gql'),
      variables() {
        return {
          "organizationGuid": this.filters.org,
          "pageNumber": this.pagination.page,
          "itemsOnPage": this.pagination.itemsOnPage,
          "fullInfo": true
        }
      },
      skip() {
        return (this.filters.org ? false : true)
      },
      manual: true,
      result(response) {
        this.houses = response.data.getHouses.houses;
        this.pagination.totalPages = response.data.getHouses.pageInfo.totalPages;
      }
    },
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
        this.houses = [response.data.getGisHouse];
      }
    },
    getHousesFullList: {
      query: require('@/graphql/getHouses.gql'),
      variables() {
        return {
          "organizationGuid": this.filters.org,
          "pageNumber": 1,
          "itemsOnPage": 10000
        }
      },
      skip() {
        return this.filters.org ? false : true
      },
      manual: true,
      result(response) {
        this.housesFullList = response.data.getHouses.houses;
      }
    }
  },
  data: () => ({
    filters: {
      'region': null,
      'org': null,
      'addr': null
    },
    houses: [],
    housesFullList: [],
    pagination: {
      page: 1,
      itemsOnPage: 10,
      totalPages: 1,
      scroll: false
    },
    energyEfficiency: null,
  }),
  computed: {

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
    }
  },
  mounted() {
  },
  watch: {
    "$apollo.loading"(isActive) {
      if (isActive) {
        this.$root.$children[0].isLoading += 1;
      } else {
        this.$root.$children[0].isLoading -= 1;
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.table
  &_striped
    & tr:nth-child(even)
       background-color: #f2f2f2
       &:hover
         background-color: inherit
         filter: invert(10%)
  & th,td
    border-top: thin solid rgba(0, 0, 0, 0.05)
    border-left: thin solid rgba(0, 0, 0, 0.05)
    border-right: thin solid rgba(0, 0, 0, 0.05)
    border-bottom: thin solid rgba(0, 0, 0, 0.05)
  &_row
    &-header
      background-color: #e6edf5
      &_light
        background-color: #f1faff
    &-selected
      background-color: #f4f9fc
</style>
