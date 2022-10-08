<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-4 text-center">
      <span class="h2 text-underline">Create Fund</span>
    </div>

    <div class="mb-3">
      <fa-icon icon="circle-info" class="icon mr-2" size="2x"></fa-icon><span>Create a new fund costs 1 FundToken</span>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-group">
          <label for="typeInput">Type</label>
          <select id="typeInput" class="form-control" v-model="data.type" :disabled="loading">
            <option v-for="(type, i) in types" :key="i" v-text="type.type" :value="type.value" :selected="type.selected"></option>
          </select>
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label for="nameInput">Name</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'form-control-error': v$.data.name.$errors.length }"
            id="nameInput"
            aria-describedby="nameHelp"
            autofocus
            v-model="data.name"
            :disabled="loading"
          />
          <small id="nameHelp" class="form-text text-muted"></small>
          <AppInputErrors :errors="v$.data.name.$errors" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-group">
          <label for="descriptionInput">Description</label>
          <textarea
            class="form-control"
            :class="{ 'form-control-error': v$.data.description.$errors.length }"
            id="descriptionInput"
            rows="3"
            aria-describedby="descriptionHelp"
            v-model="data.description"
            :disabled="loading"
          ></textarea>
          <small id="descriptionHelp" class="form-text text-muted"></small>
          <AppInputErrors :errors="v$.data.description.$errors" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-group">
          <label v-if="isConnected">Creator:&nbsp;<span v-text="address"></span></label>
          <small id="creatorHelp" class="form-text text-muted" v-else>You are not connected to MetaMask</small>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-group">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id="addMeAsAManagerInput"
              v-model="data.addMeAsAManager"
              :disabled="data.type === 'campaign' || data.type === 'donation' || loading"
            />
            <label class="custom-control-label" for="addMeAsAManagerInput">Add me as manager</label>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-group">
          <label for="managersInput">Managers</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'form-control-error': v$.data.managers.$errors.length }"
            id="managersInput"
            aria-describedby="managersHelp"
            v-model="data.managers"
            :disabled="loading"
          />
          <small id="managersHelp" class="form-text text-muted">Add address of other admins separated by comma (,)</small>
          <AppInputErrors :errors="v$.data.managers.$errors" />
        </div>
      </div>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="managersCanBeAddedOrRemovedInput"
          v-model="data.managersCanBeAddedOrRemoved"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="managersCanBeAddedOrRemovedInput">Managers can be added or removed</label>
      </div>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="managersCanTransferMoneyWithoutARequestInput"
          v-model="data.managersCanTransferMoneyWithoutARequest"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="managersCanTransferMoneyWithoutARequestInput"
          >Managers can transfer money without a request</label
        >
      </div>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="requestsCanBeCreatedInput"
          v-model="data.requestsCanBeCreated"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="requestsCanBeCreatedInput">Requests can be created</label>
      </div>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="onlyManagersCanCreateARequestInput"
          v-model="data.onlyManagersCanCreateARequest"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="onlyManagersCanCreateARequestInput">Only managers can create a request</label>
      </div>
    </div>

    <div class="form-group">
      <div class="custom-control custom-switch">
        <input
          type="checkbox"
          class="custom-control-input"
          id="onlyContributorsCanApproveARequestInput"
          v-model="data.onlyContributorsCanApproveARequest"
          :disabled="data.type !== '' || loading"
        />
        <label class="custom-control-label" for="onlyContributorsCanApproveARequestInput"
          >Only contributors can approve a request</label
        >
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="form-group">
          <label for="minimumContributionPercentageRequiredInput">Minimum contribution percentage required</label>
          <input
            type="range"
            class="form-control-range"
            id="minimumContributionPercentageRequiredInput"
            v-model="data.minimumContributionPercentageRequired"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <input
            type="number"
            class="form-control"
            :class="{ 'form-control-error': v$.data.minimumContributionPercentageRequired.$errors.length }"
            id="minimumContributionPercentageRequiredInput"
            aria-describedby="minimumContributionPercentageRequiredHelp"
            v-model="data.minimumContributionPercentageRequired"
            :disabled="loading"
          />
          <AppInputErrors :errors="v$.data.minimumContributionPercentageRequired.$errors" />
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label for="minimumApprovalsPercentageRequiredInput">Minimum approvals percentage required</label>
          <input
            type="range"
            class="form-control-range"
            id="minimumApprovalsPercentageRequiredInput"
            v-model="data.minimumApprovalsPercentageRequired"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <input
            type="number"
            class="form-control"
            :class="{ 'form-control-error': v$.data.minimumApprovalsPercentageRequired.$errors.length }"
            id="minimumApprovalsPercentageRequiredInput"
            aria-describedby="minimumApprovalsPercentageRequiredHelp"
            v-model="data.minimumApprovalsPercentageRequired"
            :disabled="loading"
          />
          <AppInputErrors :errors="v$.data.minimumApprovalsPercentageRequired.$errors" />
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" v-if="!loading">Create</button>
    <button class="btn btn-primary" type="button" disabled v-if="loading">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Loading...
    </button>
  </form>
