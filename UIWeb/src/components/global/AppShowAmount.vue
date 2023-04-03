<template>
  <span class="show-amount" v-text="amount + ' ' + (amount == 1 ? singular : plural ? plural : singular)" />
</template>

<script>
export default {
  name: 'AppShowAmountComponent',
  props: {
    amount: { type: [Number, String], default: 0 },
    singular: { type: String, default: '' },
    plural: { type: String, default: '' },
  },
};
</script>

<style scoped>
.show-amount {
  display: inline-block;
  max-width: max-content;
  min-width: max-content;
}
</style>
