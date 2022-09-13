<template>
  <div class="text-center">
    <div class="spinner-border" role="status">
      <span class="sr-only">{{ msg }}...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSpinnerComponent',
  props: {
    msg: { type: String, default: 'Loading' },
  },
};
</script>

<style scoped></style>
