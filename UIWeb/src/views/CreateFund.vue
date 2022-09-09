<template>
  <div class="create-fund-container px-5">
    <CreateFundForm class="w-100" />
  </div>
</template>

<script>
import CreateFundForm from '@/components/CreateFundForm';

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
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>