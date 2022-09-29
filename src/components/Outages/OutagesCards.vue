<template>
  <v-row align="stretch">
    <v-col
      v-for="item in data"
      :key="item.title"
      cols="12"
      md="6"
      lg="3"
    >
      <v-card
        v-if="!loading"
        :dark="blackTheme"
        elevation="2"
        width="100%"
        height="100%"
        class="d-flex flex-column justify-center"
      >
        <div>
          <v-col cols="12" class="outages__text pb-0" :class="item.key === 'excess' ? '' : 'outages__bigfonts'">{{ item.title }}</v-col>
          <div class="d-flex outages__bigfonts">
            <v-col cols="6" class="text-left d-flex flex-column justify-center pt-2">
              <div class="font-weight-bold">{{ `${item.housesCount} ${changeHouseText(item.housesCount)}` }}</div>
              <div class="font-weight-bold outages__title-card">{{ `${item.shutdownsCount} ${changeShutdownText(item.shutdownsCount)}` }}</div>
            </v-col>
            <v-col cols="6" class="text-right d-flex flex-column justify-center pt-2">
              <div class="font-weight-bold outages__title-card">{{ `${item.peopleCount} ${changePeopleText(item.peopleCount)}` }}</div>
            </v-col>
          </div>
        </div>
      </v-card>
      <v-skeleton-loader v-else type="list-item-two-line" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ['loading', 'shutdowns', 'blackTheme'],
  data() {
    return {
      data: [
        { key: 'all', title: 'Всего', housesCount: 0, peopleCount: 0, shutdownsCount: 0 },
        { key: 'planned', title: 'Плановых', housesCount: 0, peopleCount: 0, shutdownsCount: 0 },
        { key: 'emergency', title: 'Аварийных', housesCount: 0, peopleCount: 0, shutdownsCount: 0 },
        { key: 'excess', title: 'Отключения с превышением продолжительности', housesCount: 0, peopleCount: 0, shutdownsCount: 0 }
      ]
    }
  },
  methods: {
    resetData() {
      this.data = [
        { key: 'all', title: 'Всего', housesCount: 0, peopleCount: 0, shutdownsCount: 0 },
        { key: 'planned', title: 'Плановых', housesCount: 0, peopleCount: 0, shutdownsCount: 0 },
        { key: 'emergency', title: 'Аварийных', housesCount: 0, peopleCount: 0, shutdownsCount: 0 },
        { key: 'excess', title: 'Отключения с превышением продолжительности', housesCount: 0, peopleCount: 0, shutdownsCount: 0 }
      ]
    },
    countShutdowns() {
      const info = [
        { key: 'all', title: 'Всего', housesCount: 0, peopleCount: 0, shutdownsCount: 0 },
        { key: 'planned', title: 'Плановых', housesCount: 0, peopleCount: 0, shutdownsCount: 0 },
        { key: 'emergency', title: 'Аварийных', housesCount: 0, peopleCount: 0, shutdownsCount: 0 },
        { key: 'excess', title: 'Отключения с превышением продолжительности', housesCount: 0, peopleCount: 0, shutdownsCount: 0 }
      ];
      let allHousesCount = 0,
          allPeopleCount = 0,
          allShutdownsCount = 0;

      Object.keys(this.shutdowns[0]).forEach(key => {
        const cardObj = info.find(i => i.key === key);

        if (cardObj) {
          cardObj.housesCount = this.shutdowns[0][key].totalHouses;
          allHousesCount += this.shutdowns[0][key].totalHouses;

          cardObj.peopleCount = this.shutdowns[0][key].totalPeople;
          allPeopleCount += this.shutdowns[0][key].totalPeople;

          cardObj.shutdownsCount = this.shutdowns[0][key].totalShutdowns;
          allShutdownsCount += this.shutdowns[0][key].totalShutdowns;
        }
      });

      info[0].housesCount = allHousesCount;
      info[0].peopleCount = allPeopleCount;
      info[0].shutdownsCount = allShutdownsCount;

      this.data = info;
    },
    changeHouseText(count) {
      if (count % 100 === 11 || count % 100 ===  12 || count % 100 ===  13 || count % 100 === 14) {
        return 'домов';
      } else if (count % 10 === 1) {
        return 'дом';
      } else if (count % 10 === 2 || count % 10 === 3 || count % 10 === 4) {
        return 'дома';
      } else {
        return 'домов';
      }
    },
    changePeopleText(count) {
      if (count % 100 ===  12 || count % 100 ===  13 || count % 100 === 14) {
        return 'человек';
      } else if (count % 10 === 2 || count % 10 === 3 || count % 10 === 4) {
        return 'человека';
      } else {
        return 'человек';
      }
    },
    changeShutdownText(count) {
      if (count % 100 === 11 || count % 100 ===  12 || count % 100 ===  13 || count % 100 === 14) {
        return 'отключений';
      } else if (count % 10 === 1) {
        return 'отключение';
      } else if (count % 10 === 2 || count % 10 === 3 || count % 10 === 4) {
        return 'отключения';
      } else {
        return 'отключений';
      }
    }
  },
  mounted() {
    this.shutdowns.length > 0 ? this.countShutdowns() : null;
  },
  watch: {
    shutdowns(val) {
      val.length > 0 ? this.countShutdowns() : this.resetData();
    }
  }
}
</script>

<style>

</style>