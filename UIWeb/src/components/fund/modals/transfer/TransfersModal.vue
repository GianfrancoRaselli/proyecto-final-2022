<template>
  <div>
    <div class="modal fade" id="transfersModal" tabindex="-1" aria-labelledby="transfersModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="transfersModalLabel">
              <span>Transferencias</span>
              <span class="amount" v-text="transfers.length" v-if="transfers.length > 0"></span>
            </h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="transfer" v-if="fund.managersCanTransferMoneyWithoutARequest && isManager">
              <button type="button" class="btn btn-success btn-sm" @click="transfer">
                <fa-icon icon="plus" class="icon mr-2" />Transferir
              </button>
            </div>
            <TransfersList
              :class="{ list: fund.managersCanTransferMoneyWithoutARequest && isManager }"
              :loading="loading"
              :transfers="transfersOrdered"
            />
          </div>
        </div>
      </div>
    </div>
    <TransferModal :fund="fund" v-if="fund.managersCanTransferMoneyWithoutARequest && isManager" />
  </div>
</template>

<script>
import $ from 'jquery';
import { mapGetters } from 'vuex';
import { event } from '@/helpers/helpers';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

// modals
import TransferModal from '@/components/fund/modals/transfer/TransferModal.vue';
import TransfersList from '@/components/lists/TransfersList.vue';

export default {
  name: 'TransfersModalComponent',
  components: {
    TransferModal,
    TransfersList,
  },
  props: {
    fund: { type: Object, required: true },
    isManager: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: true,
      transfers: [],
      transferSubscription: null,
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
    compareAddresses,
    fromUnixTimestampToDate,

    transfer() {
      $('#transfersModal').modal('hide');
      $('#transferModal').modal('show');
    },

    async getTransfers() {
      this.loading = true;
      try {
        await event(
          { name: 'Fund', address: this.$route.params.fundAddress },
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

    this.transferSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'Transfer',
      undefined,
      () => {
        this.getTransfers();
      },
    );
  },
  unmounted() {
    if (this.transferSubscription) this.transferSubscription.unsubscribe();
  },
};
</script>

<style lang="scss" scoped>
.transfer {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgb(156, 156, 156);
}

.list {
  margin-top: 0.4rem;
}
</style>
