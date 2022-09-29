<template>
  <div>
    <VRow justify="space-between">
      <VCol cols="12" md="6" lg="5">
        <div class="text-h4">Дебиторская задолженность</div>
      </VCol>
      <VCol cols="12" sm="8" md="7">
        <VRow justify="end">
          <VCol cols="12" sm="6">
            <v-autocomplete
              clearable
              dense
              type="select"
              filled
              rounded
              hide-details
              class="text-subtitle-2"
              placeholder="Выберите регион"
              item-text="fullName"
              item-value="objectId"
              v-model="region"
              :items="regions"
            />
          </VCol>
        </VRow>
      </VCol>
    </VRow>

    <PlaceholderPage
      v-if="!isFilterCompleted"
      text="Выберите регион для отображения данных"
    />

    <template v-else>
      <div :class="$style.receivable">
        <div v-for="(card, i) in cardStats" :key="i" :class="[$style.receivableItem, 'top-outages__item']">
          <div class="d-flex flex-column align-baseline flex justify-space-between unit unit--stats">
            <div class="unit__col">
              <div class="unit__title">{{ card.caption }}</div>
            </div>
            <div class="unit__col unit__col--right unit__col--100">
              <div class="unit__value text-h5 font-weight-semibold">{{ card.value }}</div>
            </div>
          </div>
        </div>
      </div>
      <VRow class="mt-3">
        <VCol cols="12" md="6" xl="4" class="d-flex">
          <DebitCharts
            class="unit flex-grow-1"
            title="Задолженность (млн.руб.)"
            sub-title="Нарастающим итогом"
            :theme-mode="themeMode"
            :meaning="debt"
          />
        </VCol>
        <VCol cols="12" md="6" xl="4" class="d-flex">
          <CollectionCurrencyCharts
            class="unit flex-grow-1"
            title="Судебная работа/Взыскания (млн.руб.)"
            sub-title="(Текущий год)"
            title-max-width="100%"
            :meaning="chart2"
            :dataLabelsFormatter="convertIntegerToText"
            :yaxisLabelsFormatter="chart2Formatter"
            :theme-mode="themeMode"
          />
        </VCol>
        <VCol cols="12" xl="4" class="d-flex">
          <CollectionCurrencyCharts
            class="unit flex-grow-1"
            title="Задолженность (млн.руб.)"
            :meaning="chart3"
            :dataLabelsFormatter="convertIntegerToText"
            :yaxisLabelsFormatter="chart2Formatter"
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
                    <td :class="$style.textBlue">{{ item.address }}</td>
                    <td class="text-center red--text">{{ item.physical }}</td>
                    <td class="text-center red--text">{{ item.legal }}</td>
                    <td class="text-center red--text">{{ item.municipality }}</td>
                    <td class="text-center red--text">{{ item.republic }}</td>
                    <td class="text-center red--text">{{ item.federal }}</td>
                    <td class="text-center red--text">{{ item.all }}</td>
                  </tr>
                  </tbody>
                </template>
              </VDataTable>
            </VueCustomScrollbar>
          </div>
        </VCol>
        <VCol cols="12" xl="4" :class="[$style.map, 'd-flex']">
          <div class="unit unitNoHover flex-grow-1">
            <OverhaulMap :theme-mode="themeMode" :mapData="mapData" />
          </div>
        </VCol>
      </VRow>
    </template>
  </div>
</template>

<script>
import { VCol, VRow, VDataTable } from "vuetify/lib";
import VueCustomScrollbar from "vue-custom-scrollbar";
import DebitCharts from "@/components/Overhaul/DebitCharts";
import CollectionCurrencyCharts from "@/components/Overhaul/CollectionCurrencyCharts";
import OverhaulMap from "@/components/Overhaul/OverhaulMap";
import { convertIntegerToText, scrollbarSettings, mapData } from "@/constants";
import PlaceholderPage from "@/components/Overhaul/PlaceholderPage";

