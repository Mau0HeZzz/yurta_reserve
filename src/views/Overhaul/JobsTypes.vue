<template>
  <div>
    <VRow justify="space-between">
      <VCol cols="12" md="6" lg="2">
        <div class="text-h4">Виды работ</div>
      </VCol>
      <VCol cols="12" md="6" lg="3">
        <v-autocomplete
          clearable
          dense
          type="select"
          filled
          rounded
          hide-details
          class="text-subtitle-2"
          placeholder="Вид работ"
          :items="jobsTypes"
          item-text="title"
          item-value="title"
          @change="setJobTypeFilter"
        />
      </VCol>
      <OutagesFilters @filter-updated="updateFilterData" :region="regions" />
    </VRow>
    <PlaceholderPage v-if="!isFilterCompleted" />
    <template v-else>
      <div class="jobs-types__head head-jobsTypes">
        <div class="head-jobsTypes__item">
          <div class="d-flex flex justify-space-between unit unit--stats">
            <div class="unit__col unit__col-100">
              <div class="unit__title">Общее количество проводимых работ</div>
              <div class="unit__value text-h5 font-weight-semibold">{{this.totalWorks}} шт.</div>
            </div>
          </div>
        </div>
        <div class="head-jobsTypes__item">
          <div class="d-flex flex justify-space-between unit unit--stats">
            <div class="unit__col unit__col-100">
              <div class="unit__title">Общяя стоимость работ</div>
              <div class="unit__value text-h5 font-weight-semibold">{{ this.totalCost }} руб.</div>
            </div>
          </div>
        </div>
        <div class="head-jobsTypes__item">
          <div class="d-flex flex justify-space-between unit unit--stats">
            <div class="unit__col unit__col-100">
              <div class="unit__title">Охват домов</div>
              <div class="unit__value text-h5 font-weight-semibold">{{ this.totalHouses }} домов</div>
            </div>
          </div>
        </div>
      </div>
      <div class="jobs-types__body">
        <div class="outages__grd grid-outages">
          <div class="grid-outages__item">
            <div class="unit flex-grow-1">
              <JobsTypesCharts title="Виды работ"
              :meaning="types"
              :theme-mode="themeMode" />
            </div>
          </div>
          <div class="grid-outages__item">
            <div class="unit flex-grow-1">
              <JobsTypesCharts title="Стоимость работ (тыс. руб.)"
              :meaning="costs"
              :mainColor="'#6C5DD3'"
              :theme-mode="themeMode" />
            </div>
          </div>
          <div class="grid-outages__item">
            <div class="unit flex-grow-1">
              <JobsTypesCharts title="Охват домов"
              :meaning="counts"
              :mainColor="chartColor"
              :theme-mode="themeMode"
              />
            </div>
          </div>
          <div class="grid-outages__item grid-outages__item-1-3">
            <div class="unit unitNoHover unit--no-hover flex-grow-1">
              <JobsTypesTable
                :tableData="tableData"
                @jobsTypesTableEnd="jobsTypesTableEnd"
              />
            </div>
          </div>
          <div class="grid-outages__item jobs-types__textcontent">
            <div class="unit flex-grow-1">
              <div class="jobs-types__title">Обязательные виды работ</div>
              <ul class="jobs-types__list">
                <li class="jobs-types__li">Ремонт крыши</li>
                <li class="jobs-types__li">Ремонт фасада</li>
                <li class="jobs-types__li">Ремонт внутренних инженерных сетей (водо-, газо-, Электроснабжения,
                  водоотведения)</li>
                <li class="jobs-types__li">Ремонт фундамента</li>
                <li class="jobs-types__li">Ремонт подвальных помещений</li>
                <li class="jobs-types__li">Ремонт, замена, модернизация лифтов</li>
              </ul>
              <div class="jobs-types__title">Дополнительные виды работ</div>
              <ul class="jobs-types__list">
                <li class="jobs-types__li">Утепление фасада</li>
                <li class="jobs-types__li">Переустройство невентилируемой крыши на вентилируемую</li>
                <li class="jobs-types__li">Установка общедомовых приборов учета коммунальных услуг</li>
                <li class="jobs-types__li">Утепление чердачного перекрытия (утепление верхнего этажа)</li>
                <li class="jobs-types__li">Ремонт подъездов</li>
              </ul>
            </div>
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
import JobsTypesCharts from '@/components/Overhaul/JobsTypesCharts';
import JobsTypesTable from '@/components/Overhaul/JobsTypesTable';
import { convertIntegerToText } from "@/constants/helpers";

