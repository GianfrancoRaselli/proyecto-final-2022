<template>
  <div class="requests-list" v-if="!loading">
    <div class="no-items-modal" v-if="requestsOrdered && requestsOrdered.length === 0">Sin solicitudes</div>

    <ul class="list-group list-group-flush" v-else>
      <li
        class="list-group-item"
        :class="getRequestClass(request)"
        v-for="(request, index) in requestsOrdered"
        :key="request.index"
      >
        <div class="item-number pr-3">
          <span v-text="index + 1 + '.'" />
        </div>

        <div class="item-content px-3">
          <RequestsContent
            class="request-content"
            :fund="fund"
            :requestsApproved="requestsApproved"
            :request="request"
            hideModalId="requestsModal"
          />
          <div class="content-buttons" v-if="!request.complete && (!requestApproved(request.index) || canFinalize(request))">
            <div class="button" v-if="!requestApproved(request.index)">
              <button
                type="button"
                class="btn btn-primary btn-sm"
                v-if="!approving(request.index)"
                @click="approveRequest(request.index)"
              >
                <FaIcon icon="thumbs-up" class="icon mr-2" />Aprobar
              </button>
              <button class="btn btn-primary btn-sm" type="button" disabled v-if="approving(request.index)">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              </button>
            </div>

            <div class="button" v-if="canFinalize(request)">
              <button
                type="button"
                class="btn btn-dark btn-sm"
                v-if="!finalizing(request.index)"
                @click="finalizeRequest(request.index)"
              >
                <FaIcon icon="square-arrow-up-right" class="icon mr-2" />Finalizar
              </button>
              <button class="btn btn-dark btn-sm" type="button" disabled v-if="finalizing(request.index)">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Web3 from 'web3';
import { mapGetters } from 'vuex';
import { transaction, call, event, convertNumberToMaxDecimals } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';
import Swal from 'sweetalert2';
import BigNumber from 'bignumber.js';

import RequestsContent from '@/components/contents/RequestsContent.vue';

