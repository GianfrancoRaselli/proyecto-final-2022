<template>
  <div class="modal fade" id="transferModal" tabindex="-1" aria-labelledby="transferModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="transferModalLabel">Transfer</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p class="card-text current-balance">
            <span class="text-bold">Current balance</span>:&nbsp;<AppShowEth :weis="fund.balance" />
            <button class="btn btn-link btn-sm ml-2" @click="setCurrentBalance" v-if="fund.balance > 0">
              Transfer all balance
            </button>
          </p>
          <hr />
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="receiverInput">Receiver</label>
              <div class="wrapper">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.receiver.$errors.length }"
                  id="receiverInput"
                  aria-describedby="receiverHelp"
                  v-model="receiver"
                  :disabled="loading"
                />
                <span class="badge badge-pill badge-primary" v-if="compareAddresses(receiver, address)">Me</span>
              </div>
              <small id="receiverHelp" class="form-text text-muted">Enter an address</small>
              <AppInputErrors :errors="v$.receiver.$errors" />
            </div>

            <div class="form-row">
              <div class="col-8">
                <div class="form-group">
                  <label for="valueInput">Value</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': v$.value.$errors.length }"
                    id="valueInput"
                    aria-describedby="valueHelp"
                    v-model="value"
                    :disabled="loading"
                  />
                  <AppInputErrors :errors="v$.value.$errors" />
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="unitInput">Unit</label>
                  <select id="unitInput" class="form-control" v-model="unit" :disabled="loading">
                    <option v-for="(u, i) in units" :key="i" v-text="u" :value="u"></option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Transfer</button>
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
import Web3 from 'web3';
import { mapGetters } from 'vuex';
import { getSplitAddress, compareAddresses } from 'web3-simple-helpers/methods/general';
import { transaction, validateForm } from '@/helpers/helpers';
import BigNumber from 'bignumber.js';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, numeric } from '@vuelidate/validators';
import { addNotification } from '@/composables/useNotifications';

export default {
  name: 'TransferModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    fund: { type: Object, require: true },
  },
  data() {
    return {
      loading: false,
      receiver: '',
      value: '0',
      unit: 'Wei',
      units: ['Wei', 'Ether'],
    };
  },
  computed: {
    ...mapGetters(['address']),
  },
  watch: {
    value(newValue) {
      this.value = newValue.replace(',', '.');
    },
  },
  validations() {
    return {
      receiver: {
        required,
        mustBeAnAddress: helpers.withMessage('Value is not a valid address', (value) => {
          return Web3.utils.isAddress(value.trim());
        }),
      },
      value: {
        required,
        numeric,
        minValue: helpers.withMessage('Value must be greater than 0', (value) => {
          return value > 0;
        }),
        weiValue: helpers.withMessage('Value in Wei must be an integer', (value) => {
          if (this.unit === 'Wei' && !BigNumber(value).isInteger()) return false;
          return true;
        }),
        maxValue: helpers.withMessage('Value must be less than or equal to the current balance', (value) => {
          return BigNumber(this.unit === 'Wei' ? value : Web3.utils.toWei(value, 'ether')).isLessThanOrEqualTo(
            BigNumber(this.fund.balance.toString()),
          );
        }),
      },
    };
  },
  methods: {
    compareAddresses,

    async handleSubmit() {
      if (await validateForm(this.v$)) {
        try {
          this.loading = true;
          await transaction(
            { name: 'Fund', address: this.$route.params.fundAddress },
            'transfer',
            [this.receiver.trim(), this.unit === 'Wei' ? this.value : Web3.utils.toWei(this.value, 'ether')],
            undefined,
            true,
            'Transfer ' + this.value + ' ' + this.unit + ' to ' + getSplitAddress(this.receiver.trim()),
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.totalContributions += this.unit === 'Wei' ? this.value : Web3.utils.toWei(this.value, 'ether');
          addNotification({
            message: 'Transferred ' + this.value + ' ' + this.unit,
            type: 'success',
          });
          this.receiver = this.address;
          this.value = 0;
          this.unit = 'Wei';
        } finally {
          this.loading = false;
        }
      }
    },

    setCurrentBalance() {
      this.value = this.fund.balance;
      this.unit = 'Wei';
    },
  },
  created() {
    this.receiver = this.address;
  },
};
</script>

<style scoped>
.current-balance {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.wrapper {
  position: relative;
}

.wrapper .badge {
  font-size: 0.8rem;
  position: absolute;
  top: 10px;
  right: 4px;
}
</style>
