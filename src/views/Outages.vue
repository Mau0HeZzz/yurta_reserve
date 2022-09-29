<template>
  <v-container class="col-12 outages pr-xl-6" :class="{'outages--black': blackTheme}">
    <v-row class="justify-space-between align-center">
      <v-col cols="12" sm="4" md="5">
        <h2 class="eye__text text-uppercase">Аварийные/плановые отключения</h2>
      </v-col>
      <outages-filters
        @filter-updated="updateFilter"
      />
    </v-row>

    <template v-if="dataLoaded">
      <outages-cards
        :loading="loading"
        :shutdowns="shutdownsInfo"
        :blackTheme="blackTheme"
      />

      <v-row class="flex-column-reverse flex-md-row">
        <v-col cols="12" md="7">
          <outages-charts
            :data="charts"
            :loading="loading"
            :blackTheme="blackTheme"
            :removeSelection="removeSelection"
            @filter-marks="filterMarks"
            @update-map="updateMap"
          />
        </v-col>
        <v-col cols="12" md="5" class="d-flex flex-column">
          <v-row class="flex-grow-0">
            <v-col cols="12" sm="6">
              <v-card
                v-if="!loading"
                :dark="blackTheme"
                elevation="2"
                width="100%"
                height="100%"
                class="d-flex"
              >
                <v-col cols="6" class="d-flex align-center justify-start text-left">
                  <div>Удельный показатель аварийности (МКА ЖКХ)</div>
                </v-col>
                <v-col cols="6" class="d-flex align-center justify-end text-right">
                  <div class="font-weight-bold">0,066 чел/час</div>
                </v-col>
              </v-card>
              <v-skeleton-loader v-else type="list-item-two-line" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-card
                v-if="!loading"
                :dark="blackTheme"
                elevation="2"
                width="100%"
                height="100%"
                class="d-flex"
              >
                <v-col cols="6" class="text-left d-flex flex-column justify-center">
                    <div class="mb-sm-2">Рейтинг ПФО</div>
                    <div>Рейтинг РФ</div>
                  </v-col>
                  <v-col cols="6" class="text-right d-flex flex-column justify-center">
                    <div class="font-weight-bold mb-sm-2">1 место</div>
                    <div class="font-weight-bold">15 место</div>
                </v-col>
              </v-card>
              <v-skeleton-loader v-else type="list-item-two-line" />
            </v-col>
          </v-row>
          <v-row class="flex-grow-1">
            <v-col cols="12">
              <v-card
                v-if="!loading"
                :dark="blackTheme"
                elevation="2"
                style="height: 100%"
              >
                <div
                  v-if="titleMap"
                  class="outages__titlemap px-5"
                  :class="blackTheme ? 'outages__titlemap--black' : ''"
                >
                  <h2>{{ titleMap }}</h2>
                  <v-btn
                    text
                    outlined
                    :color="blackTheme ? 'white': 'primary'"
                    @click="updateMap(); clearSelection();">Сбросить</v-btn>
                </div>
                <div id="shutdowns-map" ref="map"
                  :style="{'height': titleMap ? 'calc(100% - 70px)' : '100%', 'min-height': '500px', 'z-index': '3'}"
                ></div>
              </v-card>
              <v-skeleton-loader v-else type="image@3" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </template>
    <div
      v-else
      class="d-flex justify-center align-center"
      style="min-height: 300px"
    >
      <h2 v-if="!loading" class="text-center font-weight-regular">{{ message }}</h2>
    </div>
  </v-container>
</template>

<script>
import OutagesCards from '../components/Outages/OutagesCards.vue';
import OutagesFilters from '../components/Outages/OutagesFilters.vue';
import OutagesCharts from '../components/Outages/OutagesCharts.vue';
import L from "leaflet";

