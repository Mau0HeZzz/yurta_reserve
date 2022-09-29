<template>
  <div id="overhaul-map" :style="{ 'height' : '100%', 'z-index': '3' }">
  </div>
</template>

<script>
import L from "leaflet";

export default {
  data() {
    return {
      map: null,
    }
  },
  props: {
    themeMode: {
      type: String,
      default: 'light',
    },
    mapData: {
      type: Object,
      default: () => {
        return {
          typename: 'Данные отсутствуют',
          items: [{
            coord: [54.74728667873139, 55.9947550905636],
            totalWorks: 'Данные отсутствуют',
            totalHouses: 'Данные отсутствуют',
            worksByTypes: [
              {
                type: 'Данные отсутствуют',
                amount: '0',
              }, {
                type: 'Данные отсутствуют',
                amount: '0',
              }
            ]}
          ],
        }
      } 
    }
    },
  methods: {
    updateMap() {
      this.map.remove();
      this.map = null;
      this.initMap();
    },
      initMap() {
      let mymap = L.map('overhaul-map').setView([54.74728667873139, 55.9947550905636], 11);
      if (this.themeMode === 'dark') {
          L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          }).addTo(mymap);
        } else {
          L.tileLayer(this.$root.urlMap, {
            foo: 'bar',
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          }).addTo(mymap);
      }
        this.map = mymap;

        if (this.mapData.typename !== null) {
          switch (this.mapData.typename) {
            case 'Данные отсутствуют':
              this.mapWorksRender(this.mapData, 'Данные отсутствуют');
              break;
            case 'WorkTypeDashboard':
              this.mapWorksRender(this.mapData, 'Виды работ');
              break;
            case 'Entrance':
              this.mapEntrancesRender(this.mapData, 'Подъезды');
              break;
            case 'VentilationDashboard':
              this.mapVentilationRender(this.mapData, '');
              break;
          }
        }
    },
    mapWorksRender(mapData, title) {
        // let redIcon = L.icon({
        //   iconUrl: './img/icons/pin_red.png',
        //   iconSize: [48, 48],
        //   iconAnchor: [24, 48],
        //   popupAnchor: [0, -48]
        // });
        let blueIcon = L.icon({
          iconUrl: '../img/icons/pin_blue.png',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48]
        });
        // let greenIcon = L.icon({
        //   iconUrl: './img/icons/pin_green.png',
        //   iconSize: [48, 48],
        //   iconAnchor: [24, 48],
        //   popupAnchor: [0, -48]
        // });
      mapData.items.forEach(mapDataItem=>{
        let coord;
        coord = mapDataItem.coord ? mapDataItem.coord : [54.74728667873139, 55.9947550905636];
        let mapBaloonBody = '';
        if (mapDataItem.worksByTypes !== null) {
          mapDataItem.worksByTypes.forEach(work => {
            mapBaloonBody += `<li><div>${work.type}</div><div>${work.amount}</div></li>`
          });
        }
        let mapBaloonWrapper = `
          <div class="overhaul-baloon" style="min-width: 280px">
            <div class="overhaul-baloon__head">
              <h2 class="overhaul-baloon__title" style="text-align: center">${title}</h2>
              <ul style="padding: 0;" class="overhaul-baloon__totals">
                <li class="overhaul-baloon__total"><div>Всего работ</div><div>${mapDataItem.totalWorks}</div></li>
                <li class="overhaul-baloon__total"><div>Всего домов</div><div>${mapDataItem.totalHouses}</div></li>
              </ul>
            </div>
            <div class="overhaul-baloon__body">
              <ul style="padding: 0;" class="overhaul-baloon__list">
                <li class="overhaul-baloon__li overhaul-baloon__li_first"><div>Вид</div><div>Кол-во</div></li>
                ${mapBaloonBody}
              </ul>
            </div>
          </div>
        `;

        let marker = L.marker(coord, {
          'title': title,
          'icon': blueIcon
        });
        marker.addTo(this.map);
        marker.bindPopup(mapBaloonWrapper);
      })
    },
    mapEntrancesRender(mapData, title) {
        let blueIcon = L.icon({
          iconUrl: '../img/icons/pin_blue.png',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48]
        });
      mapData.items.forEach(mapDataItem=>{
        let coord;
        coord = mapDataItem.coord ? mapDataItem.coord : [54.74728667873139, 55.9947550905636];
        let mapBaloonWrapper = `
          <div class="overhaul-baloon" style="min-width: 280px">
            <div class="overhaul-baloon__head">
              <h2 class="overhaul-baloon__title" style="text-align: center">${title}</h2>
              <ul style="padding: 0;" class="overhaul-baloon__totals">
                <li class="overhaul-baloon__total"><div>Всего домов</div><div>${mapDataItem.houses}</div></li>
                <li class="overhaul-baloon__total"><div>Всего Подъездов</div><div>${mapDataItem.entrances}</div></li>
              </ul>
            </div>
          </div>
        `;

        let marker = L.marker(coord, {
          'title': title,
          'icon': blueIcon
        });
        marker.addTo(this.map);
        marker.bindPopup(mapBaloonWrapper);
      })
    },
    mapVentilationRender(mapData, title) {
        let blueIcon = L.icon({
          iconUrl: '../img/icons/pin_blue.png',
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48]
        });
      mapData.items.forEach(mapDataItem=>{
        let coord;
        coord = mapDataItem.coord ? mapDataItem.coord : [54.74728667873139, 55.9947550905636];
        let mapLi = '';
        mapDataItem.rows.forEach(row=>{
          let str = `<li style="margin-bottom: 10px;"><span>${row.black}</span>: <span style="color: #ddd;">${row.grey}</span></li>`;
          mapLi+=str;
        })
        let mapBaloonWrapper = `
          <div class="overhaul-baloon" style="min-width: 280px">
            <div class="overhaul-baloon__head" style="margin-bottom: 10px;">
              <h2 class="overhaul-baloon__title" style="text-align: center">${mapDataItem.title}</h2>
              <div class="overhaul-baloon__green"><span>${mapDataItem.greentext.left}</span><span>${mapDataItem.greentext.right}</span></div>
              </div>
              <ul style="padding: 0;" class="overhaul-baloon__totals">
                ${mapLi}
              </ul>
          </div>
        `;

        let marker = L.marker(coord, {
          'title': title,
          'icon': blueIcon
        });
        marker.addTo(this.map);
        marker.bindPopup(mapBaloonWrapper);
      })

    },
  },
  mounted() {
    this.initMap();
  },
  watch: {
    themeMode() {
      if (this.map) {
        this.updateMap();
      }
    },
    mapData() {
      if (this.map) {
        this.updateMap();
      }
    }
  }
  }
</script>

<style lang="scss">
@media (min-width:1360px){
  #overhaul-map {
    min-height: 500px;
  }
}
@media (max-width:950px) {
  #overhaul-map {
      min-height: 500px;
    }
}

.theme--dark {
  .leaflet-popup-content-wrapper {
  background-color: #202020;
  color: #fff;
  }
  .leaflet-popup-tip {
    display: none;
  }
}

.overhaul-baloon {

  &__head {
    padding: 0 0 10px;
    border-bottom: 1px solid #fff;
    }

  &__green {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    background-color: rgba(0, 128, 0, 0.3);
    border-radius: 30px;
    font-size: 0.8rem;
  }

  &__title {
    font-size: 1.2rem;
  }

  &__totals {
    font-size: 1rem;
  }

  &__total {
    display: flex;
    column-gap: 15px;
    justify-content: space-between;
    &:not(:last-child) {margin-bottom: 7px;}
  }

  &__body {
    padding-top: 10px;
    font-size: 1rem;
  }

  &__list {
    padding: 0;
    li {
      display: flex;
      column-gap: 15px;
      justify-content: space-between;
    
      &:not(:last-child) {
        margin-bottom: 7px;
      }

    }
  }

  &__li {

    &_first {}
  }
}
</style>