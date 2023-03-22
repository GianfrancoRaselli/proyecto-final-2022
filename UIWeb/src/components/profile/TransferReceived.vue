<template>
  <Transfers :loading="loading" :transfers="transfers" filter="received" />
</template>

<script>
import { event } from '@/helpers/helpers';

import Transfers from '@/components/profile/Transfers.vue';

export default {
  name: 'ProfileTransferReceivedComponent',
  components: {
    Transfers,
  },
  props: {
    funds: { type: Array, required: true },
  },
  data() {
    return {
      loading: true,
      transfers: [],
    };
  },
  computed: {},
  watch: {
    funds() {
      this.getTransfers();
    },
  },
  methods: {
    async getTransfers() {
      try {
        if (this.funds.length > 0) {
          await Promise.all(
            Array(this.funds.length)
              .fill()
              .map((element, index) => {
                return event(
                  { name: 'Fund', address: this.funds[index].address },
                  'Transfer',
                  { filter: { to: this.$route.params.address } },
                  async (events) => {
                    let transfers = [];
                    for (const event of events) {
                      const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(event.blockNumber);
                      transfers.push({
                        fundAddress: this.funds[index].address,
                        fundName: this.funds[index].name,
                        sender: event.returnValues.sender,
                        to: event.returnValues.to,
                        value: event.returnValues.value,
                        timestamp: block.timestamp,
                      });
                    }
                    this.transfers = transfers;
                  },
                  true,
                );
              }),
          );
        }
      } finally {
        this.loading = false;
      }
    },
  },
  created() {},
  mounted() {},
  unmounted() {},
};
</script>

<style lang="scss" scoped></style>
