<template>
  <v-container class="col-12">
    <v-row>
      <v-col class="font-weight-bold text-uppercase" cols="12">
        Аварийные/плановые отключения
      </v-col>
    </v-row>

    <!-- <PageFilters :types="[ 'region', 'org', 'addr' ]" /> -->

    <v-row style="min-height: 80vh">
      <v-col cols="12" style="max-width: 300px">
        <v-col cols="12" class="title">
          Аналитические данные
        </v-col>
        <v-col cols="12">
          <v-list
            dense
            flat
            style="max-height: 60vh"
            class="overflow-y-auto"
          >
            <v-list-item-group
              multiple
            >
              <template v-for="(an_item, an_i, an_index) in shutdownsByType">
                <v-divider
                  v-if="an_index > 0"
                  :key="`divider-${an_index}`"
                ></v-divider>

                <v-list-item :key="an_index" v-if="an_item.length">
                  <v-list-item-content>
                    <v-list-item-title
                      class="text-subtitle-1 font-weight-bold text-decoration-underline"
                    >{{ an_i }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  v-for="(ani, ani_k) in an_item"
                  :key="an_index +'-'+ ani_k"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="ani[0]"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-title v-text="ani[1].length"></v-list-item-title>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-col>
      <v-col cols="12" style="max-width: calc(100% - 300px)">
        <div id="shutdowns-map" style="height: 100%; min-height: 300px; z-index: 5;"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import L from "leaflet";
// import PageFilters from '@/components/PageFilters.vue';

export default {
  name: 'Outages',
  metaInfo: {
    title: 'Аварийные/плановые отключения'
  },
  components: {
    // PageFilters,
  },
  apollo: {
    getShutdowns: {
      query: require('@/graphql/getShutdowns.gql'),
      result(response) {
        this.notFiltredShutdowns = response.data.getShutdowns;
        this.transformShutdowns();
      }
    }
  },
  data: () => ({
    shutdowns: [],
    notFiltredShutdowns: [],
    shutdownTypes: []
  }),
  computed: {
    shutdownsByType() {
      if (this.shutdownTypes.length == 0) {
        return false;
      }

      function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
          const key = keyGetter(item);
          const collection = map.get(key);
          if (!collection) {
             map.set(key, [item]);
          } else {
             collection.push(item);
          }
        });
        return map;
      }

      const types = groupBy(this.shutdownTypes, shutdown => shutdown.type);
      var planned = [],
          emergency = [];

      planned = types.get('Плановые');
      const pSection = planned ? groupBy(planned, p => p.section) : [];

      emergency = types.get('Аварийные');
      const eSection = emergency ? groupBy(emergency, e => e.section) : [];

      // for (var i = 0; i < this.shutdowns.length; i++) {
      //   switch (this.shutdowns[i].type) {
      //     case 'Плановые':
      //       planned.push(grouped.get("Газ"));
      //       planned.push(grouped.get("Лифт"));
      //       console.log(planned);
      //       // planned = sortBySection(i, 'planned');
      //       break;
      //     case 'Аварийные':
      //       emergency.push(grouped.get("Газ"));
      //       emergency.push(grouped.get("Лифт"));
      //       console.log(emergency);
      //       // emergency = sortBySection(i, 'emergency');
      //       break;
      //   }
      // }
      return {
        'Плановые': Array.from(pSection),
        'Аварийные': Array.from(eSection)
      }
    }
  },
  methods: {
    transformShutdowns() {
      var shutdowns = [],
          shutdownTypes = [];

      for (var i = 0; i < this.notFiltredShutdowns.length; i++) {
        shutdowns.push({
          'address': this.notFiltredShutdowns[i].address,
          'coord': this.notFiltredShutdowns[i].coord,
          'shutdowns': this.notFiltredShutdowns[i].shutdowns
        });
        for (var j = 0; j < this.notFiltredShutdowns[i].shutdowns.length; j++) {
          shutdownTypes.push( this.notFiltredShutdowns[i].shutdowns[j] );
        }
      }
      this.shutdowns = shutdowns;
      this.shutdownTypes = shutdownTypes;
      // this.initMap();
    },
    initMap() {
      var redIcon = L.icon({
          iconUrl: './img/icons/pin_red.png',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48]
      });
      var orangeIcon = L.icon({
          iconUrl: './img/icons/pin_orange.png',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48]
      });
      // var mymap = null;
      //   mymap = L.map('shutdowns-map', {
      //   }).setView([54.764363, 55.954266], 10);
      // L.tileLayer(this.$root.urlMap, {
      //   foo: 'bar',
      //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      // }).addTo(mymap);
      ///////////////////////////////
      var mymap = null;
      // if (this.latlng) {
      //   mymap = L.map('shutdowns-map').setView([this.latlng.lat, this.latlng.lng], 15);
      // } else {
        mymap = L.map('shutdowns-map').setView([54.735147, 55.958727], 12);
      // }

      L.tileLayer(this.$root.urlMap, {
        foo: 'bar',
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      }).addTo(mymap);

      for (var i = 0; i < this.shutdowns.length; i++) {
        if (!this.shutdowns[i].coord) {
          continue;
        }
        var sd = this.shutdowns[i],
        coord = sd.coord.split(','),
        address = sd.address,
        title = '<div><span style="margin-bottom: 30px"><b>'+ address +'</b></span><ul style="padding: 0;">',
        dates = null,
        work = null;

        for (var j = 0; j < sd.shutdowns.length; j++) {
          if (sd.shutdowns[j].dateend) {
            dates = this.$moment(sd.shutdowns[j].dateon).format('DD MMM, HH:mm') +' - '+ this.$moment(sd.shutdowns[j].dateend).format('DD MMM, HH:mm');
          } else {
            dates = 'с '+ this.$moment(sd.shutdowns[j].dateon).format('DD MMMM, HH:mm');
          }
          work = sd.shutdowns[j].group +' - '+ sd.shutdowns[j].type +' - '+ sd.shutdowns[j].section;

          title += '<li style="line-height: 1.6; border-top: 1px solid #cccccc77; padding-top: 7px; margin-top: 7px; text-align: center;"><div style="background-color: #E7F3EB; border-radius: 62px; padding: 5px 10px; margin-bottom: 5px;">'+ dates +'</div><div style="font-weight: bold; color: #777777; margin-bottom: 5px;">'+ work +'</div><div style="text-align: left; text-indent: 1em;">'+ sd.shutdowns[j].comment +'</div></li>';
        }
        title += '</ul></div>';

        let marker = null;
        if (sd.shutdowns[0].type == 'Плановые') {
          marker = L.marker([parseFloat(coord[1]), parseFloat(coord[0])], {
            'title': address,
            'icon': orangeIcon
          });
        } else {
          marker = L.marker([parseFloat(coord[1]), parseFloat(coord[0])], {
            'title': address,
            'icon': redIcon
          });
        }
        marker.addTo(mymap);
        marker.bindPopup(title);
        if (this.latlng) {
          if (coord[1] +', '+ coord[0] === this.latlng.lat +', '+ this.latlng.lng) {
            marker.openPopup();
          }
        }
      }
    }
  },
  mounted() {

  }
}
</script>
