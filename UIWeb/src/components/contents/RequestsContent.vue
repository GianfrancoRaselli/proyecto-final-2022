<template>
  <div class="content-info">
    <AppDate class="date" :date="fromUnixTimestampToDate(request.timestamp)" />
    <div class="info" v-if="showFundName">
      <span class="info__label"><span class="text-bold">Fondo</span>:&nbsp;</span>
      <span class="hover" v-text="fund.name" @click="goToFund(fund.address)"></span>
    </div>
    <div class="info" v-text="request.description" v-if="request.description" />
    <div class="info" v-if="request.petitioner">
      <span class="info__label"><span class="text-bold">Solicitante</span>:&nbsp;</span>
      <span class="info__info">
        <AppShowAddress :address="request.petitioner" :goToProfile="true" />
        <span class="badge badge-pill badge-primary ml-1" v-if="compareAddresses(request.petitioner, address)">
          Mi dirección
        </span>
      </span>
    </div>
    <div class="info" v-if="request.recipient">
      <span class="info__label"><span class="text-bold">Destinatario</span>:&nbsp;</span>
      <span class="info__info">
        <AppShowAddress :address="request.recipient" :goToProfile="true" />
        <span class="badge badge-pill badge-primary ml-1" v-if="compareAddresses(request.recipient, address)">
          Mi dirección
        </span>
      </span>
    </div>
    <div class="info">
      <span class="info__label"><span class="text-bold">Valor a transferir</span>:&nbsp;</span>
      <AppShowEth :weis="request.valueToTransfer" />
    </div>
    <div class="info" v-if="request.complete">
      <span class="info__label"><span class="text-bold">Valor transferido</span>:&nbsp;</span>
      <span class="info__info">
        <AppShowEth :weis="request.transferredValue" />
        <span>&nbsp;</span>
        <AppDate class="date" :date="fromUnixTimestampToDate(request.completeTimestamp)" />
      </span>
    </div>
    <div class="info" v-if="!request.complete">
      <span class="info__label"><span class="text-bold">Aprobaciones</span>:&nbsp;</span>
      <span class="info__info">
        <span
          v-text="
            (request.approvalsCount | '0') +
            ' de ' +
            Math.ceil(maxNumOfApprovers() * (fund.minimumApprovalsPercentageRequired / 100)) +
            ' ' +
            (Math.ceil(maxNumOfApprovers() * (fund.minimumApprovalsPercentageRequired / 100)) === 1 ? 'necesaria' : 'necesarias')
          "
        >
        </span>
        <span class="badge badge-pill badge-success ml-1" v-if="requestApproved()">Aprobada</span>
      </span>
    </div>
    <div class="info">
      <button type="button" class="btn btn-link btn-show-approvals" @click="goToApprovals()">Ver aprobaciones</button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { mapGetters } from 'vuex';
import { goToFund } from '@/helpers/helpers';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'RequestsListComponent',
  components: {},
  props: {
    fund: { type: Object, required: true },
    requestsApproved: { type: Array, required: false },
    request: { type: Object, required: true },
    showFundName: { type: Boolean, default: false },
    hideModalId: { type: String, default: '' },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {
    compareAddresses,
    fromUnixTimestampToDate,
    goToFund,

    goToApprovals() {
      if (this.hideModalId) $('#' + this.hideModalId).modal('hide');
      $('#approvalsModal' + this.fund.address + this.request.index).modal('show');
    },

    maxNumOfApprovers() {
      if (this.fund.onlyContributorsCanApproveARequest) {
        if (this.fund.contributors) return this.fund.contributors.length;
        else return 0;
      } else {
        let num = 0;
        if (this.fund.contributors) {
          num = this.fund.contributors.length;
          if (this.fund.managers) {
            this.fund.managers.forEach((manager) => {
              let isAContributor = false;
              for (let i = 0; i < this.fund.contributors.length; i++) {
                if (this.fund.contributors[i].contributor === manager) {
                  isAContributor = true;
                  break;
                }
              }
              if (!isAContributor) num++;
            });
          }
        } else {
          if (this.fund.managers) num = this.fund.managers.length;
        }
        return num;
      }
    },

    requestApproved() {
      if (this.requestApproved && this.requestApproved.length > 0) return this.requestsApproved[this.request.index];
      return false;
    },
  },
  async created() {},
  unmounted() {},
};
</script>

<style scoped>
.content-info {
  display: flex;
  flex-direction: column;
}

.info {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.info__info {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.btn-show-approvals {
  font-size: 0.92rem;
}

.btn-show-approvals:focus {
  box-shadow: none;
}

@media (max-width: 620px) {
  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
