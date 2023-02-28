<template>
  <div class="modal fade" id="walletModal" tabindex="-1" aria-labelledby="walletModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="walletModalLabel" v-text="accountMsg" />
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="first-line">
            <span class="text-muted" v-if="isConnected"
              >{{ connectedMsg }} <span v-if="isConnectedToTheValidChain">{{ toMsg }} {{ validChainName }}</span></span
            >
            <span class="text-muted" v-if="!isConnected" v-text="disconnectedMsg" />
            <div class="first-line-btns">
              <AppButton
                classes="btn-sm btn-warning btn-radius mr-2"
                :text="changeMsg + ' ' + validChainName"
                v-if="isConnected && !isConnectedToTheValidChain"
                @click="changeToTheValidChain"
              />
              <AppButton classes="btn-sm btn-danger btn-radius" :text="disconnectMsg" v-if="isConnected" @click="disconnect" />
              <AppButton
                classes="btn-sm btn-success btn-radius"
                :text="connectMetaMaskMsg"
                v-if="!isConnected"
                @click="connectToMetamask"
              />
            </div>
          </div>

          <div class="center-line" v-if="isConnected">
            <AppShowAddress :address="address" />
          </div>

          <div class="below-line" v-if="isConnected">
            <div class="address">
              <AppButton classes="btn-sm btn-link btn-radius btn-copy" :text="copyAddressMsg" icon="copy" @click="copyAddress" />

              <a :href="validChainExplorer + '/address/' + address" target="_blank">
                <AppButton classes="btn-sm btn-link btn-radius" :text="viewExplorerMsg" icon="arrow-up-right-from-square" />
              </a>
            </div>
            <div class="user">
              <AppButton
                classes="btn-sm btn-link btn-radius btn-profile"
                text="Ver mi perfil"
                icon="user"
                @click="redirectToMyProfile"
              />
            </div>
          </div>

          <div class="recent-transactions mt-2" v-if="isConnected">
            <div class="mb-1">
              <span class="h6 text-bold text-underline">Transacciones recientes</span>
            </div>
            <span v-if="recentTransactionsToShow.length === 0">Sin transacciones</span>
            <div class="text-center-with-space mt-2" v-for="(transaction, index) in recentTransactionsToShow" :key="index">
              <span class="text-center">
                <span class="float-left mr-2">
                  <div class="spinner-border text-primary" role="status" v-if="transaction.loading">
                    <span class="sr-only"></span>
                  </div>
                  <fa-icon icon="circle-check" class="circle-check-icon" size="2x" v-else-if="transaction.success"></fa-icon>
                  <fa-icon icon="circle-xmark" class="circle-xmark-icon" size="2x" v-else></fa-icon>
                </span>
                <span class="text-start" v-text="transaction.message"></span>
              </span>
              <a :href="validChainExplorer + '/tx/' + transaction.hash" target="_blank" v-if="transaction.hash">
                <fa-icon icon="arrow-up-right-from-square" class="icon"></fa-icon>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { getMessages } from '@/dictionary';
import { addNotification } from '@/composables/useNotifications';
import { mapState, mapGetters } from 'vuex';
import { connectToMetamask, checkValidChain } from '@/helpers/connection';

const MINUTE = 60000;

export default {
  name: 'WalletModalComponent',
  data() {
    return {};
  },
  computed: {
    ...getMessages([
      'account',
      'connected',
      'disconnected',
      'to',
      'connectMetaMask',
      'disconnect',
      'change',
      'copyAddress',
      'addressCopied',
      'viewExplorer',
    ]),

    ...mapState({
      recentTransactions: (state) => state.connection.recentTransactions,
    }),
    ...mapGetters(['isConnected', 'isConnectedToTheValidChain', 'validChainName', 'validChainExplorer', 'address']),

    recentTransactionsToShow() {
      let recentTransactionsToShow = this.recentTransactions.slice();
      recentTransactionsToShow = recentTransactionsToShow.filter(
        (transaction) => new Date(new Date(transaction.date).getTime() + MINUTE * 60).getTime() > new Date().getTime(),
      );
      return recentTransactionsToShow
        .sort((a, b) => {
          if (new Date(a.date).getTime() < new Date(b.date).getTime()) return 1;
          if (new Date(a.date).getTime() > new Date(b.date).getTime()) return -1;
          return 0;
        })
        .slice(0, 5); // take the first 5 transactions
    },
  },
  methods: {
    async connectToMetamask() {
      this.$store.commit('setDisconnected', false);
      await connectToMetamask();
    },

    changeToTheValidChain() {
      checkValidChain();
    },

    disconnect() {
      this.$store.commit('setDisconnected', true);
      this.$store.commit('setSignature', null);
    },

    copyAddress() {
      navigator.clipboard.writeText(this.address);
      addNotification({
        message: this.addressCopiedMsg,
        type: 'success',
      });
    },

    redirectToMyProfile() {
      $('#walletModal').modal('hide');
      this.$router.push({
        name: 'Profile',
        params: { address: this.address },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.first-line {
  font-size: small;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .first-line-btns {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.center-line {
  font-size: 2rem;
  font-weight: bolder;
}

.below-line {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  gap: 0.3rem;

  .btn {
    color: rgb(67, 67, 67);
  }

  .address {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    gap: 0.3rem;
  }
}

.text-center {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.text-center-with-space {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.text-start {
  text-align: start;
}

.float-left {
  float: left;
}

.circle-check-icon {
  color: green;
}

.circle-xmark-icon {
  color: rgb(187, 0, 0);
}
</style>
