<template>
  <div>
    <div class="input-errors" v-for="error of errors" :key="error.$uid">
      <div class="error-msg">{{ error.$message }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppInputErrorsComponent',
  props: {
    errors: { type: Array, required: true },
  },
};
</script>

<style scoped>
.error-msg {
  font-size: 0.88rem;
  color: rgba(225, 21, 21, 0.912);
}
</style>
