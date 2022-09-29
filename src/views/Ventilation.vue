<template>
  <router-view
    :class="$style.wrapper"
    @change-loading="handleChangeLoading"
  />
</template>

<script>
export default {
  name: 'Ventilation',
  methods: {
    handleChangeLoading(pending) {
      this.$emit('change-loading', pending)
    },
  },
};
</script>

<style module>
@media (min-width: 600px) {
  .wrapper {
    padding: 12px;
  }
}
@media (min-width: 960px) {
  .wrapper {
    padding: 30px;
  }
}
@media (min-width: 1264px) {
  .wrapper {
    padding: 48px;
  }
}
</style>
