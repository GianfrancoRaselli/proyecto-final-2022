<template>
  <div>
    <div class="modal fade" id="contributionsModal" tabindex="-1" aria-labelledby="contributionsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="contributionsModalLabel">
              <span>Contribuciones</span>
              <span class="modal-amount" v-text="contributions.length" v-if="contributions.length > 0"></span>
            </h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <button
              type="button"
              class="btn btn-success btn-sm"
              :class="{ 'margin-bottom': contributionsOrdered.length === 0 }"
              @click="contribute"
            >
              <fa-icon icon="plus" class="icon mr-2" />Contribuir
            </button>
            <ContributionsList class="list" :loading="loading" :contributions="contributionsOrdered" />
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
            let contributions = [];
            for (const event of events) {
              const block = await this.$store.state.connection.infuraWeb3.eth.getBlock(event.blockNumber);
              contributions.push({
                contributor: event.returnValues.contributor,
                value: event.returnValues.value,
                timestamp: block.timestamp,
              });
            }
            this.contributions = contributions;
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
.list {
  margin-top: 0.4rem;
}
</style>
