<template>
  <div>
    <div
      class="modal fade"
      :id="'fundsContributedModal'"
      tabindex="-1"
      :aria-labelledby="'fundsContributedModal'"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" :id="'fundsContributedModal'">
              <span>Fondos contribuidos</span>
              <span class="modal-amount" v-text="contributions.length" v-if="contributions.length > 0"></span>
            </h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="contributions-list" v-if="!loading">
              <div class="no-items-modal" v-if="contributionsOrdered.length === 0">Sin contribuciones</div>
              <ul class="list-group list-group-flush" v-else>
                <li class="list-group-item" v-for="(contribution, index) in contributionsOrdered" :key="index">
                  <div class="item-fund">
                    <span>
                      <span v-text="index + 1 + '. '" />
                      <span class="hover" v-text="contribution.fundName" @click="goToFund(contribution.fundAddress)"></span>
                    </span>
                  </div>
                  <div class="item-amount">
                    <AppShowEth :weis="contribution.contribution" />
                    <span
                      class="percentage"
                      data-toggle="tooltip"
                      data-placement="left"
                      title=""
                      :data-original-title="
                        convertNumberToMaxDecimals((contribution.contribution / totalContributions) * 100, 3) + '%'
                      "
                      ><span v-text="Math.round((contribution.contribution / totalContributions) * 100)"></span>%</span
                    >
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapGetters } from 'vuex';
import { convertNumberToMaxDecimals, goToFund } from '@/helpers/helpers';

export default {
  name: 'FundsContributedModalComponent',
  components: {},
  props: {
    loading: { type: Boolean, required: true },
    contributions: { type: Array, required: true },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['address']),

    contributionsOrdered() {
      return this.contributions.slice().sort((a, b) => {
        return b.contribution - a.contribution;
      });
    },

    totalContributions() {
      let totalContributions = 0;
      for (let contribution of this.contributions) {
        totalContributions = BigNumber.sum(totalContributions, contribution.contribution);
      }
      return totalContributions;
    },
  },
  methods: {
    convertNumberToMaxDecimals,
    goToFund,
  },
  async created() {},
};
</script>

<style lang="scss" scoped>
.list-group-item {
  padding: 0.8rem 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.item-fund {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-amount {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: end;

  .percentage {
    font-size: 0.8rem;
    color: grey;
  }
}
</style>
