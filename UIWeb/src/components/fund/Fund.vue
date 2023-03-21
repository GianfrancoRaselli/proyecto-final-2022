<template>
  <div>
    <div class="loading mb-2" v-if="loading">
      <AppSpinner class="spinner" size="big" />
    </div>
    <div class="card" v-else>
      <div class="card-header text-center">
        <span class="name" v-text="fund.name" />
        <div class="fund-info">
          <span class="badge badge-pill badge-primary my-fund-info mb-1" v-if="isMyFund">Mi fondo</span>
          <span class="badge badge-pill" :class="'badge-' + fundType.class" v-if="fundType" v-text="fundType.type" />
        </div>
      </div>
      <div class="card-body">
        <div class="body-header">
          <div class="img-container">
            <img class="img" :src="serverUrl + 'images/' + fund.image" v-if="fund && fund.image" />
            <img class="img" src="@/assets/imgs/fund.png" v-else />
            <div class="icons" v-if="isMyFund">
              <fa-icon icon="plus" class="icon light" data-toggle="modal" data-target="#editImageModal" />
              <fa-icon icon="trash" class="icon red" @click="openRemoveImage" v-if="fund && fund.image" />
            </div>
          </div>
          <div class="description" v-if="isMyFund || fund.description">
            <form class="form" @submit.prevent="handleEditDescriptionSubmit" v-if="isMyFund">
              <div class="form-group">
                <textarea
                  class="form-control"
                  :class="{ 'is-invalid': v$.editDescription.new.$errors.length }"
                  id="descriptionInput"
                  rows="12"
                  aria-describedby="descriptionHelp"
                  v-model="editDescription.new"
                  :disabled="editDescription.loading"
                ></textarea>
                <AppInputErrors :errors="v$.editDescription.new.$errors" />
              </div>

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="fund.description === editDescription.new"
                v-if="!editDescription.loading"
              >
                Actualizar descripción
              </button>
              <button class="btn btn-primary" type="button" disabled v-else>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Actualizando...
              </button>
            </form>
            <span v-text="fund.description" v-else />
          </div>
        </div>
        <p class="h5 text-center my-3 information-text">Información</p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Dirección</span>:&nbsp;</span>
          <AppShowAddress :address="fund.address" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Balance actual</span>:&nbsp;</span>
          <AppShowEth :weis="fund.balance" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Creador</span>:&nbsp;</span>
          <button type="button" class="btn btn-link" data-toggle="modal" :data-target="'#entityModal' + fund.creator">
            <AppShowAddress :address="fund.creator" />
          </button>
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Managers can be added or removed</span>:&nbsp;</span>
          <AppBadge :check="fund.managersCanBeAddedOrRemoved" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Total contributions</span>:&nbsp;</span>
          <AppShowEth :weis="fund.totalContributions" class="mr-3" />
          <button type="button" class="btn btn-link btn-show-contributors" data-toggle="modal" data-target="#contributorsModal">
            Ver contribuyentes
          </button>
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Managers can transfer money without a request</span>:&nbsp;</span>
          <AppBadge :check="fund.managersCanTransferMoneyWithoutARequest" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Requests can be created</span>:&nbsp;</span>
          <AppBadge :check="fund.requestsCanBeCreated" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Only managers can create a request</span>:&nbsp;</span>
          <AppBadge :check="fund.onlyManagersCanCreateARequest" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Only contributors can approve a request</span>:&nbsp;</span>
          <AppBadge :check="fund.onlyContributorsCanApproveARequest" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Minimum contribution percentage required</span>:&nbsp;</span>
          <span v-text="fund.minimumContributionPercentageRequired + '%'" />
        </p>
        <p class="info">
          <span class="info__label"><span class="text-bold">Minimum approvals percentage required</span>:&nbsp;</span>
          <span v-text="fund.minimumApprovalsPercentageRequired + '%'" />
        </p>
        <hr />
        <div class="buttons">
          <button type="button" class="btn btn-managers" data-toggle="modal" data-target="#managersModal">
            <fa-icon icon="person" class="icon mr-2" />Administradores
          </button>
          <button type="button" class="btn btn-contributions" data-toggle="modal" data-target="#contributionsModal">
            <fa-icon icon="circle-dollar-to-slot" class="icon mr-2" />Contribuciones
          </button>
          <button
            type="button"
            class="btn btn-transfers"
            data-toggle="modal"
            data-target="#transfersModal"
            v-if="fund.managersCanTransferMoneyWithoutARequest && isManager"
          >
            <fa-icon icon="money-bill-transfer" class="icon mr-2" />Transferencias
          </button>
          <button type="button" class="btn btn-requests" data-toggle="modal" data-target="#requestsModal">
            <fa-icon icon="list-check" class="icon mr-2" />Solicitudes
          </button>
        </div>
      </div>
      <div class="card-footer text-muted text-center">
        <AppDate :date="createdAt" />
      </div>

      <EntityModal :address="fund.creator" />
    </div>

    <!-- modals -->
    <CreateFundModal :fund="fund" />
    <EditImageModal :fundAddress="fund.address" @update="updateImage" v-if="isMyFund" />
    <ContributorsModal :loading="loading" :contributors="fund.contributors" />
    <ManagersModal :fund="fund" :isManager="isManager" />
    <ContributionsModal :fund="fund" />
    <TransfersModal :fund="fund" :isManager="isManager" />
    <RequestsModal :loading="loading" :fund="fund" :isManager="isManager" />
  </div>
