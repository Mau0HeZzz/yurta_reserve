<template>
  <div :class="$style.wrapper">
    <label
      v-if="label"
      :class="$style.label"
    >
      {{ label }}
    </label>
    <div :class="$style.field">
      <input
        :class="$style.input"
        :type="type"
        v-bind="$attrs"
        :value="value"
        @input="onInput"
        @change="onChange"
      />
      <v-tooltip top v-if="tooltip">
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
        <span>{{ tooltip }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomInput",
  inheritAttrs: false,
  props: {
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    tooltip: {
      type: String,
      default: "",
    },
  },
  methods: {
    onInput(event) {
      this.$emit('input', event.target.value);
    },
    onChange(event) {
      this.$emit('change', event.target.value);
    },
  },
};
</script>

<style module>
.wrapper {

}

.label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: var(--v-inputLabel-base);
}

.field {
  display: flex;
  align-items: center;
}

.input {
  display: block;
  width: 100%;
  min-height: 32px;
  padding: 7px 8px 7px 14px;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: var(--v-inputColor-base);
  background-color: var(--v-inputBG-base);
  background-clip: padding-box;
  border: 1px solid var(--v-inputBorder-base);
  border-radius: 6px;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.input:focus {
  outline: 0;
}

.input::placeholder {
  color: var(--v-inputColor-base);
}

.icon {
  margin-left: 8px;
  color: var(--v-inputIcon-base) !important;
}
</style>
