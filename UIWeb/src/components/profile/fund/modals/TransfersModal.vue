<template>
  <div>
    <div
      class="modal fade"
      :id="'profileTransfersModal' + fundAddress"
      tabindex="-1"
      :aria-labelledby="'profileTransfersModalLabel' + fundAddress"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" :id="'profileTransfersModalLabel' + fundAddress">Transferencias</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <TransfersList :loading="loading" :transfers="transfersOrdered" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { event } from '@/helpers/helpers';

import TransfersList from '@/components/lists/TransfersList.vue';

export default {
  name: 'ProfileTransfersModalComponent',
  components: {
    TransfersList,
  },
  props: {
    fundAddress: { type: String, required: true },
  },
  emits: ['transfers'],
  data() {
    return {
      loading: true,
      transfers: [],
    };
  },
  computed: {
    ...mapGetters(['address']),

    transfersOrdered() {
      return this.transfers.slice().sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
    },
  },
  methods: {
    async getTransfers() {
      this.loading = true;
      this.$emit('transfers', 0);

      try {
        await event(
          { name: 'Fund', address: this.fundAddress },
          'Transfer',
          undefined,
          async (events) => {
            let transfers = [];
            for (const event of events) {
              const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(event.blockNumber);
              transfers.push({
                sender: event.returnValues.sender,
                to: event.returnValues.to,
                value: event.returnValues.value,
                timestamp: block.timestamp,
              });
            }
            this.$emit('transfers', events.length);
            this.transfers = transfers;
          },
          true,
        );
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    this.getTransfers();
  },
};
</script>

<style lang="scss" scoped></style>