export default {
  components: {
    VRow,
    VCol,
    PlaceholderPage,
    OutagesFilters,
    JobsTypesCharts,
    JobsTypesTable
  },
  name: 'JobsTypes',
  metaInfo: {
    title: 'Капитальный ремонт в МКД',
  },
  apollo: {
    getAddrObj: {
      query: require('@/graphql/getAddrObj.gql'),
      result(response) {
        this.regions = response.data.getAddrObj.nextAddrObjs;
      }
    },
    getOverhaulWorkTypes: {
      query: require('@/graphql/getOverhaulWorkTypes.gql'),
      result(response) {
        this.jobsTypes = response.data.getOverhaulWorkTypes;
        if (this.jobsTypes[0].id !== 0) {
          this.jobsTypes.unshift({
            id: 0,
            isBasic: true,
            title: "Все"
          })
        }
      }
    },
    getOverhaulWorksDashboard: {
      query: require('@/graphql/getOverhaulWorksDashboard.gql'),
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
        this.overhaul = response.data;
        this.totalCost = convertIntegerToText(response.data.getOverhaulWorksDashboard.totalCost);
        this.totalWorks = convertIntegerToText(response.data.getOverhaulWorksDashboard.totalWorks);
        this.totalHouses = convertIntegerToText(response.data.getOverhaulWorksDashboard.totalHouses);

        this.updateOverHaul(response.data.getOverhaulWorksDashboard.worksByTypes)
        this.updateCounts(response.data.getOverhaulWorksDashboard.worksByWorkCount)
      }
    },
    getLastWorksOnHouses: {
      query: require('@/graphql/getLastWorksOnHouses.gql'),
      variables() {
        return {
          periodStart: this.filter.period?.[0]?.toString(),
          periodEnd: this.filter.period?.[1]?.toString(),
          addrObjGar: this.filter.region,
          itemsOnPage: this.itemsOnPage,
          pageNumber: this.pageNumber
        }
      },
      skip() {
        return !this.filter.region || this.filter.period?.length < 2;
      },
      result(response) {
        this.lastWorks = response.data.getLastWorksOnHouses;
        this.maxPages = response.data.getLastWorksOnHouses.totalPages;
        this.lastWorksUpdate(response.data.getLastWorksOnHouses.lastWorksOnHouse);
      }
    },
  },
  data() {
    return {
      tableData: {
        headers: [
          { text: "No", value: "id", sortable: false },
          { text: "Адрес", value: "adress", sortable: false },
          { text: "Ремонт крыши", value: "roof", sortable: false },
          { text: "Ремонт фасада", value: "facade", sortable: false },
          { text: "Водоснабжение", value: "water", sortable: false },
          { text: "Теплоснабжение", value: "warm", sortable: false },
          { text: "Газоснабжение", value: "gas", sortable: false },
          { text: "Электроснабжение", value: "electricity", sortable: false },
          { text: "Ремонт подвала", value: "basement", sortable: false },
          { text: "Ремонт фундамента", value: "foundation", sortable: false },
          { text: "Ремонт лифта", value: "elevator", sortable: false },
          ],
        sortedHouses: [],
        title: 'График проведения работ',
        slots: 'jobsTypes',
        select: true
      },
      totalWorks: null,
      totalCost: null,
      totalHouses: null,
      jobsTypes : [
        {
          id: 0,
          isBasic: true,
          title: "Все"
        }
      ],
      jobTypeForFilter: 'Все',
      lastWorks: {
        pageNumber: 1,
        itemsOnPage: 20,
        totalItems: 100,
        totalPages: 5,
        lastWorksOnHouse: []
      },
      inputValue: '',
      unsortedHouses: [],
      overhaul: null,
      types: {
        titles: ['Ремонт крыши', 'Ремонт фасада', 'Водоснабжение', 'Газоснабжение', 'Электроснабжение', 'Теплоснабжение', 'Подвальные помещения', 'Ремонт фундамента', 'Ремонт/замена лифтов'],
        values: [400, 248, 669, 144, 306, 783, 139, 375, 584]
      },
      costs: {
        titles: ['Ремонт крыши', 'Ремонт фасада', 'Водоснабжение', 'Газоснабжение', 'Электроснабжение', 'Теплоснабжение', 'Подвальные помещения', 'Ремонт фундамента', 'Ремонт/замена лифтов'],
        values: [40000, 24800, 66900, 14400, 30600, 78300, 13900, 37500, 58400]
      },
      counts: {
        titles: ['1 вид работ', '2 вида работ', '3 вида работ', '4 вида работ', '5 вида работ', '6 вида работ', '7 вида работ', '8 вида работ', '9 видов работ'],
        values: [400, 248, 669, 144, 306, 783, 139, 375, 584]
      },
      regions: [],
      filter: {
        period: [],
        region: 'all',
      },
      pageNumber: 1,
      itemsOnPage: 10,
      maxPages: null,
      index: 1
    }
  },
  methods: {
    setJobTypeFilter(val) {
      if (!this.isFilterCompleted) {
        return
      }
      this.jobTypeForFilter = val;
    },
    updateFilterData(filter) {
      this.filter.region = filter.region;
      this.filter.period = filter.period?.map(date => {
        const [day, month, year] = date?.split('.');
        return `${year}-${month}-${day}`;
      })
    },
    updateOverHaul(response) {
      let typesObj = {},
        typesNames = [],
        typesValues = [],
        typesCosts = [],
        costsObj = {};
      response.forEach(e => {
        let name = e.type.title;
        let amount = e.amount;
        let cost = e.cost / 1000;
        typesNames.push(name);
        typesValues.push(amount);
        typesCosts.push(cost);
      })
      typesObj.titles = typesNames;
      costsObj.titles = typesNames;
      typesObj.values = typesValues;
      costsObj.values = typesCosts;
      this.types = typesObj;
      this.costs = costsObj;
      this.typesUnf = typesObj;
      this.costsUnf = costsObj;
    },
    updateCounts(response) {
      let obj = {};
      let titles = []
      let values = [];
      response.forEach(e=>{
        values.push(e.amount);
        if (e.workCount === 1) {
          titles.push(`${e.workCount} вид работ`)
        } else if (e.workCount>1 && e.workCount<5) {
          titles.push(`${e.workCount} вида работ`)
        } else {
          titles.push(`${e.workCount} видов работ`)
        }
        obj.titles = titles;
        obj.values = values;
        this.counts = obj;
      })
    },
    lastWorksUpdate(lastWorksArr) {
      let arr = [];
        lastWorksArr.forEach((el) =>{
          let obj = {};
          obj.elevator = el.elevator;
          obj.foundation = el.foundation;
          obj.basement = el.basement;
          obj.electricity = el.electricity;
          obj.gas = el.gas;
          obj.warm = el.warm;
          obj.water = el.water;
          obj.facade = el.facade;
          obj.roof = el.roof;
          obj.adress = el.gisHouse.shortAddress;
          obj.id = this.index;
          this.index++
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
    jobsTypesTableEnd() {
      if (this.tableData.sortedHouses.length !== 0) {
        this.pageNumber++
      } else {
        return
      }
    }
  },
  computed: {
    themeMode() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
    chartColor() {
      return this.themeMode === 'dark' ? '#E2E2E2' : '#48485A';
    },
    isFilterCompleted() {
      return this.filter.region && this.filter.period?.length === 2;
    },
  },
  watch: {
    jobTypeForFilter() {
      let types = this.typesUnf;
      let costs = this.costsUnf;
      let typesFiltered = {
        titles: [],
        values: []
      };
      let costsFiltered = {
        titles: [],
        values: []
      };
      if (this.jobTypeForFilter === 'Все' || this.jobTypeForFilter === null) {
        this.types = types;
        this.costs = costs;
        return
      } else {
        types.titles.forEach((item, index)=>{
          if (item === this.jobTypeForFilter) {
            typesFiltered.titles.push(item);
            typesFiltered.values.push(types.values[index])
          }
        })
        costs.titles.forEach((item, index)=>{
          if (item === this.jobTypeForFilter) {
            costsFiltered.titles.push(item);
            costsFiltered.values.push(costs.values[index])
          }
        })
        this.types = typesFiltered;
        this.costs = costsFiltered;
      }
    }
  }
};
</script>
