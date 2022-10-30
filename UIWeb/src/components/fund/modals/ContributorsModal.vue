<template>
  <div class="modal fade" id="contributorsModal" tabindex="-1" aria-labelledby="contributorsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="contributorsModalLabel">Contributors</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="contributors-list mt-2">
            <div class="no-contributors" v-if="fund.contributors && fund.contributors.length === 0">No contributors</div>
            <ul class="list-group list-group-flush" v-else>
              <li class="list-group-item" v-for="(c, index) in contributorsOrdered" :key="index">
                <div class="item-address">
                  <span v-text="index + 1 + '. ' + getSplitAddress(c.contributor)" />
                  <span class="badge badge-pill badge-primary ml-1" v-if="compareAddresses(c.contributor, address)"
                    >My address</span
                  >
                </div>
                <div class="item-amount">
                  <AppShowEth :weis="contribution ? contribution.toString() : '0'" />
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
import { mapState } from 'vuex';
import { getSplitAddress, compareAddresses } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ContributorsModalComponent',
  props: {
    fund: { type: Object, require: true },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),

    contributorsOrdered() {
      return this.fund.contributors.slice().sort((a, b) => {
        return b.contribution - a.contribution;
      });
    },
  },
  methods: {
    compareAddresses,
    getSplitAddress,
  },
  async created() {},
};
</script>

<style scoped>
.list-group-item {
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

.badge {
  font-size: 0.7rem;
}
</style>
