<template>
  <div>
    <div :class="$style.title">Технические характеристики системы</div>
    <div class="custom-row">
      <div class="custom-col-1">
        <CustomSelect
          class="mb-6"
          label="Тип системы"
          type="variant-2"
          :options="filter.houseType"
          v-model="values.house_type"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          class="mb-6"
          label="Количество дымоходов в МКД (всего), ед."
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_chimneys_count"
        />
        <CustomInput
          class="mb-6"
          label="Количество вентканалов в МКД (всего), ед."
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_ventilation_channels_count"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          class="mb-6"
          label="Длина дымоходов, м.п."
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_chimneys_length"
        />
        <CustomInput
          class="mb-6"
          label="Длина вентканалов, м.п."
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_ventilation_channels_length"
        />
      </div>
      <div class="custom-col-2">
        <div class="custom-row justify-center">
          <div class="custom-col-2">
            <CustomInput
              class="mb-6"
              label="Приточный клапан дымохода"
              placeholder="Ввести"
              tooltip="Подсказка"
              v-model="values.house_chimneys_cap_size"
            />
            <CustomInput
              class="mb-6"
              label="Приточный клапан вентканала"
              placeholder="Ввести"
              tooltip="Подсказка"
              v-model="values.house_ventilation_channels_dimensions"
            />
          </div>
          <div class="custom-col-2">
            <div class="mx-auto">
              <CustomSelect
                class="mb-6"
                label="Боров"
                :options="filter.valve"
                v-model="values.house_chimneys_has_valve"
              />
              <CustomSelect
                class="mb-6"
                label="Боров"
                :options="filter.yesOrNo"
                v-model="values.house_has_cojoined_chimneys_ventilation"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-row mb-12">
      <div class="custom-col-1">
        <CustomInput
          class="mb-6"
          label="Год постройки"
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_build_year"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          class="mb-6"
          label="Общая площадь дома, тыс.кв.м."
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_square"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          class="mb-6"
          label="Кол-во этажей, ед."
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_floors"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          class="mb-6"
          label="Кол-во подъездов, ед."
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_entrances"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          class="mb-6"
          label="Количество квартир, ед."
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_flats"
        />
      </div>
      <div class="custom-col-1">
        <CustomSelect
          class="mb-6"
          label="Наличие борова"
          :options="filter.yesOrNo"
          v-model="values.house_has_flue"
        />
      </div>
    </div>
    <div :class="$style.title">
      Проверка состояния акт по форме Ф-20 с Газ
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            dense
            :class="$style.icon"
            v-bind="attrs"
            v-on="on"
          >
            mdi-help-circle
          </v-icon>
        </template>
        <span>Подсказка</span>
      </v-tooltip>
    </div>
    <div class="custom-row mb-12">
      <div class="custom-col-1">
        <CustomInput
          class="mb-6"
          label="Форма Ф-20 с Газ"
          placeholder="Ввести"
          tooltip="Подсказка"
          v-model="values.house_20c_form_date"
        />
      </div>
      <div class="custom-col-1">
        <CustomSelect
          label="Заключение"
          type="variant-2"
          :options="typeOptions"
          value="2"
        />
      </div>
      <div class="custom-col-3">
        <CustomTextarea
          label="Причина отключения"
          placeholder="Ввести"
          rows="1"
          v-model="values.house_20c_form_conclusion"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Дата отключения газоснабдения"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Отключено квартир, шт."
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Дата восстановления газоснабэения"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Возобновлено, квартир шт."
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Процент износа систем"
          placeholder="1-100%"
          tooltip="Подсказка"
        />
      </div>
    </div>
    <div :class="$style.title">
      Обследование систем
    </div>
    <div class="custom-row mb-12">
      <div class="custom-col-1">
        <CustomInput
          label="Наименование организации"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Номер договора"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Дата договора"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomSelect
          label="Результат обследования, требуется"
          type="variant-2"
          :options="typeOptions"
          value="2"
        />
      </div>
      <div class="custom-col-1">
        <InputFile
          title="Акт обследования"
          value=""
        />
      </div>
    </div>
    <div :class="$style.title">
      Осмечивание работ
    </div>
    <div class="custom-row mb-12">
      <div class="custom-col-1">
        <CustomInput
          label="Наименование организации"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Номер договора"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Дата договора"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Сумма затрат, руб."
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <InputFile
          title="Смета"
          value=""
        />
      </div>
    </div>
    <div :class="$style.title">
      Проведённые работы
    </div>
    <div class="custom-row mb-12">
      <div class="custom-col-1">
        <CustomInput
          label="Наименование организации"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Номер договора"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Дата договора"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Сумма затрат, руб."
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Дата проведения"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <CustomSelect
          label="Вид проведённых работ"
          type="variant-2"
          :options="typeOptions"
          value="2"
        />
      </div>
      <div class="custom-col-1">
        <CustomInput
          label="Количество отремонтированных систем"
          placeholder="Ввести"
          tooltip="Подсказка"
        />
      </div>
      <div class="custom-col-1">
        <InputFile
          title="Акт выполненных работ, КС-2"
          value=""
        />
      </div>
      <div class="custom-col-3">
        <CustomTextarea
          label="Примечание"
          placeholder="Ввести"
          value=""
        />
      </div>
    </div>
    <CustomButton type="default" :class="[$style.inputButton, 'mr-4']">Сохранить изменения</CustomButton>
  </div>