export default {
  name: "AccountsReceivable",
  components: {
    PlaceholderPage,
    VRow,
    VCol,
    VDataTable,
    VueCustomScrollbar,
    DebitCharts,
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
    getOverhaulDebtDashboard: {
      query: require('@/graphql/getOverhaulDebtDashboard.gql'),
      variables() {
        return {
          addrObjGar: this.region,
        }
      },
      skip() {
        return !this.region;
      },
      result(response) {
        this.totalDebt = response.data.getOverhaulDebtDashboard.totalDebt;
        this.totalCollected = response.data.getOverhaulDebtDashboard.totalCollected;
        this.debtThreeYearsMore = response.data.getOverhaulDebtDashboard.debtThreeYearsMore;
        this.totalClaimed = response.data.getOverhaulDebtDashboard.totalClaimed;
        this.setOverhaulDebtDashboard(response.data.getOverhaulDebtDashboard);
        this.chart2.series[0].data = [response.data.getOverhaulDebtDashboard.totalClaimed, response.data.getOverhaulDebtDashboard.totalCollected]
        this.chart3 = this.setDebtOnPayerTypes(response.data.getOverhaulDebtDashboard.debtOnPayerTypes)
      }
    },
    getOverhaulDebtByHouses: {
      query: require('@/graphql/getOverhaulDebtByHouses.gql'),
      variables() {
        return {
          addrObjGar: this.region,
          pageNumber: this.pageNumber,
          itemsOnPage: this.itemsOnPage,
        }
      },
      skip() {
        return !this.region;
      },
      result(response) {
        this.maxPages = response.data.getOverhaulDebtByHouses.totalPages;
        this.setTableItems(response.data.getOverhaulDebtByHouses.debtByHouses);
      }
    },
  },
  data() {
    return {
      pageNumber: 1,
      itemsOnPage: 2,
      maxPages: 1,
      debt: {
        categories: [],
        series: [],
      },
      totalDebt: 0,
      totalCollected: 0,
      debtThreeYearsMore: 0,
      totalClaimed: 0,
      isPending: false,
      region: '',
      regions: [],
      filter: {
        period: [],
        region: '',
      },
      chart2: {
        titles: [ 'Подано в суд', 'Взыскано по суду' ],
        series: [{
          data: [ 320000000, 210000000 ],
        }],
        colors: ['#F58220', '#00AEEF'],
        distributed: true,
        showLegend: false,
      },
      chart2Formatter: (val) => val / 1000000,
      chart3: {
        titles: [ 'Физ.лица', 'Юр.лица', 'Муниципалитеты', 'РБ', 'РФ' ],
        series: [{
          data: [ 320000000, 110000000, 142000000, 110000000, 142000000 ],
        }],
        colors: ['#EE1D23'],
      },
      table: {
        headers: [
          { text: "№", value: "id", class: "text-uppercase" },
          { text: "Адрес", value: "address", class: "text-uppercase" },
          { text: "Физ.лица", value: "physical", align: "center", class: "text-uppercase" },
          { text: "Юр.лица", value: "legal", align: "center", class: "text-uppercase" },
          { text: "Муниципалитет", value: "municipality", align: "center", class: "text-uppercase" },
          { text: "Республика", value: "republic", align: "center", class: "text-uppercase" },
          { text: "Федеральные", value: "federal", align: "center", class: "text-uppercase" },
          { text: "Всего", value: "all", align: "center", class: "text-uppercase" },
        ],
        items: [],
      },
      id: 1,
    }
  },
  computed: {
    themeMode() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
    isFilterCompleted() {
      return Boolean(this.region);
    },
    mapData: () => mapData,
    scrollbarSettings: () => scrollbarSettings,
    cardStats() {
      return [
        { caption: 'Всего начислено', value: convertIntegerToText(28000000000) },
        { caption: 'Общая задолженность', value: convertIntegerToText(this.totalDebt) },
        { caption: 'Подано в суд', value: convertIntegerToText(this.totalClaimed) },
        { caption: 'Взыскано по суду', value: convertIntegerToText(this.totalCollected) },
        { caption: 'Задолженность свыше трех лет', value: convertIntegerToText(this.debtThreeYearsMore) },
      ]
    },
  },
  watch: {
    '$apollo.loading'(pending) {
      this.$emit('change-loading', pending);
    }
  },
  methods: {
    updateFilter(filter) {
      this.region = filter.region;
      this.filter.period = filter.period?.map(date => {
        const [ day, month, year ] = date?.split('.');
        return `${ year }-${ month }-${ day }`;
      })
    },
    setTableItems(array) {
      let arr = [];
      array.forEach((item, index)=>{
        let obj = {
          id: index + 1,
          address: item.gisHouse.shortAddress,
          physical: null,
          legal: null,
          municipality: null,
          republic: null,
          federal: null,
          all: item.totalDebt,
        }
        item.debtOnPayerTypes.forEach(e=>{
          switch (e.payerType.title) {
            case "Юридическое лицо":
              obj.legal = e.debt
              break;
            case "Физическое лицо":
              obj.physical = e.debt
              break;
            case "Муниципалитет":
              obj.municipality = e.debt
              break;
            case "Республика Башкортостан":
              obj.republic = e.debt
              break;
            case "Российская Федерация":
              obj.federal = e.debt
              break;
          }
        })
        arr.push(obj);
      })

      if (this.pageNumber <= 1) {
        this.table.items = arr;
      } else if (this.pageNumber > 1 && this.pageNumber <= this.maxPages) {
        arr.forEach(el=>{
          this.table.items.push(el)
        })
      } else {
        return;
      }
    },
    setOverhaulDebtDashboard(data) {
      let yearsArr = [];
      let series = []
      data.debtOnYears[0].debtOnPayerTypes.forEach(e=>{
        let obj = {
          name: e.payerType.title,
          data: []
        }
        series.push(obj);
      })
      data.debtOnYears.forEach((item)=>{
        yearsArr.push(item.year);
        item.debtOnPayerTypes.forEach((e,index)=>{
          series[index].data.push(e.debt / 1000000)
        })
      })
      this.debt.categories = yearsArr
      this.debt.series = series
    },
    convertIntegerToText: (val) => convertIntegerToText(val, 0),
    setDebtOnPayerTypes(array = []) {
      let titles = []
      let data = [];
      array.forEach(e=>{
        data.push(e.debt);
        titles.push(this.$root.titlesFirstWordReduction(e.payerType.title))
      });
      return {
        titles: titles,
        series: [{
          data: data,
        }],
        colors: ['#EE1D23'],
      }
    },
    scrollCallback() {
      if (this.table.items.length !== 0) {
        this.pageNumber++
      } else {
        return
      }
    }
  },
};
</script>

<style module>
.receivable {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-gap: 24px;
  margin-top: 24px
}

.receivableItem {
  min-height: 78px;
}

.wrapper {
  max-height: 500px;
}

.textBlue {
  color: #009fd1;
}

.map {
  min-height: 380px;
}
</style>
