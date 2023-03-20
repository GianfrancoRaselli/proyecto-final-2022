<template>
  <div class="requests-list mt-2">
    <div class="no-requests" v-if="fund.requests && fund.requests.length === 0">Sin solicitudes</div>

    <ul class="list-group list-group-flush" v-else>
      <li class="list-group-item" :class="getRequestClass(request)" v-for="(request, index) in fund.requests" :key="index">
        <div class="item-number pr-3">
          <span v-text="index + 1 + '.'" />
        </div>

        <div class="item-content px-3">
          <div class="content-info">
            <div class="info" v-text="request.description" v-if="request.description" />
            <div class="info" v-if="request.petitioner">
              <span class="info__label"><span class="text-bold">Solicitante</span>:&nbsp;</span>
              <span class="info__info">
                <AppShowAddress class="hover" :address="request.petitioner" @click="goToProfile(request.petitioner)" />
                <span class="badge badge-pill badge-primary ml-1" v-if="compareAddresses(request.petitioner, address)">
                  Mi dirección
                </span>
              </span>
            </div>
            <div class="info" v-if="request.recipient">
              <span class="info__label"><span class="text-bold">Destinatario</span>:&nbsp;</span>
              <span class="info__info">
                <AppShowAddress class="hover" :address="request.recipient" @click="goToProfile(request.recipient)" />
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
            </div>
            <div class="info" v-if="!request.complete">
              <span class="info__label"><span class="text-bold">Aprobaciones</span>:&nbsp;</span>
              <span class="info__info">
                <span
                  v-text="
                    (request.approvalsCount | '0') +
                    ' de ' +
                    Math.ceil(maxNumOfApprovers() * (fund.minimumApprovalsPercentageRequired / 100)) +
                    ' necesarias'
                  "
                >
                </span>
                <span class="badge badge-pill badge-success ml-1" v-if="requestApproved(index)">Aprobado</span>
              </span>
            </div>
          </div>

          <div class="content-buttons" v-if="!request.complete && (!requestApproved(index) || canFinalize(request))">
            <div class="button" v-if="!requestApproved(index)">
              <button type="button" class="btn btn-primary btn-sm" v-if="!approving(index)" @click="approveRequest(index)">
                <fa-icon icon="thumbs-up" class="icon mr-2" />Aprobar
              </button>
              <button class="btn btn-primary btn-sm" type="button" disabled v-if="approving(index)">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              </button>
            </div>

            <div class="button" v-if="canFinalize(request)">
              <button type="button" class="btn btn-dark btn-sm" v-if="!finalizing(index)" @click="finalizeRequest(index)">
                <fa-icon icon="square-arrow-up-right" class="icon mr-2" />Finalizar
              </button>
              <button class="btn btn-dark btn-sm" type="button" disabled v-if="finalizing(index)">
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
import { transaction, call, event, convertNumberToMaxDecimals, goToProfile } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';
import Swal from 'sweetalert2';
import BigNumber from 'bignumber.js';

export default {
  name: 'RequestsListComponent',
  props: {
    fund: { type: Object, required: true },
    isManager: { type: Boolean, default: false },
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
  },
  methods: {
    compareAddresses,
    goToProfile,

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

    getRequestClass(request) {
      if (request.complete) return 'request-completed';
      if (request.approvalsCount >= Math.ceil(this.maxNumOfApprovers() * (this.fund.minimumApprovalsPercentageRequired / 100)))
        return 'request-approved';
      return 'request-created';
    },

    requestApproved(index) {
      return this.requestsApproved[index];
    },

    async approveRequest(index) {
      if (this.address) {
        if (
          (!this.fund.onlyContributorsCanApproveARequest && this.isManager) ||
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
              {},
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
          let message = 'You have not contributed to the fund yet';
          if (this.fund.totalContributions > 0) {
            message =
              'You have contributed ' +
              ((this.fund.contributors.find((c) => compareAddresses(c.contributor, this.address))
                ? this.fund.contributors.find((c) => compareAddresses(c.contributor, this.address)).contribution
                : 0) /
                this.fund.totalContributions) *
                100 +
              '% of the ' +
              this.fund.minimumContributionPercentageRequired +
              '% required to approve a request';
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
            {},
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
.no-requests {
  margin-top: 12px;
}

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

.badge {
  font-size: 0.7rem;
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

.content-info {
  padding-right: 1rem;
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

.content-buttons {
  min-width: 120px;
  padding-left: 1rem;
  border-left: 1px solid rgb(163, 163, 163);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

@media (max-width: 767px) {
  .info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .content-buttons {
    min-width: 100px;
  }
}

@media (max-width: 500px) {
  .item-content {
    flex-direction: column;
  }

  .content-info {
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
