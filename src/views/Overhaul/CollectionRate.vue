<template>
  <div>
    <VRow justify="space-between">
      <VCol cols="12" md="6" lg="5">
        <div class="text-h4">Собираемость взносов</div>
      </VCol>
      <OutagesFilters @filter-updated="updateFilter" :region="regions" />
    </VRow>

    <PlaceholderPage v-if="!isFilterCompleted" />

    <VRow v-if="isFilterCompleted">
      <VCol cols="6" xl="3" class="d-flex">
        <div class="d-flex flex justify-space-between unit unit--stats">
          <div class="unit__col">
            <div class="unit__title">Всего начислено</div>
            <div class="unit__value text-h5 font-weight-semibold">1,2 млрд.</div>
          </div>
          <div class="unit__col unit__col--right">
            <div class="unit__title">Всего собрано</div>
            <div class="unit__value text-h5 font-weight-semibold">1,1 млрд.</div>
          </div>
        </div>
      </VCol>
      <VCol cols="6" xl="3" class="d-flex">
        <div class="d-flex flex flex-column align-start justify-center unit unit--stats">
          <div class="unit__title">Средний % собираемости</div>
          <div class="unit__value text-h5 font-weight-semibold">88,3%</div>
        </div>
      </VCol>
      <VCol cols="12" xl="6" class="d-flex">
        <div class="d-flex flex justify-space-between unit unit--stats">
          <div :class="[$style.collectibleTitle, 'unit__title']">Средний % собираемости</div>
          <div :class="[$style.collectibleGrid, 'font-weight-semibold']">
            <template v-for="(item, i) in paidProportion">
              <div :key="i">
                {{ item.title }} {{ item.value }}%
              </div>
              <div :key="i+100" v-if="i === 2"></div>
            </template>
          </div>
        </div>
      </VCol>
    </VRow>

    <VRow v-if="isFilterCompleted">
      <VCol cols="12" md="6" xl="4" class="d-flex">
        <CollectionPercentCharts
          class="unit flex-grow-1"
          title="Собираемость (%)"
          :info="chargesOnMonthsPercent"
          :enabled-on-series="[1]"
          :theme-mode="themeMode"
        />
      </VCol>
      <VCol cols="12" md="6" xl="4" class="d-flex">
        <CollectionCurrencyCharts
          class="unit flex-grow-1"
          title="Общая собираемость (млн. руб.)"
          :meaning="chargesOnMonths"
          :theme-mode="themeMode"
        />
      </VCol>
      <VCol cols="12" xl="4" class="d-flex">
        <CollectionCurrencyCharts
          class="unit flex-grow-1"
          title="Начисления и платежи"
          split-titles
          :yaxis-labels-formatter="chart3Formatter"
          :data-labels-formatter="convertIntegerToText"
          :meaning="chargesByPayerType"
          :theme-mode="themeMode"
        />
      </VCol>
      <VCol cols="12" xl="8" class="d-flex">
        <div class="unit unitNoHover unit--no-hover flex-grow-1">
          <VueCustomScrollbar
            :class="$style.wrapper"
            :settings="scrollbarSettings"
            @ps-y-reach-end.prevent="scrollCallback"
          >
            <VDataTable
              disable-sort
              fixed-header
              hide-default-footer
              class="custom-table transparent"
              :loading="isPending"
              :headers="table.headers"
              :items="table.items"
              :items-per-page="-1"
            >
              <template #body="{ items }">
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.address }}</td>
                    <td class="text-center">{{ item.charged }}</td>
                    <td class="text-center">{{ item.paid }}</td>
                    <td class="text-center">{{ item.percentage }}</td>
                  </tr>
                </tbody>
              </template>
            </VDataTable>
          </VueCustomScrollbar>
        </div>
      </VCol>
      <VCol cols="12" xl="4" :class="[$style.map, 'd-flex']">
        <div class="unit unitNoHover flex-grow-1">
          <OverhaulMap :theme-mode="themeMode" />
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import { VCol, VRow, VDataTable } from "vuetify/lib";
import VueCustomScrollbar from "vue-custom-scrollbar";
import moment from "moment";
import PlaceholderPage from "@/components/Overhaul/PlaceholderPage";
import OutagesFilters from "@/components/Outages/OutagesFilters";
import CollectionPercentCharts from "@/components/Overhaul/CollectionPercentCharts";
import CollectionCurrencyCharts from "@/components/Overhaul/CollectionCurrencyCharts";
import OverhaulMap from "@/components/Overhaul/OverhaulMap";
import { scrollbarSettings } from "@/constants/scrollbar";
import { convertIntegerToText } from "@/constants";

