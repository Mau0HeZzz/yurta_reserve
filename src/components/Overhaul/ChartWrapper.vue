<template>
  <div>
    <div
      v-if="title"
      :class="$style.title"
      :style="{
        maxWidth: titleMaxWidth,
        textAlign: titleAlign,
      }"
    >
      {{ title }}
    </div>
    <div
      v-if="subTitle"
      :class="$style.subTitle"
    >
      {{ subTitle }}
    </div>

    <slot name="default" />
  </div>
</template>

<script>
export default {
  name: 'ChartWrapper',
  props: {
    title: {
      type: String,
      default: '',
    },
    titleMaxWidth: {
      type: String,
      default: '60%',
    },
    titleAlign: {
      type: String,
      default: 'center',
    },
    subTitle: {
      type: String,
      default: '',
    },
  },
};
</script>

<style module>
.title {
  margin: 0 auto;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  color: var(--v-chartsTitle-base);
}

.subTitle {
  margin-top: 2px;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: var(--v-chartsTitle-base);
}
</style>
