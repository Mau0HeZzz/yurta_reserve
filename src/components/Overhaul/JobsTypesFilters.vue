<template>
  <div>
    <div class="types-filters">
      <div class="types-filters__item types-filters__item_input">
        <div class="types-filters__icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.66683 14C11.1646 14 14.0002 11.1645 14.0002 7.66667C14.0002 4.16886 11.1646 1.33333 7.66683 1.33333C4.16903 1.33333 1.3335 4.16886 1.3335 7.66667C1.3335 11.1645 4.16903 14 7.66683 14Z"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14.6668 14.6667L13.3335 13.3333" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
        <input class="types-filters__input" type="text" placeholder="Поиск" v-model="selectedPlan.input">
      </div>
      <div v-if="select" class="types-filters__item">
        <v-autocomplete clearable filled dense rounded class="text-subtitle-2" :items="items" item-text="fullName"
          item-value="value" placeholder="План" v-model="selectedPlan.select"></v-autocomplete>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  props: {
    select: {
      type: Boolean,
      default: false
    }
  },
  data() {
      return {
        items: [
          { value: 'true', fullName: 'Выполнен'},
          { value: 'false', fullName: 'Не выполнен'}
        ],
        selectedPlan: {
          'input': null,
          'select': null
        },
      }
  },
  methods: {
    
  },
  watch: {
    "selectedPlan.select"(val) {
      if (val) {
        this.selectedPlan.select = val
      }
      this.$emit('changeTypePlan', {
        'name': 'plan',
        'value': this.selectedPlan
      });
    },
    "selectedPlan.input"(val) {
      if (val) {
        this.selectedPlan.input = val
      }
      this.$emit('changeTypePlan', {
        'name': 'plan',
        'value': this.selectedPlan
      });
    },
    }
  }
</script>

<style lang="scss" scoped>

</style>