<template>
  <div class="adresses-jobsTypes">
    <div class="adresses-jobsTypes__head">
      <div class="adresses-jobsTypes__title">{{ tableData.title }}</div>
      <JobsTypesFilters
        @changeTypePlan="searchUpdate"
        :select="select"
      />
    </div>
    <VueCustomScrollbar
      :class="$style.wrapper"
      :settings="scrollbarSettings"
      @ps-y-reach-end="scrollCallback"
    >
      <VDataTable
        disable-sort
        fixed-header
        calculate-widths
        hide-default-footer
        class="custom-table transparent"
        loading-text="Загрузка..."
        item-key="id"
        :loading="loading"
        :headers="tableData.headers"
        :items="tableData.sortedHouses"
        :items-per-page="-1"
        :options.sync="options"
        :search="search"
      >
        <template v-slot:item.water="{ item }">
          <span style="color: #009FD1;">{{ item.address }}</span>
        </template>
      </VDataTable>
    </VueCustomScrollbar>
  </div>
</template>

<script>
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import VueCustomScrollbar from "vue-custom-scrollbar";
import JobsTypesFilters from "@/components/Overhaul/JobsTypesFilters";

export default {
  name: "EntrancesTable",
  components: {
    VueCustomScrollbar,
    JobsTypesFilters
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
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
        suppressScrollX: true,
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


<style module>
.wrapper {
  max-height: 500px;
}
</style>