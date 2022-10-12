<template>
  <div>
    <div class="modal fade" id="requestsModal" tabindex="-1" aria-labelledby="requestsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="requestsModalLabel">Requests</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div
              class="create-request"
              v-if="
                fund._requestsCanBeCreated &&
                (!fund._onlyManagersCanCreateARequest || (fund._onlyManagersCanCreateARequest && isManager))
              "
            >
              <button type="button" class="btn btn-success btn-sm" @click="createNewRequest">
                <fa-icon icon="plus" class="icon mr-2" />Create request
              </button>
            </div>

            <div class="requests-list" v-else>
              <span v-if="fund._requests.length === 0">No requests</span>
              <ul class="list-group list-group-flush" v-else>
                <li class="list-group-item" v-for="(request, index) in fund._requests" :key="index">
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
    <CreateRequestModal :fund="fund" />
  </div>
</template>

<script>
import $ from 'jquery';
import { mapState } from 'vuex';
import { transaction } from '@/helpers/helpers';
import { getSplitAddress } from 'web3-simple-helpers/methods/general';
import { addNotification } from '@/composables/useNotifications';

// modals
import CreateRequestModal from '@/components/fund/modals/request/CreateRequestModal.vue';

export default {
  name: 'RequestsModalComponent',
  components: {
    CreateRequestModal,
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

    createNewRequest() {
      $('#requestModal').modal('hide');
      $('#createRequestModal').modal('show');
    },

    async removeManager(manager) {
      try {
        this.removingManagers.push(manager);
        await transaction(
          { name: 'Fund', address: this.$route.params.fundAddress },
          'removeManager',
          [this.managers.findIndex((m) => m.toLowerCase() === manager.toLowerCase())],
          {},
          true,
          'Remove manager from ' + this.fund._name + ': ' + getSplitAddress(manager),
        );
        this.managers = this.managers.filter((m) => m.toLowerCase() !== manager.toLowerCase());
        addNotification({
          message: 'Manager ' + getSplitAddress(manager) + ' removed from ' + this.fund._name,
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
.create-request {
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
