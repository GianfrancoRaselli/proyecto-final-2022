<template>
  <div>
    <div class="modal fade" id="requestsModal" tabindex="-1" aria-labelledby="requestsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" :class="{ 'modal-lg': fund.requests && fund.requests.length > 0 }">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="requestsModalLabel">
              <span>Solicitudes</span>
              <span class="amount" v-text="fund.requests.length" v-if="fund.requests.length > 0"></span>
            </h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div
              class="create-request"
              v-if="
                fund.requestsCanBeCreated &&
                (!fund.onlyManagersCanCreateARequest || (fund.onlyManagersCanCreateARequest && isAManager))
              "
            >
              <button type="button" class="btn btn-success btn-sm" @click="createNewRequest">
                <fa-icon icon="plus" class="icon mr-2" />Crear solicitud
              </button>
            </div>

            <RequestsList
              :class="{
                list:
                  fund.requestsCanBeCreated &&
                  (!fund.onlyManagersCanCreateARequest || (fund.onlyManagersCanCreateARequest && isAManager)),
              }"
              :loading="loading"
              :fund="fund"
              :isAManager="isAManager"
            />
          </div>
        </div>
      </div>
    </div>
    <CreateRequestModal :fund="fund" />
    <div v-if="!loading">
      <ApprovalsModal
        :fundAddress="fund.address"
        :requestIndex="request.index"
        backTo="requestsModal"
        :listenNewApprovals="true"
        v-for="request in fund.requests"
        :key="request.index"
      />
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { mapState } from 'vuex';
import RequestsList from '@/components/fund/modals/request/RequestsList.vue';

// modals
import CreateRequestModal from '@/components/fund/modals/request/CreateRequestModal.vue';
import ApprovalsModal from '@/components/modals/fund/ApprovalsModal.vue';

export default {
  name: 'RequestsModalComponent',
  components: {
    CreateRequestModal,
    RequestsList,
    ApprovalsModal,
  },
  props: {
    loading: { type: Boolean, required: true },
    fund: { type: Object, required: true },
    isAManager: { type: Boolean, default: false },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({}),
  },
  methods: {
    createNewRequest() {
      $('#requestsModal').modal('hide');
      $('#createRequestModal').modal('show');
    },
  },
  created() {},
};
</script>

<style scoped>
@media (min-width: 768px) {
  .modal-lg {
    max-width: 800px;
  }
}

.create-request {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgb(156, 156, 156);
}

.list {
  margin-top: 0.4rem;
}
</style>
