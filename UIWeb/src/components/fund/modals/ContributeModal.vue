<template>
  <div class="modal fade" id="contributeModal" tabindex="-1" aria-labelledby="contributeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="contributeModalLabel">Contribute</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="contributorInput">Contributor</label>
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
                <span class="badge badge-pill badge-primary" v-if="compareAddresses(contributor, address)">Me</span>
              </div>
              <small id="contributorHelp" class="form-text text-muted">Enter an address</small>
              <AppInputErrors :errors="v$.contributor.$errors" />
            </div>

            <div class="form-row">
              <div class="col-8">
                <div class="form-group">
                  <label for="contributionAmountInput">Contribution amount</label>
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
                  <label for="contributionUnitInput">Unit</label>
                  <select id="contributionUnitInput" class="form-control" v-model="contributionUnit" :disabled="loading">
                    <option v-for="(unit, i) in units" :key="i" v-text="unit" :value="unit"></option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" v-if="!loading">Contribute</button>
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
import { mapState } from 'vuex';
import { getSplitAddress, compareAddresses } from 'web3-simple-helpers/methods/general';
import { transaction, validateForm } from '@/helpers/helpers';
import { useVuelidate } from '@vuelidate/core';
import { helpers, required, numeric } from '@vuelidate/validators';
import { addNotification } from '@/composables/useNotifications';

export default {
  name: 'ContributeModalComponent',
  setup() {
    return { v$: useVuelidate() };
  },
  props: {
    fund: { type: Object, require: true },
  },
  data() {
    return {
      loading: false,
      contributor: '',
      contribution: 0,
      contributionUnit: 'Wei',
      units: ['Wei', 'Ether'],
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),
  },
  validations() {
    return {
      contributor: {
        required,
        mustBeAnAddress: helpers.withMessage('Value is not a valid address', (value) => {
          return Web3.utils.isAddress(value.trim());
        }),
      },
      contribution: {
        required,
        numeric,
        minValue: helpers.withMessage('Value must be greater than 0', (value) => {
          return value > 0;
        }),
        weiValue: helpers.withMessage('Value in Wei must be an integer', (value) => {
          if (this.contributionUnit === 'Wei' && !Number.isInteger(Number(value))) return false;
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
                this.contributionUnit === 'Wei' ? this.contribution : Web3.utils.toWei(this.contribution.toString(), 'ether'),
            },
            true,
            'Contribute ' +
              this.contribution +
              ' ' +
              this.contributionUnit +
              ' to ' +
              this.fund.name +
              this.contributor.trim() !==
              this.address
              ? ' for ' + getSplitAddress(this.contributor.trim())
              : '',
          );
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.totalContributions +=
            this.contributionUnit === 'Wei' ? this.contribution : Web3.utils.toWei(this.contribution.toString(), 'ether');
          // eslint-disable-next-line vue/no-mutating-props
          this.fund.balance +=
            this.contributionUnit === 'Wei' ? this.contribution : Web3.utils.toWei(this.contribution.toString(), 'ether');
          addNotification({
            message: 'Contributed ' + this.contribution + ' ' + this.contributionUnit,
            type: 'success',
          });
          this.contributor = this.address;
          this.contribution = 0;
          this.contributionUnit = 'Wei';
        } finally {
          this.loading = false;
        }
      }
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
  font-size: 0.8rem;
  position: absolute;
  top: 10px;
  right: 4px;
}
</style>
