<template>
  <button class="btn" :class="classes">
    <div class="btn-container">
      <FaIcon :icon="icon" class="icon" size="1x" v-if="icon" />
      <span v-text="text"></span>
    </div>
  </button>
</template>

<script>
export default {
  name: 'AppButtonComponent',
  props: {
    classes: { type: String, default: 'btn-primary' },
    text: { type: String },
    icon: { type: String },
  },
};
</script>

<style scoped>
.btn-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
}

.btn-sm {
  padding: 0.25rem;
  font-size: 0.86rem;
}

.btn-md {
  padding: 0.4rem;
}

.btn-radius {
  border-radius: 0.5rem;
}
</style>
