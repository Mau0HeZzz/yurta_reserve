<template>
  <div>
    <VRow justify="space-between">
      <VCol cols="12" md="6" lg="5">
        <div class="text-h4">Капитальный ремонт в МКД</div>
      </VCol>
      <OutagesFilters @filter-updated="updateFilter" :region="regions" :onlyYear="false" :firstDate="'01.02.2000'" />
    </VRow>

    <PlaceholderPage v-if="!isFilterCompleted" />

    <div v-if="isFilterCompleted" class="outages__top top-outages">
      <div v-for="(card, i) in cardStats" :key="i" class="top-outages__item">
        <div
          :class="['d-flex flex justify-space-between unit unit--stats', {
            'align-end': card.alignEnd,
          }]"
        >
          <div class="unit__col">
            <div class="unit__title">{{ card.left.caption }}</div>
            <div class="unit__value text-h5 font-weight-semibold">{{ card.left.value }}</div>
          </div>
          <div
            :class="['unit__col unit__col--right', {
              'justify-space-between fill-height': card.right.fillHeight,
            }]"
          >
            <div class="unit__title">{{ card.right.caption }}</div>
            <div
              :class="['unit__value text-h5 font-weight-semibold', {
                'unit__value--end': card.alignEnd,
              }]">
              {{ card.right.value }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isFilterCompleted" class="outages__grd grid-outages">
      <div class="grid-outages__item">
        <JobsTypesCharts
          class="unit flex-grow-1"
          title="Виды работ"
          :meaning="worksByTypes"
          :theme-mode="themeMode"
        />
      </div>
      <div class="grid-outages__item">
        <OverhaulCharts
          class="unit flex-grow-1"
          title="Реализация программы капитального ремонта"
          sub-title="(Количество работ)"
          :meaning="worksByYears"
          :theme-mode="themeMode"
        />
      </div>
      <div class="grid-outages__item">
        <PorchRepairCharts
          class="unit flex-grow-1"
          title="Ремонт подъездов"
          :meaning="porch"
          :theme-mode="themeMode"
        />
      </div>
      <div class="grid-outages__item">
        <CollectionPercentCharts
          class="unit flex-grow-1"
          title="Собираемость (%)"
          :info="collectionPercentCharts"
          :enabled-on-series="[1]"
          :theme-mode="themeMode"
        />
      </div>
      <div class="grid-outages__item">
        <CollectionCurrencyCharts
          class="unit flex-grow-1"
          title="Собираемость (Руб.)"
          :meaning="currency"
          :theme-mode="themeMode"
        />
      </div>
      <div class="grid-outages__item">
        <DebitCharts
          :meaning="debt"
          class="unit flex-grow-1"
          title="Задолженность (млн.руб.)"
          sub-title="Нарастающим итогом"
          :theme-mode="themeMode"
        />
      </div>
      <div class="grid-outages__item">
        <HistoryCharts
          class="unit flex-grow-1"
          title="История изменения размера взноса(руб.кв.м.)"
          :settings="historySettings"
          :theme-mode="themeMode"
        />
      </div>
      <div class="grid-outages__item grid-outages__item_map">
        <div class="unit flex-grow-1">
          <OverhaulMap :theme-mode="themeMode" :mapData="mapData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VCol, VRow } from "vuetify/lib";
import PlaceholderPage from "@/components/Overhaul/PlaceholderPage";
import JobsTypesCharts from "@/components/Overhaul/JobsTypesCharts";
import OverhaulCharts from "@/components/Overhaul/OverhaulCharts";
import PorchRepairCharts from "@/components/Overhaul/PorchRepairCharts";
import CollectionPercentCharts from "@/components/Overhaul/CollectionPercentCharts";
import CollectionCurrencyCharts from "@/components/Overhaul/CollectionCurrencyCharts";
import DebitCharts from "@/components/Overhaul/DebitCharts";
import HistoryCharts from "@/components/Overhaul/HistoryCharts";
import OverhaulMap from "@/components/Overhaul/OverhaulMap";
import OutagesFilters from "@/components/Outages/OutagesFilters";
import { convertIntegerToText } from "@/constants/helpers";

export default {
  name: 'OverhaulIndex',
  metaInfo: {
    title: 'Капитальный ремонт в МКД',
  },
  components: {
    VRow,
    VCol,
    PlaceholderPage,
    OutagesFilters,
    JobsTypesCharts,
    OverhaulCharts,
    PorchRepairCharts,
    CollectionPercentCharts,
    CollectionCurrencyCharts,
    DebitCharts,
    HistoryCharts,
    OverhaulMap,
  },
  apollo: {
    getAddrObj: {
      query: require('@/graphql/getAddrObj.gql'),
      result(response) {
        this.regions = response.data.getAddrObj.nextAddrObjs;
      }
    },
    getOverhaulWorksDashboard: {
      query: require('@/graphql/getOverhaulWorksDashboard.gql'),
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
        const {
          totalWorks,
          totalHouses,
          totalCost,
          worksByTypes,
          worksByYears,
        } = response?.data?.getOverhaulWorksDashboard;

        this.totalWorks = totalWorks;
        this.totalHouses = totalHouses;
        this.totalCost = totalCost;
        this.worksByTypes = this.getWorksByTypes(worksByTypes);
        this.worksByYears = this.getWorksByYears(worksByYears);

        this.updateMapData(response.data.getOverhaulWorksDashboard)
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
        this.collectionPercentCharts = this.setChargesOnMonthsPercent(data?.chargesOnYears);
      }
    },
    getEntranceRenovationDashboard: {
      query: require('@/graphql/getEntranceRenovationDashboard.gql'),
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
        const { getEntranceRenovationDashboard: data = {} } = response?.data;

        // TODO: проверить зачем обновлять дважды эти данные с разных запросов, т.к. сейчас данные разные
        // this.totalCost = data?.TotalCost || 0;
        // this.totalRamps = data?.totalRamps || 0;
        // this.totalHouses = data?.totalHouses || 0;
        this.totalEntrances = data?.totalEntrances || 0;

        this.porch = this.getEntranceRampsByYears(data?.entranceRenovationOnYears);
      }
    },
    getOverhaulDebtDashboard: {
      query: require('@/graphql/getOverhaulDebtDashboard.gql'),
      variables() {
        return {
          addrObjGar: this.filter.region,
        }
      },
      skip() {
        return !this.filter.region;
      },
      result(response) {
        this.setOverhaulDebtDashboard(response.data.getOverhaulDebtDashboard)
      }
    },
  },
  data() {
    return {
      porch: {
        titles: [],
        values: [],
        color: '#FFED00',
      },
      currency: {
        titles: [ 'Физ.лица', 'Юр.лица', 'Муниципалитеты', 'РБ', 'РФ' ],
        series: [{
          name: 'Начислено',
          data: [ 44, 55, 57, 56, 61 ],
        }, {
          name: 'Собрано',
          data: [ 76, 85, 101, 98, 87 ],
        }],
        colors: ['#48485A', '#1EB94B']
      },
      debt: {
        categories: [ '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022' ],
        series: [{
          name: 'муниципалитеты',
          data: [ 76, 85, 101, 98, 87, 105, 91, 114, 94 ],
        }, {
          name: 'физ.лица',
          data: [ 44, 55, 57, 56, 61, 58, 63, 60, 66 ],
        }, {
          name: 'юр.лица',
          data: [ 34, 45, 47, 46, 51, 48, 53, 50, 46 ],
        }, {
          name: 'рб',
          data: [ 29, 40, 42, 41, 46, 43, 48, 45, 41 ],
        }, {
          name: 'рф',
          data: [ 44, 55, 57, 56, 61, 58, 63, 60, 66 ],
        }]
      },
      collectionPercentCharts: {
        titles: [],
        series: [],
        percentages: [],
        colors: ['#48485A', '#1EB94B'],
      },
      pageNumber: 1,
      itemsOnPage: 20,
      isOpenDateMenu: false,
      totalWorks: 0,
      totalHouses: 0,
      totalCost: 0,
      totalEntrances: 0,
      index: 0,
      worksByTypes: {
        titles: [],
        values: [],
      },
      worksByYears: {
        titles: [],
        values: [],
      },
      regions: [
      ],
      filter: {
        period: [],
        region: '',
      },
      historySettings: {
        series: [{
          name: 'свыше 6 этажей',
          data: [ 5.2, 5.22, 5.24, 5.26, 5.28, 5.3, 6.2, 7, 7.8 ],
        }, {
          name: 'до 6 этажей',
          data: [ 4.2, 4.22, 4.24, 4.26, 4.28, 4.3, 5.2, 6, 6.5 ],
        }],
        colors: ['#5BA4FA', '#FF0D0D'],
        categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
      },
      mapData: {
        typename: 'WorkTypeDashboard',
        items: [
          {
            coord: [54.74728667873139, 55.9947550905636],
            totalWorks: '800',
            totalHouses: '42',
            worksByTypes: [
              {
                type: 'ремонт крыши',
                amount: '400',
              }, {
                type: 'ремонт фасада',
                amount: '248',
              },
            ],
          }
        ]
      }
    }
  },
  computed: {
    themeMode() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
    cardStats() {
      return [
        {
          left: { caption: 'Всего работ', value: convertIntegerToText(this.totalWorks) },
          right: { caption: 'Охват домов', value: convertIntegerToText(this.totalHouses) },
        },
        {
          left: { caption: 'Начисление', value: convertIntegerToText(this.totalCost) },
          right: { caption: 'Платежи', value: convertIntegerToText(1100000000) },
        },
        {
          left: { caption: 'Общая задолженность', value: convertIntegerToText(88576) },
          right: { caption: 'В судах', value: convertIntegerToText(88576), fillHeight: true },
        },
        {
          left: { caption: 'Всего отремонтировано подъездов' },
          right: { value: convertIntegerToText(this.totalEntrances) },
          alignEnd: true,
        },
      ]
    },
    isFilterCompleted() {
      return this.filter.region && this.filter.period?.length === 2;
    },
  },
  watch: {
    '$apollo.loading'(pending) {
      this.$emit('change-loading', pending);
    }
  },
  methods: {
    updateFilter(filter) {
      this.filter.region = this.index === 0 ? 95230709 : filter.region;
      this.filter.period = filter.period?.map(date => {
        const [day, month, year] = date?.split('.');
        return `${year}-${month}-${day}`;
      })
    },
    updateMapData(newData) {
      let arr = [];
      let obj = {};
      this.mapData.typename = newData.__typename;
      obj.coord = [54.74728667873139, 55.9947550905636];
      obj.totalHouses = newData.totalHouses;
      obj.totalWorks = newData.totalWorks;
      obj.worksByTypes = newData.worksByTypes;
      arr.push(obj)
      this.mapData.items = arr;
    },
    getWorksByTypes(works = []) {
      return works?.reduce((acc, item) => {
        const { titles = [], values = [] } = acc;
        return {
          titles: [ ...titles, item?.type?.title || '' ],
          values: [ ...values, item?.amount || 0 ],
        };
      }, {});
    },
    getWorksByYears(works = []) {
      return works?.reduce((acc, item) => {
        const { titles = [], values = [] } = acc;
        return {
          titles: [ ...titles, item?.year || '' ],
          values: [ ...values, item?.amount || 0 ],
        };
      }, {});
    },
    getEntranceRampsByYears(entrances = []) {
      return entrances?.reduce((acc, item) => {
        const { titles = [], values = [] } = acc;
        return {
          titles: [ ...titles, item?.year || '' ],
          values: [ ...values, item?.totalEntrances || 0 ],
          color: '#FFED00'
        };
      }, {});
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
    setChargesOnMonthsPercent(data = []) {
      const localData = data?.reduce((acc, item) => ({
        titles: [...acc?.titles || [], item?.year || ''],
        charged: [...acc?.charged || [], (item?.totalCharged / 10000000) || 0],
        paid: [...acc?.paid || [], (item?.totalPaid / 10000000) || 0],
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
  },
};
</script>

<style lang="scss">
.overhaul-placeholder {
  min-height: 300px;
}

.top-outages {
  display: grid;
  gap: 24px;
  margin-top: 24px;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 1360px){
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 767px) {
    grid-template-columns: repeat(1, 1fr);
  }

  &__item {
    display: flex;
  }
}

.grid-outages {
  display: grid;
  grid-template-columns: repeat(3, calc(34% - 26px));
  gap: 24px;
  margin-top: 24px;
  @media (max-width:1360px){
    grid-template-columns: repeat(2, calc(50% - 13px));
  }
  @media (max-width:950px) {
    grid-template-columns: repeat(1, 100%);
  }

  &__item {
    display: flex;
    &-1-3 {
      .unit {
        max-width: 100%;
      }
      @media (min-width:950px){
        grid-column-start: 1;
        grid-column-end: 3;
      }
    }

    &_map {
      height: 100%;
      @media (min-width:1360px) {
        grid-column-start: 3;
        grid-column-end: 4;
        grid-row-start: 2;
        grid-row-end: 4;
      }
    }
  }
}
</style>
