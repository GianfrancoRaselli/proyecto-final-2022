<template>
  <div>
    <div class="modal fade" id="requestsModal" tabindex="-1" aria-labelledby="requestsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" :class="{ 'modal-lg': fund._requests && fund._requests.length > 0 }">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="requestsModalLabel">Requests</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div
              class="create-request"
              v-if="
                fund._requestsCanBeCreated &&
                (!fund._onlyManagersCanCreateARequest || (fund._onlyManagersCanCreateARequest && isManager))
              "
            >
              <button type="button" class="btn btn-success btn-sm" @click="createNewRequest">
                <fa-icon icon="plus" class="icon mr-2" />Create request
              </button>
            </div>

            <div class="requests-list mt-2">
              <div class="no-requests" v-if="fund._requests && fund._requests.length === 0">No requests</div>
              <ul class="list-group list-group-flush" v-else>
                <li
                  class="list-group-item"
                  :class="getRequestClass(request)"
                  v-for="(request, index) in fund._requests"
                  :key="index"
                >
                  <div class="item-element item-number">
                    <span v-text="index + 1 + '.'" />
                  </div>
                  <div class="item-element item-content mx-4 px-3">
                    <div v-text="request.description" v-if="request.description"></div>
                    <div class="align-text" v-if="request.petitioner">
                      <span class="text-bold">Petitioner</span>:&nbsp;<span v-text="getSplitAddress(request.petitioner)"></span
                      ><span
                        class="badge badge-pill badge-primary ml-1"
                        v-if="request.petitioner.toLowerCase() === address.toLowerCase()"
                        >My address</span
                      >
                    </div>
                    <div class="align-text" v-if="request.recipient">
                      <span class="text-bold">Recipient</span>:&nbsp;<span v-text="getSplitAddress(request.recipient)"></span
                      ><span
                        class="badge badge-pill badge-primary ml-1"
                        v-if="request.recipient.toLowerCase() === address.toLowerCase()"
                        >My address</span
                      >
                    </div>
                    <div>
                      <span class="text-bold">Value to transfer</span>:&nbsp;<AppShowAmount
                        :amount="valueInEth(request.valueToTransfer)"
                        singular="ETH"
                      />
                    </div>
                    <div v-if="request.complete">
                      <span class="text-bold">Transferred value</span>:&nbsp;<AppShowAmount
                        :amount="valueInEth(request.transferredValue)"
                        singular="ETH"
                      />
                    </div>
                    <div v-if="!request.complete">
                      <span class="text-bold">Approvals</span>:&nbsp;<span
                        v-text="
                          request.approvalsCount +
                          ' of ' +
                          Math.ceil(
                            fund._onlyContributorsCanApproveARequest
                              ? (fund._contributors ? fund._contributors.length : 0) *
                                  (fund._minimumApprovalsPercentageRequired / 100)
                              : ((fund._contributors ? fund._contributors.length : 0) +
                                  (fund._managers ? fund._managers.length : 0)) *
                                  (fund._minimumApprovalsPercentageRequired / 100),
                          ) +
                          ' needed'
                        "
                      ></span>
                    </div>
                  </div>
                  <div class="item-element item-buttons px-3" v-if="!request.complete">
                    <div class="buttons-item my-2">
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        v-if="!approving(index)"
                        @click="approveRequest(index)"
                      >
                        <fa-icon icon="thumbs-up" class="icon mr-2" />Approve
                      </button>
                      <button class="btn btn-primary btn-sm" type="button" disabled v-if="approving(index)">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        Loading...
                      </button>
                    </div>

                    <div
                      class="buttons-item my-2"
                      v-if="
                        request.petitioner.toLowerCase() === address.toLowerCase() &&
                        request.approvalsCount >=
                          Math.ceil(
                            fund._onlyContributorsCanApproveARequest
                              ? (fund._contributors ? fund._contributors.length : 0) *
                                  (fund._minimumApprovalsPercentageRequired / 100)
                              : ((fund._contributors ? fund._contributors.length : 0) +
                                  (fund._managers ? fund._managers.length : 0)) *
                                  (fund._minimumApprovalsPercentageRequired / 100),
                          )
                      "
                    >
                      <button type="button" class="btn btn-dark btn-sm" v-if="!finalizing(index)" @click="finalizeRequest(index)">
                        <fa-icon icon="square-arrow-up-right" class="icon mr-2" />Finalize
                      </button>
                      <button class="btn btn-dark btn-sm" type="button" disabled v-if="finalizing(index)">
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        Loading...
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CreateRequestModal :fund="fund" />
  </div>
