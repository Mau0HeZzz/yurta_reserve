<template>
  <v-container class="col-12">
    <v-row>
      <v-col class="text-underline" cols="12">
        <router-link :to="{ name: 'OrgList', params: { 'filter': $route.params.filter } }">
          <v-icon style="font-size: 14px; vertical-align: inherit;">mdi-arrow-left</v-icon>
          вернуться к списку
        </router-link>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="font-weight-bold text-uppercase" cols="12">
        Карта организации
      </v-col>
    </v-row>

    <v-row v-if="orgInfo">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title style="word-break: break-word;">
            {{ orgInfo.shortName }}
          </v-card-title>
          <v-simple-table dense>
            <tbody>
              <tr v-for="(od, od_key) in orgData" :key="od_key">
                <td>{{ od.title }}:</td>
                <td v-if="od.hasOwnProperty('type')">
                  <a :href="'tel:'+ od.value" v-if="od.type == 'phone'">{{ od.value }}</a>
                  <a :href="'mailto:'+ od.value" v-else-if="od.type == 'email'">{{ od.value }}</a>
                  <a :href="od.value" target="_blank" v-else-if="od.type == 'url'">{{ od.value }}</a>
                </td>
                <td v-else>{{ od.value ? od.value : 'Нет данных' }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
        <v-card class="mt-5">
          <v-card-title>
            Карта предприятия:
          </v-card-title>
          <v-simple-table dense>
            <tbody>
              <tr v-for="(oad, oad_key) in orgAddData" :key="oad_key">
                <td>{{ oad.title }}:</td>
                <td>{{ oad.value }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card>
      </v-col>


      <v-col cols="12" md="8">
        <v-row style="width: 100%">
          <v-slide-group>
            <v-slide-item>
              <HeatCard class="ma-3" style="width: 350px; height: 300px;" />
            </v-slide-item>
            <v-slide-item>
              <DashboardCard class="ma-3" style="width: 350px; height: 300px;" />
            </v-slide-item>
            <v-slide-item>
              <PaymentsCard class="ma-3" style="width: 350px; height: 300px;" />
            </v-slide-item>
            <v-slide-item>
              <OutagesCard class="ma-3" style="width: 350px; height: 300px;" />
            </v-slide-item>
            <v-slide-item>
              <EfficiencyCard class="ma-3" style="width: 350px; height: 300px;" />
            </v-slide-item>
          </v-slide-group>
        </v-row>

        <!-- <PageFilters style="width: 100%" ref="filter" :types="[ 'region' ]" @changeFtr="changeFtr" /> -->

        <v-row>
          <v-pagination
            v-model="pagination.page"
            :length="pagination.totalPages"
            :total-visible="7"
            v-show="pagination.totalPages > 1"
          ></v-pagination>
          <v-simple-table
            dense
            style="width: 100%"
            v-if="!$apollo.queries.getHouses.loading"
          >
            <thead>
              <tr>
                <th>№</th>
                <th>Адрес</th>
                <th>Статус объекта</th>
                <th>ОПУ</th>
                <th>Класс энерг.эф.</th>
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

          <v-pagination
            v-model="pagination.page"
            :length="pagination.totalPages"
            :total-visible="7"
            v-show="pagination.totalPages > 1"
          ></v-pagination>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import gql from 'graphql-tag';
import DashboardCard from '@/components/Cards/Dashboard.vue';
import HeatCard from '@/components/Cards/Heat.vue';
import PaymentsCard from '@/components/Cards/Payments.vue';
import OutagesCard from '@/components/Cards/Outages.vue';
import EfficiencyCard from '@/components/Cards/Efficiency.vue';
// import PageFilters from '@/components/PageFilters.vue';

export default {
  name: 'OrgInfo',
  metaInfo: {
    title: 'Карта организации'
  },
  components: {
    DashboardCard,
    HeatCard,
    PaymentsCard,
    OutagesCard,
    EfficiencyCard,
    // PageFilters,
  },
  apollo: {
    getOrganization: {
      query: require('@/graphql/getOrganization.gql'),
      variables() {
        return {
          "guid": this.filters.org,
          "fullInfo": true
        }
      },
      skip() {
        return (this.filters.org ? false : true)
      },
      manual: true,
      result(response) {
        this.orgInfo = response.data.getOrganization;
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
  },
  data: () => ({
    filters: {
      'region': null,
      'org': null,
      'addr': null
    },
    orgInfo: null,
    orgAddData: [
      {
        'title': 'Количество ЦТП',
        'value': 'Нет данных'
      },
      {
        'title': 'Количество ОПУ',
        'value': 'Нет данных'
      },
      {
        'title': 'Количество ИПУ',
        'value': 'Нет данных'
      },
      {
        'title': 'Количество л/с',
        'value': 'Нет данных'
      },
      {
        'title': 'Протяженность теплопровода',
        'value': 'Нет данных'
      },
      {
        'title': 'Магистральных',
        'value': 'Нет данных'
      },
      {
        'title': 'Межквартальных',
        'value': 'Нет данных'
      },
      {
        'title': 'Количество объектов недвижимости',
        'value': 'Нет данных'
      },
      {
        'title': 'Общий оборот',
        'value': 'Нет данных'
      },
      {
        'title': 'Численный состав',
        'value': 'Нет данных'
      },
    ],
    houses: null,
    selectedOrg: null,
    pagination: {
      page: 1,
      itemsOnPage: 10,
      totalPages: 1,
      scroll: false
    }
  }),
  computed: {
    orgData() {
      var data = [],
          org = this.orgInfo;

      for (var variable in org) {
        switch (variable) {
          case 'chiefFirstName':
            data.push({
              'title': 'Руководитель',
              'value': (org.chiefLastName ? org.chiefLastName +' ' : '')
                        + (org.chiefFirstName ? org.chiefFirstName +' ' : '')
                        + (org.chiefMiddleName ? org.chiefMiddleName : '')
            });
            break;
          case 'phone':
            data.push({ 'title': 'Телефон', 'value': org[variable], 'type': 'phone' });
            break;
          case 'url':
            data.push({ 'title': 'Сайт', 'value': org[variable], 'type': 'url' });
            break;
          case 'inn':
            data.push({ 'title': 'ИНН', 'value': org[variable] });
            break;
          case 'orgn':
            data.push({ 'title': 'ОГРН', 'value': org[variable] });
            break;
          case 'kpp':
            data.push({ 'title': 'КПП', 'value': org[variable] });
            break;
          case 'orgAddress':
            data.push({ 'title': 'Адрес предприятия', 'value': org[variable] });
            break;
          case 'fullName':
            data.push({ 'title': 'Наименование', 'value': org[variable] });
            break;
          case 'orgEmail':
            data.push({ 'title': 'Email', 'value': org[variable], 'type': 'email' });
            break;
        }
      }
      return data;
    },
  },
  methods: {
    changeFtr(args) {
      switch(args.name) {
        case 'region':
          this.filters.region = args.value;
          break;
        case 'org': {
          // this.filters.org = args.value;
          let orgs = this.$refs.filter.$apollo.data.getResourceOrganizations;
          this.orgInfo = orgs.find((o) => { return (o.guid == args.value ? true : false) });
          this.selectedOrg = orgs.findIndex((o) => { return (o.guid == args.value ? true : false) });
          break;
        }
        case 'addr':
          console.log('addr');
          break;
      }
    }
  },
  mounted() {
    if (Object.prototype.hasOwnProperty.call(this.$route.query, 'guid')) {
      this.filters.org = this.$route.query.guid;
    }
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
