<template>
  <v-container class="col-12">
    <v-row>
      <v-col class="font-weight-bold text-uppercase" cols="12">
        Дашборд теплоснабжение
      </v-col>
    </v-row>

    <PageFilters :types="[ 'region' ]" @changeFtr="changeFtr" />

    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <HeatCard />
        </v-col>
        <v-col cols="12" md="4">
          <DashboardCard />
        </v-col>
        <v-col cols="12" md="4">
          <PaymentsCard />
        </v-col>
        <v-col cols="12" md="4">
          <OutagesCard :values="dashboards.shutdowns" @click.native="routeTo('Outages')" style="cursor: pointer;" />
        </v-col>
        <v-col cols="12" md="4">
          <EfficiencyCard :values="dashboards.energy" @click.native="routeTo('EnergyEfficiency')" style="cursor: pointer;" />
        </v-col>
        <v-col cols="12" md="4">
          <OrganizationsCard :values="{ 'totalHouses': dashboards.energy.totalHouses, 'orgs': dashboards.heatOrgs }" @click.native="routeTo('OrgList')" style="cursor: pointer;" />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import DashboardCard from '@/components/Cards/Dashboard.vue';
import HeatCard from '@/components/Cards/Heat.vue';
import PaymentsCard from '@/components/Cards/Payments.vue';
import OutagesCard from '@/components/Cards/Outages.vue';
import EfficiencyCard from '@/components/Cards/Efficiency.vue';
import OrganizationsCard from '@/components/Cards/Organizations.vue';
import PageFilters from '@/components/PageFilters.vue';

export default {
  name: 'Dashboard',
  metaInfo: {
    title: 'Дашборд теплоснабжение'
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
      region: null
    },
    dashboards: {
      energy: {},
      shutdowns: {},
      heatOrgs: {}
    }
  }),
  methods: {
    routeTo(name) {
      this.$router.push({ 'name': name });
    },
    changeFtr(args) {
      switch(args.name) {
        case 'region':
          this.filters.region = args.value;
          break;
      }
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
