<template>
  <Requests :funds="funds" :loading="loading" :requests="requests" filter="petitioner" />
</template>

<script>
import Requests from '@/components/profile/Requests.vue';

export default {
  name: 'ProfileRequestsCreatedComponent',
  components: {
    Requests,
  },
  props: {
    funds: { type: Array, required: true },
    loading: { type: Boolean, required: true },
    requests: { type: Array, required: true },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
  unmounted() {},
};
</script>

<style lang="scss" scoped></style>
