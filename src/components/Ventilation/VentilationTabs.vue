<template>
  <div class="tabs">
    <template v-for="tab in tabs">
      <router-link
        exact
        class="tab"
        :key="tab.to"
        :to="{ name: tab.to }"
      >
        {{ tab.name }}
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: "VentilationTabs",
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.tabs {
  display: flex;
  margin: 0 -8px;
}

.tab {
  margin: 0 8px;
  padding: 0 6px 8px 6px;
  font-size: 18px;
  line-height: 21px;
  letter-spacing: 0.25px;
  color: #D6D6D6 !important;
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.tab:hover,
.tab.router-link-active {
  color: #1EB94B !important;
}

.tab.router-link-active {
  border-bottom-color: #1EB94B;
}
</style>
