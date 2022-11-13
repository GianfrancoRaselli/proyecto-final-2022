<template>
  <div class="modal fade" id="createRequestModal" tabindex="-1" aria-labelledby="createRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="createRequestModalLabel">Create request</h4>
          <fa-icon icon="arrow-left" class="icon" @click="goBack" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="descriptionInput">Description</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.data.description.$errors.length }"
                id="descriptionInput"
                aria-describedby="descriptionHelp"
                v-model="data.description"
                :disabled="loading"
              />
              <AppInputErrors :errors="v$.data.description.$errors" />
            </div>

            <div class="form-group">
              <label for="recipientInput">Recipient address</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.data.recipient.$errors.length }"
                id="recipientInput"
                aria-describedby="recipientHelp"
                v-model="data.recipient"
                :disabled="loading"
              />
              <small id="recipientHelp" class="form-text text-muted">Enter an address</small>
              <AppInputErrors :errors="v$.data.recipient.$errors" />
            </div>

            <div class="form-row">
              <div class="col-8">
                <div class="form-group">
                  <label for="valueToTransferInput">Value to transfer</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': v$.data.valueToTransfer.$errors.length }"
                    id="valueToTransferInput"
                    aria-describedby="valueToTransferHelp"
                    v-model="data.valueToTransfer"
                    :disabled="loading"
                  />
                  <AppInputErrors :errors="v$.data.valueToTransfer.$errors" />
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="valueToTransferUnitInput">Unit</label>
                  <select id="valueToTransferUnitInput" class="form-control" v-model="valueToTransferUnit" :disabled="loading">
                    <option v-for="(unit, i) in units" :key="i" v-text="unit" :value="unit"></option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Create</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import Web3 from 'web3';
import { mapGetters } from 'vuex';
import { transaction, validateForm } from '@/helpers/helpers';
import BigNumber from 'bignumber.js';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, numeric, minLength } from '@vuelidate/validators';
import { addNotification } from '@/composables/useNotifications';

export default {
  name: 'CreateRequestModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    fund: { type: Object, require: true },
  },
  data() {
    return {
      loading: false,
      data: {
        description: '',
        recipient: '',
        valueToTransfer: '0',
      },
      valueToTransferUnit: 'Wei',
      units: ['Wei', 'Ether'],
    };
  },
  computed: {
    ...mapGetters(['address']),
  },
  watch: {
    'data.valueToTransfer'(newValue) {
      this.data.valueToTransfer = newValue.replace(',', '.');
    },
  },
  validations() {
    return {
      data: {
        description: {
          required,
          minLength: minLength(1),
        },
        recipient: {
          required,
          mustBeAnAddress: helpers.withMessage('Value is not a valid address', (value) => {
            return Web3.utils.isAddress(value.trim());
          }),
        },
        valueToTransfer: {
          required,
          numeric,
          minValue: helpers.withMessage('Value must be greater than 0', (value) => {
            return value > 0;
          }),
          maxValue: helpers.withMessage('Value must be less than or equal to 1000 ETH', (value) => {
            if (this.valueToTransferUnit === 'Wei' && BigNumber(value).isLessThanOrEqualTo(1000000000000000000000)) return true;
            if (
              this.valueToTransferUnit === 'Ether' &&
              BigNumber(Web3.utils.toWei(value, 'ether')).isLessThanOrEqualTo(1000000000000000000000)
            )
              return true;
            return false;
          }),
          weiValue: helpers.withMessage('Value in Wei must be an integer', (value) => {
            if (this.valueToTransferUnit === 'Wei' && !BigNumber(value).isInteger()) return false;
            return true;
          }),
        },
      },
    };
  },
  methods: {
    async handleSubmit() {
      if (await validateForm(this.v$)) {
        try {
          this.loading = true;
          await transaction(
            { name: 'Fund', address: this.$route.params.fundAddress },
            'createRequest',
            [
              this.data.description,
              this.data.recipient.trim(),
              this.valueToTransferUnit === 'Wei'
                ? this.data.valueToTransfer
                : Web3.utils.toWei(this.data.valueToTransfer, 'ether'),
            ],
            undefined,
            true,
            'Create request for ' + this.fund.name,
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.requests.push({
            description: this.data.description,
            recipient: this.data.recipient.trim(),
            valueToTransfer:
              this.valueToTransferUnit === 'Wei'
                ? this.data.valueToTransfer
                : Web3.utils.toWei(this.data.valueToTransfer, 'ether'),
          });
          addNotification({
            message: 'Request created',
            type: 'success',
          });
          this.goBack();
          this.data = {
            description: '',
            recipient: '',
            valueToTransfer: 0,
          };
        } finally {
          this.loading = false;
        }
      }
    },

    goBack() {
      $('#createRequestModal').on('hidden.bs.modal', function () {
        $('#requestsModal').modal('show');
      });
      $('#createRequestModal').modal('hide');
    },
  },
};
</script>

<style scoped>
.modal-header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.modal-header .icon {
  cursor: pointer;
  color: grey;
}
</style>