</template>

<script>
import Web3 from 'web3';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, minLength, integer, minValue, maxValue } from '@vuelidate/validators';
import { getMessages } from '@/dictionary';
import { mapState, mapGetters } from 'vuex';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';
import { transaction, validateForm } from '@/helpers/helpers';

export default {
  name: 'CreateFundFormComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      loading: false,
      types: [
        {
          type: 'Custom fund',
          value: '',
          selected: true,
        },
        {
          type: 'Friends fund',
          value: 'friends',
          selected: false,
        },
        {
          type: 'Campaign fund',
          value: 'campaign',
          selected: false,
        },
        {
          type: 'Donation fund',
          value: 'donation',
          selected: false,
        },
      ],
      data: {
        type: '',
        name: '',
        description: '',
        addMeAsAManager: true,
        managers: '',
        managersCanBeAddedOrRemoved: true,
        managersCanTransferMoneyWithoutARequest: true,
        requestsCanBeCreated: true,
        onlyManagersCanCreateARequest: false,
        onlyContributorsCanApproveARequest: false,
        minimumContributionPercentageRequired: 5,
        minimumApprovalsPercentageRequired: 50,
      },
    };
  },
  computed: {
    ...getMessages(['']),

    ...mapState({
      address: (state) => state.connection.address,
      fundTokensBalance: (state) => state.connection.fundTokensBalance,
    }),
    ...mapGetters(['isConnected']),

    splitAddress() {
      return getSplitAddress(this.address);
    },
  },
  watch: {
    'data.type'(newValue) {
      switch (newValue) {
        case 'friends':
          this.data.addMeAsAManager = true;
          this.data.managersCanBeAddedOrRemoved = true;
          this.data.managersCanTransferMoneyWithoutARequest = true;
          this.data.requestsCanBeCreated = true;
          this.data.onlyManagersCanCreateARequest = false;
          this.data.onlyContributorsCanApproveARequest = false;
          this.data.minimumContributionPercentageRequired = 0;
          break;
        case 'campaign':
          this.data.addMeAsAManager = true;
          this.data.managersCanBeAddedOrRemoved = false;
          this.data.managersCanTransferMoneyWithoutARequest = false;
          this.data.requestsCanBeCreated = true;
          this.data.onlyManagersCanCreateARequest = true;
          this.data.onlyContributorsCanApproveARequest = true;
          this.data.minimumContributionPercentageRequired = 5;
          break;
        case 'donation':
          this.data.addMeAsAManager = true;
          this.data.managersCanBeAddedOrRemoved = true;
          this.data.managersCanTransferMoneyWithoutARequest = true;
          this.data.requestsCanBeCreated = true;
          this.data.onlyManagersCanCreateARequest = true;
          this.data.onlyContributorsCanApproveARequest = true;
          this.data.minimumContributionPercentageRequired = 5;
          break;
      }
    },
  },
  validations() {
    return {
      data: {
        name: { required, minLength: minLength(1) },
        description: {},
        managers: {
          mustBeAddresses: helpers.withMessage('Some value is not a valid address', (value) => {
            if (!helpers.req(value)) return true;
            else {
              let validation = true;

              const addresses = this.data.managers.split(',');
              addresses.forEach((address) => {
                if (!Web3.utils.isAddress(address.trim())) return (validation = false);
              });

              return validation;
            }
          }),

          mustNotBeMyAddress: helpers.withMessage('You can not add your own address', (value) => {
            if (!helpers.req(value)) return true;
            else {
              let validation = true;

              const addresses = this.data.managers.split(',');
              addresses.forEach((address) => {
                if (address.trim().toLowerCase() === this.address.toLowerCase()) return (validation = false);
              });

              return validation;
            }
          }),

          mustNotBeRepeated: helpers.withMessage('Addresses must not be repeated', (value) => {
            if (!helpers.req(value)) return true;
            else {
              let validation = true;

              const addresses = this.data.managers.split(',');
              addresses.forEach((address1) => {
                if (Web3.utils.isAddress(address1.trim())) {
                  if (address1.trim().toLowerCase() !== this.address.toLowerCase()) {
                    let count = 0;
                    addresses.forEach((address2) => {
                      if (address1.trim().toLowerCase() === address2.trim().toLowerCase()) count++;
                    });
                    if (count > 1) return (validation = false);
                  }
                }
              });

              return validation;
            }
          }),
        },
        minimumContributionPercentageRequired: { required, integer, minValue: minValue(0), maxValue: maxValue(100) },
        minimumApprovalsPercentageRequired: { required, integer, minValue: minValue(0), maxValue: maxValue(100) },
      },
    };
  },
  methods: {
    async handleSubmit() {
      const checkFundTokensBalance = () => {
        if (this.fundTokensBalance >= 1) {
          return true;
        } else {
          addNotification({
            message: 'You need to have 1 FundToken to create a new fund',
            type: 'error',
          });
          return false;
        }
      };

      const checkedFundTokensBalance = checkFundTokensBalance();
      const validatedForm = await validateForm(this.v$);

      if (checkedFundTokensBalance && validatedForm) {
        try {
          this.loading = true;
          const tx = await transaction(
            'FundFactory',
            'createFund',
            [
              this.data.name,
              this.data.description,
              this.getArrayOfManagers(),
              this.data.managersCanBeAddedOrRemoved,
              this.data.managersCanTransferMoneyWithoutARequest,
              this.data.requestsCanBeCreated,
              this.data.onlyManagersCanCreateARequest,
              this.data.onlyContributorsCanApproveARequest,
              this.data.minimumContributionPercentageRequired,
              this.data.minimumApprovalsPercentageRequired,
            ],
            undefined,
            true,
            'Create new fund: ' + this.data.name,
          );
          addNotification({
            message: 'Fund deployed to: ' + getSplitAddress(tx.events.NewFund.returnValues.fundAddress),
            type: 'success',
          });
          this.$router.push({ name: 'MyFunds' });
          this.data = {
            type: '',
            name: '',
            description: '',
            addMeAsAManager: true,
            managers: '',
            managersCanBeAddedOrRemoved: true,
            managersCanTransferMoneyWithoutARequest: true,
            requestsCanBeCreated: true,
            onlyManagersCanCreateARequest: false,
            onlyContributorsCanApproveARequest: false,
            minimumContributionPercentageRequired: 5,
            minimumApprovalsPercentageRequired: 50,
          };
        } finally {
          this.loading = false;
        }
      }
    },

    getArrayOfManagers() {
      let managers = [];
      if (this.data.addMeAsAManager) managers.push(this.address);
      const otherManagers = this.data.managers.split(',');
      otherManagers.forEach((manager) => {
        const managerAddress = manager.trim();
        if (Web3.utils.isAddress(managerAddress)) managers.push(managerAddress);
      });
      return managers;
    },
  },
};
</script>

<style scoped>
.icon {
  color: #1d6aa8;
}
</style>
