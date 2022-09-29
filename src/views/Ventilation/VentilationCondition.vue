<template>
  <div>
    <div class="text-h4 mb-7">Состояние систем вентиляции и дымоуправления в МКД с газовым оборудованием</div>
    <div :class="$style.conditionHeader">
      <VentilationTabs :tabs="tabs" />
      <VRow :class="$style.filters">
        <VCol cols="12" lg="4" md="6" xl="3">
          <CustomSelect
            label="Муниципальное образование"
            placeholder="Выбрать"
            :options="filter1.data"
            v-model="filter1.value"
          />
        </VCol>
        <VCol cols="12" lg="5" md="6" xl="4">
          <CustomSelect
            label="Адрес"
            placeholder="Выбрать"
            :options="filter2.data"
            v-model="filter2.value"
          />
        </VCol>
      </VRow>
    </div>
    <router-view
      class="mt-12"
      :municipality="filter2.value"
    />
  </div>
</template>

<script>
import VentilationTabs from "@/components/Ventilation/VentilationTabs";
import CustomSelect from "@/components/CustomSelect";

export default {
  name: "VentilationCondition",
  metaInfo: {
    title: "Состояние систем вентиляции и дымоуправления в МКД с газовым оборудованием",
  },
  apollo: {
    getVentilationsHousesMunicipalities: {
      query: require('@/graphql/getVentilationsHousesMunicipalities.gql'),
      result(response) {
        this.filter2.value = '';
        this.filter1.data = response?.data?.getVentilationsHousesMunicipalities?.map(item => ({
          label: item.title,
          value: item.title,
        })) || [];
      },
    },
    getVentilationsHousesAddresses: {
      query: require('@/graphql/getVentilationsHousesAddresses.gql'),
      skip() {
        return !this.filter1.value;
      },
      variables() {
        return {
          houseMunicipality: this.filter1.value,
        }
      },
      result(response) {
        this.filter2.data = response?.data?.getVentilationsHousesAddresses?.map(item => ({
          label: item.title,
          value: item.title,
        })) || [];
      },
    },
  },
  components: {
    CustomSelect,
    VentilationTabs,
  },
  data() {
    return {
      tabs: [
        { to: 'VentilationInput', name: 'Ввод данных' },
        { to: 'VentilationOutput', name: 'Вывод данных' },
      ],
      filter1: {
        data: [],
        value: '',
      },
      filter2: {
        data: [],
        value: '',
      },
      tab: 'Ввод данных',
      form: {
        tech: {
          type: ""
        }
      },
      items: [],
    };
  },
};
</script>

<style module>
.conditionHeader {
  display: flex;
  flex-direction: column;
}

.filters {
  margin-top: 16px;
}

@media (min-width: 1280px) {
  .conditionHeader {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .filters {
    justify-content: end;
    margin-top: 0;
  }
}
</style>
