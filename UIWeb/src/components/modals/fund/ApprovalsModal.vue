<template>
  <div
    class="modal fade"
    :id="'approvalsModal' + fundAddress + requestIndex + from"
    tabindex="-1"
    :aria-labelledby="'approvalsModalLabel' + fundAddress + requestIndex + from"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" :id="'approvalsModalLabel' + fundAddress + requestIndex + from">Aprobaciones</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-if="!backTo">
            <span aria-hidden="true">&times;</span>
          </button>
          <fa-icon icon="arrow-left" class="icon" @click="goBack" v-else />
        </div>
        <div class="modal-body">
          <div class="approvals-list" v-if="!loading">
            <div class="no-approvals" v-if="approvalsOrdered && approvalsOrdered.length === 0">Sin aprobaciones</div>
            <ul class="list-group list-group-flush" v-else>
              <li class="list-group-item" v-for="(approval, index) in approvalsOrdered" :key="index">
                <span v-text="index + 1"></span>
                <span>.&nbsp;</span>
                <AppShowAddress :address="approval.approver" :goToProfile="true" />
                <span class="badge badge-pill badge-primary ml-1" v-if="compareAddresses(approval.approver, address)">
                  Mi dirección
                </span>
                <span>&nbsp;</span>
                <AppDate class="date" :date="fromUnixTimestampToDate(approval.timestamp)" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { mapGetters } from 'vuex';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';
import { event } from '@/helpers/helpers';

export default {
  name: 'ApprovalsModalComponent',
  props: {
    fundAddress: { type: String, required: true },
    requestIndex: { type: Number, required: true },
    from: { type: String, default: '' },
    backTo: { type: String, default: '' },
    listenNewApprovals: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: true,
      approvals: [],
      approveRequestSubscription: null,
    };
  },
  computed: {
    ...mapGetters(['address']),

    approvalsOrdered() {
      return this.approvals.slice().sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
    },
  },
  methods: {
    compareAddresses,
    fromUnixTimestampToDate,

    goBack() {
      const backTo = this.backTo;
      $('#approvalsModal' + this.fundAddress + this.requestIndex).on('hidden.bs.modal', function () {
        $('#' + backTo).modal('show');
      });
      $('#approvalsModal' + this.fundAddress + this.requestIndex).modal('hide');
    },

    async getApprovals() {
      this.loading = true;
      try {
        await event(
          { name: 'Fund', address: this.fundAddress },
          'ApproveRequest',
          { filter: { requestIndex: this.requestIndex.toString() } },
          async (events) => {
            this.approvals = [];
            events.forEach(async (event) => {
              const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(event.blockNumber);
              this.approvals.push({
                approver: event.returnValues.approver,
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
    this.getApprovals();

    this.approveRequestSubscription = await event(
      { name: 'Fund', address: this.fundAddress },
      'ApproveRequest',
      { filter: { requestIndex: this.requestIndex.toString() } },
      async () => {
        this.getApprovals();
      },
    );
  },
  unmounted() {
    if (this.approveRequestSubscription) this.approveRequestSubscription.unsubscribe();
  },
};
</script>

<style lang="scss" scoped>
.list-group-item {
  padding: 0.8rem 0.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
