<template>
  <div class="d-flex justify-content-center">
    <div class="spinner-border" :class="size" role="status">
      <span class="sr-only">{{ msg }}...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSpinnerComponent',
  props: {
    msg: { type: String, default: 'Loading' },
    size: { type: String, default: 'normal' },
  },
};
</script>

<style scoped>
.big {
  height: 4rem;
  width: 4rem;
}

.small {
  height: 1.2rem;
  width: 1.2rem;
}
</style>
