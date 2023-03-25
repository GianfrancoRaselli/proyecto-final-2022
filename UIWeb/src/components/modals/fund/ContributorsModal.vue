<template>
  <div
    class="modal fade"
    :id="'contributorsModal' + fund.address"
    tabindex="-1"
    :aria-labelledby="'contributorsModalLabel' + fund.address"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" :id="'contributorsModalLabel' + fund.address">
            <span>Contribuyentes</span>
            <span class="modal-amount" v-text="fund.contributors.length" v-if="fund.contributors.length > 0"></span>
          </h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="contributors-list" v-if="!loading">
            <div class="no-items-modal" v-if="contributorsOrdered.length === 0">Sin contribuyentes</div>
            <ul class="list-group list-group-flush" v-else>
              <li class="list-group-item" v-for="(contributor, index) in contributorsOrdered" :key="index">
                <div class="item-address">
                  <span v-text="index + 1 + '. '" />
                  <AppShowAddress type="entity" :address="contributor.contributor" :goToProfile="true" />
                  <span class="badge badge-pill badge-primary ml-1" v-if="compareAddresses(contributor.contributor, address)"
                    >Mi dirección
                  </span>
                </div>
                <div class="item-amount">
                  <AppShowEth :weis="contributor.contribution" />
                  <span
                    class="percentage"
                    data-toggle="tooltip"
                    data-placement="left"
                    title=""
                    :data-original-title="
                      convertNumberToMaxDecimals((contributor.contribution / fund.totalContributions) * 100, 3) + '%'
                    "
                    ><span v-text="Math.round((contributor.contribution / fund.totalContributions) * 100)"></span>%</span
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { mapGetters } from 'vuex';
import { convertNumberToMaxDecimals } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ContributorsModalComponent',
  props: {
    fund: { type: Object, required: true },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['address']),

    contributorsOrdered() {
      return this.fund.contributors.slice().sort((a, b) => {
        return b.contribution - a.contribution;
      });
    },
  },
  methods: {
    compareAddresses,
    convertNumberToMaxDecimals,
  },
  async created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  },
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

.item-address {
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
