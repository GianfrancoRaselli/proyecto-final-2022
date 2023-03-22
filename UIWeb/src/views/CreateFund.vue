<template>
  <div>
    <p class="page-title">Crear nuevo fondo</p>
    <CreateFundForm />
  </div>
</template>

<script>
import CreateFundForm from '@/components/fund/CreateFundForm';

export default {
  name: 'CreateFundView',
  components: {
    CreateFundForm,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped></style>
