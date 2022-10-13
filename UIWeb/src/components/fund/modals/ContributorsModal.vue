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
            <div class="no-contributors" v-if="fund._contributors && fund._contributors.length === 0">No contributors</div>
            <ul class="list-group list-group-flush" v-else>
              <li class="list-group-item" v-for="(contributor, index) in fund._contributors" :key="index">
                <div class="item">
                  <span v-text="index + 1 + '. ' + getSplitAddress(manager)" />
                  <span class="badge badge-pill badge-primary ml-1" v-if="manager.toLowerCase() === address.toLowerCase()"
                    >My address</span
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
import { mapState } from 'vuex';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ContributorsModalComponent',
  props: {
    fund: { type: Object, require: true },
    isManager: { type: Boolean, default: false },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),
  },
  methods: {
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

.item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.badge {
  font-size: 0.7rem;
}
</style>
