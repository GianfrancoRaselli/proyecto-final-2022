<template>
  <div class="modal fade" id="contributeModal" tabindex="-1" aria-labelledby="contributeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="contributeModalLabel">Contribuir</h4>
          <FaIcon icon="arrow-left" class="icon" @click="goBack" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="contributorInput">Contribuyente</label>
              <div class="wrapper">
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': v$.contributor.$errors.length }"
                  id="contributorInput"
                  aria-describedby="contributorHelp"
                  v-model="contributor"
                  :disabled="loading"
                />
                <span class="badge badge-pill badge-primary" v-if="compareAddresses(contributor, address)">Yo</span>
              </div>
              <small id="contributorHelp" class="form-text text-muted" v-text="contributorName" v-if="contributorName"></small>
              <AppInputErrors :errors="v$.contributor.$errors" />
            </div>

            <div class="form-row">
              <div class="col-8">
                <div class="form-group">
                  <label for="contributionAmountInput">Cantidad a contribuir</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': v$.contribution.$errors.length }"
                    id="contributionAmountInput"
                    aria-describedby="contributionAmountHelp"
                    v-model="contribution"
                    :disabled="loading"
                  />
                  <AppInputErrors :errors="v$.contribution.$errors" />
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label for="contributionUnitInput">Unidad</label>
                  <select id="contributionUnitInput" class="form-control" v-model="contributionUnit" :disabled="loading">
                    <option v-for="(unit, i) in units" :key="i" v-text="unit" :value="unit"></option>
                  </select>
                </div>
              </div>
            </div>
            <AppShowUsd
              :eth="contributionUnit === 'Ether' ? contribution.trim() : Web3.utils.fromWei(contribution.trim(), 'ether')"
            />

            <button type="submit" class="btn btn-primary" v-if="!loading">Contribuir</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Contribuyendo...
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import $ from 'jquery';
import Web3 from 'web3';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { getSplitAddress, compareAddresses } from 'web3-simple-helpers/methods/general';
import { transaction, validateForm, removeInitialAndFinalZeros } from '@/helpers/helpers';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, numeric } from '@vuelidate/validators';
import { addNotification } from '@/composables/useNotifications';

export default {
  name: 'ContributeModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    fund: { type: Object, required: true },
  },
  data() {
    return {
      Web3,
      loading: false,
      contributor: '',
      contributorName: '',
      contribution: '0',
      contributionUnit: 'Wei',
      units: ['Wei', 'Ether'],
    };
  },
  computed: {
    ...mapGetters(['address']),
  },
  watch: {
    contributor(newValue) {
      this.contributorName = '';
      axios.get('entity/' + newValue).then((res) => {
        if (res.data) this.contributorName = res.data.fullname;
      });
    },

    contribution(newValue) {
      if (newValue) {
        this.contribution = newValue.replace(',', '.');
      }
    },
  },
  validations() {
    return {
      contributor: {
        required: helpers.withMessage('Debe ingresar un valor', required),
        mustBeAnAddress: helpers.withMessage('El valor no es una dirección válida', (value) => {
          return Web3.utils.isAddress(value.trim());
        }),
      },
      contribution: {
        required: helpers.withMessage('Debe ingresar un valor', required),
        numeric: helpers.withMessage('Debe ingresar un valor numérico', numeric),
        minValue: helpers.withMessage('El valor debe ser mayor a 0', (value) => {
          if (value > 0) return true;
          return false;
        }),
        weiValue: helpers.withMessage('El valor en Wei debe ser un número entero', (value) => {
          if (this.contributionUnit === 'Wei' && !BigNumber(value).isInteger()) return false;
          return true;
        }),
        maxDecimals: helpers.withMessage('La cantidad máxima de decimales permitidos es 18', (value) => {
          if (this.contributionUnit === 'Ether') {
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
            this.contributor.trim() === this.address ? 'contribute' : 'contributeFor',
            this.contributor.trim() === this.address ? [] : [this.contributor.trim()],
            {
              value:
                this.contributionUnit === 'Wei' ? this.contribution.trim() : Web3.utils.toWei(this.contribution.trim(), 'ether'),
            },
            true,
            removeInitialAndFinalZeros(this.contribution.trim()) +
              ' ' +
              this.contributionUnit +
              ' contribuidos a ' +
              this.fund.name +
              (this.contributor.trim() !== this.address ? ' por ' + getSplitAddress(this.contributor.trim()) : ''),
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.totalContributions = BigNumber.sum(
            this.fund.totalContributions,
            this.contributionUnit === 'Wei' ? this.contribution.trim() : Web3.utils.toWei(this.contribution.trim(), 'ether'),
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.balance = BigNumber.sum(
            this.fund.balance,
            this.contributionUnit === 'Wei' ? this.contribution.trim() : Web3.utils.toWei(this.contribution.trim(), 'ether'),
          );
          addNotification({
            message: 'Contribuidos ' + removeInitialAndFinalZeros(this.contribution.trim()) + ' ' + this.contributionUnit,
            type: 'success',
          });
          this.goBack();
          this.contributor = this.address;
          this.contribution = 0;
          this.contributionUnit = 'Wei';
        } finally {
          this.loading = false;
        }
      }
    },

    goBack() {
      $('#contributeModal').on('hidden.bs.modal', function () {
        $('#contributionsModal').modal('show');
      });
      $('#contributeModal').modal('hide');
    },
  },
  created() {
    this.contributor = this.address;
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
