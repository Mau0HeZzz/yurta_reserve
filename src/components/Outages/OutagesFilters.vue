<template>
  <v-col cols="12" sm="8" md="7">
    <v-row>
      <v-col cols="12" sm="6">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              filled
              dense
              rounded
              hide-details
              ref="dataInput"
              v-model="dateFormatted"
              @blur="parseDate"
              @input="menu = false"
              @keypress="preventNotDigit"
              class="text-subtitle-2"
              placeholder="Выберите период"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <div class="outages__toggle-period">
            <v-btn-toggle v-model="togglePeriod" tile>
              <v-btn text :color="darkTheme ? 'white': 'primary'">Неделя</v-btn>
              <v-btn text :color="darkTheme ? 'white': 'primary'">Месяц</v-btn>
              <v-btn text :color="darkTheme ? 'white': 'primary'">Год</v-btn>
            </v-btn-toggle>
            <v-date-picker
              v-model="date"
              no-title
              scrollable
              range
              @click:year="saveYear"
              ref="picker"
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                :color="darkTheme ? 'white': 'primary'"
                @click="menu = false"
              >
                Закрыть
              </v-btn>
              <v-btn
                text
                :color="darkTheme ? 'white': 'primary'"
                @click="clearDate"
              >
                Сбросить
              </v-btn>
            </v-date-picker>
          </div>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6">
        <v-autocomplete
          clearable
          dense
          type="select"
          filled
          rounded
          hide-details
          class="text-subtitle-2"
          placeholder="Выберите регион"
          :items="region"
          item-text="fullName"
          item-value="objectId"
          v-model="selectedRegion"
        />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
export default {
  emits: ['filter-updated'],
  props: {
    onlyYear: {
      type: Boolean,
      default: false
    },
    region: {
      type: Array,
      default: ()=> [
        { "objectId": "all", "fullName": "Уфа"},
        { "objectId": "dema", "fullName": "Дёмский район"},
        { "objectId": "kalin", "fullName": "Калининский район"},
        { "objectId": "kirov", "fullName": "Кировский район"},
        { "objectId": "lenin", "fullName": "Ленинский район"},
        { "objectId": "okt", "fullName": "Октябрьский район"},
        { "objectId": "ordj", "fullName": "Орджоникидзевский район"},
        { "objectId": "sovet", "fullName": "Советский район"},
      ]
    },
    firstDate: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      menu: false,
      togglePeriod: undefined,
      inputDate: '',
      date: ['01.01.1970'],
      selectedRegion: null,
    }
  },
  computed: {
    darkTheme() {
      return this.$vuetify.theme.dark;
    },
    dateFormatted: {
      get() {
        return this.inputDate;
      },
      set(val) {
        if (typeof(val) === 'string') {
          let matrix = '__.__.____ - __.__.____',
            i = 0,
            date = val.replace(/\D/g, '');

          const result = matrix.replace(/./g, (a) => {
            return (/[_]/.test(a) && i < date.length) ? date.charAt(i++) : i >= date.length ? '' : a;
          });

          (val.length > matrix.length)
          ? this.inputDate = result + val.substr(matrix.length)
          : this.inputDate = result;
        } else {
          this.inputDate = val.map(item => new Date(Date.parse(item)).toLocaleDateString('ru-RU')).join(' - ');
        }
      }
    },
    filters() {
      if (this.date.length === 2) {
        return {
          period: this.date.map(item => new Date(Date.parse(item)).toLocaleDateString('ru-RU')),
          region: this.selectedRegion,
        };
      } else {
        return {
          period: [],
          region: this.selectedRegion,
        };
      }
    }
  },
  methods: {
    saveYear(val) {
      this.dateFormatted = `01.01.${val} - 31.12.${val}`;
      this.menu = false;
      this.parseDate()
    },
    clearDate() {
      this.date = [];
      this.inputDate = '';
    },
    preventNotDigit(e) {
      if (e.key.match(/\D/ig)) {
        e.preventDefault();
      }
    },
    convertDate(date) {
      return `${date.substr(6)}-${date.substr(3, 2)}-${date.substr(0, 2)}`;
    },
    reverseDate(date) {
      let arr;

      (typeof(date) === 'string')
      ? arr = date.split(' - ').map(item => this.convertDate(item))
      : arr = date;

      if (Date.parse(arr[0]) > Date.parse(arr[1])) {
        return arr.reverse();
      } else {
        return arr;
      }
    },
    parseDate() {
      if (this.menu) return;

      if (this.dateFormatted.length !== 23) {
        this.dateFormatted = this.date;
      } else {
        const arr = this.dateFormatted.split(' - '),
              newDate = [];
        let isValid = true;

        arr.forEach(item => {
          const currDate = this.convertDate(item),
                parse = Date.parse(currDate),
                currentCetury = 946666800000,
                afterFiveYear = Date.parse(new Date()) + 157248000000;

          if (isNaN(parse) || parse < currentCetury || parse > afterFiveYear) {
            isValid = false;
          } else {
            newDate.push(new Date(parse).toISOString().substr(0, 10));
          }
        });

        isValid
        ? this.date = newDate
        : this.dateFormatted = this.date;
      }
    }
  },
  watch: {
    date(val) {
      if (val && val.length === 2) {
        this.dateFormatted = this.reverseDate(val);
      }
    },
    inputDate(newVal) {
      this.$nextTick(() => {
        if (newVal.length > 23) {
          this.inputDate = newVal.substr(0, 23);
        }
      })
    },
    menu(val) {
      if (this.onlyYear) {
        val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'));
        if (!val && this.date.length === 1) {
          const now = [`01.01.${new Date().getFullYear()}`, `31.12.${new Date().getFullYear()}`];
          this.date = now;
        }
      } else if (!val && this.date.length === 1) {
        const now = new Date().toISOString().substr(0, 10);
        this.date.push(now);
      }
    },
    togglePeriod(val) {
      if (val !== undefined) {
        let firstDate;
        const currMonth = new Date().getMonth();
        const currYear = new Date().getFullYear();

        switch (val) {
          case 0:
            firstDate = new Date(Date.parse(new Date()) - (1000 * 60 * 60 * 24 * 6));
            break;
          case 1:
            firstDate = new Date(currYear, currMonth, 1, 5);
            break;
          case 2:
            firstDate = new Date(currYear, 0, 1, 5);
            break;
        }

        firstDate = this.firstDate ? new Date(Date.parse(this.firstDate)).toISOString().substr(0, 10) : new Date(Date.parse(firstDate)).toISOString().substr(0, 10);
        const secondDate = new Date().toISOString().substr(0, 10);

        this.date = [firstDate, secondDate];
        setTimeout(() => this.togglePeriod = undefined, 0);
      }
    },
    filters(val) {
      if (val.period.length === 2) this.menu = false;

      this.$emit('filter-updated', val);
    }
  },
  mounted() {
    this.togglePeriod = 0;
  }
}
</script>

<style>

</style>
