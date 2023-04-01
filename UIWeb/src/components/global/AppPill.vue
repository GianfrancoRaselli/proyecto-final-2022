<template>
  <span class="pill" :class="'pill-' + type">{{ msg }}<FaIcon icon="xmark" class="icon" @click="$emit('close')" /></span>
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
  color: black;
  background-color: rgb(230, 230, 230);
  padding: 0.26rem 0.8rem;
  border-radius: 20px;
  user-select: none;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.52rem;
}

.pill-primary {
  color: white;
  background-color: #007bff;
}

.pill-secondary {
  color: white;
  background-color: #6c757d;
}

.pill-success {
  color: white;
  background-color: #28a745;
}

.pill-danger {
  color: white;
  background-color: #dc3545;
}

.pill-warning {
  color: #212529;
  background-color: #ffc107;
}

.pill-info {
  color: white;
  background-color: #17a2b8;
}

.pill-dark {
  color: white;
  background-color: #343a40;
}

.icon {
  font-size: 1.38em;
}

.icon:hover {
  cursor: pointer;
}
</style>
