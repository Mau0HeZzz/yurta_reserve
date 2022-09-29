<template>
  <div>
    <VRow justify="space-between">
      <VCol cols="12" md="6" lg="5">
        <div class="text-h4">Подъезды</div>
      </VCol>
      <OutagesFilters
        :region="regions"
        @filter-updated="updateFilter"
      />
    </VRow>
    <PlaceholderPage v-if="!isFilterCompleted" />
    <template v-else>
      <div class="jobs-types__head head-jobsTypes">
        <div v-for="(card, i) in cardStats" :key="i" class="head-jobsTypes__item">
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

      <div class="grid-entrances">
        <div class="grid-entrances__item">
          <PorchRepairCharts
            class="unit flex-grow-1"
            title="Количество домов"
            :theme-mode="themeMode"
            :meaning="housesByYears"
          />
        </div>
        <div class="grid-entrances__item">
        <CollectionCurrencyCharts
          class="unit flex-grow-1"
          title="Количество подъездов/пандусов"
          :meaning="entranceRampsByYears"
          :theme-mode="themeMode"
        />
        </div>
        <div class="grid-entrances__item">
          <PorchRepairCharts
            class="unit flex-grow-1"
            title="Стоимость работ"
            :meaning="costsByYears"
            :theme-mode="themeMode"
          />
        </div>
        <div class="grid-entrances__item">
          <PorchRepairCharts
            class="unit flex-grow-1"
            title="Количество муниципалитетов"
            :meaning="municipatitetsByYears"
            :theme-mode="themeMode"
          />
        </div>


        <div class="grid-entrances__item grid-entrances__item-1-4">
          <div class="unit unitNoHover unit--no-hover flex-grow-1">
            <EntrancesTable
              :tableData="tableData"
              :loading="$apollo.queries.getHousesEntranceRenovations.loading"
              @jobsTypesTableEnd="jobsTypesTableEnd"
            />
          </div>
        </div>

        <div class="grid-entrances__item grid-entrances__item_map">
          <div class="unit flex-grow-1">
            <OverhaulMap
            :theme-mode="themeMode"
            :mapData="mapData"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { VRow, VCol } from 'vuetify/lib';
import OutagesFilters from "@/components/Outages/OutagesFilters";
import PlaceholderPage from "@/components/Overhaul/PlaceholderPage";
import EntrancesTable from "@/components/Overhaul/EntrancesTable";
import OverhaulMap from "@/components/Overhaul/OverhaulMap";
import PorchRepairCharts from "@/components/Overhaul/PorchRepairCharts";
import CollectionCurrencyCharts from "@/components/Overhaul/CollectionCurrencyCharts";
import { convertIntegerToText } from "@/constants/helpers";

