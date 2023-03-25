<template>
  <div
    class="modal fade"
    :id="'profileManagersModal' + fundAddress"
    tabindex="-1"
    :aria-labelledby="'profileManagersModalLabel' + fundAddress"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" :id="'profileManagersModalLabel' + fundAddress">Administradores</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="no-items" v-if="managers && managers.length === 0">Sin administradores</div>
          <ul class="list-group list-group-flush" v-else>
            <li class="list-group-item" v-for="(manager, index) in managers" :key="index">
              <span
                ><span v-text="index + 1 + '. '" /><AppShowAddress type="entity" :address="manager"
              /></span>
              <span class="badge badge-pill badge-primary" v-if="compareAddresses(manager, address)">Mi dirección</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { compareAddresses } from 'web3-simple-helpers/methods/general';

export default {
  name: 'ProfileManagersModalComponent',
  components: {},
  props: {
    fundAddress: { type: String, required: true },
    managers: { type: Array, required: true },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['address']),
  },
  methods: {
    compareAddresses,
  },
  async created() {},
};
</script>

<style scoped>
.list-group-item {
  padding: 0.8rem 0.2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
}
</style>
