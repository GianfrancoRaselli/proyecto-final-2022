<template>
  <div>
    <div
      class="modal fade"
      :id="'profileContributionsModal' + fundAddress"
      tabindex="-1"
      :aria-labelledby="'profileContributionsModalLabel' + fundAddress"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" :id="'profileContributionsModalLabel' + fundAddress">Contribuciones</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <AppSpinner v-if="loading" />
            <div v-else>
              <div class="no-requests" v-if="contributionsOrdered && contributionsOrdered.length === 0">Sin contribuciones</div>
              <ul class="list-group list-group-flush" v-else>
                <li class="list-group-item" v-for="(contribution, index) in contributionsOrdered" :key="index">
                  <div class="header">
                    <AppDate class="date" :date="fromUnixTimestampToDate(contribution.timestamp)" />
                    <span class="badge badge-pill badge-primary" v-if="compareAddresses(contribution.contributor, address)"
                      >Mi contribución</span
                    >
                  </div>
                  <span>
                    <AppShowAddress
                      class="address hover"
                      :address="contribution.contributor"
                      @click="goToProfile(contribution.contributor)"
                    />
                    <span>&nbsp;contribuyó&nbsp;</span>
                    <AppShowEth :weis="contribution.value" />
                  </span>
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
import { event, goToProfile } from '@/helpers/helpers';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ProfileManagersModalComponent',
  components: {},
  props: {
    fundAddress: { type: String, required: true },
  },
  emits: ['contributions'],
  data() {
    return {
      loading: true,
      contributions: [],
    };
  },
  computed: {
    ...mapGetters(['address']),

    contributionsOrdered() {
      return this.contributions.slice().sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
    },
  },
  methods: {
    compareAddresses,
    fromUnixTimestampToDate,
    goToProfile,

    async getContributions() {
      this.loading = true;

      try {
        this.$emit('contributions', 0);
        (
          await event(
            { name: 'Fund', address: this.fundAddress },
            'Contribute',
            undefined,
            async (err, event) => {
              const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(event.blockNumber);
              this.contributions.push({
                contributor: event.returnValues.contributor,
                value: event.returnValues.value,
                timestamp: block.timestamp,
              });
              this.$emit('contributions', this.contributions.length);
            },
            true,
          )
        ).unsubscribe();
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    this.getContributions();
  },
};
</script>

<style lang="scss" scoped>
.list-group-item {
  padding: 0.6rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  gap: 0.3rem;

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.4rem;

    .date {
      font-size: 0.8rem;
    }

    .badge {
      font-size: 0.75rem;
    }
  }

  .address {
    font-weight: bold;
  }
}
</style>
