<template>
  <div
    :class="['button', type]"
  >
    <template v-if="$slots.icon">
      <span class="icon">
        <slot name="icon"/>
      </span>
    </template>
    <slot/>
  </div>
</template>

<script>
export default {
  name: "CustomButton",
  props: {
    type: {
      type: String,
      default: "default",
    }
  }
};
</script>

<style scoped>
.button {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 7px 20px;
  font-size: 13px;
  line-height: 1.23;
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  cursor: pointer;
}

.icon {
  display: inline-flex;
  align-items: center;
  min-width: 16px;
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.default {
  background: #118332;
  color: #fff;
  border-color: #118332;
}

.green-ghost {
  background: rgba(17, 131, 50, 0.17);
  color: #1EB94B;
  border-color: #1EB94B;
}
</style>
