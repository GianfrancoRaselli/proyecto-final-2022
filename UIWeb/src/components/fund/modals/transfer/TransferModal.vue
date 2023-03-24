<template>
  <div class="modal fade" id="transferModal" tabindex="-1" aria-labelledby="transferModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="transferModalLabel">Transferir</h4>
          <fa-icon icon="arrow-left" class="icon" @click="goBack" />
        </div>
        <div class="modal-body">
          <p class="card-text current-balance">
            <span class="text-bold">Balance actual</span>:&nbsp;<AppShowEth :weis="fund.balance" />
            <button class="btn btn-link btn-sm ml-2" @click="setCurrentBalance" v-if="fund.balance > 0">
              Transferir todo el balance
            </button>
          </p>
          <hr />
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="receiverInput">Destinatario</label>
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
                <span class="badge badge-pill badge-primary" v-if="compareAddresses(receiver, address)">Yo</span>
              </div>
              <small id="receiverHelp" class="form-text text-muted">Ingrese una dirección</small>
              <AppInputErrors :errors="v$.receiver.$errors" />
            </div>

            <div class="form-row">
              <div class="col-8">
                <div class="form-group">
                  <label for="valueInput">Valor</label>
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
                  <label for="unitInput">Unidad</label>
                  <select id="unitInput" class="form-control" v-model="unit" :disabled="loading">
                    <option v-for="(u, i) in units" :key="i" v-text="u" :value="u"></option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Transferir</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Transfiriendo...
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
    fund: { type: Object, required: true },
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
      if (newValue) this.value = newValue.replace(',', '.');
    },
  },
  validations() {
    return {
      receiver: {
        required: helpers.withMessage('Debe ingresar un valor', required),
        mustBeAnAddress: helpers.withMessage('El valor no es una dirección válida', (value) => {
          return Web3.utils.isAddress(value.trim());
        }),
      },
      value: {
        required: helpers.withMessage('Debe ingresar un valor', required),
        numeric: helpers.withMessage('Debe ingresar un valor numérico', numeric),
        minValue: helpers.withMessage('El valor debe ser mayor a 0', (value) => {
          if (value > 0) return true;
          return false;
        }),
        weiValue: helpers.withMessage('El valor en Wei debe ser un número entero', (value) => {
          if (this.unit === 'Wei' && !BigNumber(value).isInteger()) return false;
          return true;
        }),
        maxValue: helpers.withMessage('El valor debe ser menor o igual al saldo actual', (value) => {
          return BigNumber(this.unit === 'Wei' ? value : Web3.utils.toWei(value, 'ether')).isLessThanOrEqualTo(
            BigNumber(this.fund.balance.toString()),
          );
        }),
        maxDecimals: helpers.withMessage('La cantidad máxima de decimales permitidos es 18', (value) => {
          if (this.unit === 'Ether') {
            const decimals = value.trim().split('.')[1];
            if (decimals && decimals.length > 18) return false;
          }
          return true;
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
            [this.receiver.trim(), this.unit === 'Wei' ? this.value.trim() : Web3.utils.toWei(this.value.trim(), 'ether')],
            undefined,
            true,
            this.value.trim() + ' ' + this.unit + ' transferidos a ' + getSplitAddress(this.receiver.trim()),
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.totalContributions += this.unit === 'Wei' ? this.value.trim() : Web3.utils.toWei(this.value.trim(), 'ether');
          addNotification({
            message: 'Transferidos ' + this.value.trim() + ' ' + this.unit,
            type: 'success',
          });
          this.goBack();
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

    goBack() {
      $('#transferModal').on('hidden.bs.modal', function () {
        $('#transfersModal').modal('show');
      });
      $('#transferModal').modal('hide');
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
  position: absolute;
  top: 10px;
  right: 4px;
}
</style>
