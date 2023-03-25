<template>
  <div class="container">
    <AppSpinner class="spinner" size="medium" v-if="loading" />
    <div class="items" v-else>
      <div class="no-items" v-if="requestsToShow.length === 0">
        <fa-icon icon="xmark" class="icon" size="5x" />
        <span v-if="filter === 'petitioner'">La entidad no ha creado ninguna solicitud aún.</span>
        <span v-if="filter === 'recipient'">La entidad no ha sido receptora de ninguna solicitud aún.</span>
      </div>
      <div v-else>
        <p class="amount">
          <span class="number" v-text="requestsToShow.length"></span>
          <span v-text="requestsToShow.length === 1 ? ' solicitud encontrada.' : ' solicitud encontradas.'"></span>
        </p>
        <div class="item" :class="getRequestClass(request)" v-for="request in requestsToShow" :key="request.index">
          <RequestsContent :fund="funds[request.fundIndex]" :request="request" :showFundName="true" />
          <ApprovalsModal
            :fundAddress="funds[request.fundIndex].address"
            :requestIndex="request.index"
            :from="'profileRequests' + filter"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { compareAddresses } from 'web3-simple-helpers/methods/general';

import ApprovalsModal from '@/components/modals/fund/ApprovalsModal.vue';
import RequestsContent from '@/components/contents/RequestsContent.vue';

export default {
  name: 'ProfileRequestsComponent',
  components: {
    ApprovalsModal,
    RequestsContent,
  },
  props: {
    funds: { type: Array, required: true },
    loading: { type: Boolean, required: true },
    requests: { type: Array, required: true },
    filter: { type: String, required: true }, // petitioner | recipient
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['address']),

    requestsToShow() {
      let requestsToShow = this.requests.slice();

      // filter
      requestsToShow = requestsToShow.filter((request) => {
        return compareAddresses(request[this.filter], this.$route.params.address);
      });

      // order
      requestsToShow = requestsToShow.sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });

      return requestsToShow;
    },
  },
  watch: {},
  methods: {
    getRequestClass(request) {
      if (request.complete) return 'request-completed';
      if (
        request.approvalsCount >=
        Math.ceil(this.maxNumOfApprovers(request) * (this.funds[request.fundIndex].minimumApprovalsPercentageRequired / 100))
      )
        return 'request-approved';
      return 'request-created';
    },

    maxNumOfApprovers(request) {
      const fund = this.funds[request.fundIndex];
      if (fund.onlyContributorsCanApproveARequest) {
        if (fund.contributors) return fund.contributors.length;
        else return 0;
      } else {
        let num = 0;
        if (fund.contributors) {
          num = fund.contributors.length;
          if (fund.managers) {
            fund.managers.forEach((manager) => {
              let isAContributor = false;
              for (let i = 0; i < fund.contributors.length; i++) {
                if (fund.contributors[i].contributor === manager) {
                  isAContributor = true;
                  break;
                }
              }
              if (!isAContributor) num++;
            });
          }
        } else {
          if (fund.managers) num = fund.managers.length;
        }
        return num;
      }
    },
  },
  created() {},
  mounted() {},
  unmounted() {},
};
</script>

<style lang="scss" scoped>
.item {
  padding: 0.65rem 0.55rem;
  border: 1px solid rgb(238, 238, 238);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  gap: 0.3rem;
}

.request-completed {
  background-color: rgba(0, 0, 255, 0.19);
}

.request-approved {
  background-color: rgba(0, 128, 0, 0.262);
}

.request-created {
  background-color: rgba(255, 0, 0, 0.185);
}
</style>
