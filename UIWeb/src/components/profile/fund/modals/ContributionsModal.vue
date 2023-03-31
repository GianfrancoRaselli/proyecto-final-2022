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
            <h4 class="modal-title" :id="'profileContributionsModalLabel' + fundAddress">
              <span>Contribuciones</span>
              <span class="modal-amount" v-text="contributions.length" v-if="contributions.length > 0"></span>
            </h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ContributionsList :loading="loading" :contributions="contributionsOrdered" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { event } from '@/helpers/helpers';

import ContributionsList from '@/components/lists/ContributionsList.vue';

export default {
  name: 'ProfileContributionsModalComponent',
  components: {
    ContributionsList,
  },
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
        return -1;
      });
    },
  },
  methods: {
    async getContributions() {
      this.loading = true;
      this.$emit('contributions', 0);

      try {
        await event(
          { name: 'Fund', address: this.fundAddress },
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
            this.$emit('contributions', events.length);
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
  },
};
</script>

<style lang="scss" scoped></style>
