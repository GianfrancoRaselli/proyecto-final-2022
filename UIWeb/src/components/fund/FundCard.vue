<template>
  <div class="card-container">
    <div class="card text-center" @click="redirect">
      <div class="card-header">
        <span class="name" v-text="fund.name" />
        <div class="fund-info">
          <span class="badge badge-pill badge-primary mb-1" v-if="compareAddresses(address, fund.creator)">Mi fondo</span>
          <span class="badge badge-pill" :class="'badge-' + fundType.class" v-if="fundType" v-text="fundType.type" />
        </div>
      </div>
      <div class="card-body">
        <img class="img" :src="serverUrl + 'images/' + fund.image" v-if="fund.image" />
        <img class="img" src="@/assets/imgs/fund.png" v-else />
        <div class="info">
          <p v-text="fund.description" v-if="fund.description" />
          <p>
            <span class="text-bold">Creador</span>:&nbsp;<button
              type="button"
              class="btn btn-link"
              @click="openEntityModalClick"
              data-toggle="modal"
              :data-target="'#entityModal' + fund.creator"
            >
              <AppShowAddress type="entity" id="creatorAddress" :address="fund.creator" :showTooltip="false" />
            </button>
          </p>
        </div>
      </div>
      <div class="card-footer text-muted"><AppDate :date="createdAt" /></div>
    </div>
    <EntityModal :address="fund.creator" />
  </div>
</template>

<script>
import { serverUrl } from '@/siteConfig';
import { mapGetters } from 'vuex';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';

import EntityModal from '@/components/fund/modals/EntityModal';

export default {
  name: 'FundCardComponent',
  components: {
    EntityModal,
  },
  props: {
    fund: { type: Object, required: true },
  },
  data() {
    return {
      serverUrl,
      canRedirect: true,
    };
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

    redirect() {
      if (this.canRedirect) this.$router.push({ name: 'Fund', params: { fundAddress: this.fund.address } });
      this.canRedirect = true;
    },

    openEntityModalClick() {
      this.canRedirect = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card {
  word-wrap: break-word;
  word-break: break-word;
  height: 98%;
  width: 100%;
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

  .name {
    word-break: keep-all;
  }
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

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 2rem;

  .img {
    height: 8rem;
    width: 8rem;
    border-radius: 1.2rem;
  }
}

.card-footer {
  .date {
    font-size: 0.9rem;
  }
}
</style>