export default {
  name: 'RequestsListComponent',
  components: {
    RequestsContent,
  },
  props: {
    loading: { type: Boolean, required: true },
    fund: { type: Object, required: true },
    isAManager: { type: Boolean, default: false },
  },
  data() {
    return {
      requestsApproved: [],
      approvingRequests: [],
      finalizingRequests: [],
      approveRequestSubscription: null,
    };
  },
  computed: {
    ...mapGetters(['address']),

    requestsOrdered() {
      return this.fund.requests.slice().sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return -1;
      });
    },
  },
  methods: {
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

    requestApproved(requestIndex) {
      return this.requestsApproved[requestIndex];
    },

    async approveRequest(index) {
      if (this.address) {
        if (
          (!this.fund.onlyContributorsCanApproveARequest && this.isAManager) ||
          this.fund.minimumContributionPercentageRequired == 0 ||
          (this.fund.totalContributions > 0 &&
            ((this.fund.contributors.find((c) => compareAddresses(c.contributor, this.address))?.contribution || 0) /
              this.fund.totalContributions) *
              100 >=
              this.fund.minimumContributionPercentageRequired)
        ) {
          try {
            this.approvingRequests.push(index);
            await transaction(
              { name: 'Fund', address: this.$route.params.fundAddress },
              'approveRequest',
              [index],
              undefined,
              true,
              'Solicitud ' + (index + 1) + ' de ' + this.fund.name + ' aprobada',
            );
            this.requestsApproved[index] = true;
            // eslint-disable-next-line vue/no-mutating-props
            this.fund.requests[index].approvalsCount += 1;
            addNotification({
              message: 'Solicitud ' + (index + 1) + ' aprobada',
              type: 'success',
            });
          } finally {
            this.approvingRequests = this.approvingRequests.filter((i) => i !== index);
          }
        } else {
          let message = 'No has contribuido al fondo aún';
          if (this.fund.totalContributions > 0) {
            message =
              'Solo has contribuido ' +
              convertNumberToMaxDecimals(
                ((this.fund.contributors.find((c) => compareAddresses(c.contributor, this.address))
                  ? this.fund.contributors.find((c) => compareAddresses(c.contributor, this.address)).contribution
                  : 0) /
                  this.fund.totalContributions) *
                  100,
                3,
              ) +
              '% del ' +
              this.fund.minimumContributionPercentageRequired +
              '% requerido para poder aprobar una solicitud';
          }
          addNotification({
            message,
            type: 'error',
          });
        }
      } else {
        addNotification({
          message: 'Conectese a MetaMask para aprobar una solicitud',
          type: 'warning',
        });
      }
    },

    approving(requestIndex) {
      if (this.approvingRequests.findIndex((i) => i === requestIndex) >= 0) return true;
      return false;
    },

    canFinalize(request) {
      return (
        compareAddresses(request.petitioner, this.address) &&
        request.approvalsCount >= Math.ceil(this.maxNumOfApprovers() * (this.fund.minimumApprovalsPercentageRequired / 100))
      );
    },

    async finalizeRequest(index) {
      const successHandler = async () => {
        try {
          this.finalizingRequests.push(index);
          await transaction(
            { name: 'Fund', address: this.$route.params.fundAddress },
            'finalizeRequest',
            [index],
            undefined,
            true,
            'Solicitud ' + (index + 1) + ' de ' + this.fund.name + ' aprobada',
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.requests[index].transferredValue =
            this.fund.requests[index].valueToTransfer > this.fund.balance
              ? this.fund.balance
              : this.fund.requests[index].valueToTransfer;
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.requests[index].complete = true;
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.balance -= this.fund.requests[index].transferredValue;
          addNotification({
            message: 'Solicitud ' + (index + 1) + ' finalizada',
            type: 'success',
          });
        } finally {
          this.finalizingRequests = this.finalizingRequests.filter((i) => i !== index);
        }
      };

      if (BigNumber(this.fund.requests[index].valueToTransfer).isLessThanOrEqualTo(BigNumber(this.fund.balance))) {
        successHandler();
      } else {
        let valueToTransfer;
        if (this.fund.balance.length <= 13) {
          if (this.fund.balance === '1') valueToTransfer = '1 Wei';
          else valueToTransfer = this.fund.balance + ' Weis';
        } else {
          valueToTransfer = convertNumberToMaxDecimals(Number(Web3.utils.fromWei(this.fund.balance, 'ether')), 6) + ' ETH';
        }

        Swal.fire({
          title: '¿Quieres continuar de todos modos?',
          text: 'Si finalizas la solicitud en este momento solo podrás retirar ' + valueToTransfer,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#14A44D',
          cancelButtonColor: '#9FA6B2',
          confirmButtonText: '¡Sí, finalizar de todos modos!',
          cancelButtonText: 'Cancelar',
        }).then((result) => {
          if (result.isConfirmed) {
            successHandler();
          }
        });
      }
    },

    finalizing(requestIndex) {
      if (this.finalizingRequests.findIndex((i) => i === requestIndex) >= 0) return true;
      return false;
    },
  },
  async created() {
    const searchRequestsApproved = async () => {
      let requestsApproved = [];

      if (this.address) {
        const totalRequests = parseInt(await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'requestsCount'));
        if (totalRequests > 0) {
          requestsApproved = Array(totalRequests);

          await Promise.all(
            Array(totalRequests)
              .fill()
              .map((element, index) => {
                return call(
                  { name: 'Fund', address: this.$route.params.fundAddress },
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
    };
    await searchRequestsApproved();

    this.approveRequestSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'ApproveRequest',
      undefined,
      () => {
        searchRequestsApproved();
      },
    );
  },
  unmounted() {
    if (this.approveRequestSubscription) this.approveRequestSubscription.unsubscribe();
  },
};
</script>

<style scoped>
.list-group-item {
  padding: 0.8rem;
  border-radius: 10px;
  margin-top: 4px;
  margin-bottom: 4px;
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
  background-color: rgba(255, 0, 0, 0.185);
}

.item-number {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-content {
  border-left: 1px solid rgb(163, 163, 163);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-basis: 100%;
}

.request-content {
  padding-right: 1rem;
}

.content-buttons {
  min-width: 8rem;
  padding-left: 1rem;
  border-left: 1px solid rgb(163, 163, 163);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

@media (max-width: 767px) {
  .content-buttons {
    min-width: 100px;
  }
}

@media (max-width: 500px) {
  .item-content {
    flex-direction: column;
  }

  .request-content {
    padding: 0;
  }

  .content-buttons {
    min-width: 0;
    padding: 0;
    border: none;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgb(163, 163, 163);
    flex-direction: row;
    justify-content: start;
  }
}
</style>
