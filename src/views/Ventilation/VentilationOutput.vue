<template>
  <div>
    <div :class="$style.title">Выбор параметров данных</div>
    <VRow>
      <VCol cols="4" class="mb-10">
        <div :class="$style.subtitle">Характеристики МКД</div>
        <CustomCheckbox label="Тип МКД" v-model="form.col1.type" :class="$style.checkbox"/>
        <CustomCheckbox label="Год постройки" v-model="form.col1.count"
                        :class="$style.checkbox"/>
        <CustomCheckbox label="Общая площадь МКД, м2" v-model="form.col1.dateWork" :class="$style.checkbox"/>
        <CustomCheckbox label="Количество этажей, ед." v-model="form.col1.name" :class="$style.checkbox"/>
        <CustomCheckbox label="Количество подъездов, ед." v-model="form.col1.date" :class="$style.checkbox"/>
        <CustomCheckbox label="Количество квартир, ед." v-model="form.col1.number" :class="$style.checkbox"/>
        <CustomCheckbox label="Способ управления МКД" v-model="form.col1.sum" :class="$style.checkbox"/>
        <CustomCheckbox label="Название управляющей организации" v-model="form.col1.act" :class="$style.checkbox"/>
      </VCol>
      <VCol cols="4" class="mb-10">
        <div :class="$style.subtitle">Характеристики системы</div>
        <CustomCheckbox label="Тип системы" v-model="form.col2.type" :class="$style.checkbox"/>
        <CustomCheckbox label="Количество систем в МКД" v-model="form.col2.count"
                        :class="$style.checkbox"/>
        <CustomCheckbox label="Длина системы, м.л." v-model="form.col2.dateWork" :class="$style.checkbox"/>
        <CustomCheckbox label="Наличие проточного клапана" v-model="form.col2.name" :class="$style.checkbox"/>
        <CustomCheckbox label="Наличие борова" v-model="form.col2.date" :class="$style.checkbox"/>
        <!-- <CustomCheckbox label="Номер договора" v-model="form.col2.number" :class="$style.checkbox"/>
        <CustomCheckbox label="Сумма затрат, руб." v-model="form.col2.sum" :class="$style.checkbox"/>
        <CustomCheckbox label="Акт выполненных работ, КС-2" v-model="form.col2.act" :class="$style.checkbox"/> -->
      </VCol>
      <VCol cols="4" class="mb-10">
        <div :class="$style.subtitle">Форма Ф-20 с Газ, газоснабжение</div>
        <CustomCheckbox label="Дата выдачи формы Ф-20 с Газ" v-model="form.col3.type" :class="$style.checkbox"/>
        <CustomCheckbox label="Заключение по форме Ф-20 с Газ" v-model="form.col3.count"
                        :class="$style.checkbox"/>
        <CustomCheckbox label="Дата отключения газоснабжения" v-model="form.col3.dateWork" :class="$style.checkbox"/>
        <CustomCheckbox label="Количество отключенных квартир" v-model="form.col3.name" :class="$style.checkbox"/>
        <CustomCheckbox label="Дата возобновления газоснабжения" v-model="form.col3.date" :class="$style.checkbox"/>
        <CustomCheckbox label="Количество подключенных квартир" v-model="form.col3.number" :class="$style.checkbox"/>
        <CustomCheckbox label="Процент износа систем, %" v-model="form.col3.sum" :class="$style.checkbox"/>
        <!-- <CustomCheckbox label="Акт выполненных работ, КС-2" v-model="form.col3.act" :class="$style.checkbox"/> -->
      </VCol>
      <VCol cols="4" class="mb-10">
        <div :class="$style.subtitle">Обследование систем</div>
        <CustomCheckbox label="Наименование организации" v-model="form.col4.type" :class="$style.checkbox"/>
        <CustomCheckbox label="Номер договора" v-model="form.col4.count"
                        :class="$style.checkbox"/>
        <CustomCheckbox label="Дата договора" v-model="form.col4.dateWork" :class="$style.checkbox"/>
        <CustomCheckbox label="Результат обследования" v-model="form.col4.name" :class="$style.checkbox"/>
        <CustomCheckbox label="Акт обследования" v-model="form.col4.date" :class="$style.checkbox"/>
        <!-- <CustomCheckbox label="Номер договора" v-model="form.col4.number" :class="$style.checkbox"/>
        <CustomCheckbox label="Сумма затрат, руб." v-model="form.col4.sum" :class="$style.checkbox"/>
        <CustomCheckbox label="Акт выполненных работ, КС-2" v-model="form.col4.act" :class="$style.checkbox"/> -->
      </VCol>
      <VCol cols="4" class="mb-10">
        <div :class="$style.subtitle">Осмечивание работ по восстановлению</div>
        <CustomCheckbox label="Наименование организации" v-model="form.col5.type" :class="$style.checkbox"/>
        <CustomCheckbox label="Номер договора" v-model="form.col5.count"
                        :class="$style.checkbox"/>
        <CustomCheckbox label="Дата договора" v-model="form.col5.dateWork" :class="$style.checkbox"/>
        <CustomCheckbox label="Сумма затрат" v-model="form.col5.name" :class="$style.checkbox"/>
        <CustomCheckbox label="Смета" v-model="form.col5.date" :class="$style.checkbox"/>
        <!-- <CustomCheckbox label="Номер договора" v-model="form.col5.number" :class="$style.checkbox"/>
        <CustomCheckbox label="Сумма затрат, руб." v-model="form.col5.sum" :class="$style.checkbox"/>
        <CustomCheckbox label="Акт выполненных работ, КС-2" v-model="form.col5.act" :class="$style.checkbox"/> -->
      </VCol>
      <VCol cols="4" class="mb-10">
        <div :class="$style.subtitle">Проведенные работы</div>
        <CustomCheckbox label="Вид работ" v-model="form.col6.type" :class="$style.checkbox"/>
        <CustomCheckbox label="Количество отремонтированных систем,ед." v-model="form.col6.count" :class="$style.checkbox"/>
        <CustomCheckbox label="Дата проведения работ, мм.гг." v-model="form.col6.dateWork" :class="$style.checkbox"/>
        <CustomCheckbox label="Наименование организации подрядчика" v-model="form.col6.name" :class="$style.checkbox"/>
        <CustomCheckbox label="Дата договора" v-model="form.col6.date" :class="$style.checkbox"/>
        <CustomCheckbox label="Номер договора" v-model="form.col6.number" :class="$style.checkbox"/>
        <CustomCheckbox label="Сумма затрат, руб." v-model="form.col6.sum" :class="$style.checkbox"/>
        <CustomCheckbox label="Акт выполненных работ, КС-2" v-model="form.col6.act" :class="$style.checkbox"/>
      </VCol>
    </VRow>
    <VRow class="align-center mb-12">
      <VCol>
        <CustomButton type="default" :class="[$style.inputButton, 'mr-4']">Вывести</CustomButton>
        <CustomButton type="green-ghost" :class="$style.iconButton">
          <template v-slot:icon>
            <v-img
              contain
              :class="$style.iconDownload"
              src="/img/icons/download.svg"
            />
          </template>
          Скачать таблицу
        </CustomButton>
      </VCol>
      <VCol cols="auto">
        <div :class="$style.stats">
          <span :class="$style.statsItem">Выбрано всего:</span>
          <span :class="$style.statsItem">МКД - 0000</span>
          <span :class="$style.statsItem">Домохозяйств - 0000</span>
          <span :class="$style.statsItem">Систем - 0000</span>
        </div>
      </VCol>
    </VRow>

    <VueCustomScrollbar
      :class="$style.wrapper"
      :settings="scrollbarSettings"
      @ps-y-reach-end.prevent="scrollCallback"
    >
      <VDataTable
        disable-sort
        fixed-header
        hide-default-footer
        class="custom-table transparent"
        :loading="pending"
        :headers="table.headers"
        :items="items"
        :items-per-page="-1"
      >
        <template #body="{ items }">
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td class="fs-8">{{ item.id }}</td>
              <td class="fs-8">{{ item.address }}</td>
              <td class="text-center fs-8">{{ item.type }}</td>
              <td class="text-center fs-8">{{ item.year }}</td>
              <td class="text-center fs-8">{{ item.area }}</td>
              <td class="text-center fs-8">{{ item.floors }}</td>
              <td class="text-center fs-8">{{ item.entrances }}</td>
              <td class="text-center fs-8">{{ item.apartments }}</td>
              <td class="text-center fs-8">{{ item.ventilation }}</td>
              <td class="text-center fs-8">{{ item.mkd }}</td>
              <td class="text-center fs-8">{{ item.length }}</td>
              <td class="text-center fs-8">{{ item.valve }}</td>
              <td class="text-center fs-8">{{ item.hog }}</td>
              <td class="text-center fs-8">{{ item.date }}</td>
              <td class="text-center fs-8">{{ item.conclusion }}</td>
              <td class="text-center fs-8">{{ item.shutdown }}</td>
              <td class="text-center fs-8">{{ item.countShutdown }}</td>
              <td class="text-center fs-8">{{ item.renewal }}</td>
              <td class="text-center fs-8">{{ item.countRenewal }}</td>
            </tr>
          </tbody>
        </template>
      </VDataTable>
    </VueCustomScrollbar>
  </div>
