<template>
  <span class="pill">{{ msg }}<fa-icon icon="xmark" class="icon" @click="$emit('close')" /></span>
</template>

<script>
export default {
  name: 'AppPillComponent',
  props: {
    msg: { type: String, require: true },
  },
  emits: ['close'],
};
</script>

<style scoped>
.pill {
  font-size: 0.9rem;
  background-color: rgba(200, 200, 200, 0.547);
  padding: 4px 12px;
  border-radius: 20px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 1.2rem;
}

.icon:hover {
  cursor: pointer;
}
</style>
