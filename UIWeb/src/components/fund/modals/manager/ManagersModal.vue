<template>
  <div>
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
            <div class="add-manager" v-if="fund.managersCanBeAddedOrRemoved && isManager">
              <button type="button" class="btn btn-success btn-sm" @click="addNewManagers">
                <fa-icon icon="plus" class="icon mr-2" />Add manager
              </button>
            </div>

            <div class="managers-list mt-2">
              <div class="no-managers" v-if="fund.managers && fund.managers.length === 0">No managers</div>
              <ul class="list-group list-group-flush" v-else>
                <li class="list-group-item" v-for="(manager, index) in fund.managers" :key="index">
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
                      v-if="fund.managersCanBeAddedOrRemoved && isManager && !removing(manager)"
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
    <AddManagersModal :fund="fund" />
  </div>
</template>

<script>
import $ from 'jquery';
import { mapState } from 'vuex';
import { transaction } from '@/helpers/helpers';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';

// modals
import AddManagersModal from '@/components/fund/modals/manager/AddManagersModal.vue';

export default {
  name: 'ManagersModalComponent',
  components: {
    AddManagersModal,
  },
  props: {
    fund: { type: Object, require: true },
    isManager: { type: Boolean, default: false },
  },
  data() {
    return {
      removingManagers: [],
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.connection.address,
    }),
  },
  methods: {
    getSplitAddress,

    addNewManagers() {
      $('#managersModal').modal('hide');
      $('#addManagersModal').modal('show');
    },

    async removeManager(manager) {
      try {
        this.removingManagers.push(manager);
        await transaction(
          { name: 'Fund', address: this.$route.params.fundAddress },
          'removeManager',
          [this.fund.managers.findIndex((m) => m.toLowerCase() === manager.toLowerCase())],
          {},
          true,
          'Remove manager from ' + this.fund.name + ': ' + getSplitAddress(manager),
        );
        // eslint-disable-next-line vue/no-mutating-props
        this.fund.managers = this.fund.managers.filter((m) => m.toLowerCase() !== manager.toLowerCase());
        addNotification({
          message: 'Manager ' + getSplitAddress(manager) + ' removed from ' + this.fund.name,
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
  async created() {},
};
</script>

<style scoped>
.add-manager {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid rgb(156, 156, 156);
}

.no-managers {
  margin-top: 12px;
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
