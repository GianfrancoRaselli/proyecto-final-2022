<template>
  <div class="modal fade" id="addManagersModal" tabindex="-1" aria-labelledby="addManagersModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="addManagersModalLabel">Agregar administradores</h4>
          <FaIcon icon="arrow-left" class="icon" @click="goBack" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="newManagersInput">Nuevos administradores</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': v$.newManagers.$errors.length }"
                id="newManagersInput"
                aria-describedby="newManagersHelp"
                v-model="newManagers"
                :disabled="loading"
              />
              <small id="newManagersHelp" class="form-text text-muted" v-if="arrayOfManagers.length === 0"
                >Ingrese las direcciones de los administradores separadas por coma (,)</small
              >
              <small id="managersHelp" class="form-text text-muted" v-else
                ><AppShowAddress
                  class="managerAddress"
                  type="entity"
                  :address="manager"
                  :showAddressComplete="true"
                  :showTooltip="false"
                  :allowCopyAddress="false"
                  :showComma="i + 1 < arrayOfManagers.length ? true : false"
                  :showSpace="i + 1 < arrayOfManagers.length ? true : false"
                  v-for="(manager, i) in arrayOfManagers"
                  :key="i"
              /></small>
              <AppInputErrors :errors="v$.newManagers.$errors" />
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Agregar administradores</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Agregando...
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
import { compareAddresses } from 'web3-simple-helpers/methods/general';
import { transaction, validateForm } from '@/helpers/helpers';
import { useVuelidate } from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { addNotification } from '@/composables/useNotifications';

export default {
  name: 'AddManagersModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    fund: { type: Object, required: true },
  },
  data() {
    return {
      loading: false,
      newManagers: '',
    };
  },
  computed: {
    ...mapGetters(['address']),

    arrayOfManagers() {
      let managers = [];
      this.newManagers.split(',').forEach((manager) => {
        const newManagerAddress = manager.trim();
        if (Web3.utils.isAddress(newManagerAddress)) managers.push(newManagerAddress);
      });
      return managers;
    },
  },
  validations() {
    return {
      newManagers: {
        mustEnterAnAddressAtLeast: helpers.withMessage('Ingrese al menos una dirección', (value) => {
          if (!helpers.req(value)) return false;
          else {
            let validation = false;

            const addresses = value.split(',');
            addresses.forEach((address) => {
              if (Web3.utils.isAddress(address.trim())) return (validation = true);
            });

            return validation;
          }
        }),

        mustBeAddresses: helpers.withMessage('Algún valor no es una dirección válida', (value) => {
          if (!helpers.req(value)) return true;
          else {
            let validation = true;

            const addresses = value.split(',');
            addresses.forEach((address) => {
              if (!Web3.utils.isAddress(address.trim())) return (validation = false);
            });

            return validation;
          }
        }),

        mustNotBeMyAddress: helpers.withMessage('No puedes agregar tu propia dirección', (value) => {
          if (!helpers.req(value)) return true;
          else {
            let validation = true;

            const addresses = value.split(',');
            addresses.forEach((address) => {
              if (compareAddresses(address.trim(), this.address)) return (validation = false);
            });

            return validation;
          }
        }),

        mustNotBeRepeated: helpers.withMessage('Las direcciones no pueden repetirse', (value) => {
          if (!helpers.req(value)) return true;
          else {
            let validation = true;

            const addresses = value.split(',');
            addresses.forEach((address1) => {
              if (Web3.utils.isAddress(address1.trim())) {
                if (address1.trim().toLowerCase() !== this.address.toLowerCase()) {
                  let count = 0;
                  addresses.forEach((address2) => {
                    if (compareAddresses(address1.trim(), address2.trim())) count++;
                  });
                  if (count > 1) return (validation = false);
                }
              }
            });

            return validation;
          }
        }),

        mustNotBeAddedAlready: helpers.withMessage('Alguna dirección ya se encuentra agregada como administrador', (value) => {
          if (!helpers.req(value)) return true;
          else {
            let validation = true;

            const addresses = value.split(',');
            addresses.forEach((address1) => {
              if (Web3.utils.isAddress(address1.trim())) {
                if (address1.trim().toLowerCase() !== this.address.toLowerCase()) {
                  let count = 0;
                  this.fund.managers.forEach((address2) => {
                    if (compareAddresses(address1.trim(), address2.trim())) count++;
                  });
                  if (count >= 1) return (validation = false);
                }
              }
            });

            return validation;
          }
        }),
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
            'addNewManagers',
            [this.arrayOfManagers],
            undefined,
            true,
            'Nuevos administradores agregados a ' + this.fund.name,
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.managers.concat(this.arrayOfManagers);
          addNotification({
            message: 'Nuevos administradores agregados a ' + this.fund.name,
            type: 'success',
          });
          this.goBack();
          this.newManagers = '';
        } finally {
          this.loading = false;
        }
      }
    },

    goBack() {
      $('#addManagersModal').on('hidden.bs.modal', function () {
        $('#managersModal').modal('show');
      });
      $('#addManagersModal').modal('hide');
    },
  },
};
</script>

<style scoped></style>
