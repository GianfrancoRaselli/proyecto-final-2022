<template>
  <div>
    <div
      class="modal fade"
      :id="'profileTransfersModal' + fundAddress"
      tabindex="-1"
      :aria-labelledby="'profileTransfersModalLabel' + fundAddress"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" :id="'profileTransfersModalLabel' + fundAddress">Transferencias</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <AppSpinner v-if="loading" />
            <div v-else>
              <div class="no-requests" v-if="transfers && transfers.length === 0">Sin transferencias</div>
            </div>
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
  name: 'ProfileManagersModalComponent',
  components: {},
  props: {
    fundAddress: { type: String, required: true },
  },
  emits: ['transfers'],
  data() {
    return {
      loading: true,
      transfers: [],
    };
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {
    compareAddresses,

    async getTransfers() {
      this.loading = true;

      try {
        console.log("T")
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    this.getTransfers();
  },
};
</script>

<style scoped>
.list-group-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
}

.badge {
  font-size: 0.7rem;
}
</style>
