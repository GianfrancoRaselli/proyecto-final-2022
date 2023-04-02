<template>
  <div class="create-fund-container">
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

<style scoped>
.create-fund-container {
  max-width: 1100px;
}
</style>
