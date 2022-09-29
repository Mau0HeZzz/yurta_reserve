<template>
  <div>
    <VRow justify="space-between">
      <VCol cols="12" md="6" lg="5">
        <div class="text-h4">Дымоходы.Вентканалы</div>
      </VCol>
      <OutagesFilters @filter-updated="updateFilter" :region="regions" :onlyYear="false" :firstDate="'01.02.2000'" />
    </VRow>

    <div class="outages__top top-outages">
      <div v-for="(card, i) in cardStats" :key="i" class="top-outages__item">
        <div v-if="card.head" class="unit__head">{{ card.head }}</div>
        <div
          :class="['d-flex flex justify-space-between unit unit--stats', {
            'align-end': card.alignEnd,
          }]"
        >
          <div class="unit__col">
            <div class="unit__title">{{ card.left.caption }}</div>
            <div class="unit__value text-h5 font-weight-semibold">{{ card.left.value }}</div>
            <div v-if="card.left.bottom" class="unit__value text-h5 font-weight-semibold">{{ card.left.bottom }}</div>
          </div>
          <div
            :class="['unit__col unit__col--right', {
              'justify-space-between fill-height': card.right.fillHeight,
            }]"
          >
            <div class="unit__title">{{ card.right.caption }}</div>
            <div
              :class="['unit__value text-h5 font-weight-semibold', {
                'unit__value--end': card.alignEnd, 'unit_tar': card.right }]">
              {{ card.right.value }}
            </div>
            <div v-if="card.right.bottom" class="unit__value text-h5 font-weight-semibold">{{ card.right.bottom }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="outages__grd grid-outages">
      <div class="grid-outages__item">
        <div
        class="flex-grow-1"
        :class="$style.unit"
        >
          <VentilationDiagram
            title="Совокупные данные"
            :meaning="diagramDataOne"
            :theme-mode="themeMode"
          />
        </div>
      </div>
      <div class="grid-outages__item">
        <div
        class="flex-grow-1"
        :class="$style.unit"
        >
          <VentilationDiagram
            title="Износ систем"
            :meaning="diagramDataTwo"
            :theme-mode="themeMode"
          />
        </div>
      </div>
      <div class="grid-outages__item">
        <div
        class="flex-grow-1"
        :class="$style.unit"
        >
          <CollectionCurrencyCharts
            title="Восстановление систем"
            :meaning="сollectionCurrencyChartsData"
            :theme-mode="themeMode"
          />
        </div>
      </div>
      <div class="grid-outages__item">
        <div
        class="flex-grow-1"
        :class="$style.unit"
        >
          <JobsTypesCharts
          title="Рейтинг аварийности МО и ГО РБ в процентном соотношении"
          :meaning="jobsTypesChartsData"
          :theme-mode="themeMode" />
        </div>
      </div>
      <div class="grid-outages__item">
        <div
        class="flex-grow-1"
        :class="$style.unit"
        >
          <CollectionCurrencyCharts
            title="Затраты на восстановление систем план/факт 2022"
            :meaning="сollectionCurrencyChartsDataTwo"
            :theme-mode="themeMode"
            :dataLabelsFormatter="dataLabelsFormatter"
          />
        </div>
      </div>
      <div
        class="grid-outages__item grid-outages__item_map"
        :class="$style.gridOutagesMap"
      >
        <div class="unit flex-grow-1">
          <OverhaulMap :theme-mode="themeMode" :mapData="mapData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VCol, VRow } from "vuetify/lib";
import OverhaulMap from "@/components/Overhaul/OverhaulMap";
import OutagesFilters from "@/components/Outages/OutagesFilters";
import VentilationDiagram from "@/components/Ventilation/VentilationDiagram";
import CollectionCurrencyCharts from "@/components/Overhaul/CollectionCurrencyCharts";
import JobsTypesCharts from '@/components/Overhaul/JobsTypesCharts';
import { convertIntegerToText } from "@/constants/helpers";

export default {
  name: 'OverhaulIndex',
  components: {
    VRow,
    VCol,
    OutagesFilters,
    OverhaulMap,
    VentilationDiagram,
    CollectionCurrencyCharts,
    JobsTypesCharts,
  },
  apollo: {
    getVentilationsHousesMunicipalities: {
      query: require('@/graphql/getVentilationsHousesMunicipalities.gql'),
      result(response) {
        this.regions = response?.data?.getVentilationsHousesMunicipalities?.map(item => ({
          fullName: item.title,
          objectId: item.title,
        })) || [];
      },
    },
  },
  data() {
    return {
      hardCodeData: {
        periodStart: null,
        periodEnd: null,
        houseMunicipality: null,
        houseMunicipalityGuid: null,
        housesWithGasAppliances: 12803,
        apartmentsWithGasAppliances: 631179,
        gasShutdownedWithGasDispenserHouses: 74,
        gasShutdownedWithGasDispenserApartments: 1760,
        gasShutdownedWithoutGasDispenserHouses: 84,
        gasShutdownedWithoutGasDispenserApartments: 587,
        totalVentilationChannelsCount: 705088,
        totalChimneys: 117952,
        emergencyVentilationChannelsCount: 2319,
        emergencyChimneys: 1335,
        SystemsAggregatedDataGrouped: {
          verified: {
            ventilationsCount: 422385,
            chimneysCount: 60206,
            managementCompanyCount: null,
            managementCompanyPercentage: null,
            homeownersAssociationCount: null,
            homeownersAssociationPercentage: null,
            directControlCount: null,
            directControlPercentage: null,
          },
          unverified: {
            ventilationsCount: 280384,
            chimneysCount: 56411,
            managementCompanyCount: null,
            managementCompanyPercentage: null,
            homeownersAssociationCount: null,
            homeownersAssociationPercentage: null,
            directControlCount: null,
            directControlPercentage: null,
          },
          emergency: {
            ventilationsCount: 2319,
            chimneysCount: 1335,
            managementCompanyCount: null,
            managementCompanyPercentage: null,
            homeownersAssociationCount: null,
            homeownersAssociationPercentage: null,
            directControlCount: null,
            directControlPercentage: null,
          }
        },
        systemsDeteriorations: {
          goodVentilationsCount: 14693,
          goodChimneysCount: 65577,
          tolerableVentilationsCount: 13860,
          tolerableChimneysCount: 198300,
          intolerableVentilationsCount: 53338,
          intolerableChimneysCount: 244839,
          emergencyVentilationsCount: 24701,
          emergencyChimneysCount: 45575,
        },
        systemsRepairs: null,
        systemsEmergencyRating: null,
        systemsRepairCost: null
      },
      regions: [
        {
          fullName: 'Муниципальное образование',
          objectId: 1
        }
      ],
      diagramDataOne: {
        sideTexts: [
          {
            title: 'Проверенные по Ф20 Газ Рабочие',
            keys: ['Дымоходы', 'Вентканалы'],
            values: [60206, 422385],
            color: '#42b983'
          },
          {
            title: 'Не проверенные по Ф20 Газ Рабочие',
            keys: ['Дымоходы', 'Вентканалы'],
            values: [56411, 280384],
            color: '#486491'
          },
          {
            title: 'Аварийные',
            keys: ['Дымоходы', 'Вентканалы'],
            values: [1335, 2319],
            color: '#d63200'
          },
        ],
        data: {
          series: [55, 43.5, 1.5],
          labels: ['УК - 00 ед. 00% <br> ТСЖ - 00 ед. 00% <br> НСУ - 00 ед. 00%', 'УК - 00 ед. 00% <br> ТСЖ - 00 ед. 00% <br> НСУ - 00 ед. 00%', 'УК - 00 ед. 00% <br> ТСЖ - 00 ед. 00% <br> НСУ - 00 ед. 00%']
        },
        colors: ['#00a759', '#0093cb', '#fc2626'],
      },
      diagramDataTwo: {
        sideTexts: [
          {
            title: '0 - 21% хорошее состояние',
            keys: ['Дымоходы', 'Вентканалы'],
            values: [14693, 65577],
            color: '#42b983'
          },
          {
            title: '21 - 40% удовлетворительное состояние',
            keys: ['Дымоходы', 'Вентканалы'],
            values: [13860, 198300],
            color: '#486491'
          },
          {
            title: '41 - 60% не удовлетворительное состояние',
            keys: ['Дымоходы', 'Вентканалы'],
            values: [53338, 244839],
            color: '#fca326'
          },
          {
            title: '61 - 100% аварийное состяние',
            keys: ['Дымоходы', 'Вентканалы'],
            values: [24701, 45575],
            color: '#d63200'
          },
        ],
        data: {
          series: [12.75, 24.35, 47.5, 15.6],
          labels: [
            'УК - 00 ед. 00% <br> ТСЖ - 00 ед. 00% <br> НСУ - 00 ед. 00%',
            'УК - 00 ед. 00% <br> ТСЖ - 00 ед. 00% <br> НСУ - 00 ед. 00%',
            'УК - 00 ед. 00% <br> ТСЖ - 00 ед. 00% <br> НСУ - 00 ед. 00%',
            'УК - 00 ед. 00% <br> ТСЖ - 00 ед. 00% <br> НСУ - 00 ед. 00%'
          ]
        },
        colors: ['#00a759', '#0093cb', '#fc2626', '#fca326'],
      },
      сollectionCurrencyChartsData: {
          titles: [ 'Обследование', 'Ремонт' ],
          series: [
            {
              name: 'Вент. ед',
              data: [ 0, 0 ],
            },
            {
              name: 'Дым. ед',
              data: [ 0, 0 ],
            },
          ],
          colors: ['#d63200', '#486491'],
          distributed: false,
          showLegend: true,
      },
      сollectionCurrencyChartsDataTwo: {
          titles: [ 'Текущий', 'Капитальный', 'Реконструкция', 'Новый' ],
          series: [
            {
              name: 'План, руб.',
              data: [ 0, 0, 0, 0 ],
            },
            {
              name: 'Факт, руб.',
              data: [ 0, 0, 0, 0 ],
            },
          ],
          colors: ['#d63200', '#486491'],
          distributed: false,
          showLegend: true,
      },
      jobsTypesChartsData: {
        titles: [
          'Уфа ГО',
          'Учалинский р-н',
          'Салават ГО',
          'Гафурийский р-н',
          'Баймакский р-н',
          'Абзелиловский р-н'
        ],
        values: [0, 0, 0, 0, 0, 0],
        formatter: function(val) {
          return val + '%'
        }
      },
      filter: {
        period: [],
        region: 'all',
      },
      mapData: {
        typename: 'VentilationDashboard',
        items: [
          {
            coord: [54.74728667873139, 55.9947550905636],
            title: 'Достоевского ул., д.83',
            greentext: {
              left: 'Дата отключения подачи газа',
              right: '28.06.2022'
            },
            rows: [
              {
                black: 'Способ управления МКД',
                grey: 'УК ООО "Управляющая компания"'
              },
              {
                black: 'Затраты на восстановление',
                grey: '0000000 руб.'
              },
              {
                black: 'Источник финансирования',
                grey: 'Бюджет МО'
              },
              {
                black: 'Причина отключения',
                grey: 'Заключение проверки работоспособности дымохода - нет тяги.'
              },
            ]
          }
        ]
      }}
  },
  computed: {
    themeMode() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
    cardStats() {
      return [
        {
          head: 'Всего с газовым оборудованием',
          left: { caption: 'МКД', value: convertIntegerToText(this.hardCodeData.housesWithGasAppliances) },
          right: { caption: 'КВ', value: convertIntegerToText(this.hardCodeData.apartmentsWithGasAppliances) },
        },
        {
          head: 'Отключено по предписанию',
          left: { caption: 'с газ. колонкой', value: `МКД - ${convertIntegerToText(this.hardCodeData.gasShutdownedWithGasDispenserHouses)}`, bottom: `КВ - ${convertIntegerToText(this.hardCodeData.gasShutdownedWithGasDispenserApartments)}` },
          right: { caption: 'без газ. колонки', value: `МКД - ${convertIntegerToText(this.hardCodeData.gasShutdownedWithoutGasDispenserHouses)}`, bottom: `КВ-${convertIntegerToText(this.hardCodeData.gasShutdownedWithoutGasDispenserApartments)}`},
          alignEnd: true,
        },
        {
          head: 'Всего систем',
          left: { caption: 'Вентканалы', value: convertIntegerToText(this.hardCodeData.totalVentilationChannelsCount) },
          right: { caption: 'Дымоходы', value: convertIntegerToText(this.hardCodeData.totalChimneys) },
        },
        {
          head: 'Всего в аварийном состоянии',
          left: { caption: 'Вентканалы', value: convertIntegerToText(this.hardCodeData.emergencyVentilationChannelsCount) },
          right: { caption: 'Дымоходы', value: convertIntegerToText(this.hardCodeData.emergencyChimneys)},
        },
      ]
    },
  },
  watch: {
    '$apollo.loading'(pending) {
      this.$emit('change-loading', pending);
    }
  },
  methods: {
    dataLabelsFormatter:  (val) => convertIntegerToText(val),
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
    flex-direction: column;
  }
}

.unit__head {
  padding: 0 10px;
  text-align: center;
}
.unit_tar {
  text-align: right;
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
.leaflet-control [href="https://leafletjs.com"] {
  display: none !important;
}
</style>
<style lang="scss" module>
  .gridOutagesMap {
    @media (min-width:1360px) {
      grid-column-start: 3;
      grid-column-end: 4;
      grid-row-start: 2;
      grid-row-end: 3;
    }
  }
.unit {
  padding: 18px 16px;
  border-radius: 16px;
  transition: .3s;
  max-width: 100%;
  &>div {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 100%;
    justify-content: center;
  }
}
.unit:hover {
  background-color: var(--v-unitHover-base) !important
}
.unit {
    background-color: var(--v-unit-base) !important;
    border-color: var(--v-unit-base) !important;
}
</style>