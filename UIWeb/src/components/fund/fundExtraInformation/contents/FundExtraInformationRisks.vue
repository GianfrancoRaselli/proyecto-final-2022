<template>
  <div class="fund-extra-information-content">
    <FundExtraInformationEditor
      title="Riesgos"
      :fund="fund"
      propertyToEdit="risks"
      @showDisplay="edit = false"
      v-show="edit && isAManager"
    />
    <FundExtraInformationDisplay
      :isAManager="isAManager"
      title="Riesgos"
      :html="fund.risks"
      @showEditor="edit = true"
      v-show="!edit || !isAManager"
    />
  </div>
</template>

<script>
import FundExtraInformationEditor from '@/components/fund/fundExtraInformation/contents/FundExtraInformationEditor';
import FundExtraInformationDisplay from '@/components/fund/fundExtraInformation/contents/FundExtraInformationDisplay';

export default {
  name: 'FundExtraInformationRisksComponent',
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
      edit: false,
    };
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
