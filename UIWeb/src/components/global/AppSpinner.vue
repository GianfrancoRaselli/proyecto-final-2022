<template>
  <div class="d-flex justify-content-center">
    <div class="spinner-border" :class="{ big: this.size === 'big' }" role="status">
      <span class="sr-only">{{ msg }}...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSpinnerComponent',
  props: {
    msg: { type: String, default: 'Loading' },
    size: { type: String, default: 'small' }
  },
};
</script>

<style scoped>
.big {
  height: 4rem;
  width: 4rem;
}
</style>
