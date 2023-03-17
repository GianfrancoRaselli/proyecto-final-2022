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
            <AppSpinner v-if="loading" />
            <div v-else>
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
                    <AppShowAddress class="address hover" :address="transfer.sender" @click="goToProfile(transfer.sender)" />
                    <span>&nbsp;transfirió&nbsp;</span>
                    <AppShowEth :weis="transfer.value" />
                    <span>&nbsp;a&nbsp;</span>
                    <AppShowAddress class="address hover" :address="transfer.to" @click="goToProfile(transfer.to)" />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { event, goToProfile } from '@/helpers/helpers';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ProfileManagersModalComponent',
  components: {},
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
    compareAddresses,
    fromUnixTimestampToDate,
    goToProfile,

    async getTransfers() {
      this.loading = true;
      this.$emit('transfers', 0);

      try {
        await event(
          { name: 'Fund', address: this.fundAddress },
          'Transfer',
          undefined,
          async (err, events) => {
            events.forEach(async (event) => {
              const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(event.blockNumber);
              this.transfers.push({
                sender: event.returnValues.sender,
                to: event.returnValues.to,
                value: event.returnValues.value,
                timestamp: block.timestamp,
              });
            });

            this.$emit('transfers', events.length);
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

<style lang="scss" scoped>
.list-group-item {
  padding: 0.6rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  gap: 0.3rem;

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.4rem;

    .date {
      font-size: 0.8rem;
    }

    .badges {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 0.25rem;

      .badge {
        font-size: 0.75rem;
      }
    }
  }

  .address {
    font-weight: bold;
  }
}
</style>
