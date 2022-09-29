<template>
  <h2>
    Для работы со страницей {{ title ? '"'+ title +'"' : '' }} необходимо выбрать фильтры
  </h2>
</template>

<script>
export default {
  name: 'NoFiltersSelected',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
