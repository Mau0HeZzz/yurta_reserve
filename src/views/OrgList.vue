<template>
  <v-container class="col-12">
    <v-row>
      <v-col class="font-weight-bold text-uppercase" cols="12">
        Список организаций
      </v-col>
    </v-row>

    <PageFilters ref="filter" :types="[ 'region', 'org' ]" @changeFtr="changeFtr" />
    <!-- <PageFilters :types="[ 'resource', 'region', 'org', 'addr', 'period' ]" /> -->

    <v-row class="col-12 board-row mx-auto">
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
          <OutagesCard :values="dashboards.shutdowns" class="ma-3" style="width: 350px; height: 300px;" />
        </v-slide-item>
        <v-slide-item>
          <EfficiencyCard :values="dashboards.energy" class="ma-3" style="width: 350px; height: 300px;" />
        </v-slide-item>
        <v-slide-item>
          <OrganizationsCard :values="{ 'totalHouses': dashboards.energy.totalHouses, 'orgs': dashboards.heatOrgs }" class="ma-3" style="width: 350px; height: 300px;" />
        </v-slide-item>
      </v-slide-group>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        :style="'max-height: '+ heightForList +'px; overflow-y: auto;'"
        ref="orgList"
        @scroll.passive="handleScroll"
      >
        <v-card
          class="mb-5"
          v-for="(org, org_index) in orgList" :key="org_index"
        >
          <v-card-title>
            <h6>{{ org.shortName }}</h6>
            <v-spacer></v-spacer>
            <router-link
              :to="{
                'name': 'OrgInfo',
                'query': {
                  'guid': org.guid
                },
                'params': {
                  'filter': filters
                }
              }"
              class="primary--text text-caption text-underline link"
            >
              Перейти к организации
            </router-link>
          </v-card-title>
          <v-simple-table dense>
            <tbody>
              <tr v-for="(od, od_key) in orgData(org_index)" :key="od_key">
                <td>{{ od.title }}</td>
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
        <v-card v-show="resOrgPagination.scroll">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </v-card>
        <!-- <v-tabs v-model="selectedOrg">
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="(aotab, aotab_key) in orgList" :key="aotab_key">
            {{ aotab.shortName }}
          </v-tab>
        </v-tabs>
        <v-simple-table dense>
          <tbody>
            <tr v-for="(od, od_key) in orgData" :key="od_key">
              <td>{{ od.title }}</td>
              <td>{{ od.value }}</td>
            </tr>
          </tbody>
        </v-simple-table> -->
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
import OrganizationsCard from '@/components/Cards/Organizations.vue';
import PageFilters from '@/components/PageFilters.vue';

export default {
  name: 'OrgList',
  metaInfo: {
    title: 'Список организаций'
  },
  components: {
    DashboardCard,
    HeatCard,
    PaymentsCard,
    OutagesCard,
    EfficiencyCard,
    OrganizationsCard,
    PageFilters,
  },
  apollo: {
    getResourceOrganizations: {
      query: require('@/graphql/getResourceOrganizations.gql'),
      variables() {
        var queryObj = {
          "pageNumber": this.resOrgPagination.page,
          "itemsOnPage": this.resOrgPagination.itemsOnPage,
          "fullInfo": true
        };
        if (this.filters.region) {
          queryObj['addrObjId'] = this.filters.region;
        }
        return queryObj;
      },
      // skip() {
      //   return (this.filters.region ? false : true)
      // },
      // manual: true,
      result(response) {
        if (!this.resOrgPagination.scroll) {
          this.orgList = response.data.getResourceOrganizations.organizations;
        } else {
          this.orgList = this.orgList.concat(response.data.getResourceOrganizations.organizations);
          this.resOrgPagination.scroll = false;
        }
        this.resOrgPagination.totalPages = response.data.getResourceOrganizations.pageInfo.totalPages;
      }
    },
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
        this.orgList = [response.data.getOrganization];
      }
    },
    getDashboard: {
      query: require('@/graphql/getDashboard.gql'),
      variables() {
        if (this.filters.region) {
          return {
            "addrObjId": this.filters.region
          }
        } else {
          return {}
        }
      },
      result(response) {
        this.dashboards.energy = response.data.getDashboard.energyEfficiencyInfo;
        this.dashboards.shutdowns = response.data.getDashboard.shutdownsInfo;
        this.dashboards.heatOrgs = response.data.getDashboard.heatSupplyOrganizationsInfo;
      }
    }
  },
  data: () => ({
    filters: {
      'region': null,
      'org': null,
      'addr': null
    },
    resOrgPagination: {
      page: 1,
      itemsOnPage: 10,
      totalPages: 1,
      scroll: false
    },
    selectedOrg: null,
    orgList: [],
    dashboards: {
      energy: {},
      shutdowns: {},
      heatOrgs: {}
    }
  }),
  computed: {
    heightForList() {
      return window.innerHeight*.7;
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
          this.orgList = this.$apolloData.data.getResourceOrganizations.organizations;
          this.resOrgPagination.page = 1;
          // let orgs = this.$refs.filter.$apollo.data.getResourceOrganizations;
          // let org = orgs.find((o) => { return (o.guid == args.value ? true : false) });
          // this.orgs = [org];
          break;
        }
        case 'addr':
          console.log('addr');
          break;
      }

      if (!this.checkFilter()) {
        this.orgList = [];
        this.resOrgPagination.page = 1;
      }
    },
    checkFilter() {
      let r = false;
      for (let obj in this.filters) {
        r = this.filters[obj] ? true : false;
        if (r) {
          return r;
        }
      }
      return r;
    },
    handleScroll(e) {
      var elFullHeight = e.target.scrollHeight,
          elHeight = this.$refs.orgList.offsetHeight,
          scrollY = e.target.scrollTop;

      if (elFullHeight > elHeight) {
        if (elFullHeight - elHeight - scrollY < 500
            && this.resOrgPagination.page < this.resOrgPagination.totalPages
        ) {
          if (!this.$apollo.queries.getResourceOrganizations.loading
              && this.resOrgPagination.page < this.resOrgPagination.totalPages
          ) {
            this.resOrgPagination.scroll = true;
            this.resOrgPagination.page += 1;
            this.$apollo.queries.getResourceOrganizations.refetch;
          }
        }
      }
    },
    orgData(index) {
      var data = [],
          org = this.orgList[index];

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
    }
  },
  mounted() {
    if (Object.prototype.hasOwnProperty.call(this.$route.params, 'filter')) {
      // this.filters = this.$route.params.filter;
      this.$refs.filter.selectedFilters.region = this.$route.params.filter.region;
      // this.$refs.filter.$apollo.queries.getResourceOrganizations.loading
      this.$refs.filter.selectedFilters.org = this.$route.params.filter.org;
    }
  },
  watch: {
    "$apollo.loading"(isActive) {
      if (isActive) {
        this.$root.$children[0].isLoading += 1;
      } else {
        this.$root.$children[0].isLoading -= 1;
      }
    },

  }
}
</script>

<style lang="sass" scoped>
table
  & td:first-of-type
    width: 250px
  & th,td
    font-size: 1em !important

@media (max-width: 1000px)
  table
    & td:first-of-type
      width: auto
</style>
