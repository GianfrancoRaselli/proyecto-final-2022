<template>
  <button class="btn" :class="classes">
    <fa-icon :icon="icon" class="icon mr-1" size="1x" v-if="icon" />
    <span v-text="text"></span>
  </button>
</template>

<script>
export default {
  name: "AppButtonComponent",
  props: {
    classes: { type: String, default: "btn-primary" },
    text: { type: String },
    icon: { type: String }
  },
};
</script>

<style scoped>
.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.btn-sm {
  padding: 4px;
  font-size: small;
}

.btn-md {
  padding: 8px;
  font-size: 14px;
}

.btn-radius {
  border-radius: 10px;
}
</style>
