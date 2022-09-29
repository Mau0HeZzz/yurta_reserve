<template>
  <div class="wrapper">
    <div v-if="title" class="fileLabel">{{ title }}</div>
    <label class="file">
      <span class="icon">+</span>
      <span class="label">
        <span>{{ theFileName }}</span>
        <input
          type="file"
          name="attachment"
          class="input"
          @change="fileChangeHandler"
        >
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: "InputFile",
  props: {
    title: {
      type: String,
      default: "",
    },
    labelPlaceholder: {
      type: String,
      default: "Загрузить",
    },
  },
  data() {
    return {
      value: "",
      files: [],
    };
  },
  computed: {
    theFileName() {
      if ((this.files.length > 0) && "name" in this.files[0]) {
        return this.files[0].name;
      }
      return this.labelPlaceholder;
    },
  },
  methods: {
    fileChangeHandler(e) {
      this.files = Array.from(e.target.files);
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.fileLabel {
  margin-bottom: 10px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #FFF;
}

.file {
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 5px 16px 4px;
  min-height: 32px;
  background: rgba(17, 131, 50, 0.48);
  border: 1px solid #118332;
  border-radius: 6px;
  cursor: pointer;
}

.icon {
  margin-right: 8px;
}

.label {
  color: #E7F3EB;
  font-size: 12px;
  overflow: hidden;
  word-wrap: break-word;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  z-index: 1;
}

.input {
  position: absolute !important;
  height: 1px !important;
  width: 1px !important;
  padding: 0 !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  z-index: -1;
}

.input:focus {
  outline: none;
}
</style>
