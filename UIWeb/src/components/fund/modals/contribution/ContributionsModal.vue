<template>
  <div>
    <div class="modal fade" id="contributionsModal" tabindex="-1" aria-labelledby="contributionsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="contributionsModalLabel">Contribuciones</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="contribute">
              <button type="button" class="btn btn-success btn-sm" @click="contribute">
                <fa-icon icon="plus" class="icon mr-2" />Contribuir
              </button>
            </div>

            <div class="contributions-list mt-2" v-if="!loading">
              <div class="no-contributions" v-if="contributionsOrdered && contributionsOrdered.length === 0">
                Sin contribuciones
              </div>
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
    <ContributeModal :fund="fund" />
  </div>
</template>

<script>
import $ from 'jquery';
import { mapGetters } from 'vuex';
import { event, goToProfile } from '@/helpers/helpers';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

// modals
import ContributeModal from '@/components/fund/modals/contribution/ContributeModal.vue';

export default {
  name: 'ContributionsModalComponent',
  components: {
    ContributeModal,
  },
  props: {
    fund: { type: Object, required: true },
  },
  data() {
    return {
      loading: true,
      contributions: [],
      contributeSubscription: null,
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

    contribute() {
      $('#contributionsModal').modal('hide');
      $('#contributeModal').modal('show');
    },

    async getContributions() {
      this.loading = true;
      try {
        await event(
          { name: 'Fund', address: this.$route.params.fundAddress },
          'Contribute',
          undefined,
          async (events) => {
            this.contributions = [];
            events.forEach(async (event) => {
              const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(event.blockNumber);
              this.contributions.push({
                contributor: event.returnValues.contributor,
                value: event.returnValues.value,
                timestamp: block.timestamp,
              });
            });
          },
          true,
        );
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    this.getContributions();

    this.contributeSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'Contribute',
      undefined,
      () => {
        this.getContributions();
      },
    );
  },
  unmounted() {
    if (this.contributeSubscription) this.contributeSubscription.unsubscribe();
  },
};
</script>

<style lang="scss" scoped>
.contribute {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(156, 156, 156);
}

.no-contributions {
  margin-top: 12px;
}

.list-group-item {
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: start;
  gap: 0.3rem;

  .header {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.4rem;

    .date {
      font-size: 0.8rem;
    }

    .badge {
      margin-left: auto;
    }
  }

  .address {
    font-weight: bold;
  }
}
</style>