export default {
  name: 'Entrances',
  metaInfo: {
    title: 'Подъезды',
  },
  components: {
    VRow,
    VCol,
    PlaceholderPage,
    OutagesFilters,
    EntrancesTable,
    OverhaulMap,
    PorchRepairCharts,
    CollectionCurrencyCharts
  },
  apollo: {
    getAddrObj: {
      query: require('@/graphql/getAddrObj.gql'),
      result(response) {
        this.regions = response.data.getAddrObj.nextAddrObjs;
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
      skip() {
        return !this.filter.region || this.filter.period?.length < 2;
      },
      result(response) {
        this.totalCost = response.data.getEntranceRenovationDashboard.TotalCost;
        this.totalRamps = response.data.getEntranceRenovationDashboard.totalRamps;
        this.totalHouses = response.data.getEntranceRenovationDashboard.totalHouses;
        this.totalEntrances = response.data.getEntranceRenovationDashboard.totalEntrances;
        // console .log(response.data.getEntranceRenovationDashboard)
        this.getMapdata(response.data.getEntranceRenovationDashboard);
        this.getHousesByYears(response.data.getEntranceRenovationDashboard.entranceRenovationOnYears);
        this.getEntranceRampsByYears(response.data.getEntranceRenovationDashboard.entranceRenovationOnYears);
        this.getCostsByYears(response.data.getEntranceRenovationDashboard.entranceRenovationOnYears);
        this.getMunicipalitetsByYears(response.data.getEntranceRenovationDashboard.entranceRenovationOnYears);
      }
    },
    getHousesEntranceRenovations : {
      query: require('@/graphql/getHousesEntranceRenovations.gql'),
      variables() {
        return {
          periodStart: this.filter.period?.[0]?.toString(),
          periodEnd: this.filter.period?.[1]?.toString(),
          addrObjGar: this.filter.region,
          pageNumber: this.pageNumber,
          itemsOnPage: this.itemsOnPage,
        }
      },
      skip() {
        return !this.filter.region || this.filter.period?.length < 2;
      },
      result(response) {
        this.maxPages = response.data.getHousesEntranceRenovations.totalPages;
        this.getHousesEntranceRenovations(response.data.getHousesEntranceRenovations.housesEntranceRenovations)
        // console.log(response.data.getHousesEntranceRenovations.housesEntranceRenovations)
      }
    },
  },
  data() {
    return {
      tableData: {
        headers: [
          { text: "No", value: "id", sortable: false, align: 'center' },
          { text: "Адрес", value: "address", sortable: false, align: 'center' },
          { text: "Количество подъездов", value: "entrance", sortable: false, align: 'center' },
          { text: "Количество пандусов", value: "ramps", sortable: false, align: 'center' },
          { text: "Стоимость работ", value: "cost", sortable: false, align: 'center' },
          { text: "Год работ", value: "date", sortable: false, align: 'center' },
        ],
        sortedHouses: [],
        title: '',
        slots: 'entrances',
        select: false,
      },
      housesByYears: {
        titles: ['2020', '2021', '2022', '2023'],
        values: [10, 11, 12, 13],
        color: '#1EB94B'
      },
      entranceRampsByYears: {
        titles: [ 'Физ.лица', 'Юр.лица', 'Муниципалитеты', 'РБ', 'РФ' ],
        series: [{
          name: 'Подъезды',
          data: [ 44, 55, 57, 56, 61 ],
        },
        {
          name: 'Пандусы',
          data: [ 76, 85, 101, 98, 87 ],
        }],
        colors: ['#48485A', '#1EB94B'],
      },
      costsByYears: {
        titles: ['2019', '2020', '2021'],
        values: [ 1000000, 2000000, 3000000 ],
        color: '#FFED00'
      },
      municipatitetsByYears: {
        titles: ['2019', '2020', '2021', '2022'],
        values: [ 4, 2, 9, 3 ],
        color: '#FFED00'
      },
      regions: [],
      filter: {
        period: [],
        region: '',
      },
      totalCost: 0,
      totalRamps: 0,
      totalHouses: 0,
      totalEntrances: 0,
      pageNumber: 1,
      itemsOnPage: 20,
      maxPages: 1,
      tableIndex: 1,
      mapData: {
        typename: 'Entrance',
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
    isFilterCompleted() {
      return this.filter.region && this.filter.period?.length === 2;
    },
    cardStats() {
      return [
        {
          left: { caption: 'Количество домов', value: convertIntegerToText(this.totalHouses) },
          right: {  },
          alignEnd: false,
        },
        {
          left: { caption: 'Подъезды', value: convertIntegerToText(this.totalEntrances) },
          right: { caption: 'Пандусы', value: convertIntegerToText(this.totalRamps), fillHeight:true },
        },
        {
          left: { caption: 'Общая стоимость работ', value: convertIntegerToText(this.totalCost) },
          right: {  },
          alignEnd: false,
        },
      ]
    },
  },
  methods: {
    jobsTypesTableEnd() {
      if (this.tableData.sortedHouses.length !== 0) {
        this.pageNumber++
      }
    },
    getHousesByYears(array) {
      let titles = [],
      values = []
      array.forEach(elem=>{
        titles.push(elem.year);
        values.push(elem.totalHouses);
      })
      this.housesByYears.titles = titles;
      this.housesByYears.values = values;
    },
    getEntranceRampsByYears(array) {
      let titles = [],
      dataOne = [],
      dataTwo = [];
      array.forEach(elem=>{
        titles.push(elem.year);
        dataOne.push(elem.totalEntrances);
        dataTwo.push(elem.totalRamps);
      })
      this.entranceRampsByYears.titles = titles;
      this.entranceRampsByYears.series[0].data = dataOne;
      this.entranceRampsByYears.series[1].data = dataTwo;
    },
    getCostsByYears(array) {
      let titles = [],
      values = [];
      array.forEach(elem=>{
        titles.push(elem.year);
        values.push(elem.cost);
      })
      this.costsByYears.titles = titles;
      this.costsByYears.values = values;
    },
    getMunicipalitetsByYears(array) {
      let titles = [],
      values = [];
      array.forEach(elem=>{
        titles.push(elem.year);
        values.push(elem.totalMunicipalitets);
      })
      this.municipatitetsByYears.titles = titles;
      this.municipatitetsByYears.values = values;
    },
    getHousesEntranceRenovations(array) {
      let arr = [];
      array.forEach(el=>{
        let obj = {};
        obj.address = el.gisHouse.shortAddress;
        obj.entrance = el.totalEntrances;
        obj.ramps = el.totalRamps;
        obj.cost = el.cost;
        obj.date = new Date(el.date).toLocaleDateString()
        obj.id = this.tableIndex;
        this.tableIndex++
        arr.push(obj)
      })

      if (this.pageNumber <= 1) {
        this.tableData.sortedHouses = arr;
      } else if (this.pageNumber > 1 && this.pageNumber <= this.maxPages) {
        arr.forEach(el=>{
          this.tableData.sortedHouses.push(el)
        })
      } else {
        return;
      }
    },
    getMapdata(data) {
      let arr = [];
      let obj = {};
      obj.houses = data.totalHouses;
      obj.entrances = data.totalEntrances;
      obj.coord = data.coord ? data.coord : [54.74728667873139, 55.9947550905636]
      arr.push(obj)
      this.mapData.items = arr;
    },
    updateFilter(filter) {
      this.filter.region = filter.region;
      this.filter.period = filter.period?.map(date => {
        const [day, month, year] = date?.split('.');
        return `${year}-${month}-${day}`;
      })
    },
  }
};
</script>

<style scoped lang="scss">
  .grid-entrances {
    display: grid;
    grid-template-columns: repeat(4, calc(25% - 18px));
    gap: 24px;
    margin-top: 24px;
    @media (max-width: 1700px){
      grid-template-columns: repeat(3, calc(33% - 15px));
    }
    @media (max-width: 1500px){
      grid-template-columns: repeat(2, calc(50% - 12px));
    }
    @media (max-width: 767px) {
      grid-template-columns: repeat(1, 1fr);
    }

		&__item {
      max-width: 100%;
      .unit {
        height: 100%;
        max-width: calc(100vw - 24px);
      }

			&_map {
        min-height: 500px;
        @media (max-width: 1700px){
          grid-column-start: 1;
          grid-column-end: 4;
        }
        @media (max-width: 1500px){
          grid-column-start: 1;
          grid-column-end: 3;
        }
        @media (max-width: 767px){
          grid-column-start: 1;
          grid-column-end: 2;
        }
			}
		}

		&__item-1-4 {
      @media (max-width: 1500px){
        grid-column-end: 3;
      }
      @media (min-width: 767px){
        grid-column-start: 1;
      }
      @media (min-width: 1500px){
        grid-column-end: 4;
      }
      @media (max-width: 767px){
        grid-column-start: 1;
        grid-column-end: 2;
      }
    }
}
.unit {
}
.flex-grow-1 {
}
::v-deep .v-data-table .v-data-table__wrapper td {
  font-weight: 600;
  text-align: center;
}

</style>
