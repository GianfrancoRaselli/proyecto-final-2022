<template>
  <div>
    <div
      class="modal fade"
      :id="'profileRequestsModal' + fundAddress"
      tabindex="-1"
      :aria-labelledby="'profileRequestsModalLabel' + fundAddress"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" :id="'profileRequestsModalLabel' + fundAddress">Solicitudes</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <AppSpinner v-if="loadingRequests || loadingRequestsApproved" />
            <div v-else>
              <div class="no-requests" v-if="requestsOrdered && requestsOrdered.length === 0">Sin solicitudes</div>

              <ul class="list-group list-group-flush" v-else>
                <li
                  class="list-group-item"
                  :class="getRequestClass(request)"
                  v-for="(request, index) in requestsOrdered"
                  :key="index"
                >
                  <div class="item-number">
                    <span v-text="index + 1 + '.'" />
                  </div>

                  <div class="item-content">
                    <AppDate class="date" :date="fromUnixTimestampToDate(request.timestamp)" />
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
                      <AppShowEth :weis="request.transferredValue" />
                      &nbsp;
                      <AppDate class="date" :date="fromUnixTimestampToDate(request.completeTimestamp)" />
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
                            (Math.ceil(maxNumOfApprovers() * (fund.minimumApprovalsPercentageRequired / 100)) === 1
                              ? 'necesaria'
                              : 'necesarias')
                          "
                        >
                        </span>
                        <span class="badge badge-pill badge-success ml-1" v-if="requestApproved(index)">Aprobado</span>
                      </span>
                    </div>
                  </div>
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
import { call, event } from '@/helpers/helpers';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ProfileRequestsModalComponent',
  components: {},
  props: {
    fundAddress: { type: String, required: true },
    fund: { type: Object, required: true },
  },
  emits: ['requests'],
  data() {
    return {
      loadingRequests: true,
      requests: [],
      loadingRequestsApproved: true,
      requestsApproved: [],
    };
  },
  computed: {
    ...mapGetters(['address']),

    requestsOrdered() {
      return this.requests.slice().sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
    },
  },
  methods: {
    compareAddresses,
    fromUnixTimestampToDate,

    getRequestClass(request) {
      if (request.complete) return 'request-completed';
      if (request.approvalsCount >= Math.ceil(this.maxNumOfApprovers() * (this.fund.minimumApprovalsPercentageRequired / 100)))
        return 'request-approved';
      return 'request-created';
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

    requestApproved(index) {
      return this.requestsApproved[index];
    },

    async getRequests() {
      this.loadingRequests = true;

      try {
        const totalRequests = parseInt(await call({ name: 'Fund', address: this.fundAddress }, 'requestsCount'));
        this.$emit('requests', totalRequests);

        let requests = [];
        if (totalRequests > 0) {
          requests = Array(totalRequests);
          await Promise.all(
            Array(totalRequests)
              .fill()
              .map((element, index) => {
                return call({ name: 'Fund', address: this.fundAddress }, 'requests', [index], {}, async (res) => {
                  let newRequestBlock;
                  await event(
                    { name: 'Fund', address: this.fundAddress },
                    'NewRequest',
                    { filter: { requestIndex: index } },
                    async (events) => {
                      newRequestBlock = await this.$store.state.connection.infuraWeb3.eth.getBlock(events[0].blockNumber);
                    },
                    true,
                  );
                  let finalizeRequestBlock;
                  if (res.complete) {
                    await event(
                      { name: 'Fund', address: this.fundAddress },
                      'FinalizeRequest',
                      { filter: { requestIndex: index } },
                      async (events) => {
                        finalizeRequestBlock = await this.$store.state.connection.infuraWeb3.eth.getBlock(events[0].blockNumber);
                      },
                      true,
                    );
                  }
                  requests[index] = {
                    description: res.description,
                    petitioner: res.petitioner,
                    recipient: res.recipient,
                    valueToTransfer: res.valueToTransfer,
                    transferredValue: res.transferredValue,
                    complete: res.complete,
                    completeTimestamp: res.complete ? finalizeRequestBlock.timestamp : '',
                    approvalsCount: res.approvalsCount,
                    timestamp: newRequestBlock.timestamp,
                  };
                });
              }),
          );
        }
        this.requests = requests;
      } finally {
        this.loadingRequests = false;
      }
    },

    async getRequestsApproved() {
      this.loadingRequestsApproved = true;

      try {
        let requestsApproved = [];
        if (this.address) {
          const totalRequests = parseInt(await call({ name: 'Fund', address: this.fundAddress }, 'requestsCount'));
          if (totalRequests > 0) {
            requestsApproved = Array(totalRequests);
            await Promise.all(
              Array(totalRequests)
                .fill()
                .map((element, index) => {
                  return call(
                    { name: 'Fund', address: this.fundAddress },
                    'getRequestApproval',
                    [index, this.address],
                    {},
                    (res) => {
                      requestsApproved[index] = res;
                    },
                  );
                }),
            );
          }
        }
        this.requestsApproved = requestsApproved;
      } finally {
        this.loadingRequestsApproved = false;
      }
    },
  },
  async created() {
    this.getRequests();
    this.getRequestsApproved();
  },
};
</script>

<style scoped>
.list-group-item {
  border-radius: 10px;
  margin-top: 4px;
  margin-bottom: 4px;
  padding: 0.6rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
}

.request-completed {
  background-color: rgba(0, 0, 255, 0.19);
}

.request-approved {
  background-color: rgba(0, 128, 0, 0.262);
}

.request-created {
  background-color: rgba(255, 0, 0, 0.15);
}

.item-number {
  padding-right: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-content {
  width: 100%;
  padding-left: 0.6rem;
  border-left: 1px solid rgb(163, 163, 163);
  display: flex;
  flex-direction: column;
}

.date {
  font-size: 0.8rem;
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

@media (max-width: 430px) {
  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
