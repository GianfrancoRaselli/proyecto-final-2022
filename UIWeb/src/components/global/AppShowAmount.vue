<template>
  <span v-text="amount + ' ' + (amount === 1 ? singular : plural ? plural : singular)" />
</template>

<script>
export default {
  name: 'AppShowAmountComponent',
  props: {
    amount: { type: Number, default: 0 },
    singular: { type: String, default: '' },
    plural: { type: String, default: '' },
  },
};
</script>

<style scoped></style>