</template>

<script>
import $ from 'jquery';
import { serverUrl } from '@/siteConfig';
import { mapState, mapGetters } from 'vuex';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';
import { call, event } from '@/helpers/helpers';
import { signMessage } from '@/helpers/connection';
import { addNotification } from '@/composables/useNotifications';
import { useVuelidate } from '@vuelidate/core';
import { helpers, maxLength } from '@vuelidate/validators';
import { validateForm } from '@/helpers/helpers';
import Swal from 'sweetalert2';
import axios from 'axios';

// modals
import CreateFundModal from '@/components/fund/CreateFundModal';
import EditImageModal from '@/components/EditImageModal';
import EntityModal from '@/components/fund/modals/EntityModal';
import ContributorsModal from '@/components/modals/fund/ContributorsModal.vue';
import ManagersModal from '@/components/fund/modals/manager/ManagersModal.vue';
import ContributionsModal from '@/components/fund/modals/contribution/ContributionsModal.vue';
import TransfersModal from '@/components/fund/modals/transfer/TransfersModal.vue';
import RequestsModal from '@/components/fund/modals/request/RequestsModal.vue';

export default {
  name: 'FundComponent',
  setup() {
    return { v$: useVuelidate({ $scope: false }) };
  },
  components: {
    CreateFundModal,
    EditImageModal,
    EntityModal,
    ContributorsModal,
    ManagersModal,
    ContributionsModal,
    TransfersModal,
    RequestsModal,
  },
  data() {
    return {
      serverUrl,
      loading: true,
      fund: {
        address: '',
        balance: '0',
        name: '',
        description: '',
        image: '',
        creator: '',
        createdAt: 0,
        managers: [],
        managersCanBeAddedOrRemoved: false,
        contributors: [],
        totalContributions: '0',
        managersCanTransferMoneyWithoutARequest: false,
        requests: [],
        requestsCanBeCreated: false,
        onlyManagersCanCreateARequest: false,
        onlyContributorsCanApproveARequest: false,
        minimumContributionPercentageRequired: 0,
        minimumApprovalsPercentageRequired: 0,
      },
      editDescription: {
        loading: false,
        new: '',
      },
      newManagerSubscription: null,
      removeManagerSubscription: null,
      contributeSubscription: null,
      transferSubscription: null,
      newRequestSubscription: null,
      approveRequestSubscription: null,
      finalizeRequestSubscription: null,
    };
  },
  computed: {
    ...mapState({
      signature: (state) => state.connection.signature,
    }),
    ...mapGetters(['address']),

    isMyFund() {
      return compareAddresses(this.address, this.fund.creator);
    },

    isManager() {
      if (this.fund.managers.findIndex((manager) => compareAddresses(manager, this.address)) >= 0) return true;
      return false;
    },

    fundType() {
      if (
        this.fund.managersCanBeAddedOrRemoved &&
        this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        !this.fund.onlyManagersCanCreateARequest &&
        !this.fund.onlyContributorsCanApproveARequest
      )
        return {
          type: 'Amigos',
          class: 'success',
        };
      if (
        !this.fund.managersCanBeAddedOrRemoved &&
        !this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        this.fund.onlyManagersCanCreateARequest &&
        this.fund.onlyContributorsCanApproveARequest
      )
        return {
          type: 'Campaña',
          class: 'warning',
        };
      if (
        this.fund.managersCanBeAddedOrRemoved &&
        this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        this.fund.onlyManagersCanCreateARequest &&
        this.fund.onlyContributorsCanApproveARequest
      )
        return {
          type: 'Donación',
          class: 'secondary',
        };
      return undefined;
    },

    createdAt() {
      return fromUnixTimestampToDate(this.fund.createdAt);
    },
  },
  validations() {
    return {
      editDescription: {
        new: {
          maxLength: helpers.withMessage('La cantidad máxima de caracteres permitidos es 1000', maxLength(1000)),
        },
      },
    };
  },
  methods: {
    updateImage(imageName) {
      this.fund.image = imageName;
    },

    openRemoveImage() {
      Swal.fire({
        title: 'Eliminar imagen',
        text: '¿Está seguro que desea eliminar la imagen del fondo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: '¡Sí, eliminar!',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeImage();
        }
      });
    },

    async removeImage() {
      if (!this.signature) await signMessage();
      axios.delete('fund/removeImage/' + this.fund.address).then(() => {
        this.fund.image = undefined;
        addNotification({
          message: 'Imagen eliminada',
          type: 'success',
        });
      });
    },

    async handleEditDescriptionSubmit() {
      if (await validateForm(this.v$)) {
        try {
          this.editDescription.loading = true;
          if (!this.signature) await signMessage();
          await axios.put('fund/' + this.fund.address, {
            description: this.editDescription.new,
          });
          this.fund.description = this.editDescription.new;
          addNotification({
            message: 'Descripción actualizada',
            type: 'success',
          });
        } catch {
          this.editDescription.new = this.fund.description;
        } finally {
          this.editDescription.loading = false;
        }
      }
    },
  },
  async created() {
    const getSearchSummaryPromise = () => {
      return new Promise((resolve) => {
        const searchSummary = async () => {
          const { requests, ...fundWithoutRequests } = await call(
            { name: 'Fund', address: this.$route.params.fundAddress },
            'getSummary',
          );
          console.log(requests);
          this.fund = Object.assign(this.fund, fundWithoutRequests);
          const { data: fundExtraInformation } = await axios.get('fund/' + this.$route.params.fundAddress);
          if (fundExtraInformation) {
            const { description, image } = fundExtraInformation;
            this.fund.description = description;
            this.editDescription.new = description;
            this.fund.image = image;
          }
          await getSearchContributorsPromise(this.fund.contributors);
          resolve();
        };
        searchSummary();
      });
    };

    const getSearchContributorsPromise = (fundContributors) => {
      return new Promise((resolve) => {
        const searchContributors = async () => {
          if (!fundContributors)
            fundContributors = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getContributors');

          let contributors = [];

          if (fundContributors.length > 0) {
            contributors = Array(fundContributors.length);

            await Promise.all(
              Array(fundContributors.length)
                .fill()
                .map((element, index) => {
                  return call(
                    { name: 'Fund', address: this.$route.params.fundAddress },
                    'contributions',
                    [fundContributors[index]],
                    {},
                    (res) => {
                      contributors[index] = {
                        contributor: fundContributors[index],
                        contribution: res,
                      };
                    },
                  );
                }),
            );
          }

          this.fund.contributors = contributors;
          resolve();
        };
        searchContributors();
      });
    };

    const getSearchRequestsPromise = () => {
      return new Promise((resolve) => {
        const searchRequests = async () => {
          const totalRequests = parseInt(await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'requestsCount'));
          let requests = [];
          if (totalRequests > 0) {
            requests = Array(totalRequests);
            await Promise.all(
              Array(totalRequests)
                .fill()
                .map((element, index) => {
                  return call({ name: 'Fund', address: this.$route.params.fundAddress }, 'requests', [index], {}, async (res) => {
                    let newRequestBlock;
                    await event(
                      { name: 'Fund', address: this.$route.params.fundAddress },
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
                        { name: 'Fund', address: this.$route.params.fundAddress },
                        'FinalizeRequest',
                        { filter: { requestIndex: index } },
                        async (events) => {
                          finalizeRequestBlock = await this.$store.state.connection.infuraWeb3.eth.getBlock(
                            events[0].blockNumber,
                          );
                        },
                        true,
                      );
                    }
                    requests[index] = {
                      index,
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
          this.fund.requests = requests;
          resolve();
        };
        searchRequests();
      });
    };

    // load fund info
    this.loading = true;
    await Promise.all([getSearchSummaryPromise(), getSearchRequestsPromise()]);
    this.loading = false;

    // subscriptions
    this.newManagerSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'NewManager',
      undefined,
      async () => {
        this.fund.managers = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getManagers');
      },
    );
    this.removeManagerSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'RemoveManager',
      undefined,
      async () => {
        this.fund.managers = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getManagers');
      },
    );
    this.contributeSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'Contribute',
      undefined,
      async () => {
        await Promise.all([
          getSearchContributorsPromise(),
          call({ name: 'Fund', address: this.$route.params.fundAddress }, 'totalContributions', [], {}, (res) => {
            this.fund.totalContributions = res;
          }),
          call({ name: 'Fund', address: this.$route.params.fundAddress }, 'balance', [], {}, (res) => {
            this.fund.balance = res;
          }),
        ]);
      },
    );
    this.transferSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'Transfer',
      undefined,
      async () => {
        this.fund.balance = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'balance');
      },
    );
    this.newRequestSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'NewRequest',
      undefined,
      () => {
        getSearchRequestsPromise();
      },
    );
    this.approveRequestSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'ApproveRequest',
      undefined,
      () => {
        getSearchRequestsPromise();
      },
    );
    this.finalizeRequestSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'FinalizeRequest',
      undefined,
      () => {
        getSearchSummaryPromise();
        getSearchRequestsPromise();
      },
    );
  },
  mounted() {
    if (this.$route.query.nuevo) {
      $('#createFundModal').modal('show');
    }
  },
  unmounted() {
    if (this.newManagerSubscription) this.newManagerSubscription.unsubscribe();
    if (this.removeManagerSubscription) this.removeManagerSubscription.unsubscribe();
    if (this.contributeSubscription) this.contributeSubscription.unsubscribe();
    if (this.transferSubscription) this.transferSubscription.unsubscribe();
    if (this.newRequestSubscription) this.newRequestSubscription.unsubscribe();
    if (this.approveRequestSubscription) this.approveRequestSubscription.unsubscribe();
    if (this.finalizeRequestSubscription) this.finalizeRequestSubscription.unsubscribe();
  },
};
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 25vh;
  left: 0;
  width: 100%;

  .spinner {
    margin: auto;
  }
}

