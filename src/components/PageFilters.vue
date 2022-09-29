<template>
  <v-row
    dense
    class="justify-space-around"
  >
    <v-spacer></v-spacer>
    <v-col cols="12" sm="6" md="4" lg="3" v-if="types.includes('resource')">
      <v-autocomplete
        clearable
        filled
        dense
        rounded
        class="text-subtitle-2"
        :items="filters.resource"
        placeholder="Выберите ресурсоснабжение"
        v-model="selectedFilters.resource"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" sm="6" md="4" lg="3" v-if="types.includes('region')">
      <v-autocomplete
        clearable
        filled
        dense
        rounded
        class="text-subtitle-2"
        :items="filters.region"
        item-text="fullName"
        item-value="objectId"
        placeholder="Выберите регион"
        v-model="selectedFilters.region"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" sm="6" md="4" lg="3" v-if="types.includes('org')">
      <v-autocomplete
        clearable
        filled
        dense
        rounded
        class="text-subtitle-2"
        :items="filters.org"
        item-text="shortName"
        item-value="guid"
        placeholder="Выберите предприятие"
        v-model="selectedFilters.org"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" sm="6" md="4" lg="3" v-if="types.includes('addr')">
      <v-autocomplete
        clearable
        filled
        dense
        rounded
        class="text-subtitle-2"
        :items="filters.addr"
        item-text="shortAddress"
        item-value="gar"
        placeholder="Выберите адрес"
        v-model="selectedFilters.addr"
      ></v-autocomplete>
    </v-col>
    <v-col cols="12" sm="6" md="4" lg="3" v-if="types.includes('period')">
      <v-autocomplete
        clearable
        filled
        dense
        rounded
        class="text-subtitle-2"
        :items="filters.period"
        placeholder="Выберите период"
        v-model="selectedFilters.period"
      ></v-autocomplete>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PageFilters',
  apollo: {
    getAddrObj: {
      query: require('@/graphql/getAddrObj.gql'),
      skip() {
        return (this.types.includes('region') ? false : true)
      },
      result(response) {
        this.filters.region = response.data.getAddrObj.nextAddrObjs;
      }
    },
    getResourceOrganizations: {
      query: require('@/graphql/getResourceOrganizations.gql'),
      variables() {
        if (this.selectedFilters.region) {
          return {
            "addrObjId": this.selectedFilters.region
          }
        }
      },
      skip() {
        return (this.types.includes('org') ? false : true)
      },
      result(response) {
        this.filters.org = response.data.getResourceOrganizations.organizations;
      }
    },
    getHouses: {
      query: require('@/graphql/getHouses.gql'),
      variables() {
        return {
          "organizationGuid": this.selectedFilters.org,
          "addrObjId": this.selectedFilters.region,
          "pageNumber": 1,
          "itemsOnPage": 10000
        }
      },
      skip() {
        return (this.types.includes('addr') && (this.selectedFilters.region || this.selectedFilters.org) ? false : true)
      },
      manual: true,
      result(response) {
        this.filters.addr = response.data.getHouses.houses;
      }
    }
  },
  props: {
    types: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    filters: {
      resource: [],
      region: [],
      org: [],
      addr: [],
      period: []
    },
    selectedFilters: {
      resource: null,
      region: null,
      org: null,
      addr: null,
      period: null
    }
  }),
  watch: {
    "$apollo.loading"(isActive) {
      if (isActive) {
        this.$root.$children[0].isLoading += 1;
        // setTimeout(() => this.$root.$children[0].isLoading = false, 1000);
      } else {
        this.$root.$children[0].isLoading -= 1;
      }
    },
    "selectedFilters.resource"(val) {
      if (!val) {
        this.filters.region = [];
        this.selectedFilters.region = null;
      }
    },
    "selectedFilters.region"(val) {
      if (this.selectedFilters.org) {
        this.filters.org = [];
        this.selectedFilters.org = null;
        if (!val) {
          this.$apollo.queries.getResourceOrganizations.refetch();
        }
      }
      this.$emit('changeFtr', {
        'name': 'region',
        'value': this.selectedFilters.region
      });
    },
    "selectedFilters.org"(val) {
      if (!val) {
        this.filters.addr = [];
        this.selectedFilters.addr = null;
      }
      this.$emit('changeFtr', {
        'name': 'org',
        'value': this.selectedFilters.org
      });
    },
    "selectedFilters.addr"(val) {
      if (!val) {
        this.filters.period = [];
        this.selectedFilters.period = null;
      }
      this.$emit('changeFtr', {
        'name': 'addr',
        'value': this.selectedFilters.addr
      });
    }
  }
}
</script>
