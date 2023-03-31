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
        <FaIcon
          class="saved"
          :icon="[isSaved ? 'fas' : 'far', 'bookmark']"
          data-toggle="tooltip"
          data-placement="right"
          title=""
          :data-original-title="isSaved ? 'Remover' : 'Guardar'"
          @click="savedClick"
          v-if="address"
        />
        <div class="img-container">
          <img class="img" :src="serverUrl + 'images/' + fund.image" v-if="fund.image" />
          <img class="img" src="@/assets/imgs/background-lg.jpg" v-else />
        </div>
        <div class="info">
          <p v-text="fund.description" v-if="fund.description" />
          <p>
            <span class="text-bold">Creador</span>:&nbsp;<button
              type="button"
              class="btn btn-link"
              @click="preventRedirect"
              data-toggle="modal"
              :data-target="'#entityModal' + fund.creator"
            >
              <AppShowAddress
                type="entity"
                id="creatorAddress"
                :address="fund.creator"
                :showTooltip="false"
                :allowCopyAddress="false"
              />
            </button>
          </p>
          <p class="contributions-container">
            <span>
              <span class="text-bold" v-if="fundType.type !== 'Campaña'">Contribuciones totales</span>
              <span class="text-bold" v-else>Dinero invertido</span>
              <span>:&nbsp;</span>
              <AppShowEth :weis="fund.totalContributions" />
            </span>
            <span class="amount" v-if="fund.contributors.length > 0">
              (<AppShowAmount :amount="fund.contributors.length" singular="contribuyente" plural="contribuyentes" />)
            </span>
          </p>
          <span class="badge rounded-pill" v-if="isAContributor">Contribución realizada</span>
        </div>
      </div>
      <div class="card-footer text-muted"><AppDate :date="createdAt" /></div>
    </div>
    <EntityModal :address="fund.creator" />
  </div>
</template>

<script>
import $ from 'jquery';
import { serverUrl } from '@/siteConfig';
import { mapState, mapGetters } from 'vuex';
import { signMessage } from '@/helpers/connection';
import { getFundType } from '@/helpers/helpers';
import { compareAddresses, fromUnixTimestampToDate } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';
import axios from 'axios';

import EntityModal from '@/components/fund/modals/EntityModal';

export default {
  name: 'FundCardComponent',
  components: {
    EntityModal,
  },
  props: {
    fund: { type: Object, required: true },
    savedFunds: { type: Array, required: true },
  },
  emits: ['updateSavedFunds'],
  data() {
    return {
      serverUrl,
      canRedirect: true,
    };
  },
  computed: {
    ...mapState({
      signature: (state) => state.connection.signature,
    }),
    ...mapGetters(['address']),

    isAContributor() {
      if (this.fund.contributors.length > 0) {
        if (typeof this.fund.contributors[0] === 'string') {
          if (this.fund.contributors.findIndex((contributor) => compareAddresses(contributor, this.address)) >= 0) return true;
        } else {
          if (this.fund.contributors.findIndex((contributor) => compareAddresses(contributor.contributor, this.address)) >= 0)
            return true;
        }
      }
      return false;
    },

    fundType() {
      return getFundType(this.fund);
    },

    isSaved() {
      if (this.address) {
        if (this.savedFunds.findIndex((fund) => compareAddresses(fund, this.fund.address)) >= 0) return true;
      }
      return false;
    },

    createdAt() {
      return fromUnixTimestampToDate(this.fund.createdAt);
    },
  },
  watch: {},
  methods: {
    compareAddresses,

    preventRedirect() {
      this.canRedirect = false;
    },

    redirect() {
      if (this.canRedirect) this.$router.push({ name: 'Fund', params: { fundAddress: this.fund.address } });
      this.canRedirect = true;
    },

    async savedClick() {
      this.preventRedirect();
      $('.tooltip').tooltip('hide');
      if (!this.signature) await signMessage();
      try {
        await axios[this.isSaved ? 'delete' : 'put'](
          'entity/' + (this.isSaved ? 'removeFund' : 'saveFund') + '/' + this.fund.address,
        );
        addNotification({
          message: 'Fondo ' + (this.isSaved ? 'removido' : 'guardado'),
          type: 'success',
        });
        this.$emit('updateSavedFunds');
      } catch (e) {
        addNotification({
          message: 'Error al ' + (this.isSaved ? 'remover' : 'guardar') + ' fondo',
          type: 'error',
        });
      }
    },
  },
  created() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
  },
};
</script>

<style lang="scss" scoped>
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

.card-body {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 2rem;

  .saved {
    user-select: none;
    font-size: 1.4rem;
    cursor: pointer;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  .img-container {
    height: 14rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .img {
      height: auto;
      max-height: 100%;
      width: 26rem;
      max-width: calc(100% - 1.8rem);
      border-radius: 1rem;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;

    .contributions-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      column-gap: 0.7rem;
      row-gap: 0.18rem;

      .amount {
        font-size: 0.9rem;
      }
    }

    .badge {
      font-size: 0.85rem;
      color: black;
      background-color: #0dcaf0;
      width: fit-content;
      padding: 0.16rem 1rem;
    }
  }
}

.card-footer {
  .date {
    font-size: 0.9rem;
  }
}
</style>
