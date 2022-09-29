<template>
  <div class="adresses-jobsTypes">
    <div class="adresses-jobsTypes__head">
      <div class="adresses-jobsTypes__title">{{ tableData.title }}</div>
      <JobsTypesFilters
        :select="select"
        @changeTypePlan="searchUpdate"
      />
    </div>
    <vue-custom-scrollbar
      class="adresses-jobsTypes__body"
      :settings="scrollbarSettings"
      @ps-y-reach-end="scrollCallback"
    >
      <v-data-table
        class="custom-table transparent"
        :headers="tableData.headers"
        :fixed-header="true"
        :options.sync="options"
        :items="tableData.sortedHouses"
        item-key="id"
        :search="search"
        :hide-default-footer="true"
        :calculate-widths="true"
      >
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.adress="{ item }">
          <div style="min-width: 120px;">{{ item.adress }}</div>
        </template>
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.roof="{ item }">
          <div class="table-jobsTypes__slot" style="color: #009FD1;">{{ item.roof }}</div>
        </template>
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.warm="{ item }">
          <div class="table-jobsTypes__slot" style="color: #009FD1;">{{ item.warm }}</div>
        </template>
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.electricity="{ item }">
          <div class="table-jobsTypes__slot" style="color: #009FD1;">{{ item.electricity }}</div>
        </template>
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.basement="{ item }">
          <div class="table-jobsTypes__slot" style="color: #009FD1;">{{ item.basement }}</div>
        </template>
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.foundation="{ item }">
          <div class="table-jobsTypes__slot" style="color: #009FD1;">{{ item.foundation }}</div>
        </template>
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.facade="{ item }">
          <div class="table-jobsTypes__slot" style="color: #1EB94B;">{{ item.facade }}</div>
        </template>
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.gas="{ item }">
          <div class="table-jobsTypes__slot" style="color: #1EB94B;">{{ item.gas }}</div>
        </template>
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.elevator="{ item }">
          <div class="table-jobsTypes__slot" style="color: #1EB94B;">{{ item.elevator }}</div>
        </template>
        <template v-if="tableData.slots==='jobsTypes'" v-slot:item.water="{ item }">
          <div class="table-jobsTypes__slot" style="color: #FF0D0D;">{{ item.water }}</div>
        </template>
      </v-data-table>
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import vueCustomScrollbar from "vue-custom-scrollbar";
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import JobsTypesFilters from "@/components/Overhaul/JobsTypesFilters";

export default {
  components: {
    vueCustomScrollbar,
    JobsTypesFilters
  },
  props: {
    tableData: {
      type: Object,
      default: () => {
        return {
          headers: [],
          sortedHouses: [],
          title: "",
          slots: true,
          select: true
        };
      }
    },
  },
  data() {
    return {
      scrollbarSettings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: true,
        swipeEasing: true
      },
      search: "",
      options: {
        page: 1,
        itemsPerPage: -1,
        pageStart: 1,
        pageStop: 1,
        sortDesc: [ false, false ]
      },
    };
  },
  methods: {
    scrollCallback() {
      this.$emit("jobsTypesTableEnd");
    },
    searchUpdate(event) {
      this.search = event.value.input;
    }
  },
  computed: {
    select() {
      return this.tableData.select;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table .v-data-table__wrapper::-webkit-scrollbar {
  width: 10px;
}

::v-deep .v-data-table .v-data-table__wrapper table {
  max-width: 100%;
}

::v-deep .v-data-table .v-data-table__wrapper .table-jobsTypes__slot {
  font-weight: 600;
  text-align: center;
  max-width: 100px;
}

.adresses-jobsTypes__body {
  max-height: 477px;
  max-width: 100%;
}
</style>