</template>

<script>
import $ from 'jquery';
import Web3 from 'web3';
import { mapState } from 'vuex';
import { transaction } from '@/helpers/helpers';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';

// modals
import CreateRequestModal from '@/components/fund/modals/request/CreateRequestModal.vue';

export default {
  name: 'RequestsModalComponent',
  components: {
    CreateRequestModal,
  },
  props: {
    fund: { type: Object, require: true },
    isManager: { type: Boolean, default: false },
  },
  data() {
    return {
      approvingRequests: [],
      finalizingRequests: [],
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),
  },
  methods: {
    getRequestClass(request) {
      if (request.complete) return 'request-completed';
      if (
        request.approvalsCount >=
        Math.ceil(
          this.fund._onlyContributorsCanApproveARequest
            ? (this.fund._contributors ? this.fund._contributors.length : 0) *
                (this.fund._minimumApprovalsPercentageRequired / 100)
            : ((this.fund._contributors ? this.fund._contributors.length : 0) +
                (this.fund._managers ? this.fund._managers.length : 0)) *
                (this.fund._minimumApprovalsPercentageRequired / 100),
        )
      )
        return 'request-approved';
      return 'request-created';
    },

    getSplitAddress,

    valueInEth(value) {
      return parseFloat(Web3.utils.fromWei(value.toString(), 'ether'));
    },

    createNewRequest() {
      $('#requestsModal').modal('hide');
      $('#createRequestModal').modal('show');
    },

    async approveRequest(index) {
      try {
        this.approvingRequests.push(index);
        await transaction(
          { name: 'Fund', address: this.$route.params.fundAddress },
          'approveRequest',
          [index],
          {},
          true,
          'Approve request ' + (index + 1) + ' of ' + this.fund._name,
        );
        // eslint-disable-next-line vue/no-mutating-props
        this.fund._requests[index].approvalsCount += 1;
        addNotification({
          message: 'Request ' + (index + 1) + ' approved',
          type: 'success',
        });
      } finally {
        this.approvingRequests = this.approvingRequests.filter((i) => i !== index);
      }
    },

    async finalizeRequest(index) {
      try {
        this.finalizingRequests.push(index);
        await transaction(
          { name: 'Fund', address: this.$route.params.fundAddress },
          'finalizeRequest',
          [index],
          {},
          true,
          'Finalize request ' + (index + 1) + ' of ' + this.fund._name,
        );
        // eslint-disable-next-line vue/no-mutating-props
        this.fund._requests[index].transferredValue =
          this.fund._requests[index].valueToTransfer > this.fund._balance
            ? this.fund._balance
            : this.fund._requests[index].valueToTransfer;
        // eslint-disable-next-line vue/no-mutating-props
        this.fund._requests[index].complete = true;
        addNotification({
          message: 'Request ' + (index + 1) + ' finalized',
          type: 'success',
        });
      } finally {
        this.finalizingRequests = this.approvingRequests.filter((i) => i !== index);
      }
    },

    approving(requestIndex) {
      if (this.approvingRequests.findIndex((i) => i === requestIndex) >= 0) return true;
      return false;
    },

    finalizing(requestIndex) {
      if (this.finalizingRequests.findIndex((i) => i === requestIndex) >= 0) return true;
      return false;
    },
  },
  async created() {},
};
</script>

<style scoped>
.create-request {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(156, 156, 156);
}

.no-requests {
  margin-top: 12px;
}

.list-group-item {
  border-radius: 10px;
  margin-bottom: 6px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
}

.request-completed {
  background-color: rgba(0, 0, 255, 0.18);
}

.request-approved {
  background-color: rgba(0, 128, 0, 0.21);
}

.request-created {
  background-color: rgba(255, 0, 0, 0.15);
}

.badge {
  font-size: 0.7rem;
}

.item-element {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
}

.item-content {
  border-left: 1px solid rgb(190, 190, 190);
  flex-basis: 100%;
}

.align-text {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-buttons {
  border-left: 1px solid rgb(190, 190, 190);
}
</style>
