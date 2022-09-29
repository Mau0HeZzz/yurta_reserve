<template>
  <div class="d-flex justify-center align-center overhaul-placeholder">
    <h2 class="text-center font-weight-regular">{{ text }}</h2>
  </div>
</template>

<script>
export default {
  name: "PlaceholderPage",
  props: {
    text: {
      type: String,
      default: 'Выберите период и регион для отображения данных',
    }
  }
};
</script>