export default {
  name: 'Outages',
  emits: ['change-theme'],
  metaInfo: {
    title: 'Аварийные/плановые отключения'
  },
  apollo: {
    getShutdowns: {
      query: require('@/graphql/getShutdowns.gql'),
      variables() {
        if (this.filters.region === 'all') {
          return {
            "dateStart": this.filters.period[0],
            "dateEnd": this.filters.period[1]
          }
        } else {
          return {
            "area": this.filters.region,
            "dateStart": this.filters.period[0],
            "dateEnd": this.filters.period[1]
          }
        }
      },
      skip() {
        if (this.startLoading) {
          return false;
        } else {
          return true;
        }
      },
      result(response) {
        if (response.data.getShutdowns === null || response.data.getShutdowns.length === 0) {
          this.dataLoaded = false;
          this.message = 'Нет данных за указанный период';
          this.resetData();
        } else {
          this.dataLoaded = true;
          this.notFiltredShutdowns = response.data.getShutdowns.shutdownsHouses;
          this.setShutdownsInfo(response.data.getShutdowns.info);
          this.transformShutdowns();
        }
      }
    }
  },
  data() {
    return {
      blackTheme: false,
      map: null,
      message: 'Выберите период и регион для отображения данных',
      titleMap: '',
      filters: {},
      startLoading: false,
      dataLoaded: false,
      removeSelection: false,
      charts: [
        {key: 'coldWater', title: 'Холодное водоснабжение', series: [], peoples: []},
        {key: 'hotWater', title: 'Горячее водоснабжение', series: [], peoples: []},
        {key: 'warm', title: 'Теплоснабжение', series: [], peoples: []},
        {key: 'electricity', title: 'Электроснабжение', series: [], peoples: []},
        {key: 'gas', title: 'Газоснабжение', series: [], peoples: []},
        {key: 'elevator', title: 'Лифтовое хозяйство', series: [], peoples: []}
      ],
      notFiltredShutdowns: [],
      shutdownsInfo: [],
      shutdowns: []
    }
  },
  computed: {
    loading() {
      return this.$apollo.loading;
    }
  },
  destroyed() {
    this.$emit('change-theme', false);
  },
  mounted() {
    this.changeTheme();
  },
  methods: {
    changeTheme() {
      this.blackTheme = !this.blackTheme;
      this.$emit('change-theme', this.blackTheme);
    },
    clearSelection() {
      this.removeSelection = true;
      setTimeout(() => this.removeSelection = false, 0);
    },
    updateMap() {
      this.map.remove();
      this.titleMap = '';
      this.map = null;
      this.initMap();
    },
    updateFilter(obj) {
      this.startLoading = false;
      this.dataLoaded = false;
      this.titleMap = '';
      this.map = null;

      if (obj.period.length === 2 && obj.region !== null) {
        if (JSON.stringify(this.filters) === JSON.stringify(obj)) {
          return;
        }

        this.filters = obj;
        this.startLoading = true;
      } else {
        this.filters = {};
        this.message = 'Выберите период и регион для отображения данных';
        this.resetData();
      }
    },
    resetData() {
      this.charts = [
        {key: 'coldWater', title: 'Холодное водоснабжение', series: [], peoples: []},
        {key: 'hotWater', title: 'Горячее водоснабжение', series: [], peoples: []},
        {key: 'warm', title: 'Теплоснабжение', series: [], peoples: []},
        {key: 'electricity', title: 'Электроснабжение', series: [], peoples: []},
        {key: 'gas', title: 'Газоснабжение', series: [], peoples: []},
        {key: 'elevator', title: 'Лифтовое хозяйство', series: [], peoples: []}
      ];
      this.notFiltredShutdowns = [];
      this.shutdowns = [];
    },
    transformShutdowns() {
      const shutdowns = [];
      this.notFiltredShutdowns.forEach(item => {
        shutdowns.push({
          address: item.address,
          coord: item.coord,
          shutdowns: item.shutdowns
        });
      });
      this.shutdowns = shutdowns;
    },
    filterMarks(arr) {
      let sections = [];
      switch(arr[1]) {
        case 'coldWater':
          sections = ['ХВС', 'ГВС / ХВС'];
          break;
        case 'hotWater':
          sections = ['ГВС', 'ГВС / ХВС'];
          break;
        case 'warm':
          sections = ['Отопление', 'Центральное отопление', 'Газовое отопление'];
          break;
        case 'electricity':
          sections = ['Электроэнергия'];
          break;
        case 'gas':
          sections = ['Газ'];
          break;
        case 'elevator':
          sections = ['Лифт'];
          break;
      }
      this.titleMap = this.charts.filter(item => item.key === arr[1])[0].title;

      this.map.remove();
      this.map = null;
      this.initMap(sections, arr[0]);
    },
    setShutdownsInfo(obj) {
      const result = [
          {key: 'coldWater', title: 'Холодное водоснабжение', series: [], peoples: []},
          {key: 'hotWater', title: 'Горячее водоснабжение', series: [], peoples: []},
          {key: 'warm', title: 'Теплоснабжение', series: [], peoples: []},
          {key: 'electricity', title: 'Электроснабжение', series: [], peoples: []},
          {key: 'gas', title: 'Газоснабжение', series: [], peoples: []},
          {key: 'elevator', title: 'Лифтовое хозяйство', series: [], peoples: []}
        ],
        info = {};

      Object.keys(obj).forEach(key => {
        const chartTypeObj = result.find(i => i.key === key);
        const typeObj = obj[key];

        if (chartTypeObj) {
          chartTypeObj.series.push(typeObj.planned.totalHouses);
          chartTypeObj.series.push(typeObj.emergency.totalHouses);
          chartTypeObj.series.push(typeObj.excess.totalHouses);

          chartTypeObj.peoples.push(typeObj.planned.totalPeople);
          chartTypeObj.peoples.push(typeObj.emergency.totalPeople);
          chartTypeObj.peoples.push(typeObj.excess.totalPeople);
        }
      });
      this.charts = result;

      ['planned', 'emergency', 'excess'].forEach(key => {
        info[key] = obj[key];
      });
      this.shutdownsInfo = [info];
    },
    initMap(sections = [], type = null) {
      let redIcon = L.icon({
          iconUrl: './img/icons/pin_red.png',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48]
      });
      let blueIcon = L.icon({
          iconUrl: './img/icons/pin_blue.png',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48]
      });
      let greenIcon = L.icon({
          iconUrl: './img/icons/pin_green.png',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48]
      });
      let mymap = L.map('shutdowns-map').setView([54.74728667873139,55.9947550905636], 11);
      if (this.blackTheme) {
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(mymap);
      } else {
        L.tileLayer(this.$root.urlMap, {
          foo: 'bar',
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        }).addTo(mymap);
      }

      let shutdowns = [];

      if (sections.length > 0) {
        this.shutdowns.forEach(sd => {
          let sdn = [];

          sd.shutdowns.forEach(item => {
            if (sections.includes(item.section)) {
              sdn.push(item);
            }
          });

          if (sdn.length) {
            shutdowns.push({...sd, shutdowns: sdn});
          }
        });
      } else {
        shutdowns = this.shutdowns;
      }

      shutdowns.forEach(sd => {
        if (!sd.coord) return;

        let coord = sd.coord.split(','),
            address = sd.address,
            title = `
              <div>
                <span style="margin-bottom: 30px"><b>${address}</b></span>
                  <ul style="padding: 0;">
            `,
            dates = null,
            work = null,
            markerType = null;

        sd.shutdowns.forEach(item => {

          if (type !== null) {
            if (type === 0) {
              if (item.type !== 'Плановые') {
                return;
              } else {
                markerType = greenIcon;
              }
            } else if (type === 1){
              if (item.type !== 'Аварийные' || !item.inTime) {
                return;
              } else {
                markerType = blueIcon;
              }
            } else if (type === 2) {
              if (item.type !== 'Аварийные' || item.inTime) {
                return;
              } else {
                markerType = redIcon;
              }
            }
          }


          if (item.dateend) {
            dates = this.$moment(item.dateon).format('DD MMM, HH:mm') + ' - '
            + this.$moment(item.dateend).format('DD MMM, HH:mm');
          } else {
            dates = 'с '+ this.$moment(item.dateon).format('DD MMMM, HH:mm');
          }

          work = `${item.group} - ${item.type} - ${item.section}`;
          title += `
            <li style="line-height: 1.6; border-top: 1px solid #cccccc77; padding-top: 7px; margin-top: 7px; text-align: center;">
              <div class="${this.blackTheme ? 'outages__dates outages__dates--dark' : 'outages__dates'}">
                ${dates}
              </div>
              <div style="font-weight: bold; color: #777777; margin-bottom: 5px;">
                ${work}
              </div>
              <div style="text-align: left; margin-bottom: 5px;">
                <strong>Организация:</strong> ${item.performer}
              </div>
              <div style="text-align: left;">
                <strong>Причина отключения:</strong> ${item.comment}
              </div>
            </li>
          `;
        });

        title += '</ul></div>';

        let marker = null;

        if (type === null) {
          if (sd.shutdowns[0].type === 'Плановые') {
            marker = L.marker([parseFloat(coord[1]), parseFloat(coord[0])], {
              'title': address,
              'icon': greenIcon
            });
          } else if (sd.shutdowns[0].type === 'Аварийные') {
            if (sd.shutdowns[0].inTime) {
              marker = L.marker([parseFloat(coord[1]), parseFloat(coord[0])], {
                'title': address,
                'icon': blueIcon
              });
            } else {
              marker = L.marker([parseFloat(coord[1]), parseFloat(coord[0])], {
                'title': address,
                'icon': redIcon
              });
            }
          }
          marker.addTo(mymap);
          marker.bindPopup(title);
        } else {
          if (markerType === null) {
            return;
          } else {
            marker = L.marker([parseFloat(coord[1]), parseFloat(coord[0])], {
              'title': address,
              'icon': markerType
            });
            marker.addTo(mymap);
            marker.bindPopup(title);
          }
        }
      });

      this.map = mymap;
    }
  },
  watch: {
    "$apollo.loading"(isActive) {
      if (isActive) {
        this.$root.$children[0].isLoading += 1;
      } else {
        this.$root.$children[0].isLoading -= 1;
      }
    },
    blackTheme() {
      if (this.map) {
        this.updateMap();
      }
    },
    dataLoaded(val) {
      if (val) {
        let timerID = setInterval(() => {
          if (!val) {
            clearInterval(timerID);
          }

          if (!this.loading && this.shutdowns.length > 0) {
            this.initMap();
            clearInterval(timerID);
          }
        }, 100);
      }
    }
  },
  components: { OutagesCards, OutagesFilters, OutagesCharts }
}
</script>
