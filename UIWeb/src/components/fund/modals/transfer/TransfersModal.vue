<template>
  <div>
    <div class="modal fade" id="transfersModal" tabindex="-1" aria-labelledby="transfersModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="transfersModalLabel">Transferencias</h4>
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

            <div class="transfers-list mt-2" v-if="!loading">
              <div class="no-transfers" v-if="transfersOrdered && transfersOrdered.length === 0">Sin transferencias</div>
              <ul class="list-group list-group-flush" v-else>
                <li class="list-group-item" v-for="(transfer, index) in transfersOrdered" :key="index">
                  <div class="header">
                    <AppDate class="date" :date="fromUnixTimestampToDate(transfer.timestamp)" />
                    <div class="badges">
                      <span class="badge badge-pill badge-primary" v-if="compareAddresses(transfer.sender, address)"
                        >Mi transferencia</span
                      >
                      <span class="badge badge-pill badge-secondary" v-if="compareAddresses(transfer.to, address)">Receptor</span>
                    </div>
                  </div>
                  <span>
                    <AppShowAddress class="address" :address="transfer.sender" :goToProfile="true" />
                    <span>&nbsp;transfirió&nbsp;</span>
                    <AppShowEth :weis="transfer.value" />
                    <span>&nbsp;a&nbsp;</span>
                    <AppShowAddress class="address" :address="transfer.to" :goToProfile="true" />
                  </span>
                </li>
              </ul>
            </div>
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

export default {
  name: 'TransfersModalComponent',
  components: {
    TransferModal,
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
            this.transfers = [];
            events.forEach(async (event) => {
              const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(event.blockNumber);
              this.transfers.push({
                sender: event.returnValues.sender,
                to: event.returnValues.to,
                value: event.returnValues.value,
                timestamp: block.timestamp,
              });
            });
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
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(156, 156, 156);
}

.no-transfers {
  margin-top: 12px;
}

.list-group-item {
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  gap: 0.3rem;

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.4rem;

    .badges {
      margin-left: auto;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;
    }
  }

  .address {
    font-weight: bold;
  }
}
</style>
