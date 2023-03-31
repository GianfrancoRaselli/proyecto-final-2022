<template>
  <div>
    <div class="modal fade" id="managersModal" tabindex="-1" aria-labelledby="managersModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="managersModalLabel">
              <span>Administradores</span>
              <span class="modal-amount" v-text="fund.managers.length" v-if="fund.managers.length > 0"></span>
            </h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <button
              type="button"
              class="btn btn-success btn-sm"
              :class="{ 'margin-bottom': fund.managers.length === 0 }"
              @click="addNewManagers"
              v-if="fund.managersCanBeAddedOrRemoved && isAManager"
            >
              <FaIcon icon="plus" class="icon mr-2" />Agregar administrador
            </button>
            <div class="managers-list" :class="{ list: fund.managersCanBeAddedOrRemoved && isAManager }">
              <div class="no-items-modal" v-if="fund.managers && fund.managers.length === 0">Sin administradores</div>
              <ul class="list-group list-group-flush" v-else>
                <li class="list-group-item" v-for="(manager, index) in fund.managers" :key="index">
                  <div class="item-manager">
                    <span>
                      <span v-text="index + 1 + '. '" />
                      <AppShowAddress type="entity" :address="manager" :goToProfile="true" />
                    </span>
                    <AppMyAddress :addressToCompare="manager" />
                  </div>
                  <div class="item-buttons">
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      v-if="fund.managersCanBeAddedOrRemoved && isAManager && !removing(manager)"
                      @click="removeManager(manager)"
                    >
                      <FaIcon icon="trash" class="icon mr-2" />Eliminar
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
import { mapGetters } from 'vuex';
import { transaction } from '@/helpers/helpers';
import { getSplitAddress, compareAddresses } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';

// modals
import AddManagersModal from '@/components/fund/modals/manager/AddManagersModal.vue';

export default {
  name: 'ManagersModalComponent',
  components: {
    AddManagersModal,
  },
  props: {
    fund: { type: Object, required: true },
    isAManager: { type: Boolean, default: false },
  },
  data() {
    return {
      removingManagers: [],
    };
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {
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
          [this.fund.managers.findIndex((m) => compareAddresses(m, manager))],
          {},
          true,
          'Administrador eliminado de ' + this.fund.name + ': ' + getSplitAddress(manager),
        );
        // eslint-disable-next-line vue/no-mutating-props
        this.fund.managers = this.fund.managers.filter((m) => m.toLowerCase() !== manager.toLowerCase());
        addNotification({
          message: 'Aministrador ' + getSplitAddress(manager) + ' eliminado de ' + this.fund.name,
          type: 'success',
        });
      } finally {
        this.removingManagers = this.removingManagers.filter((m) => m.toLowerCase() !== manager.toLowerCase());
      }
    },

    removing(manager) {
      if (this.removingManagers.findIndex((m) => compareAddresses(m, manager)) >= 0) return true;
      return false;
    },
  },
  async created() {},
};
</script>

<style scoped>
.list {
  margin-top: 0.4rem;
}

.list-group-item {
  padding: 0.8rem 0;
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
</style>