</template>

<script>
import CustomInput from "@/components/CustomInput";
import CustomSelect from "@/components/CustomSelect";
import CustomButton from "@/components/CustomButton";
import CustomTextarea from "@/components/CustomTextarea";
import InputFile from "@/components/InputFile";

export default {
  name: "VentilationInput",
  components: {
    InputFile,
    CustomInput,
    CustomSelect,
    CustomButton,
    CustomTextarea,
  },
  props: {
    municipality: {
      type: String,
      default: "",
    },
  },
  apollo: {
    getVentilations: {
      query: require('@/graphql/getVentilations.gql'),
      fetchPolicy: 'network-only',
      skip() {
        return !this.municipality;
      },
      variables() {
        return {
          houseMunicipality: this.municipality,
        }
      },
      result(response) {
        console.log(response);
      },
    },
    getVentilation: {
      query: require('@/graphql/getVentilation.gql'),
      fetchPolicy: 'network-only',
      skip() {
        return !this.municipality;
      },
      variables() {
        return {
          houseAddress: this.municipality,
        }
      },
      result(response) {
        this.values = {
          ...this.values,
          ...(response?.data?.getVentilation || {}),
        }
      },
    },
  },
  data() {
    return {
      filter: {
        houseType: [
          { label: 'Кирпичный', value: 'кирпичный' },
          { label: 'Панельный', value: 'панельный' },
          { label: 'Деревянный', value: 'деревянный' },
        ],
        valve: [
          { label: 'Есть', value: true },
          { label: 'Нет', value: false },
        ],
        yesOrNo: [
          { label: 'Да', value: true },
          { label: 'Нет', value: false },
        ],
      },
      values: {
        "id": "",
        "house_municipality": "",
        "house_address": "",
        "house_type": "",
        "house_build_year": "",
        "house_square": "",
        "house_floors": "",
        "house_entrances": "",
        "house_flats": "",
        "house_chimneys_count": "",
        "house_chimneys_length": "",
        "house_chimneys_cap_size": "",
        "house_chimneys_has_valve": false,
        "house_ventilation_channels_count": "",
        "house_ventilation_channels_length": "",
        "house_ventilation_channels_dimensions": "",
        "house_has_cojoined_chimneys_ventilation": false,
        "house_has_flue": true,
        "house_20c_form_date": null,
        "house_20c_form_conclusion": null,
        "house_gas_shutdown_date": null,
        "house_gas_shutdown_affected_flats_count": null,
        "house_gas_shutdown_resume_date": null,
        "house_gas_shutdown_resume_affected_flats_count": null,
        "house_management_organization_name": "",
        "house_management_community_name": null,
        "house_management_direct_management": null,
        "checkup_chimneys_contractor_name": "",
        "checkup_chimneys_contractor_contract_number": null,
        "checkup_chimneys_contractor_contract_date": null,
        "checkup_chimneys_attestation_date": null,
        "checkup_chimneys_attestation_contract_number": null,
        "checkup_chimneys_attestation_image_available": null,
        "checkup_ventilation_contractor_name": "",
        "checkup_ventilation_contractor_contract_number": null,
        "checkup_ventilation_contractor_contract_date": null,
        "checkup_ventilation_attestation_date": null,
        "checkup_ventilation_attestation_contract_number": null,
        "checkup_ventilation_attestation_image_available": null,
        "inspection_chimneys_contractor_contract_number": null,
        "inspection_chimneys_contractor_contract_date": null,
        "inspection_chimneys_contractor_name": "",
        "inspection_chimneys_maintenance_required_count": null,
        "inspection_chimneys_overhaul_required_count": null,
        "inspection_chimneys_reconstruction_required_count": null,
        "inspection_chimneys_construction_required_count": null,
        "inspection_ventilation_contractor_contract_number": null,
        "inspection_ventilation_contractor_contract_date": null,
        "inspection_ventilation_contractor_name": null,
        "inspection_ventilation_maintenance_required_count": null,
        "inspection_ventilation_overhaul_required_count": null,
        "inspection_ventilation_reconstruction_required_count": null,
        "inspection_ventilation_construction_required_count": null,
        "cost_estimating_chimneys_maintenance_cost": null,
        "cost_estimating_chimneys_overhaul_cost": null,
        "cost_estimating_chimneys_reconstruction_cost": null,
        "cost_estimating_chimneys_construction_cost": null,
        "cost_estimating_chimneys_contract_info": null,
        "cost_estimating_ventilation_maintenance_cost": null,
        "cost_estimating_ventilation_overhaul_cost": null,
        "cost_estimating_ventilation_reconstruction_cost": null,
        "cost_estimating_ventilation_construction_cost": null,
        "cost_estimating_ventilation_contract_info": null,
        "repairs_chimneys_maintenance_repaired_count": null,
        "repairs_chimneys_maintenance_period": null,
        "repairs_chimneys_maintenance_contract_info": null,
        "repairs_chimneys_maintenance_cost": null,
        "repairs_chimneys_overhaul_repaired_count": null,
        "repairs_chimneys_overhaul_period": null,
        "repairs_chimneys_overhaul_contract_info": null,
        "repairs_chimneys_overhaul_cost": null,
        "repairs_chimneys_reconstruction_repaired_count": null,
        "repairs_chimneys_reconstruction_period": null,
        "repairs_chimneys_reconstruction_contract_info": null,
        "repairs_chimneys_reconstruction_cost": null,
        "repairs_chimneys_construction_repaired_count": null,
        "repairs_chimneys_construction_period": null,
        "repairs_chimneys_construction_contract_info": null,
        "repairs_chimneys_construction_cost": null,
        "repairs_ventilation_maintenance_repaired_count": null,
        "repairs_ventilation_maintenance_period": null,
        "repairs_ventilation_maintenance_contract_info": null,
        "repairs_ventilation_maintenance_cost": null,
        "repairs_ventilation_overhaul_repaired_count": null,
        "repairs_ventilation_overhaul_period": null,
        "repairs_ventilation_overhaul_contract_info": null,
        "repairs_ventilation_overhaul_cost": null,
        "repairs_ventilation_reconstruction_repaired_count": null,
        "repairs_ventilation_reconstruction_period": null,
        "repairs_ventilation_reconstruction_contract_info": null,
        "repairs_ventilation_reconstruction_cost": null,
        "repairs_ventilation_construction_repaired_count": null,
        "repairs_ventilation_construction_period": null,
        "repairs_ventilation_construction_contract_info": null,
        "repairs_ventilation_construction_cost": null,
        "note": "",
        "house_fias_guid": "",
        "house_address_normalized": "",
      },
      checkboxes: [
        { label: 'Есть', value: '1' },
        { label: 'Нет', value: '0' },
      ],
      typeOptions: [
        { label: 'Совмещенная', value: '1' },
        { label: 'Капитальный ремонт', value: '2' }
      ],
      form: {
        block1: {
          valve1: '1',
          valve2: '1',
          valve3: '1',
          valve4: '1',
          valve5: '1',
          valve6: '1',
        }
      }
    };
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

.inputButton {
  min-width: 210px;
}
</style>
