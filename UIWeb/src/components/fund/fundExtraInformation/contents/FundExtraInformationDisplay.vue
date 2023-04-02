<template>
  <div class="display-container">
    <div class="fund-extra-information-header">
      <span class="title" v-text="title"></span>
      <button class="btn btn-primary" @click="$emit('showEditor')" v-if="isAManager">Editar</button>
    </div>
    <hr />
    <div v-html="html" v-if="html"></div>
    <div class="not-information" v-else>
      <FaIcon icon="xmark" class="icon" size="5x" />
      <span>Información aún no cargada.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FundExtraInformationDisplayComponent',
  components: {},
  props: {
    isAManager: { type: Boolean, required: true },
    title: { type: String, required: true },
    html: { type: String, required: true },
  },
  emits: ['showEditor'],
  data() {
    return {};
  },
  computed: {},
  methods: {},
  created() {},
};
</script>

<style lang="scss" scoped></style>
