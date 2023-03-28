<template>
  <div class="fund-extra-information-content">
    <FundExtraInformationEditor :fund="fund" propertyToEdit="history" @showDisplay="edit = false" v-if="edit && isAManager" />
    <FundExtraInformationDisplay
      :isAManager="isAManager"
      title="Historia"
      :html="fund.history"
      @showEditor="edit = true"
      v-else
    />
  </div>
</template>

<script>
import FundExtraInformationEditor from '@/components/fund/fundExtraInformation/contents/FundExtraInformationEditor';
import FundExtraInformationDisplay from '@/components/fund/fundExtraInformation/contents/FundExtraInformationDisplay';

export default {
  name: 'FundExtraInformationHistoryComponent',
  components: {
    FundExtraInformationEditor,
    FundExtraInformationDisplay,
  },
  props: {
    isAManager: { type: Boolean, required: true },
    fund: { type: Object, required: true },
  },
  data() {
    return {
      edit: true,
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
