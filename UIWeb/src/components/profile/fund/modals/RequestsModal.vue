<template>
  <div>
    <div
      class="modal fade"
      :id="'profileRequestsModal' + fundAddress"
      tabindex="-1"
      :aria-labelledby="'profileRequestsModalLabel' + fundAddress"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" :id="'profileRequestsModalLabel' + fundAddress">Administradores</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="managers-list">
              <div class="no-managers" v-if="managers && managers.length === 0">Sin administradores</div>
              <ul class="list-group list-group-flush" v-else>
                <li class="list-group-item" v-for="(manager, index) in managers" :key="index">
                  <span><span v-text="index + 1 + '. '" /><AppShowAddress :address="manager" /></span>
                  <span class="badge badge-pill badge-primary" v-if="compareAddresses(manager, address)">Mi dirección</span>
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
import { mapGetters } from 'vuex';
import { call } from '@/helpers/helpers';
import { compareAddresses } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ProfileManagersModalComponent',
  components: {},
  props: {
    fundAddress: { type: String, required: true },
  },
  data() {
    return {
      loading: true,
      requests: [],
    };
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {
    compareAddresses,

    async getRequests() {
      this.loading = true;

      try {
        const totalRequests = parseInt(await call({ name: 'Fund', address: this.fundAddress }, 'requestsCount'));
        let requests = [];

        if (totalRequests > 0) {
          requests = Array(totalRequests);

          await Promise.all(
            Array(totalRequests)
              .fill()
              .map((element, index) => {
                return call({ name: 'Fund', address: this.fundAddress }, 'requests', [index], {}, (res) => {
                  requests[index] = res;
                });
              }),
          );
        }

        this.requests = requests;
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    this.getRequests();
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
