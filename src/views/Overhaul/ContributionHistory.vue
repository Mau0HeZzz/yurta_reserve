<template>
  <div>
    <VRow justify="space-between">
      <VCol cols="12">
        <div class="text-h4">История изменения минимального размера взноса</div>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" md="6">
        <HistoryCharts
          class="unit flex-grow-1"
          title="Средний размер взноса"
          :theme-mode="themeMode"
          :settings="chart1"
        />
      </VCol>
      <VCol cols="12" md="6">
        <HistoryCharts
          class="unit flex-grow-1"
          title="Средний размер взноса"
          :theme-mode="themeMode"
          :settings="chart2"
        />
      </VCol>
      <VCol cols="12">
        <AverageInstallmentChart
          class="unit flex-grow-1"
          title="Средний размер взноса в Российской Федерации, (руб/кв.м.)"
          :theme-mode="themeMode"
          :settings="chart3"
        />
      </VCol>
    </VRow>
  </div>
</template>

<script>
import { VRow, VCol } from 'vuetify/lib';
import HistoryCharts from "@/components/Overhaul/HistoryCharts";
import AverageInstallmentChart from "@/components/Overhaul/AverageInstallmentChart";

export default {
  name: 'ContributionHistory',
  metaInfo: {
    title: 'История изменения минимального размера взноса',
  },
  components: {
    VRow,
    VCol,
    HistoryCharts,
    AverageInstallmentChart,
  },
  apollo: {

  },
  data() {
    return {
      chart1: {
        series: [{
          name: 'до 6 этажей',
          data: [ 4.2, 4.22, 4.24, 4.26, 4.28, 4.3, 5.2, 6, 6.5 ],
        }],
        colors: ['#FF0D0D'],
        categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
      },
      chart2: {
        series: [{
          name: 'свыше 6 этажей',
          data: [ 5.2, 5.22, 5.24, 5.26, 5.28, 5.3, 6.2, 7, 7.8 ],
        }],
        colors: ['#5BA4FA'],
        categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
      },
    }
  },
  computed: {
    themeMode() {
      return this.$vuetify.theme.dark ? 'dark' : 'light';
    },
    chart3() {
      return {
        series: [{
          data: [ 8.9, 7.69, 5.4, 6.3, 6.33, 6.38, 6.53, 7.15, 7.62, 7.63, 7.78, 8.3, 8.35, 8.6, 9.36, 9.5 ],
        }],
        colors: ['#118332','#118332','#118332','#118332','#118332','#118332','#118332','#118332','#118332','#118332','#5BA4FA','#118332','#118332','#118332','#118332','#118332'],
        categories: [
          'Российская Федерация',
          'пфо',
          'республика марий эл',
          'нижегородская область',
          'саратовская область',
          'республика татарстан',
          'республика чувашия',
          'оренбургская область',
          'самарская область',
          'республика мордовия',
          'республика башкортостан',
          'кировская область',
          'Республика удмуртия',
          'ульяновская область',
          'пермский край',
          'пензенская область',
        ],
      };
    },
  },
};
</script>
