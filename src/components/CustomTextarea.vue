<template>
  <div :class="$style.wrapper">
    <label
      v-if="label"
      :class="$style.label"
    >
      {{ label }}
    </label>
    <textarea
      :class="$style.input"
      v-bind="$attrs"
      v-model="value"
      @input="$emit('input', value)"
    />
  </div>
</template>

<script>
export default {
  name: "CustomTextarea",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
};
</script>

<style module>
.label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: var(--v-inputLabel-base);
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
</style>
