<template>
  <div class="alert" :class="type" role="alert">{{ msg }}</div>
</template>

<script>
export default {
  name: "AppAvatarComponent",
  props: {
    msg: { type: String, require: true },
    type: { type: String, default: 'alert-primary' },
  },
};
</script>

<style scoped>
.alert {
  font-size: large;
  text-align: center;
}
</style>
