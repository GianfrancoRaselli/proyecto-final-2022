<template>
  <div class="modal fade" id="createRequestModal" tabindex="-1" aria-labelledby="createRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="createRequestModalLabel">Crear solicitud</h4>
          <fa-icon icon="arrow-left" class="icon" @click="goBack" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="descriptionInput">Descripción</label>
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
              <label for="recipientInput">Dirección del destinatario</label>
              <div class="wrapper">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.data.recipient.$errors.length }"
                  id="recipientInput"
                  aria-describedby="recipientHelp"
                  v-model="data.recipient"
                  :disabled="loading"
                />
                <span class="badge badge-pill badge-primary" v-if="compareAddresses(data.recipient, address)">Yo</span>
              </div>
              <small id="recipientHelp" class="form-text text-muted">Ingrese una dirección</small>
              <AppInputErrors :errors="v$.data.recipient.$errors" />
            </div>

            <div class="form-row">
              <div class="col-8">
                <div class="form-group">
                  <label for="valueToTransferInput">Valor a transferir</label>
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
                  <label for="valueToTransferUnitInput">Unidad</label>
                  <select id="valueToTransferUnitInput" class="form-control" v-model="valueToTransferUnit" :disabled="loading">
                    <option v-for="(unit, i) in units" :key="i" v-text="unit" :value="unit"></option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Crear solicitud</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Creando...
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
import { compareAddresses } from 'web3-simple-helpers/methods/general';
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
    fund: { type: Object, required: true },
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
      if (newValue) this.data.valueToTransfer = newValue.replace(',', '.');
    },
  },
  validations() {
    return {
      data: {
        description: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          minLength: helpers.withMessage('Debe ingresar al menos un carácter', minLength(1)),
        },
        recipient: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          mustBeAnAddress: helpers.withMessage('El valor no es una dirección válida', (value) => {
            return Web3.utils.isAddress(value.trim());
          }),
        },
        valueToTransfer: {
          required: helpers.withMessage('Debe ingresar un valor', required),
          numeric: helpers.withMessage('Debe ingresar un valor numérico', numeric),
          minValue: helpers.withMessage('El valor debe ser mayor a 0', (value) => {
            if (value > 0) return true;
            return false;
          }),
          maxValue: helpers.withMessage('El valor debe ser menor o igual a 1000 ETH', (value) => {
            if (this.valueToTransferUnit === 'Wei' && BigNumber(value).isLessThanOrEqualTo(1000000000000000000000)) return true;
            if (
              this.valueToTransferUnit === 'Ether' &&
              BigNumber(Web3.utils.toWei(value, 'ether')).isLessThanOrEqualTo(1000000000000000000000)
            )
              return true;
            return false;
          }),
          weiValue: helpers.withMessage('El valor en Wei debe ser un número entero', (value) => {
            if (this.valueToTransferUnit === 'Wei' && !BigNumber(value).isInteger()) return false;
            return true;
          }),
          maxDecimals: helpers.withMessage('La cantidad máxima de decimales permitidos es 18', (value) => {
            if (this.valueToTransferUnit === 'Ether') {
              const decimals = value.trim().split('.')[1];
              if (decimals && decimals.length > 18) return false;
            }
            return true;
          }),
        },
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
            'createRequest',
            [
              this.data.description,
              this.data.recipient.trim(),
              this.valueToTransferUnit === 'Wei'
                ? this.data.valueToTransfer.trim()
                : Web3.utils.toWei(this.data.valueToTransfer.trim(), 'ether'),
            ],
            undefined,
            true,
            'Solicitud para ' + this.fund.name + ' creada',
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.requests.push({
            description: this.data.description,
            recipient: this.data.recipient.trim(),
            valueToTransfer:
              this.valueToTransferUnit === 'Wei'
                ? this.data.valueToTransfer.trim()
                : Web3.utils.toWei(this.data.valueToTransfer.trim(), 'ether'),
          });
          addNotification({
            message: 'Solicitud creada',
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
.wrapper {
  position: relative;
}

.wrapper .badge {
  position: absolute;
  top: 10px;
  right: 4px;
}
</style>
