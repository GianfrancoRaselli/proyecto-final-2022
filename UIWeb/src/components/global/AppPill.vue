<template>
  <span class="pill" :class="'pill-' + type">{{ msg }}<fa-icon icon="xmark" class="icon" @click="$emit('close')" /></span>
</template>

<script>
export default {
  name: 'AppPillComponent',
  props: {
    msg: { type: String, required: true },
    type: { type: String },
  },
  emits: ['close'],
};
</script>

<style scoped>
.pill {
  font-size: 0.82rem;
  background-color: rgba(200, 200, 200, 0.547);
  padding: 4px 12px;
  border-radius: 20px;
  user-select: none;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.pill-primary {
  color: #fff;
  background-color: #007bff;
}

.pill-secondary {
  color: #fff;
  background-color: #6c757d;
}

.pill-success {
  color: #fff;
  background-color: #28a745;
}

.pill-warning {
  color: #343a40;
  background-color: #ffc107;
}

.icon {
  font-size: 1.38em;
}

.icon:hover {
  cursor: pointer;
}
</style>
