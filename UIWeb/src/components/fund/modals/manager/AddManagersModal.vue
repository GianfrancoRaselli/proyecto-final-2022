<template>
  <div class="modal fade" id="addManagersModal" tabindex="-1" aria-labelledby="addManagersModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="addManagersModalLabel">Add managers</h4>
          <fa-icon icon="arrow-left" class="icon" @click="goBack" />
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="newManagersInput">New managers</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'form-control-error': v$.newManagers.$errors.length }"
                id="newManagersInput"
                aria-describedby="newManagersHelp"
                v-model="newManagers"
                :disabled="loading"
              />
              <small id="newManagersHelp" class="form-text text-muted">Enter address of admins separated by comma (,)</small>
              <AppInputErrors :errors="v$.newManagers.$errors" />
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Add managers</button>
            <button class="btn btn-primary" type="button" disabled v-if="loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Adding...
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
import { mapState } from 'vuex';
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
    fund: { type: Object, require: true },
  },
  data() {
    return {
      loading: false,
      newManagers: '',
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),
  },
  validations() {
    return {
      newManagers: {
        mustEnterAnAddressAtLeast: helpers.withMessage('Enter an address at least', (value) => {
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

        mustBeAddresses: helpers.withMessage('Some value is not a valid address', (value) => {
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

        mustNotBeMyAddress: helpers.withMessage('You can not add your own address', (value) => {
          if (!helpers.req(value)) return true;
          else {
            let validation = true;

            const addresses = value.split(',');
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

            const addresses = value.split(',');
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

        mustNotBeAddedAlready: helpers.withMessage('Some address is already added as manager', (value) => {
          if (!helpers.req(value)) return true;
          else {
            let validation = true;

            const addresses = value.split(',');
            addresses.forEach((address1) => {
              if (Web3.utils.isAddress(address1.trim())) {
                if (address1.trim().toLowerCase() !== this.address.toLowerCase()) {
                  let count = 0;
                  this.fund._managers.forEach((address2) => {
                    if (address1.trim().toLowerCase() === address2.trim().toLowerCase()) count++;
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
            [this.getArrayOfManagers()],
            undefined,
            true,
            'Add new managers to ' + this.fund._name,
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund._managers.concat(this.getArrayOfManagers());
          addNotification({
            message: 'New managers added to ' + this.fund._name,
            type: 'success',
          });
          this.goBack();
          this.newManagers = '';
        } finally {
          this.loading = false;
        }
      }
    },

    getArrayOfManagers() {
      let managers = [];
      this.newManagers.split(',').forEach((manager) => {
        const newManagerAddress = manager.trim();
        if (Web3.utils.isAddress(newManagerAddress)) managers.push(newManagerAddress);
      });
      return managers;
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
