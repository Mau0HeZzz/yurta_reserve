<template>
  <div>
    <div
      v-if="title"
      :class="$style.title"
      :style="{
        maxWidth: titleMaxWidth,
        textAlign: titleAlign,
        marginBottom: '10px',
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
    <div :class="[$style.flexbox, $style.flexboxCenter]">
      <slot name="default" />
      <div
      v-if="sideText"
      >
        <div
          v-for="(text, i) in sideText"
          :key="i"
          :style="{
            marginBottom: '10px',
            fontSize: '10px'
          }"
        >
          <div :style="{color: text.color}">
            {{text.title}}
          </div>
          <div
            v-for="(keyval, index) in text.keys"
            :key="index"
          >
          {{keyval}}: {{text.values[index]}}
          </div>
        </div>
      </div>
    </div>
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
    sideText : {
      type: Array,
    }
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
.flexbox {
  display: flex;
}
.flexboxCenter {
  align-items: center;
  flex: 1 1 auto;
}
</style>
