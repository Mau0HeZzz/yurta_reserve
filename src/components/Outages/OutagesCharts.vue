<template>
  <v-row>
    <v-col
      v-for="item in data"
      :key="item.key"
      cols="12"
      sm="6"
    >
      <v-card
        v-if="!loading"
        :dark="blackTheme"
        height="100%"
        elevation="2"
        class="d-flex flex-column align-center"
      >
        <v-card-title class="d-block text-uppercase text-center">{{ item.title }}</v-card-title>
        <v-row class="ma-0" v-if="!isEmptySeries(item.series)">
          <v-col cols="12" md="7" xl="8" class="pa-md-0 d-flex align-center justify-center">
              <apexchart
                :ref="item.key"
                width="100%"
                type="donut"
                :options="options"
                :series="item.series"
                :data-key="item.key"
                @dataPointSelection="dataPointSelection"
              />
          </v-col>
          <v-col cols="8" md="5" xl="4" class="d-flex flex-column ma-auto pa-md-0 pr-md-4 pb-md-4">
              <div
                v-for="(houses, i) in item.series"
                :key="i"
                class="outages__legend mb-2"
              >
                <p class="font-weight-bold text-center" :style="{color: options.colors[i]}">
                  {{ options.labels[i] }}
                </p>
                <div class="d-flex justify-space-between">
                  <span>Домов:</span>
                  <strong>{{ item.series[i] }}</strong>
                </div>
                <div class="d-flex justify-space-between">
                  <span>Жителей:</span>
                  <strong>{{ item.peoples[i] }}</strong>
                </div>
              </div>
          </v-col>
        </v-row>
        <div class="d-flex flex-grow-1 align-center pb-10" v-else>Отключений нет</div>
      </v-card>
      <v-skeleton-loader v-else type="table-heading, list-item-two-line, image" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'DashboardCard',
  emits: ['filter-marks', 'update-map'],
  props: ['data', 'loading', 'blackTheme','removeSelection'],
  data() {
    return {
      options: {
        chart: {
          type: 'donut'
        },
        colors: ['#00a759', '#0093cb', '#fc2626'],
        states: {
          active: {
            filter: {
              type: 'none',
            }
          },
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          pie: {
            donut: {
              size: '50%',
            }
          }
        },
        legend: { show: false },
        labels: [
          'Плановые отключения',
          'Аварийные отключения (норма)',
          'Аварийные отключения (сверх)'
        ]
      },
      selectedType: null,
      selectedKey: null
    } 
  },
  watch: {
    removeSelection(val) {
      if (val) {
        this.clearSelection();
        this.selectedType = null;
        this.selectedKey = null;
      }
    }
  },
  methods: {
    dataPointSelection(_, chartContext, config) {
      const type = config.dataPointIndex,
            key = chartContext.el.dataset.key;

      if (this.selectedType === type && this.selectedKey === key) {
        this.selectedType = null;
        this.selectedKey = null;
        this.$emit('update-map');
      } else {
        if (this.selectedType !== null && this.selectedKey !== null) {
          this.clearSelection();
        }

        this.selectedType = type;
        this.selectedKey = key;

        this.$emit('filter-marks', [ type, key ]);
      }
    },
    isEmptySeries(series) {
      let isEmpty = true;

      series.forEach(item => {
        if (item > 0) {
          isEmpty = false;
        }
      });

      return isEmpty;
    },
    clearSelection() {
      if (this.$refs[this.selectedKey]) {
        this.$refs[this.selectedKey][0].toggleDataPointSelection(this.selectedType);
      }
    }
  },
}
</script>
