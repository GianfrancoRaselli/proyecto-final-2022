<template>
  <button class="btn" :class="classes">
    <fa-icon :icon="icon" class="icon mr-1" size="1x" v-if="icon"></fa-icon
    >{{ text }}
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
.btn-sm {
  padding: 4px;
  font-size: small;
}

.btn-radius {
  border-radius: 10px;
}
</style>