</template>

<script>
import "vue-custom-scrollbar/dist/vueScrollbar.css";
import VueCustomScrollbar from "vue-custom-scrollbar";
import { scrollbarSettings } from "@/constants/scrollbar";
import CustomCheckbox from "@/components/CustomCheckbox";
import CustomButton from "@/components/CustomButton";

export default {
  name: "VentilationOutput",
  components: {
    VueCustomScrollbar,
    CustomButton,
    CustomCheckbox,
  },
  props: {
    municipality: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      pending: false,
      scrollbarSettings: () => scrollbarSettings,
      form: {
        col1: {
          type: true,
          count: true,
          dateWork: true,
          name: true,
          date: true,
          number: true,
          sum: true,
          act: true,
        },
        col2: {
          type: false,
          count: false,
          dateWork: false,
          name: false,
          date: false,
          number: false,
          sum: false,
          act: false,
        },
        col3: {
          type: false,
          count: false,
          dateWork: false,
          name: false,
          date: false,
          number: false,
          sum: false,
          act: false,
        },
        col4: {
          type: false,
          count: false,
          dateWork: false,
          name: false,
          date: false,
          number: false,
          sum: false,
          act: false,
        },
        col5: {
          type: false,
          count: false,
          dateWork: false,
          name: false,
          date: false,
          number: false,
          sum: false,
          act: false,
        },
        col6: {
          type: false,
          count: false,
          dateWork: false,
          name: false,
          date: false,
          number: false,
          sum: false,
          act: false,
        },
      },
      table: {
        headers: [
          { text: "Муниципальное образование", value: "id", class: "text-uppercase fs-8" },
          { text: "Адрес МКД", value: "address", class: "text-uppercase fs-8" },
          { text: "Тип", value: "type", align: "center", class: "text-uppercase fs-8" },
          { text: "Год постройки", value: "year", align: "center", class: "text-uppercase fs-8" },
          { text: "Общая площадь МКД, м2", value: "area", align: "center", class: "text-uppercase fs-8" },
          { text: "Кол-во этажей, ед.", value: "floors", align: "center", class: "text-uppercase fs-8" },
          { text: "Кол-во подъездов, ед.", value: "entrances", align: "center", class: "text-uppercase fs-8" },
          { text: "Кол-во квартир, ед.", value: "apartments", align: "center", class: "text-uppercase fs-8" },
          { text: "Тип системы дымоудаления", value: "ventilation", align: "center", class: "text-uppercase fs-8" },
          { text: "Кол-во систем в МКД (всего), ед.", value: "mkd", align: "center", class: "text-uppercase fs-8" },
          { text: "Длина, в м.п.", value: "length", align: "center", class: "text-uppercase fs-8" },
          { text: "Наличие приточного клапана, \"да/нет\"", value: "valve", align: "center", class: "text-uppercase fs-8" },
          { text: "Наличие борова, да/нет", value: "hog", align: "center", class: "text-uppercase fs-8" },
          { text: "Дата выдачи Ф-20 с ГАЗ", value: "date", align: "center", class: "text-uppercase fs-8" },
          { text: "Заключение Ф-20 с ГАЗ", value: "conclusion", align: "center", class: "text-uppercase fs-8" },
          { text: "Дата отключения газоснабжения", value: "shutdown", align: "center", class: "text-uppercase fs-8" },
          { text: "Кол-во отключенных квартир", value: "countShutdown", align: "center", class: "text-uppercase fs-8" },
          { text: "Дата возобновления подачи газа", value: "renewal", align: "center", class: "text-uppercase fs-8" },
          { text: "Кол-во подключенных квартир", value: "countRenewal", align: "center", class: "text-uppercase fs-8" },
        ],
        items: [],
      },
    };
  },
  computed: {
    items() {
      return [...Array(7).keys()]?.map(() => ({
        id: "Республика Башкортостан",
        address: "г. Октябрьский, ул. Менделеева, д.167",
        type: "",
        year: "0000",
        area: "0000",
        floors: "0000",
        entrances: "0000",
        apartments: "0000",
        ventilation: "",
        mkd: "0000",
        length: "0000",
        valve: "Нет",
        hog: "Нет",
        date: "00.00.0000",
        conclusion: "00.00.0000",
        shutdown: "00.00.0000",
        countShutdown: "0000",
        renewal: "00.00.0000",
        countRenewal: "0000",
      }));
    },
  },
  methods: {
    scrollCallback() {
      this.$emit("tableEnd");
    },
  },
};
</script>

<style module>
.title {
  margin-bottom: 40px;
  font-weight: 400;
  font-size: 18px;
  line-height: 21px;
  text-align: center;
  color: var(--v-ventilationTitle-base);
}

.subtitle {
  margin-bottom: 18px;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: var(--v-ventilationSubTitle-base);
}

.checkbox:not(:last-child) {
  margin-bottom: 18px;
}

.stats {
  margin: -6px;
}

.statsItem {
  margin: 6px;
}

.inputButton {
  min-width: 210px;
}

.iconButton {
  display: inline-flex !important;
  align-items: center;
}

.iconDownload {
  width: 16px;
  height: 10px;
}
</style>

<style>
.fs-8 {
  font-size: 8px !important;
}
</style>
