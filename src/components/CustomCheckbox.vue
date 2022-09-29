<template>
  <label :class="$style.wrapper">
    <input
      type="checkbox"
      :class="[$style.input, 'custom-input']"
      :value="value"
      :checked="value"
      @change="$emit('input', $event.target.checked)"
    >
    <span
      v-if="label"
      :class="$style.label"
    >
      {{ label }}
    </span>
  </label>
</template>

<script>
export default {
  name: "CustomCheckbox",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
  },
};
</script>

<style>
.custom-input:checked {
  background-color: #1EB94B;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='11' viewBox='0 0 14 11' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M5 11L0 5.99996L1.41 4.58996L5 8.16996L12.59 0.579956L14 1.99996L5 11V11Z' fill='white' fill-opacity='0.7'/%3E%3C/svg%3E");
  border-color: #1EB94B;
}

.theme--dark .custom-input:checked {
  background-color: #1EB94B;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='11' viewBox='0 0 14 11' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M5 11L0 5.99996L1.41 4.58996L5 8.16996L12.59 0.579956L14 1.99996L5 11V11Z' fill='black' fill-opacity='0.7'/%3E%3C/svg%3E");
  border-color: #1EB94B;
}
</style>

<style module>
.wrapper {
  display: block;
  min-height: 1.5rem;
  padding-left: 1.5em;
  margin-bottom: 0.125rem;
}

.wrapper:hover {
  cursor: pointer;
}

.input {
  float: left;
  width: 1.25em;
  height: 1.25em;
  margin-top: 0.25em;
  margin-left: -1.5em;
  vertical-align: top;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  border: 2px solid #898989;
  border-radius: 2px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  print-color-adjust: exact;
}

.label {
  display: inline-block;
  margin-left: 0.5em;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: var(---v-checkboxLabel-base);
  vertical-align: middle;
}
</style>
