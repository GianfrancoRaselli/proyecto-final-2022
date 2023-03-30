<template>
  <div class="alert" :class="type" role="alert">{{ msg }}</div>
</template>

<script>
export default {
  name: 'AppAlertComponent',
  props: {
    msg: { type: String, required: true },
    type: { type: String, default: 'alert-primary' },
  },
};
</script>

<style scoped>
.alert {
  font-size: 1.28rem;
  text-align: center;
  padding: 1.2rem;
}
</style>
