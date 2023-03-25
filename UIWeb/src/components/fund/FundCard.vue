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
          <p>
            <span class="text-bold" v-if="fundType.type !== 'Campaña'">Contribuciones totales</span>
            <span class="text-bold" v-else>Dinero invertido</span>
            <span>:&nbsp;</span>
            <AppShowEth :weis="fund.totalContributions" />
            <span
              >&nbsp;(<AppShowAmount :amount="fund.contributors.length" singular="contribuyente" plural="contribuyentes" />)</span
            >
          </p>
          <span class="badge rounded-pill bg-success" v-if="isAContributor">Contribución realizada</span>
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
import { getFundType } from '@/helpers/helpers';
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

    isAContributor() {
      if (this.fund.contributors.findIndex((contributor) => compareAddresses(contributor, this.address)) >= 0) return true;
      return false;
    },

    fundType() {
      return getFundType(this.fund);
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

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;

    .badge {
      font-size: 0.85rem;
      color: white;
      width: fit-content;
      padding: 0.1rem 1rem;
    }
  }
}

.card-footer {
  .date {
    font-size: 0.9rem;
  }
}
</style>