.card {
  position: relative;

  @media (min-width: 768px) {
    margin: 0 30px;
  }

  .card-header {
    padding-left: 80px;
    padding-right: 80px;

    .name {
      word-break: keep-all;
    }

    .fund-info {
      position: absolute;
      top: 4px;
      right: 4px;
      display: flex;
      flex-direction: column;
      align-items: end;

      .my-fund-info {
        width: fit-content;
      }
    }
  }

  .body-header {
    background-color: rgb(244, 244, 244);
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    @media (max-width: 1000px) {
      padding: 5px;
      display: flex;
      flex-direction: column;
    }

    .img-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 0.8rem;

      .img {
        height: 20rem;
        width: 20rem;
        border-radius: 1.5rem;
      }

      .icons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;

        .icon {
          user-select: none;
          height: 1.5rem;
          width: 1.5rem;
          padding: 0.5rem;
          border-radius: 1.5rem;
        }

        .icon:hover {
          cursor: pointer;
          background-color: rgb(225, 225, 225);
        }
      }
    }

    .description {
      word-wrap: break-word;
      word-break: break-word;
      width: 100%;
      padding: 2rem;

      @media (max-width: 1000px) {
        text-align: center;
        padding: 1.5rem;
      }
    }
  }

  .information-text {
    color: white;
    background-color: rgb(85, 85, 202);
    padding: 8px;
    border-radius: 5px;
  }

  .info {
    display: flex;
    flex-direction: row;
    align-items: center;

    @media (max-width: 600px) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .btn-show-contributors {
      font-size: 0.9rem;
    }

    .btn-show-contributors:focus {
      box-shadow: none;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;

    .btn-managers {
      color: white;
      background-color: rgba(57, 57, 221, 0.942);
    }

    .btn-contributions {
      color: white;
      background-color: rgba(45, 151, 45, 0.985);
    }

    .btn-transfers {
      color: white;
      background-color: rgba(201, 38, 38, 0.958);
    }

    .btn-requests {
      color: black;
      background-color: rgba(255, 166, 0, 0.935);
    }
  }
}

.card-footer {
  .date {
    font-size: 0.922rem;
  }
}
</style>
