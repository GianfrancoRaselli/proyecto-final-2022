<template>
  <div class="modal fade" id="managersModal" tabindex="-1" aria-labelledby="managersModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="managersModalLabel">Managers</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="add-manager" v-if="fund._managersCanBeAddedOrRemoved && isManager">
            <button type="button" class="btn btn-success btn-sm"><fa-icon icon="plus" class="icon mr-2" />Add manager</button>
          </div>
          <AppSpinner class="spinner mt-3" v-if="loading" />
          <div class="managers-list" v-else>
            <span v-if="managers.length === 0">No managers</span>
            <ul class="list-group list-group-flush" v-else>
              <li class="list-group-item" v-for="(manager, index) in managers" :key="index">
                <div class="item-manager">
                  <span v-text="index + 1 + '. ' + getSplitAddress(manager)" />
                  <span class="badge badge-pill badge-primary ml-1" v-if="manager.toLowerCase() === address.toLowerCase()"
                    >My address</span
                  >
                </div>
                <div class="item-buttons">
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    v-if="fund._managersCanBeAddedOrRemoved && isManager && !removing(manager)"
                    @click="removeManager(manager)"
                  >
                    <fa-icon icon="trash" class="icon mr-2" />Remove
                  </button>
                  <button class="btn btn-danger btn-sm" type="button" disabled v-if="removing(manager)">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    Removing...
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { transaction, call, event } from '@/helpers/helpers';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';

export default {
  name: 'ManagersModalComponent',
  props: {
    fund: { type: Object, require: true },
  },
  data() {
    return {
      loading: true,
      managers: [],
      removingManagers: [],
      newManagerSubscription: null,
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),

    isManager() {
      if (this.managers.findIndex((manager) => manager.toLowerCase() === this.address.toLowerCase()) >= 0) return true;
      return false;
    },
  },
  methods: {
    getSplitAddress,

    addNewManagers() {},

    async removeManager(manager) {
      try {
        this.removingManagers.push(manager);
        await transaction(
          { name: 'Fund', address: this.$route.params.fundAddress },
          'removeManager',
          [this.managers.findIndex((m) => m.toLowerCase() === manager.toLowerCase())],
          {},
          true,
          'Remove manager: ' + getSplitAddress(manager),
        );
        this.managers = this.managers.filter((m) => m.toLowerCase() !== manager.toLowerCase());
        addNotification({
          message: 'Manager ' + getSplitAddress(manager) + ' removed',
          type: 'success',
        });
      } finally {
        this.removingManagers = this.removingManagers.filter((m) => m.toLowerCase() !== manager.toLowerCase());
      }
    },

    removing(manager) {
      if (this.removingManagers.findIndex((m) => m.toLowerCase() === manager.toLowerCase()) >= 0) return true;
      return false;
    },
  },
  async created() {
    this.loading = true;
    this.managers = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getManagers');
    this.loading = false;
    this.newManagerSubscription = await event(
      { name: 'Fund', address: this.$route.params.fundAddress },
      'NewManager',
      undefined,
      async () => {
        this.managers = await call({ name: 'Fund', address: this.$route.params.fundAddress }, 'getManagers');
      },
    );
  },
  unmounted() {
    if (this.newManagerSubscription) this.newManagerSubscription.unsubscribe();
  },
};
</script>

<style scoped>
.add-manager {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid rgb(156, 156, 156);
}

.list-group-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.item-manager {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.item-buttons .btn {
  width: 100%;
}

.badge {
  font-size: 0.7rem;
}
</style>
