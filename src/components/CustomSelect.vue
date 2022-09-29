<template>
  <div :class="[$style.select, {[$style.open]: open }]" :tabindex="tabindex" @blur="open = false">
    <div :class="$style.label">
      {{ label }}
    </div>
    <div
      :class="[$style.selected, {
        open: open,
        [$style[type]]: type,
      }]"
      @click="open = !open"
    >
      {{ selected }}
    </div>
    <div :class="[$style.items, { [$style.selectHide]: !open }]">
      <div
        v-for="(option, i) of options"
        :key="i"
        :class="[$style.item, {
          [$style.itemActive]: value === option.value,
        }]"
        @click="() => handleChangeSelected(option.value)"
      >
        {{ option.label }}
      </div>
      <div v-if="!options.length">Ничего нет</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomSelect",
  props: {
    type: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: [String, Boolean],
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      required: false,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    selected() {
      return this.options?.find(option => option.value === this.value)?.label || this.placeholder;
    }
  },
  methods: {
    handleChangeSelected(value) {
      this.open = false;
      this.$emit("input", value);
    }
  }
};
</script>

<style module>
.select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  z-index: 4;
}

.select.open {
  z-index: 5;
}

.label {
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: var(--v-selectLabel-base);
}

.selected {
  position: relative;
  min-height: 32px;
  background: var(--v-selectBG-base);
  padding: 8px 16px;
  font-size: 12px;
  line-height: 14px;
  border: 1px solid var(--v-selectBorder-base);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
}

.selected:after {
  position: absolute;
  content: "";
  top: 50%;
  width: 15px;
  height: 10px;
  right: 14px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='10' viewBox='0 0 15 10' fill='none'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.292893 1.25005C0.683417 0.859522 1.31658 0.859522 1.70711 1.25005L7.5 7.04294L13.2929 1.25004C13.6834 0.85952 14.3166 0.85952 14.7071 1.25004C15.0976 1.64057 15.0976 2.27373 14.7071 2.66426L8.91422 8.45715C8.13317 9.2382 6.86684 9.2382 6.08579 8.45715L0.292894 2.66426C-0.0976309 2.27374 -0.097631 1.64057 0.292893 1.25005Z' fill='%23D6D6D6'/%3E%3C/svg%3E");
  transform: translateY(-50%);
}

.selected.open:after {
  transform: translateY(-50%) rotate(180deg);
}

.items {
  position: absolute;
  max-height: 300px;
  padding: 12px 24px;
  color: #fff;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--v-selectDropdown-base);
  box-shadow: 8px 3px 22px 10px rgba(var(--v-selectShadow-base));
  left: 0;
  right: 0;
  z-index: 1;
  overflow-y: auto;
}

.item {
  padding: 12px 0;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: var(--v-selectItem-base);
  cursor: pointer;
  user-select: none;
}

.itemActive {
  color: #118332;
}

.item:hover {
  background-color: rgba(17, 131, 50, 0.1);
}

.item:not(:last-child) {
  border-bottom: 1px solid var(--v-selectDivider-base);
}

.selectHide {
  display: none;
}

.variant-2 {
  border-color: transparent;
}
</style>
