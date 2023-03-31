<template>
  <span v-if="check">Sí<FaIcon icon="check" class="icon pl-1 green" /></span>
  <span v-else>No<FaIcon icon="xmark" class="icon pl-1 red" /></span>
</template>

<script>
export default {
  name: 'AppBadgeComponent',
  props: {
    check: { type: Boolean, default: true },
  },
};
</script>

<style scoped>
.green {
  color: green;
}

.red {
  color: red;
}
</style>
