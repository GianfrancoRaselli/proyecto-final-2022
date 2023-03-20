<template>
  <div class="modal fade" id="contributorsModal" tabindex="-1" aria-labelledby="contributorsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="contributorsModalLabel">Contribuyentes</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="contributors-list mt-2" v-if="!loading">
            <div class="no-contributors" v-if="fund.contributors && fund.contributors.length === 0">Sin contribuyentes</div>
            <ul class="list-group list-group-flush" v-else>
              <li class="list-group-item" v-for="(c, index) in contributorsOrdered" :key="index">
                <div class="item-address">
                  <span v-text="index + 1 + '. '" /><AppShowAddress
                    class="hover"
                    :address="c.contributor"
                    @click="goToProfile(c.contributor)"
                  />
                  <span class="badge badge-pill badge-primary ml-1" v-if="compareAddresses(c.contributor, address)"
                    >Mi dirección</span
                  >
                </div>
                <div class="item-amount">
                  <AppShowEth :weis="c.contribution ? c.contribution : 0" />
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
import { goToProfile } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ContributorsModalComponent',
  props: {
    loading: { type: Boolean, required: true },
    fund: { type: Object, required: true },
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
    goToProfile,
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

.badge {
  font-size: 0.7rem;
}
</style>
