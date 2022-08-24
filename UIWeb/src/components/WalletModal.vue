<template>
  <div
    class="modal fade"
    id="walletModal"
    tabindex="-1"
    aria-labelledby="walletModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="walletModalLabel" v-text="accountMsg" />
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="first-line">
            <span class="text-muted" v-if="isConnected"
              >{{ connectedMsg }}
              <span v-if="isConnectedToTheValidChain"
                >{{ toMsg }} {{ validChainName }}</span
              ></span
            >
            <span class="text-muted" v-if="!isConnected" v-text="desconnected" />
            <div class="first-line-btns">
              <AppButton
                classes="btn-sm btn-secondary btn-radius mr-2"
                :text="changeMsg + ' ' + validChainName"
                v-if="isConnected && !isConnectedToTheValidChain"
                @click="changeToTheValidChain"
              />
              <AppButton
                classes="btn-sm btn-danger btn-radius"
                :text="disconnectMsg"
                v-if="isConnected"
                @click="disconnect"
              />
              <AppButton
                classes="btn-sm btn-success btn-radius"
                :text="connectMetaMaskMsg"
                v-if="!isConnected"
                @click="connectToMetamask"
              />
            </div>
          </div>

          <div class="center-line" v-if="isConnected">
            <span v-text="splitAddress" />
          </div>

          <div class="below-line" v-if="isConnected">
            <AppButton
              classes="btn-sm btn-link btn-radius btn-copy mr-2"
              :text="copyAddressMsg"
              icon="copy"
              @click="copyAddress"
            />

            <a
              :href="validChainExplorer + '/address/' + address"
              target="_blank"
            >
              <AppButton
                classes="btn-sm btn-link btn-radius"
                :text="viewExplorerMsg"
                icon="arrow-up-right-from-square"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMessages } from "@/dictionary";
import { addNotification } from "@/composables/useNotifications";
import { mapState, mapGetters } from "vuex";
import {
  connectToMetamask,
  checkValidChain,
  disconnect,
} from "@/helpers/connection";

export default {
  name: "WalletModalComponent",
  data() {
    return {};
  },
  computed: {
    ...getMessages(["account", "connected", "desconnected", "to", "connectMetaMask", "disconnect", "change", "copyAddress", "viewExplorer"]),

    ...mapState({
      selectedLanguage: (state) => state.config.selectedLanguage,
      address: (state) => state.connection.address,
    }),
    ...mapGetters([
      "isConnected",
      "isConnectedToTheValidChain",
      "validChainName",
      "validChainExplorer",
    ]),
    splitAddress() {
      let splitAccount = "";
      for (let i = 0; i < 4; i++) {
        splitAccount += this.address.charAt(i);
      }
      splitAccount += "...";
      for (let i = this.address.length - 4; i < this.address.length; i++) {
        splitAccount += this.address.charAt(i);
      }
      return splitAccount;
    },
  },
  methods: {
    async connectToMetamask() {
      this.$store.commit("setDisconnected", false);
      try {
        await connectToMetamask();
      } catch {
        this.$store.commit("setDisconnected", true);
      }
    },
    changeToTheValidChain() {
      checkValidChain();
    },
    disconnect() {
      this.$store.commit("setDisconnected", true);
      disconnect();
    },
    copyAddress() {
      navigator.clipboard.writeText(this.address);
      addNotification({
        message: "Address copied to clipboard",
        type: "success",
      });
    },
  },
};
</script>

<style scoped>
.first-line {
  font-size: small;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.first-line-btns {
  display: flex;
  justify-content: center;
  align-items: center;
}

.center-line {
  font-size: 30px;
  font-weight: bolder;
}

.below-line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.below-line .btn {
  color: rgb(67, 67, 67);
}

.btn-copy {
  text-decoration: none;
}
</style>