export default {
  name: 'CollectionRate',
  metaInfo: {
    title: 'Собираемость взносов',
  },
  components: {
    VRow,
    VCol,
    VDataTable,
    PlaceholderPage,
    VueCustomScrollbar,
    OutagesFilters,
    CollectionPercentCharts,
    CollectionCurrencyCharts,
    OverhaulMap,
  },
  apollo: {
    getAddrObj: {
      query: require('@/graphql/getAddrObj.gql'),
      result(response) {
        this.regions = response.data.getAddrObj.nextAddrObjs;
      }
    },
    getOverhaulChargesDashboard: {
      query: require('@/graphql/getOverhaulChargesDashboard.gql'),
      variables() {
        return {
          periodStart: this.filter.period?.[0]?.toString(),
          periodEnd: this.filter.period?.[1]?.toString(),
          addrObjGar: this.filter.region,
        }
      },
      fetchPolicy: 'network-only',
      skip() {
        return !this.isFilterCompleted;
      },
      result(response) {
        const data = response?.data?.getOverhaulChargesDashboard || {};

        this.paidProportion = data?.chargesByPayerType?.map(item => ({
          title: item?.payerType?.title || '',
          value: item?.paidProportion || 0,
        }));

        this.chargesOnMonthsPercent = this.setChargesOnMonthsPercent(data?.chargesOnMonths);
        this.chargesOnMonths = this.setChargesOnMonths(data?.chargesOnMonths);
        this.chargesByPayerType = this.setChargesByPayerType(data?.chargesByPayerType);
      }
    },
    getOverhaulChargesByHouses: {
      query: require('@/graphql/getOverhaulChargesByHouses.gql'),
      variables() {
        return {
          periodStart: this.filter.period?.[0]?.toString(),
          periodEnd: this.filter.period?.[1]?.toString(),
          addrObjGar: this.filter.region,
          pageNumber: this.pageNumber,
          itemsOnPage: this.itemsOnPage,
        }
      },
      fetchPolicy: 'network-only',
      skip() {
        return !this.isFilterCompleted || this.lastPage;
      },
      result(response) {
        this.lastPage = response?.data?.getOverhaulChargesByHouses?.totalPages < this.pageNumber;
        const tableData = response?.data?.getOverhaulChargesByHouses?.chargesByHouses?.map(item => ({
          address: 'no data',
          charged: item.charged,
          paid: item.paid,
          percentage: item.percentage,
        })) || [];

        this.table.items = [...this.table.items, ...tableData];
      }
    },
  },
  data() {
    return {
      regions: [],
      filter: {
        period: [],
        region: '',
      },
      totalCharges: 0,
      totalPaid: 0,
      paidChargesProportion: 0,
      paidProportion: [],
      chargesOnMonthsPercent: {
        titles: [],
        series: [],
        percentages: [],
        colors: ['#48485A', '#1EB94B'],
      },
      chargesOnMonths: {
        titles: [],
        series: [{
          name: 'Собрано',
          data: [],
        }],
        colors: ['#48485A'],
      },
      chargesByPayerType: {
        titles: [],
        series: [],
        colors: ['#48485A', '#1EB94B'],
      },
      table: {
        headers: [
          { text: "№", value: "id", class: "text-uppercase" },
          { text: "Адрес", value: "address", class: "text-uppercase" },
          { text: "Начислено", value: "charged", align: "center", class: "text-uppercase" },
          { text: "Собрано", value: "paid", align: "center", class: "text-uppercase" },
          { text: "%", value: "percentage", align: "center", class: "text-uppercase" },
        ],
        items: [],
      },
      pageNumber: 0,
      itemsOnPage: 20,
      lastPage: false,
    }
  },
  computed: {
    isPending() {
      return this.$apollo.queries.getOverhaulChargesDashboard.loading;
    },
    scrollbarSettings: () => scrollbarSettings,
    isFilterCompleted() {
      return this.filter.region && this.filter.period?.length === 2;
    },
    themeMode() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
  },
  watch: {
    '$apollo.loading'(pending) {
      this.$emit('change-loading', pending);
    }
  },
  methods: {
    chart3Formatter: (val) => Number(val) / 1000000,
    convertIntegerToText: (val) => convertIntegerToText(val, 0),
    clearDate() {
      this.lastPage = false;
      this.pageNumber = 1;
      this.table.items = [];
    },
    updateFilter(filter) {
      this.clearDate();

      this.filter.region = filter.region;
      this.filter.period = filter.period?.map(date => {
        const [ day, month, year ] = date?.split('.');
        return `${ year }-${ month }-${ day }`;
      });
    },
    scrollCallback() {
      if (this.isPending || this.lastPage)
        return;

      this.pageNumber++;
    },
    setChargesOnMonths(data = []) {
      const localData = data?.reduce((acc, item) => ({
        titles: [...acc?.titles || [], moment(item?.monthDate || '').format('MM.YY')],
        data: [ ...acc?.data || [], (item?.paid / 1000000) || 0],
      }), {});

      return {
        titles: localData.titles,
        series: [{
          name: 'Собрано',
          data: localData.data,
        }],
        colors: ['#48485A'],
      }
    },
    setChargesOnMonthsPercent(data = []) {
      const localData = data?.reduce((acc, item) => ({
        titles: [...acc?.titles || [], moment(item?.monthDate || '').format('MM.YY')],
        charged: [...acc?.charged || [], (item?.charged / 10000000) || 0],
        paid: [...acc?.paid || [], (item?.paid / 10000000) || 0],
        percentages: [...acc?.percentages || [], `${ item?.paidProportion || '' }%`],
      }), {});

      return {
        titles: localData.titles,
        series: [{
          name: 'Начислено',
          data: localData.charged,
        }, {
          name: 'Собрано',
          data: localData.paid,
        }],
        percentages: localData.percentages,
      }
    },
    setChargesByPayerType(data = []) {
      const localData = data?.reduce((acc, item) => ({
        titles: [...acc?.titles || [], item?.payerType?.title || ''],
        charged: [...acc?.charged || [], item?.charged || 0],
        paid: [...acc?.paid || [], item?.paid || 0],
      }), {});

      return {
        titles: localData.titles,
        series: [{
          name: 'Начислено',
          data: localData.charged,
        }, {
          name: 'Собрано',
          data: localData.paid,
        }],
        colors: ['#48485A', '#1EB94B'],
      }
    },
  },
};
</script>

<style module>
.collectibleTitle {
  width: min-content;
}

.collectibleGrid {
  display: grid;
  justify-items: end;
  grid-template-columns: repeat(3, auto);
  grid-gap: 8px 14px;
  font-size: 12px;
}

.wrapper {
  max-height: 500px;
}

.map {
  min-height: 380px;
}
</style>
