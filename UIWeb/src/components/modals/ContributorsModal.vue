<template>
  <div
    class="modal fade"
    :id="'contributorsModal' + fundAddress"
    tabindex="-1"
    :aria-labelledby="'contributorsModalLabel' + fundAddress"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" :id="'contributorsModalLabel' + fundAddress">Contribuyentes</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="contributors-list" v-if="!loading">
            <div class="no-contributors" v-if="contributorsOrdered && contributorsOrdered.length === 0">Sin contribuyentes</div>
            <ul class="list-group list-group-flush" v-else>
              <li class="list-group-item" v-for="(contributor, index) in contributorsOrdered" :key="index">
                <div class="item-address">
                  <span v-text="index + 1 + '. '" />
                  <AppShowAddress
                    :address="contributor.contributor"
                    :goToProfile="true"
                  />
                  <span class="badge badge-pill badge-primary ml-1" v-if="compareAddresses(contributor.contributor, address)"
                    >Mi dirección
                  </span>
                </div>
                <div class="item-amount">
                  <AppShowEth :weis="contributor.contribution" />
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
import { mapGetters } from 'vuex';
import { compareAddresses } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ContributorsModalComponent',
  props: {
    fundAddress: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    contributors: { type: Array, required: true },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['address']),

    contributorsOrdered() {
      return this.contributors.slice().sort((a, b) => {
        return b.contribution - a.contribution;
      });
    },
  },
  methods: {
    compareAddresses,
  },
  async created() {},
};
</script>

<style scoped>
.list-group-item {
  padding: 0.6rem;
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
</style>
