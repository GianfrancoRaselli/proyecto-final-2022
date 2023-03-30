<template>
  <div class="fund-extra-information-content">
    <div class="header">
      <span class="title" text="Actualizaciones"></span>
    </div>
    <hr />
  </div>
</template>

<script>
export default {
  name: 'FundExtraInformationUpdatesComponent',
  components: {},
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
