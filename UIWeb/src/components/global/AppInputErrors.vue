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
  color: red;
}
</style>
