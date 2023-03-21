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
            <ContributionsList class="mt-2" :loading="loading" :contributions="contributionsOrdered" />
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
import { event } from '@/helpers/helpers';

// modals
import ContributeModal from '@/components/fund/modals/contribution/ContributeModal.vue';
import ContributionsList from '@/components/lists/ContributionsList.vue';

export default {
  name: 'ContributionsModalComponent',
  components: {
    ContributeModal,
    ContributionsList,
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
</style>
