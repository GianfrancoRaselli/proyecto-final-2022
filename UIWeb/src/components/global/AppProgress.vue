<template>
  <div class="progress">
    <div
      class="progress-bar"
      role="progressbar"
      :style="'width: ' + progress + '%;'"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {{ progress }}%
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppProgressComponent',
  props: {
    progress: { type: Number, default: 0 },
  },
};
</script>

<style scoped></style>
