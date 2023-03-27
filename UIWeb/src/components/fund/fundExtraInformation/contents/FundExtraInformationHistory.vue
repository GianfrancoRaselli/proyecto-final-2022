<template>
  <div class="fund-extra-information-content">
    <FundExtraInformationEditor :fund="fund" propertyToEdit="history" v-if="isAManager" />
    <div v-html="fund.history" v-else></div>
  </div>
</template>

<script>
import FundExtraInformationEditor from '@/components/fund/fundExtraInformation/contents/FundExtraInformationEditor';

export default {
  name: 'FundExtraInformationHistoryComponent',
  components: {
    FundExtraInformationEditor,
  },
  props: {
    isAManager: { type: Boolean, required: true },
    fund: { type: Object, required: true },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
