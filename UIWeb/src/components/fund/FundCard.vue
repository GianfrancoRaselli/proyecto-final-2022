<template>
  <div class="card text-center" @click="redirect">
    <div class="card-header">
      <span v-text="fund.name" />
      <div class="fund-info">
        <span class="badge badge-pill badge-primary my-fund-info mb-1" v-if="compareAddresses(address, fund.creator)"
          >Mi fondo</span
        >
        <span class="badge badge-pill" :class="'badge-' + fundType.class" v-if="fundType" v-text="fundType.type" />
      </div>
    </div>
    <div class="card-body">
      <img class="img" :src="'http://localhost:4000/images/' + fund.image" v-if="fund.image" />
      <img class="img" src="@/assets/imgs/fund.png" v-else />
      <div class="info">
        <p v-text="fund.description" v-if="fund.description" />
        <p>
          <span class="text-bold">Creador</span>:&nbsp;<button
            type="button"
            class="btn btn-link"
            data-toggle="modal"
            data-target="#entityModal"
          >
            <AppShowAddress id="creatorAddress" :address="fund.creator" :show="false" />
          </button>
        </p>
      </div>
    </div>
    <div class="card-footer text-muted"><AppDate :date="createdAt" /></div>
  </div>
  <EntityModal :fund="fund" />
</template>

<script>
import { mapGetters } from 'vuex';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

import EntityModal from '@/components/fund/modals/EntityModal';

export default {
  name: 'FundCardComponent',
  components: {
    EntityModal,
  },
  props: {
    fund: { type: Object, require: true },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['address']),

    fundType() {
      if (
        this.fund.managersCanBeAddedOrRemoved &&
        this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        !this.fund.onlyManagersCanCreateARequest &&
        !this.fund.onlyContributorsCanApproveARequest
      )
        return {
          type: 'Amigos',
          class: 'success',
        };
      if (
        !this.fund.managersCanBeAddedOrRemoved &&
        !this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        this.fund.onlyManagersCanCreateARequest &&
        this.fund.onlyContributorsCanApproveARequest
      )
        return {
          type: 'Campaña',
          class: 'warning',
        };
      if (
        this.fund.managersCanBeAddedOrRemoved &&
        this.fund.managersCanTransferMoneyWithoutARequest &&
        this.fund.requestsCanBeCreated &&
        this.fund.onlyManagersCanCreateARequest &&
        this.fund.onlyContributorsCanApproveARequest
      )
        return {
          type: 'Donación',
          class: 'secondary',
        };
      return undefined;
    },

    createdAt() {
      return fromUnixTimestampToDate(this.fund.createdAt);
    },
  },
  watch: {},
  methods: {
    compareAddresses,

    redirect(event) {
      if (event.target.id !== 'creatorAddress') this.$router.push({ name: 'Fund', params: { fundAddress: this.fund.address } });
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  height: 98%;
  position: relative;
}

.card:hover {
  height: 100%;
  cursor: pointer;
  box-shadow: 0 0 4px rgb(65, 64, 64);
}

.card-header {
  padding-left: 65px;
  padding-right: 65px;
}

.fund-info {
  font-size: 0.8rem;
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.my-fund-info {
  width: fit-content;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 2rem;

  .img {
    height: 8rem;
    width: 8rem;
    border-radius: 2rem;
  }
}
</style>
